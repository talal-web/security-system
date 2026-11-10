import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { assertStrongPassphrase } from "./config.js";
import { exists, formatStamp, listFilesRecursive, MANIFEST_FILE, sha256File } from "./fileUtils.js";
import { exportCollection, listExportableCollections, readCollectionDocs, restoreCollection } from "./jsonExport.js";
import { runMongodump, runMongorestore } from "./mongoTools.js";
import { createArchive, extractArchive, testArchive } from "./sevenZip.js";
import { pruneBackups } from "./retention.js";

const FORMAT_VERSION = 2;
const LOCK_FILE = ".backup.lock";

/** Prevents two backup/prune runs from touching the same folder at once. */
export async function withLock(dir, task) {
  await fs.mkdir(dir, { recursive: true });
  const lockPath = path.join(dir, LOCK_FILE);

  try {
    await fs.writeFile(lockPath, String(process.pid), { flag: "wx" });
  } catch (err) {
    if (err.code === "EEXIST") {
      throw new Error(
        `Another backup or prune seems to be running (lock file: ${lockPath}). ` +
          "If none is running, delete that file and retry.",
      );
    }
    throw err;
  }

  try {
    return await task();
  } finally {
    await fs.rm(lockPath, { force: true });
  }
}

async function describeFile(baseDir, relativePath) {
  const absolute = path.join(baseDir, relativePath);
  const { size } = await fs.stat(absolute);
  return { path: relativePath, bytes: size, sha256: await sha256File(absolute) };
}

async function createJsonPart({ db, stageDir, collections }) {
  const outDir = path.join(stageDir, "json");
  await fs.mkdir(outDir);

  const available = await listExportableCollections(db);
  let names = available;
  if (collections?.length) {
    const unknown = collections.filter((name) => !available.includes(name));
    if (unknown.length) {
      throw new Error(`Unknown collections: ${unknown.join(", ")}`);
    }
    names = collections;
  }

  const entries = [];
  for (const name of names) {
    entries.push(await exportCollection({ db, name, outDir }));
  }

  return {
    collections: entries,
    totalDocuments: entries.reduce((sum, entry) => sum + entry.count, 0),
  };
}

async function createDumpPart({ mongoUri, dbName, stageDir, bin }) {
  const outDir = path.join(stageDir, "dump");
  await fs.mkdir(outDir);
  await runMongodump({ uri: mongoUri, outDir, bin });

  const files = [];
  for (const relative of await listFilesRecursive(outDir, stageDir)) {
    files.push(await describeFile(stageDir, relative));
  }
  return { database: dbName, files };
}

/**
 * Creates one archive <backupDir>/<timestamp>.7z containing manifest.json,
 * json/ and/or dump/. The files are staged in a hidden folder and removed
 * afterwards. The archive is written under a temporary name and renamed only
 * when complete. With a passphrase it is AES-256 encrypted by 7-Zip.
 */
export async function runBackup({ db, dbName, mongoUri, config, types, collections, encrypt, prune }) {
  const passphrase = encrypt ? config.passphrase : "";
  if (encrypt) assertStrongPassphrase(passphrase);

  const now = new Date();
  const stamp = formatStamp(now);
  const archiveName = `${stamp}.7z`;
  const finalPath = path.join(config.backupDir, archiveName);
  const partialPath = path.join(config.backupDir, `.tmp-${archiveName}`);
  const stageDir = path.join(config.backupDir, `.tmp-${stamp}`);

  return withLock(config.backupDir, async () => {
    if (await exists(finalPath)) {
      throw new Error(`Backup already exists: ${finalPath}. Wait a second and retry.`);
    }

    await fs.mkdir(stageDir, { recursive: true });
    try {
      const manifest = {
        formatVersion: FORMAT_VERSION,
        createdAt: now.toISOString(),
        host: os.hostname(),
        sourceDatabase: dbName,
        encrypted: Boolean(passphrase),
        json: null,
        dump: null,
      };

      if (types.includes("json")) {
        manifest.json = await createJsonPart({ db, stageDir, collections });
      }
      if (types.includes("dump")) {
        manifest.dump = await createDumpPart({ mongoUri, dbName, stageDir, bin: config.mongodumpPath });
      }

      await fs.writeFile(path.join(stageDir, MANIFEST_FILE), JSON.stringify(manifest, null, 2));

      const items = [MANIFEST_FILE, ...(manifest.json ? ["json"] : []), ...(manifest.dump ? ["dump"] : [])];
      await createArchive({
        bin: config.sevenZipPath,
        cwd: stageDir,
        items,
        archive: partialPath,
        passphrase,
      });
      await fs.rename(partialPath, finalPath);

      const { size } = await fs.stat(finalPath);
      const pruneResult = prune ? await pruneBackups(config.backupDir, config.retention, { apply: true }) : null;
      return { archive: finalPath, manifest, sizeBytes: size, pruneResult };
    } finally {
      await fs.rm(stageDir, { recursive: true, force: true });
      await fs.rm(partialPath, { force: true });
    }
  });
}

/** Checks the archive with 7-Zip's CRC test. Throws if it is damaged or the passphrase is wrong. */
export async function verifyArchive({ archive, config }) {
  await testArchive({ bin: config.sevenZipPath, archive, passphrase: config.passphrase });
}

/** Extracts the archive into a fresh temporary folder, runs `task`, and always removes the folder. */
async function withExtractedArchive({ archive, config }, task) {
  const workDir = await fs.mkdtemp(path.join(config.backupDir, ".restore-"));
  try {
    await extractArchive({
      bin: config.sevenZipPath,
      archive,
      passphrase: config.passphrase,
      outDir: workDir,
    });
    return await task(workDir);
  } finally {
    await fs.rm(workDir, { recursive: true, force: true });
  }
}

/** Checks extracted files against the manifest's sizes and SHA-256 checksums. */
async function verifyExtracted(folder, manifest) {
  const expected = [
    ...(manifest.json?.collections ?? []).map((c) => ({ path: c.file, bytes: c.bytes, sha256: c.sha256 })),
    ...(manifest.dump?.files ?? []),
  ];

  const problems = [];
  for (const file of expected) {
    const absolute = path.join(folder, file.path);
    if (!(await exists(absolute))) {
      problems.push(`missing file: ${file.path}`);
      continue;
    }
    const { size } = await fs.stat(absolute);
    if (size !== file.bytes) {
      problems.push(`size mismatch: ${file.path} (expected ${file.bytes}, found ${size})`);
      continue;
    }
    if ((await sha256File(absolute)) !== file.sha256) {
      problems.push(`checksum mismatch: ${file.path}`);
    }
  }
  return problems;
}

export function withDatabase(uri, dbName) {
  const url = new URL(uri);
  url.pathname = `/${encodeURIComponent(dbName)}`;
  return url.toString();
}

/**
 * Restores a backup archive into `targetDbName`. Without `execute` it only
 * opens the archive, verifies it, and returns the plan. Nothing is written
 * to the database unless `execute` is true.
 */
export async function restoreBackup({
  archive,
  config,
  kind,
  targetDbName,
  drop,
  execute,
  client,
  mongoUri,
}) {
  return withExtractedArchive({ archive, config }, async (folder) => {
    const manifest = JSON.parse(await fs.readFile(path.join(folder, MANIFEST_FILE), "utf8"));
    const problems = await verifyExtracted(folder, manifest);
    if (problems.length) {
      throw new Error(`Backup failed verification:\n  - ${problems.join("\n  - ")}`);
    }
    if (kind === "json" && !manifest.json) throw new Error("This backup has no JSON part.");
    if (kind === "dump" && !manifest.dump) throw new Error("This backup has no dump part.");

    const targetDb = client.db(targetDbName);
    const plan = { target: targetDbName, kind, drop, collections: [], warnings: [] };

    if (kind === "json") {
      for (const entry of manifest.json.collections) {
        const existing = await targetDb.collection(entry.name).estimatedDocumentCount();
        plan.collections.push({ name: entry.name, count: entry.count, existing });
      }
      const blocked = plan.collections.filter((c) => c.existing > 0);
      if (blocked.length && !drop) {
        plan.warnings.push(
          `Target already has documents in: ${blocked.map((c) => c.name).join(", ")}. Use --drop to replace them.`,
        );
      }
      if (!execute) return { plan, executed: false };
      if (blocked.length && !drop) throw new Error(plan.warnings[0]);

      plan.restored = [];
      for (const entry of manifest.json.collections) {
        const docs = await readCollectionDocs({ folder, entry });
        const inserted = await restoreCollection({ targetDb, entry, docs, drop });
        plan.restored.push({ name: entry.name, count: inserted });
      }
      return { plan, executed: true };
    }

    // kind === "dump"
    const existingNames = (await targetDb.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name);
    plan.warnings.push(
      existingNames.length
        ? `Target database has ${existingNames.length} collection(s). mongorestore will ${drop ? "replace" : "refuse to overwrite"} matching data.`
        : "Target database is empty.",
    );
    if (!execute) return { plan, executed: false };
    if (existingNames.length && !drop) {
      throw new Error("Target database is not empty. Use --drop to replace existing collections.");
    }

    await runMongorestore({
      uri: withDatabase(mongoUri, targetDbName),
      dir: path.join(folder, "dump", manifest.dump.database),
      drop,
      bin: config.mongorestorePath,
    });
    return { plan, executed: true };
  });
}

/** Extracts a backup archive into `outDir` for reading. Plain files, no database writes. */
export async function extractBackup({ archive, config, outDir }) {
  await fs.mkdir(outDir, { recursive: true });
  await extractArchive({ bin: config.sevenZipPath, archive, passphrase: config.passphrase, outDir });
  return outDir;
}

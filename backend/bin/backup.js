#!/usr/bin/env node
import dotenv from "dotenv";
import fs from "node:fs/promises";
import mongoose from "mongoose";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load backend/.env before anything reads process.env.
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const { default: connectDB } = await import("../src/infrastructure/config/db.js");
const { loadBackupConfig, assertStrongPassphrase } = await import("../src/infrastructure/backup/config.js");
const { runBackup, restoreBackup, verifyArchive, extractBackup, withLock } = await import(
  "../src/infrastructure/backup/backupService.js"
);
const { listBackups, pruneBackups } = await import("../src/infrastructure/backup/retention.js");
const { exists } = await import("../src/infrastructure/backup/fileUtils.js");

const HELP = `
Security app backup tool

Usage:
  npm run backup -- [--type json|dump|both] [--collections a,b] [--no-encrypt] [--no-prune]
  npm run backup:list
  npm run backup:verify -- <archive>
  npm run backup:prune -- [--yes]
  npm run restore -- <archive> --target-db <name> [--kind json|dump] [--drop] [--yes]
  npm run backup:decrypt -- [archive] [out-folder]

Notes:
  Each backup is one .7z archive (AES-256, opens with 7-Zip, WinRAR, PeaZip).
  Password = BACKUP_PASSPHRASE from backend/.env.

  --type         json = one Extended JSON file per collection (default: both)
                 dump = mongodump BSON files (needs MongoDB Database Tools)
  --collections  limits the JSON part only; the dump always holds the whole database
  restore        without --yes it only opens and checks the archive and prints the plan
  prune          without --yes it only prints what would be deleted
  decrypt        extracts an archive to plain files. With no archive, uses the newest
                 one and writes to Desktop\\security-app-decrypted. Delete the output when done.
`;

const toList = (value) =>
  value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

/** Accepts a full path, a name inside BACKUP_DIR, or a name without the .7z extension. */
async function resolveArchive(config, arg) {
  if (!arg) throw new Error("Pass a backup archive, e.g. 2026-11-05_023000.7z");
  const candidates = [path.resolve(arg), path.join(config.backupDir, arg), path.join(config.backupDir, `${arg}.7z`)];
  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate;
  }
  throw new Error(`Backup not found: ${arg}`);
}

const formatBytes = (n) =>
  n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;

async function cmdRun(argv, config) {
  const { values } = parseArgs({
    args: argv,
    options: {
      type: { type: "string", default: "both" },
      collections: { type: "string" },
      "no-encrypt": { type: "boolean", default: false },
      "no-prune": { type: "boolean", default: false },
    },
    strict: true,
  });

  const types = values.type === "both" ? ["json", "dump"] : values.type.split(",").map((s) => s.trim());
  if (types.some((t) => !["json", "dump"].includes(t))) {
    throw new Error(`--type must be json, dump or both (got "${values.type}")`);
  }
  const collections = toList(values.collections);
  if (types.includes("dump") && collections) {
    console.warn("Note: --collections applies to the JSON part only. The dump always holds the whole database.");
  }

  const encrypt = !values["no-encrypt"];
  if (encrypt) {
    if (!config.passphrase) {
      throw new Error("BACKUP_PASSPHRASE is not set. Add it to backend/.env, or pass --no-encrypt.");
    }
    assertStrongPassphrase(config.passphrase);
  } else {
    console.warn("⚠ --no-encrypt: the archive will NOT be password protected.");
  }

  await connectDB();
  try {
    console.log(`Backing up "${mongoose.connection.name}" to ${config.backupDir}`);
    const result = await runBackup({
      db: mongoose.connection.db,
      dbName: mongoose.connection.name,
      mongoUri: process.env.MONGO_URI,
      config,
      types,
      collections,
      encrypt,
      prune: !values["no-prune"],
    });

    const { manifest } = result;
    console.log(`\n✔ Backup created: ${result.archive}`);
    console.log(`  encrypted: ${manifest.encrypted ? "yes (AES-256)" : "no"}`);
    if (manifest.json) {
      console.log(`  JSON: ${manifest.json.collections.length} collections, ${manifest.json.totalDocuments} documents`);
    }
    if (manifest.dump) {
      console.log(`  dump: ${manifest.dump.files.length} files`);
    }
    console.log(`  size: ${formatBytes(result.sizeBytes)}`);

    if (result.pruneResult) {
      console.log(`  retention: kept ${result.pruneResult.kept.length}, removed ${result.pruneResult.removed.length}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

async function cmdList(config) {
  const { backups } = await listBackups(config.backupDir);

  if (backups.length === 0) {
    console.log(`No backups in ${config.backupDir}`);
    return;
  }

  console.log(`Backups in ${config.backupDir}\n`);
  for (const b of backups) {
    console.log(`  ${b.name}  ${formatBytes(b.sizeBytes).padEnd(9)} ${b.createdAt.toLocaleString()}`);
  }
}

async function cmdVerify(argv, config) {
  const { positionals } = parseArgs({ args: argv, options: {}, allowPositionals: true, strict: true });
  const archive = await resolveArchive(config, positionals[0]);

  try {
    await verifyArchive({ archive, config });
    console.log(`✔ ${archive} is intact (CRC check passed)`);
  } catch (err) {
    console.error(`✖ ${archive} failed verification: ${err.message}`);
    process.exitCode = 1;
  }
}

async function cmdPrune(argv, config) {
  const { values } = parseArgs({ args: argv, options: { yes: { type: "boolean", default: false } }, strict: true });

  const run = () => pruneBackups(config.backupDir, config.retention, { apply: values.yes });
  const result = values.yes ? await withLock(config.backupDir, run) : await run();

  console.log(`Keep (${result.kept.length}): ${result.kept.map((b) => b.name).join(", ") || "none"}`);
  console.log(`${values.yes ? "Deleted" : "Would delete"} (${result.removed.length}): ${result.removed.map((b) => b.name).join(", ") || "none"}`);
  if (!values.yes && result.removed.length) {
    console.log("\nDry run. Re-run with --yes to delete.");
  }
}

async function cmdRestore(argv, config) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      kind: { type: "string", default: "json" },
      "target-db": { type: "string" },
      drop: { type: "boolean", default: false },
      yes: { type: "boolean", default: false },
    },
    strict: true,
  });

  if (!["json", "dump"].includes(values.kind)) throw new Error("--kind must be json or dump");
  if (!values["target-db"]) {
    throw new Error("Pass --target-db <name>. Restores never default to the live database.");
  }
  const archive = await resolveArchive(config, positionals[0]);

  await connectDB();
  try {
    const { plan, executed } = await restoreBackup({
      archive,
      config,
      kind: values.kind,
      targetDbName: values["target-db"],
      drop: values.drop,
      execute: values.yes,
      client: mongoose.connection.getClient(),
      mongoUri: process.env.MONGO_URI,
    });

    console.log(`Restore ${plan.kind} from ${archive}`);
    console.log(`Target database: ${plan.target}${plan.drop ? " (existing collections will be dropped)" : ""}`);
    for (const c of plan.collections) {
      console.log(`  ${c.name}: ${c.count} documents${c.existing ? ` (target currently has ${c.existing})` : ""}`);
    }
    for (const w of plan.warnings) console.warn(`⚠ ${w}`);

    if (!executed) {
      console.log("\nDry run. Nothing was written. Re-run with --yes to restore.");
      return;
    }
    console.log("\n✔ Restore finished");
    for (const r of plan.restored ?? []) console.log(`  ${r.name}: ${r.count} documents restored`);
  } finally {
    await mongoose.disconnect();
  }
}

async function cmdDecrypt(argv, config) {
  const { positionals } = parseArgs({ args: argv, allowPositionals: true, options: {}, strict: true });
  const [input, output] = positionals;

  let archive;
  if (input) {
    archive = await resolveArchive(config, input);
  } else {
    const { backups } = await listBackups(config.backupDir);
    if (backups.length === 0) throw new Error(`No backups found in ${config.backupDir}`);
    archive = backups[0].archive;
  }

  const name = path.basename(archive, ".7z");
  const outDir = output
    ? path.resolve(output)
    : path.join(os.homedir(), "Desktop", "security-app-decrypted", name);

  const rel = path.relative(config.backupDir, outDir);
  if (rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel))) {
    throw new Error("Refusing to write plain data inside BACKUP_DIR. Choose another output folder.");
  }
  if (await exists(outDir)) throw new Error(`Output folder already exists: ${outDir}`);

  try {
    await extractBackup({ archive, config, outDir });
  } catch (err) {
    await fs.rm(outDir, { recursive: true, force: true });
    throw err;
  }

  console.log(`✔ Extracted ${name} to:\n  ${outDir}`);
  console.warn("⚠ The output contains UNENCRYPTED employee and payroll data. Delete it when you are finished.");
}

async function main() {
  const [command = "help", ...argv] = process.argv.slice(2);
  const config = loadBackupConfig();

  switch (command) {
    case "run":
      return cmdRun(argv, config);
    case "list":
      return cmdList(config);
    case "verify":
      return cmdVerify(argv, config);
    case "prune":
      return cmdPrune(argv, config);
    case "restore":
      return cmdRestore(argv, config);
    case "decrypt":
      return cmdDecrypt(argv, config);
    default:
      console.log(HELP);
  }
}

main().catch((err) => {
  console.error(`\n✖ ${err.message}`);
  process.exitCode = 1;
});

import fs from "node:fs/promises";
import path from "node:path";
import { EJSON } from "bson";

import { safeFileName, sha256File } from "./fileUtils.js";

const FLUSH_BYTES = 1_000_000;
const INSERT_BATCH = 1000;

/**
 * Documents are stored as Extended JSON in "canonical" form, so ObjectId,
 * Date, Decimal128 and Long values round-trip exactly. Plain JSON.stringify
 * would turn them into strings and silently change the data.
 */
const toEJSON = (value) => EJSON.serialize(value, { relaxed: false });

export async function listExportableCollections(db) {
  const infos = await db.listCollections({}, { nameOnly: false }).toArray();
  return infos
    .filter((info) => info.type === "collection" && !info.name.startsWith("system."))
    .map((info) => info.name)
    .sort();
}

/** Writes one collection to `<outDir>/<name>.json`, streaming documents to disk. */
export async function exportCollection({ db, name, outDir }) {
  const base = safeFileName(name);
  const partialPath = path.join(outDir, `${base}.json.partial`);
  const finalPath = path.join(outDir, `${base}.json`);
  const collection = db.collection(name);

  let count = 0;
  const handle = await fs.open(partialPath, "w");
  try {
    await handle.write("[\n");
    let chunk = "";
    for await (const doc of collection.find({})) {
      chunk += (count === 0 ? "" : ",\n") + JSON.stringify(toEJSON(doc));
      count += 1;
      if (chunk.length >= FLUSH_BYTES) {
        await handle.write(chunk);
        chunk = "";
      }
    }
    await handle.write(`${chunk}\n]\n`);
  } finally {
    await handle.close();
  }
  await fs.rename(partialPath, finalPath);

  const indexes = (await collection.indexes())
    .filter((index) => index.name !== "_id_")
    .map((index) => toEJSON(index));

  const { size } = await fs.stat(finalPath);
  return {
    name,
    file: `json/${base}.json`,
    count,
    bytes: size,
    sha256: await sha256File(finalPath),
    indexes,
  };
}

/** Reads and parses one collection file from an extracted backup folder. */
export async function readCollectionDocs({ folder, entry }) {
  const parsed = JSON.parse(await fs.readFile(path.join(folder, entry.file), "utf8"));
  if (!Array.isArray(parsed) || parsed.length !== entry.count) {
    throw new Error(
      `${entry.name}: manifest says ${entry.count} documents, file has ${Array.isArray(parsed) ? parsed.length : "invalid data"}`,
    );
  }
  return parsed.map((doc) => EJSON.deserialize(doc));
}

export async function restoreCollection({ targetDb, entry, docs, drop }) {
  const collection = targetDb.collection(entry.name);

  if (drop) {
    await collection.drop().catch((err) => {
      if (err.codeName !== "NamespaceNotFound") throw err;
    });
  }

  for (let i = 0; i < docs.length; i += INSERT_BATCH) {
    await collection.insertMany(docs.slice(i, i + INSERT_BATCH), { ordered: false });
  }

  for (const index of entry.indexes ?? []) {
    const { v, key, ns, ...options } = EJSON.deserialize(index);
    await collection.createIndex(key, options);
  }

  return docs.length;
}

import crypto from "node:crypto";
import { createReadStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

export const MANIFEST_FILE = "manifest.json";

const ARCHIVE_RE = /^(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})(\d{2})\.7z$/;

/** Local-time stamp used for backup names, e.g. 2026-11-05_023000 */
export function formatStamp(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}_` +
    `${p(date.getHours())}${p(date.getMinutes())}${p(date.getSeconds())}`
  );
}

/** Returns the Date encoded in a backup archive name, or null if the name is not a backup name. */
export function parseArchiveName(fileName) {
  const match = ARCHIVE_RE.exec(fileName);
  if (!match) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

export function isArchiveName(fileName) {
  return ARCHIVE_RE.test(fileName);
}

/** Collection names can contain characters that are awkward in file names. */
export function safeFileName(name) {
  return encodeURIComponent(name);
}

export function sha256File(file) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = createReadStream(file);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

/** Returns file paths relative to `base`, always with forward slashes. */
export async function listFilesRecursive(dir, base = dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFilesRecursive(full, base)));
    } else if (entry.isFile()) {
      files.push(path.relative(base, full).split(path.sep).join("/"));
    }
  }
  return files;
}

export async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

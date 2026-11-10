import fs from "node:fs/promises";
import path from "node:path";

import { isArchiveName, parseArchiveName } from "./fileUtils.js";

const pad = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const monthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const weekKey = (d) => {
  const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
  return dayKey(monday);
};

/**
 * Grandfather-father-son retention. `items` must be sorted newest first, and
 * each item is { name, createdAt: Date }. Returns the set of names to keep:
 * the newest backup, plus the newest backup of each of the most recent N
 * days, weeks and months.
 */
export function selectBackupsToKeep(items, policy) {
  const keep = new Set();
  if (items.length === 0) return keep;

  keep.add(items[0].name);

  const keepPerBucket = (keyOf, limit) => {
    if (limit <= 0) return;
    const seen = new Set();
    for (const item of items) {
      const key = keyOf(item.createdAt);
      if (seen.has(key)) continue;
      if (seen.size >= limit) break;
      seen.add(key);
      keep.add(item.name);
    }
  };

  keepPerBucket(dayKey, policy.daily);
  keepPerBucket(weekKey, policy.weekly);
  keepPerBucket(monthKey, policy.monthly);

  return keep;
}

/** Lists backup archives in `root` (newest first). Other files and folders are ignored. */
export async function listBackups(root) {
  let entries;
  try {
    entries = await fs.readdir(root, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return { backups: [] };
    throw err;
  }

  const backups = [];
  for (const entry of entries) {
    if (!entry.isFile() || !isArchiveName(entry.name)) continue;

    const archive = path.join(root, entry.name);
    const createdAt = parseArchiveName(entry.name);
    const { size } = await fs.stat(archive);
    backups.push({ name: entry.name, archive, createdAt, sizeBytes: size });
  }

  backups.sort((a, b) => b.createdAt - a.createdAt);
  return { backups };
}

export async function pruneBackups(root, policy, { apply = false } = {}) {
  const { backups } = await listBackups(root);
  const keep = selectBackupsToKeep(backups, policy);

  const kept = backups.filter((b) => keep.has(b.name));
  const removed = backups.filter((b) => !keep.has(b.name));

  if (apply) {
    for (const backup of removed) {
      await fs.rm(backup.archive, { force: true });
    }
  }

  return { kept, removed };
}

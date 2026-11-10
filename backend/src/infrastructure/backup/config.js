import os from "node:os";
import path from "node:path";

import { defaultSevenZipPath } from "./sevenZip.js";

const DEFAULT_BACKUP_DIR =
  process.platform === "win32"
    ? "E:\\backups\\security-app"
    : path.join(os.homedir(), "backups", "security-app");

export const MIN_PASSPHRASE_LENGTH = 12;

export function assertStrongPassphrase(passphrase) {
  if (!passphrase || passphrase.length < MIN_PASSPHRASE_LENGTH) {
    throw new Error(`BACKUP_PASSPHRASE must be at least ${MIN_PASSPHRASE_LENGTH} characters`);
  }
}

const readInt = (env, name, fallback) => {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;

  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer, got "${raw}"`);
  }
  return value;
};

/**
 * Reads backup settings from the environment. Read at call time (not import
 * time) so the CLI can load .env first.
 */
export function loadBackupConfig(env = process.env) {
  return {
    backupDir: path.resolve(env.BACKUP_DIR || DEFAULT_BACKUP_DIR),
    passphrase: env.BACKUP_PASSPHRASE || "",
    sevenZipPath: env.SEVEN_ZIP_PATH || defaultSevenZipPath(),
    mongodumpPath: env.MONGODUMP_PATH || "mongodump",
    mongorestorePath: env.MONGORESTORE_PATH || "mongorestore",
    retention: {
      daily: readInt(env, "BACKUP_KEEP_DAILY", 14),
      weekly: readInt(env, "BACKUP_KEEP_WEEKLY", 8),
      monthly: readInt(env, "BACKUP_KEEP_MONTHLY", 12),
    },
  };
}

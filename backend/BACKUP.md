# Database Backup CLI

Backs up the security app's MongoDB database (employees, attendance, salary, payroll, locations, and so on) into encrypted files, and restores them when needed.

Each backup is **one 7z archive** stored in `E:\backups\security-app` by default, outside the project folder. The archive is AES-256 encrypted with your `BACKUP_PASSPHRASE`.

Anyone with 7-Zip, WinRAR, or PeaZip can open a backup by hand, with the passphrase. You don't need this project to read one.

| Content | What it is | When it's useful |
|---|---|---|
| **JSON** (`json/`) | One Extended JSON file per collection, plus index definitions | Everyday backups. Restorable with this CLI. |
| **Dump** (`dump/`) | `mongodump` BSON output | Full binary copy for disaster recovery. Needs MongoDB Database Tools. |

---

## Quick start

Run all commands from the `backend/` folder.

```bash
# 1. Set a passphrase in backend/.env (at least 12 characters)
BACKUP_PASSPHRASE=your-long-passphrase-here

# 2. Create a backup (JSON + dump, encrypted, then apply retention)
npm run backup

# 3. Check it
npm run backup:list
npm run backup:verify -- 2026-11-05_023000.7z
```

---

## Opening a backup without this tool

1. Install 7-Zip (https://www.7-zip.org) if it isn't already installed.
2. Double-click the `.7z` file in `E:\backups\security-app`.
3. Enter `BACKUP_PASSPHRASE` when asked.
4. The `json\` folder holds one file per collection, such as `employees.json`.

The same works with WinRAR and PeaZip. Plain Windows Explorer cannot open `.7z` files, so use one of these programs.

---

## Commands

### `npm run backup` (create a backup)

```bash
npm run backup                                  # JSON + dump, encrypted
npm run backup -- --type json                   # JSON only
npm run backup -- --type dump                   # dump only
npm run backup -- --type json --collections employees,attendance
npm run backup -- --no-encrypt                  # no password (not recommended)
npm run backup -- --no-prune                    # skip retention cleanup
```

| Option | Default | Meaning |
|---|---|---|
| `--type` | `both` | `json`, `dump`, or `both` |
| `--collections a,b` | all collections | Limits the **JSON** part only. The dump always contains the whole database. |
| `--no-encrypt` | off | Creates the archive without a password. Do not use this for payroll data. |
| `--no-prune` | off | Do not delete old backups after this run. |

A run stops with an error if `BACKUP_PASSPHRASE` is missing and `--no-encrypt` is not set.

### `npm run backup:list`

Lists the archives in `BACKUP_DIR` with their size and date.

### `npm run backup:verify -- <archive>`

Runs 7-Zip's integrity check and confirms the passphrase. Exits with code 1 if the archive is damaged or the passphrase is wrong.

`<archive>` can be a file name (`2026-11-05_023000.7z`, looked up in `BACKUP_DIR`) or a full path.

### `npm run backup:prune`

Shows which backups retention would delete. Nothing is deleted until you add `--yes`:

```bash
npm run backup:prune            # shows what would be deleted
npm run backup:prune -- --yes   # deletes
```

Retention is controlled by `BACKUP_KEEP_DAILY`, `BACKUP_KEEP_WEEKLY`, and `BACKUP_KEEP_MONTHLY`. The newest backup is always kept.

### `npm run backup:decrypt`

Extracts a backup to plain files, so you can read them.

```bash
npm run backup:decrypt                                    # newest backup -> Desktop\security-app-decrypted\<name>
npm run backup:decrypt -- 2026-11-05_023000.7z            # a specific backup
npm run backup:decrypt -- 2026-11-05_023000.7z C:\somewhere  # choose the output folder
```

- The output contains **unencrypted** employee and payroll data. Delete it when you have finished reading it.
- The command refuses to write inside `BACKUP_DIR` and refuses to overwrite an existing folder.

### `npm run restore`

```bash
# Step 1: dry run. Opens and checks the archive, prints the plan. Writes nothing.
npm run restore -- 2026-11-05_023000.7z --target-db security_app_test

# Step 2: actually restore
npm run restore -- 2026-11-05_023000.7z --target-db security_app_test --yes
```

| Option | Default | Meaning |
|---|---|---|
| `<archive>` | required | Backup file name or full path |
| `--target-db <name>` | **required** | Database to restore into. There is no default, so a restore can never silently overwrite the live database. |
| `--kind json\|dump` | `json` | Which part of the backup to restore |
| `--drop` | off | Replace existing collections in the target database |
| `--yes` | off | Actually write. Without it, nothing is changed. |

For JSON restores, if the target collection already has documents and `--drop` is not given, the restore stops without writing anything.

---

## Restore runbook

Restoring over live data is the last resort. Follow these steps:

1. **Find the backup:** `npm run backup:list`
2. **Check it:** `npm run backup:verify -- <archive>`. Do not continue if it fails.
3. **Restore into a test database first**, and check the counts:
   `npm run restore -- <archive> --target-db security_app_test --yes`
4. **Restore into the live database only after step 3 looks right.** Stop the backend first so no one writes during the restore:
   `npm run restore -- <archive> --target-db <live-db-name> --drop --yes`

`--drop` replaces the collections in the target database. Anything written after the backup was taken is lost.

Use the same `BACKUP_PASSPHRASE` that created the backup.

---

## Backup folder layout

```
E:\backups\security-app\
  2026-11-05_023000.7z        one encrypted archive per run (local time)
  2026-11-04_023000.7z
  .backup.lock                exists only while a backup or prune is running
```

Inside each archive:

```
manifest.json                 formats, counts, sizes, SHA-256 checksums
json\
  employees.json              one file per collection
  attendance.json
  ...
dump\                         only if the dump format was used
  <database>\...
```

- While a backup runs, its files are staged in a hidden `.tmp-` folder inside `BACKUP_DIR`, then removed. The archive is written under a temporary name and renamed only when complete.
- The archive hides file names as well as contents (header encryption).

---

## Configuration (`backend/.env`)

| Variable | Default | Description |
|---|---|---|
| `MONGO_URI` | (existing) | Database to back up. Restores use the same server with a different database name. |
| `BACKUP_DIR` | `E:\backups\security-app` | Where backups are stored. Created automatically. |
| `BACKUP_PASSPHRASE` | none | Archive password, at least 12 characters. **If you lose it, the backups cannot be opened.** Keep a copy somewhere safe. |
| `SEVEN_ZIP_PATH` | `C:\Program Files\7-Zip\7z.exe` | Path to `7z.exe` |
| `MONGODUMP_PATH` | `mongodump` | Path to `mongodump` if it is not on PATH |
| `MONGORESTORE_PATH` | `mongorestore` | Path to `mongorestore` if it is not on PATH |
| `BACKUP_KEEP_DAILY` | `14` | Days of backups to keep (newest per day) |
| `BACKUP_KEEP_WEEKLY` | `8` | Weeks to keep (newest per week) |
| `BACKUP_KEEP_MONTHLY` | `12` | Months to keep (newest per month) |

Note that `BACKUP_PASSPHRASE` is passed to 7-Zip on its command line. On a shared computer, other programs running at the same time could see it briefly.

---

## Installing the required tools

- **7-Zip** (required): https://www.7-zip.org. The default install location is already used.
- **MongoDB Database Tools** (for dump backups only): https://www.mongodb.com/try/download/database-tools. Unzip them and either add the `bin` folder to PATH, or set `MONGODUMP_PATH` and `MONGORESTORE_PATH` in `.env` to the full paths of the `.exe` files.

---

## Scheduling a daily backup (Windows)

Run once in an administrator terminal:

```bat
schtasks /Create /SC DAILY /ST 02:00 /TN "SecurityAppBackup" /TR "cmd /c cd /d E:\NextJS\security-app\backend && npm run backup"
```

The task runs as your Windows user, so `.env` is read. Check the last run in Task Scheduler. Retention runs automatically after each backup.

---

## Troubleshooting

| Message | Cause and fix |
|---|---|
| `BACKUP_PASSPHRASE must be at least 12 characters` | Set a longer passphrase in `.env` |
| `BACKUP_PASSPHRASE is not set` | Add it to `.env`, or use `--no-encrypt` |
| `Could not open the archive: wrong or missing BACKUP_PASSPHRASE` | The passphrase differs from the one used to create the archive, or it is not set |
| `7-Zip not found` | Install 7-Zip, or set `SEVEN_ZIP_PATH` in `.env` |
| `Another backup or prune seems to be running` | A run is in progress, or a previous run crashed. If nothing is running, delete `.backup.lock` in `BACKUP_DIR`. |
| `Backup failed verification` | A file is missing or changed. Do not restore this backup; use an older one. |
| `Target already has documents in: ...` | Use `--drop`, or choose an empty target database |
| `mongodump not found` | Install Database Tools and set `MONGODUMP_PATH` |
| `Backup already exists` | Two runs started within the same second. Retry. |

---

## Status and known limitations

- The JSON format and the 7z packaging are tested end to end: backup, list, verify, wrong passphrase, restore into a separate database, `--drop` restore, and decrypt. Unit tests cover encryption and file-name hiding.
- The dump format (`mongodump` and `mongorestore`) has **not yet been tested** against a real database. Test it on a scratch database before relying on it.
- Backups made before this change (the older `.enc` files) cannot be read by the current commands. Keep them only if you still need them, and decrypt them with the version that created them.
- Retention keeps one backup per day, so multiple runs on the same day leave only the newest.
- Restores are not transactional. If a JSON restore stops partway, the target database is partially restored. Run the restore again with `--drop` to start clean.
- Backups hold the full database, including employee and payroll records. Store them only on the protected drive, and never copy them into the repository.

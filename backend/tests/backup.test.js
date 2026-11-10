import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { Decimal128, EJSON, ObjectId } from "bson";

import { assertStrongPassphrase } from "../src/infrastructure/backup/config.js";
import { parseArchiveName } from "../src/infrastructure/backup/fileUtils.js";
import { selectBackupsToKeep } from "../src/infrastructure/backup/retention.js";
import { createArchive, defaultSevenZipPath, extractArchive, testArchive } from "../src/infrastructure/backup/sevenZip.js";

const PASS = "correct horse battery staple";
const SEVEN_ZIP = defaultSevenZipPath();
const has7z = existsSync(SEVEN_ZIP);

test("Extended JSON keeps ObjectId, Date and Decimal128 types", () => {
  const doc = {
    _id: new ObjectId(),
    joinedAt: new Date("2025-03-01T00:00:00Z"),
    basicSalary: Decimal128.fromString("15000.50"),
  };

  const text = JSON.stringify(EJSON.serialize(doc, { relaxed: false }));
  const restored = EJSON.deserialize(JSON.parse(text));

  assert.ok(restored._id instanceof ObjectId);
  assert.equal(restored._id.toHexString(), doc._id.toHexString());
  assert.ok(restored.joinedAt instanceof Date);
  assert.equal(restored.joinedAt.getTime(), doc.joinedAt.getTime());
  assert.ok(restored.basicSalary instanceof Decimal128);
  assert.equal(restored.basicSalary.toString(), "15000.50");
});

test("archive names are parsed back into local dates", () => {
  const date = parseArchiveName("2026-11-05_023000.7z");
  assert.equal(date.getFullYear(), 2026);
  assert.equal(date.getMonth(), 10);
  assert.equal(date.getDate(), 5);
  assert.equal(date.getHours(), 2);
  assert.equal(date.getMinutes(), 30);
  assert.equal(parseArchiveName("notes.txt"), null);
});

test("passphrase must be at least 12 characters", () => {
  assert.throws(() => assertStrongPassphrase("short"), /at least 12/);
  assert.throws(() => assertStrongPassphrase(""), /at least 12/);
  assert.doesNotThrow(() => assertStrongPassphrase(PASS));
});

test("retention keeps newest per day, week and month within the limits", () => {
  // Newest first. 2026-11-02 is a Monday, so Nov 3–5 share one week.
  const items = [
    { name: "A", createdAt: new Date(2026, 10, 5, 2) },
    { name: "B", createdAt: new Date(2026, 10, 4, 2) },
    { name: "C", createdAt: new Date(2026, 10, 3, 2) },
    { name: "D", createdAt: new Date(2026, 9, 20, 2) },
    { name: "E", createdAt: new Date(2026, 9, 1, 2) },
  ];

  const kept = selectBackupsToKeep(items, { daily: 2, weekly: 2, monthly: 2 });
  assert.deepEqual([...kept].sort(), ["A", "B", "D"]);
});

test("retention with zero limits still keeps the newest backup", () => {
  const items = [
    { name: "A", createdAt: new Date(2026, 10, 5, 2) },
    { name: "B", createdAt: new Date(2026, 10, 4, 2) },
  ];
  assert.deepEqual([...selectBackupsToKeep(items, { daily: 0, weekly: 0, monthly: 0 })], ["A"]);
});

test("retention returns nothing for an empty list", () => {
  assert.equal(selectBackupsToKeep([], { daily: 14, weekly: 8, monthly: 12 }).size, 0);
});

test("7z archive with password: correct passphrase opens it, wrong one does not", { skip: !has7z }, async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "sa-7z-"));
  try {
    const src = path.join(root, "src");
    await fs.mkdir(path.join(src, "json"), { recursive: true });
    await fs.writeFile(path.join(src, "manifest.json"), '{"ok":true}');
    await fs.writeFile(path.join(src, "json", "employees.json"), '[{"name":"Ali"}]');

    const archive = path.join(root, "test.7z");
    const bin = SEVEN_ZIP;
    await createArchive({ bin, cwd: src, items: ["manifest.json", "json"], archive, passphrase: PASS });

    await testArchive({ bin, archive, passphrase: PASS });
    await assert.rejects(testArchive({ bin, archive, passphrase: "wrong passphrase value" }), /wrong or missing/);

    const out = path.join(root, "out");
    await extractArchive({ bin, archive, passphrase: PASS, outDir: out });
    assert.equal(await fs.readFile(path.join(out, "json", "employees.json"), "utf8"), '[{"name":"Ali"}]');
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

test("7z archive contents are not readable without the passphrase", { skip: !has7z }, async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "sa-7z-"));
  try {
    const src = path.join(root, "src");
    await fs.mkdir(src);
    await fs.writeFile(path.join(src, "secret-name.json"), "SALARY-MARKER-123");

    const archive = path.join(root, "test.7z");
    await createArchive({ bin: SEVEN_ZIP, cwd: src, items: ["secret-name.json"], archive, passphrase: PASS });

    const raw = await fs.readFile(archive);
    assert.equal(raw.includes(Buffer.from("SALARY-MARKER-123")), false);
    assert.equal(raw.includes(Buffer.from("secret-name")), false, "file names should be hidden too");
  } finally {
    await fs.rm(root, { recursive: true, force: true });
  }
});

import { spawn } from "node:child_process";

const MAX_OUTPUT = 20_000;

export function defaultSevenZipPath() {
  return process.platform === "win32" ? "C:\\Program Files\\7-Zip\\7z.exe" : "7z";
}

function run(bin, args, { cwd, secrets = [] } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { cwd, windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });

    let output = "";
    const collect = (data) => {
      output += data.toString();
      if (output.length > MAX_OUTPUT) output = output.slice(-MAX_OUTPUT);
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);

    child.on("error", (err) => {
      reject(
        err.code === "ENOENT"
          ? new Error(`7-Zip not found ("${bin}"). Install 7-Zip or set SEVEN_ZIP_PATH in backend/.env.`)
          : err,
      );
    });

    child.on("close", (code) => {
      if (code === 0) return resolve(output);

      // Never print the passphrase, even if 7-Zip echoes the command line.
      let text = output;
      for (const secret of secrets) {
        if (secret) text = text.split(secret).join("<redacted>");
      }
      if (/wrong password|can not open encrypted|enter password/i.test(text)) {
        return reject(new Error("Could not open the archive: wrong or missing BACKUP_PASSPHRASE"));
      }
      reject(new Error(`7-Zip exited with code ${code}:\n${text.trim().slice(-1500)}`));
    });
  });
}

const passwordArgs = (passphrase) => (passphrase ? [`-p${passphrase}`] : []);
const QUIET = ["-y", "-bd", "-bso0", "-bsp0"];

/**
 * Creates a .7z archive from `items` (paths relative to `cwd`). With a
 * passphrase the archive is AES-256 encrypted and its file names are hidden.
 */
export function createArchive({ bin, cwd, items, archive, passphrase }) {
  const encryption = passphrase ? ["-mhe=on", ...passwordArgs(passphrase)] : [];
  return run(bin, ["a", "-t7z", "-mx=5", ...QUIET, ...encryption, archive, ...items], {
    cwd,
    secrets: [passphrase],
  });
}

/** Checks the archive's CRCs. Resolves if the archive is intact and the passphrase is right. */
export function testArchive({ bin, archive, passphrase }) {
  return run(bin, ["t", ...QUIET, ...passwordArgs(passphrase), archive], { secrets: [passphrase] });
}

export function extractArchive({ bin, archive, passphrase, outDir }) {
  return run(bin, ["x", ...QUIET, `-o${outDir}`, ...passwordArgs(passphrase), archive], {
    secrets: [passphrase],
  });
}

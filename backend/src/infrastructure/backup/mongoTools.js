import { spawn } from "node:child_process";

const INSTALL_HINT =
  "Install MongoDB Database Tools (https://www.mongodb.com/try/download/database-tools) " +
  "and set MONGODUMP_PATH / MONGORESTORE_PATH in .env if they are not on PATH.";

const MAX_OUTPUT = 50_000;

function runTool(bin, args, { label, secrets = [] }) {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });

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
          ? new Error(`${label} not found ("${bin}"). ${INSTALL_HINT}`)
          : err,
      );
    });

    child.on("close", (code) => {
      if (code === 0) return resolve();

      // Never print the connection string (it contains the DB password).
      let text = output;
      for (const secret of secrets) {
        if (secret) text = text.split(secret).join("<redacted>");
      }
      reject(new Error(`${label} exited with code ${code}:\n${text.trim().slice(-2000)}`));
    });
  });
}

/** Dumps the database named in `uri` as BSON into `outDir/<dbName>/`. */
export function runMongodump({ uri, outDir, bin }) {
  return runTool(bin, ["--uri", uri, "--out", outDir], {
    label: "mongodump",
    secrets: [uri],
  });
}

/** Restores a dump directory into the database named in `uri`. */
export function runMongorestore({ uri, dir, drop, bin }) {
  const args = ["--uri", uri, "--dir", dir];
  if (drop) args.push("--drop");
  return runTool(bin, args, { label: "mongorestore", secrets: [uri] });
}

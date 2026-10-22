process.env.NODE_ENV ||= "production";

await import("../bin/server.js");
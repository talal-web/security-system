import dns from "node:dns";

const DEFAULT_SERVERS = ["8.8.8.8", "8.8.4.4"];

// Overrides Node's DNS resolution, mainly needed for MongoDB Atlas SRV
// lookups on networks with unreliable default DNS.
//
// - force: true always applies the override (used by standalone scripts).
//   Left false (the default), it only applies when USE_CUSTOM_DNS=true,
//   which is how the main server gates it.
export default function configureDNS({
  servers = DEFAULT_SERVERS,
  force = false,
} = {}) {
  if (!force && process.env.USE_CUSTOM_DNS !== "true") {
    return;
  }

  dns.setServers(servers);
  console.log(`Using custom DNS servers: ${servers.join(", ")}`);
}

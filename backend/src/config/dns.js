import dns from "dns";

export default function configureDNS() {
  if (process.env.USE_CUSTOM_DNS === "true") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log("🌐 Using custom DNS servers");
  }
}

// Clash Verge Rev / Mihomo extension script.
// Change this to an existing proxy group in your own configuration.
const PROXY_POLICY = "SELECT";
const DIRECT_PORT = 7895;
const PROXY_PORT = 7896;

function installChromeEgressListeners(config) {
  const groupNames = new Set((config["proxy-groups"] || []).map(group => group.name));
  if (!groupNames.has(PROXY_POLICY)) {
    throw new Error(
      `Chrome toggle: proxy group "${PROXY_POLICY}" does not exist. ` +
      "Edit PROXY_POLICY in chrome-egress-listeners.js."
    );
  }

  config.listeners = (config.listeners || []).filter(listener => {
    return !["chrome-direct", "chrome-proxy"].includes(listener.name);
  });

  config.listeners.push({
    name: "chrome-direct",
    type: "http",
    listen: "127.0.0.1",
    port: DIRECT_PORT,
    proxy: "DIRECT"
  });

  config.listeners.push({
    name: "chrome-proxy",
    type: "http",
    listen: "127.0.0.1",
    port: PROXY_PORT,
    proxy: PROXY_POLICY
  });

  return config;
}

function main(config) {
  return installChromeEgressListeners(config);
}


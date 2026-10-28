const MODES = {
  direct: { port: 7895, badge: "直", color: "#137333" },
  proxy: { port: 7896, badge: "代", color: "#1a73e8" }
};

async function applyMode(mode) {
  const selected = MODES[mode];
  if (!selected) throw new Error(`Unsupported mode: ${mode}`);

  await chrome.proxy.settings.set({
    scope: "regular",
    value: {
      mode: "fixed_servers",
      rules: {
        singleProxy: {
          scheme: "http",
          host: "127.0.0.1",
          port: selected.port
        },
        bypassList: ["<local>", "localhost", "127.0.0.1", "[::1]"]
      }
    }
  });

  await chrome.storage.local.set({ mode });
  await chrome.action.setBadgeText({ text: selected.badge });
  await chrome.action.setBadgeBackgroundColor({ color: selected.color });
  return mode;
}

async function restoreMode() {
  const { mode } = await chrome.storage.local.get("mode");
  if (MODES[mode]) await applyMode(mode);
}

chrome.runtime.onStartup.addListener(() => {
  restoreMode().catch(console.error);
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "set-mode") {
    applyMode(message.mode)
      .then(mode => sendResponse({ ok: true, mode }))
      .catch(error => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === "get-status") {
    Promise.all([
      chrome.storage.local.get("mode"),
      chrome.proxy.settings.get({ incognito: false })
    ]).then(([stored, proxy]) => {
      sendResponse({
        ok: true,
        mode: stored.mode || null,
        levelOfControl: proxy.levelOfControl
      });
    }).catch(error => sendResponse({ ok: false, error: String(error) }));
    return true;
  }
});


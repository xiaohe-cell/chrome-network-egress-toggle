const statusNode = document.getElementById("status");
const proxyButton = document.getElementById("proxy");
const directButton = document.getElementById("direct");

function render(mode, levelOfControl) {
  proxyButton.classList.toggle("active", mode === "proxy");
  directButton.classList.toggle("active", mode === "direct");
  const label = mode === "proxy"
    ? "当前：代理模式"
    : mode === "direct"
      ? "当前：直连模式"
      : "尚未选择模式";

  statusNode.textContent = levelOfControl === "controlled_by_other_extensions"
    ? `${label}（被其他扩展控制）`
    : label;
}

async function setMode(mode) {
  statusNode.textContent = "正在切换…";
  const result = await chrome.runtime.sendMessage({ type: "set-mode", mode });
  if (!result?.ok) {
    statusNode.textContent = `切换失败：${result?.error || "未知错误"}`;
    return;
  }
  render(result.mode, "controlled_by_this_extension");
}

proxyButton.addEventListener("click", () => setMode("proxy"));
directButton.addEventListener("click", () => setMode("direct"));

chrome.runtime.sendMessage({ type: "get-status" }).then(result => {
  if (!result?.ok) {
    statusNode.textContent = `读取失败：${result?.error || "未知错误"}`;
    return;
  }
  render(result.mode, result.levelOfControl);
});


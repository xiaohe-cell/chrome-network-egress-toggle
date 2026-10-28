# 部署说明

## 1. 部署前检查

在 PowerShell 中运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\check.ps1
```

若 `7895` 或 `7896` 已被其他程序占用，请同时修改：

- `clash/chrome-egress-listeners.js` 中的端口；
- `extension/background.js` 中的端口。

## 2. 配置代理策略组

打开 `clash/chrome-egress-listeners.js`，将：

```js
const PROXY_POLICY = "SELECT";
```

改成你配置里真实存在的代理组名，例如 `节点选择`、`PROXY`。不要填写具体订阅地址或密码。

## 3. 加入 Clash Verge Rev

### 没有自定义扩展脚本

在 Clash Verge Rev 的订阅页面创建或编辑扩展脚本，粘贴 `clash/chrome-egress-listeners.js` 的全部内容，将它关联到当前订阅后重新激活订阅。

### 已经有自定义扩展脚本

不要覆盖原脚本。执行以下合并：

1. 复制三个常量和 `installChromeEgressListeners(config)` 函数。
2. 在原 `main(config)` 返回之前调用：

```js
installChromeEgressListeners(config);
return config;
```

3. 重新激活当前订阅。

## 4. 验证本机端口

重新运行 `scripts/check.ps1`，应看到：

```text
127.0.0.1:7895 LISTENING
127.0.0.1:7896 LISTENING
```

端口不得监听 `0.0.0.0` 或局域网地址。

## 5. 安装 Chrome 扩展

1. 打开 `chrome://extensions/`。
2. 打开“开发者模式”。
3. 点击“加载已解压的扩展程序”。
4. 选择本项目的 `extension` 文件夹。
5. 将扩展固定到工具栏。

首次安装后显示“尚未选择模式”。点击一个模式后，扩展会记住选择，并在 Chrome 重启时恢复。

## 6. 验证切换

- 点击“直连模式”，访问一个能显示出口 IP 的可信网站，记录 IP。
- 点击“代理模式”，刷新同一网站，出口 IP 应发生变化。
- 再分别测试一个只允许国内直连的网站和一个必须走代理的网站。

不要用需要登录、付款或提交表单的网站作为首次验证目标。

## 回滚

1. 在 `chrome://extensions/` 中移除本扩展。
2. 从 Clash 扩展脚本移除 `chrome-direct`、`chrome-proxy` 两个 listener 及安装函数调用。
3. 重新激活订阅。

项目不会修改订阅节点、系统账户或 Chrome 用户数据。


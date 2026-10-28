# Chrome 网络出口一键切换

一个本地、开源的小工具：Clash Verge Rev / Mihomo 保持常开，在 Chrome 工具栏中一键选择“代理模式”或“直连模式”。

## 它解决什么问题

开启 TUN 后，Chrome 即使设置“不使用代理”，流量也可能继续被 TUN 规则接管。这个项目不反复关闭 Clash，而是在 Mihomo 内建立两个只监听本机的独立入口：

```text
Chrome ──代理模式──> 127.0.0.1:7896 ──> 指定代理策略组
Chrome ──直连模式──> 127.0.0.1:7895 ──> DIRECT
```

Chrome 扩展只负责选择入口。真正的代理/直连出口由 Mihomo 决定，因此 TUN、系统代理和其他应用可以继续保持原来的状态。

## 特点

- 不需要反复关闭 Clash 或 TUN。
- 切换作用于当前 Chrome 配置文件的全部普通标签页。
- 两个入口只监听 `127.0.0.1`，不会向局域网开放。
- 扩展只申请 `proxy` 和 `storage` 权限。
- 不读取网页、Cookie、密码、书签或浏览记录。
- 不包含订阅地址、节点、账号或其他私人配置。

## 兼容范围

- Windows 10/11
- Google Chrome（Manifest V3）
- Clash Verge Rev 2.x
- Mihomo 1.19 或更新版本

其他 Mihomo 客户端如支持 `listeners`，也可参考部署说明自行接入。

## 快速开始

1. 按照 [部署说明](docs/DEPLOYMENT.md) 将两个 listener 合并到 Clash Verge 的扩展脚本。
2. 确认本机 `7895`、`7896` 未被占用。
3. 打开 `chrome://extensions/`，启用“开发者模式”。
4. 点击“加载已解压的扩展程序”，选择本项目的 `extension` 文件夹。
5. 固定扩展图标，点击“代理模式”或“直连模式”。

## 重要说明

- 这是网络出口切换器，不是翻墙服务，不附带代理节点。
- 代理模式默认使用 Mihomo 中名为 `SELECT` 的代理策略组。如果你的组名不同，请先修改 `clash/chrome-egress-listeners.js` 顶部的 `PROXY_POLICY`。
- 不要直接覆盖已有扩展脚本。已有自定义脚本的用户应按部署说明合并函数和调用。
- 切换是“当前 Chrome 配置文件级”，不是单标签页级。

## 项目结构

```text
extension/                      Chrome 扩展源码
clash/chrome-egress-listeners.js  Mihomo 扩展脚本模板
docs/DEPLOYMENT.md              部署与回滚
docs/DOUYIN_SCRIPT.md           短视频演示脚本
scripts/check.ps1               本机只读检查
scripts/build-release.ps1       生成发布压缩包
```

## 安全与隐私

详见 [SECURITY.md](SECURITY.md)。公开截图前请隐藏书签栏、其他扩展、账号头像、订阅地址和节点名称。

## 许可证

[MIT](LICENSE)


# iPhone 安装说明

这个分支把展示页封装成了可安装的 PWA。

## 部署

将项目目录部署到任意支持 HTTPS 的静态站点，例如 GitHub Pages、Netlify、Vercel 或 Cloudflare Pages。入口文件为：

`lby_tjucampuscard.html`

## iPhone 安装

1. 使用 iPhone Safari 打开部署后的网址。
2. 点击底部分享按钮。
3. 选择“添加到主屏幕”。
4. 从主屏幕启动后，页面会以独立 App 窗口运行。

首次打开并联网加载后，Service Worker 会缓存应用外壳，后续可离线打开。

## 原生 App Store 版本

如果需要生成可提交 App Store 的 `.ipa`，还需要 macOS、Xcode、Apple 开发者账号和签名证书。当前分支先提供无需上架即可安装使用的 PWA 版本。

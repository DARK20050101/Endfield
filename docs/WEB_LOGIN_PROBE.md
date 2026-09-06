# Android 网页登录验证工程

更新：2026-09-04。此工程是授权路径验证工具，不是已经可用的抽卡记录客户端。

## 本轮源码结论

固定来源：bhaoo/endfield-gacha 72c526d49136fd23271f77e9ef33549de3721283，src-tauri/src/lib.rs 的 open_login_window、app/components/AddAccount.vue。

上游桌面通过 WebviewWindowBuilder 加载官方页面，注入 XHR/fetch 捕获及每 1500ms 的会话轮询。匹配 as.hypergryph.com/user/auth，轮询 web-api.hypergryph.com/account/info/hg，分别读取 data.token / data.content。然后把 Token 放入 http://tauri.localhost/login_success 的 query，Rust 拦截并向前端广播。脚本和 Rust 回调均输出秘密日志。以上是源码事实，不是本项目 Android 实测结果。

不移植这段捕获代码：它有秘密日志、query 回调、宽松字符串匹配与桌面窗口依赖。本轮未抓取任何真实用户浏览器会话，未请求真实游戏 API。系统浏览器打开用户中心只能验证页面及账号绑定可见性，不能自动把浏览器 Cookie/Token 返回 Tauri。

## 已实现范围

- 从上游 Nuxt 静态配置选择性保留 ssr=false、app/ 目录及 Tauri 开发环境配置；移除图表/UI 模块和 devtools，记录 MIT 来源。
- 移动布局的官方页面入口与枚举观察表；无密码/Token 输入框，无持久化观察记录。
- 原生命令 open_official_login 无 URL 参数，只允许主窗口请求打开固定官方用户中心；错误不包含原始异常。
- 前端没有 HTTP/文件插件权限；远程页面没有原生 IPC 权限。
- 程序不接收授权、不验证 B服身份、不拉取记录；“看到角色”仅为人工观察，credentialReceived 始终为 false。
- 没有嵌入远程登录页、没有注入脚本、没有创建未经官方证明的 OAuth redirect URI。

## 本机验证结果（2026-09-05）

- npm install：成功；锁定 600 个包，npm audit 报告 0 个漏洞。安装过程提示传递依赖 glob@10.5.0 已弃用，后续升级前复查依赖树。
- npm test：3/3 通过；验证观察 DTO 白名单、秘密输入拒绝、失败状态区分。
- npm run typecheck：通过。
- npm run generate：通过，生成 .output/public；Nitro 有未使用导入/缓存驱动构建警告，但未导致失败。
- 浏览器实测本地页面标题、两个选择框、按钮和状态区域可访问；选择失败状态后摘要仅包含枚举和值 credentialReceived=false。
- Rust 1.98.1、Cargo、rustup 和 aarch64-linux-android target 已安装到项目外缓存。
- npm run tauri -- info：WebView2 和 Rust 就绪；缺 Visual Studio/MSVC 与 Windows SDK。
- npm run android:init：失败，明确缺 Android SDK；没有生成 Android 工程或 APK。Doctor 同时确认 SDK/build-tools/cmdline-tools/NDK 缺失。

以上只验证本地前端和构建前置条件，不验证官方页面、B服绑定或凭据。

## 运行

Node 24+。在仓库目录运行：

~~~powershell
npm ci
npm test
npm run typecheck
npm run generate
npm run dev
~~~

浏览器访问 http://127.0.0.1:3000。这是前端预览，不是 APK。

原生准备（Windows PowerShell）：

~~~powershell
. ./scripts/environment.ps1
npm run doctor
npm run tauri -- info
~~~

Rust 安装在项目外的 D:/Ame/.cache/endfield，environment.ps1 仅设置当前进程环境。doctor 只检测前置条件；ready=true 也不表示能够成功构建。Java 与未来 Gradle/AGP 的兼容性还须构建确认。

Rust、MSVC C++ 工具、Java、Android SDK/platform/build-tools/cmdline-tools、NDK 和 Rust Android target 都就绪后：

~~~powershell
npm run android:init
npm run android:dev
# 或生成调试包：
npm run android:build
~~~

初始化生成的 gen/android 需单独审查（应用标识、备份、网络及调试权限）再登记；不把生成目录的存在当作真机构建证据。

## 真机验证顺序与下一门槛

1. 安装启动：验证本地页面、触摸与回到前台。
2. 打开官方用户中心：确认正常页面/验证码/登录可用；用户只在官方页面输入信息。
3. 检查 B服绑定前提：能否在用户中心查看自己的终末地 B服角色；不向仓库提交 UID、截图或凭据。
4. 研究授权返回契约：官方若支持应用回调，需要确认允许的 redirect/state/PKCE；否则单独验证隔离的 Android 原生登录适配器。不得凭桌面脚本推断已存在标准 OAuth 回调。
5. 只有取得安全会话内凭据后，才验证 grant→binding→U8→角色归属及角色/武器分页，再正式落库。

参考：[Nuxt/Tauri](https://v2.tauri.app/start/frontend/nuxt/)、[Tauri Android 前置条件](https://v2.tauri.app/start/prerequisites/#android)、[Opener](https://v2.tauri.app/plugin/opener/)。

## GitHub Pages 手机入口

验证站地址：https://dark20050101.github.io/Endfield/ 。

main 分支更新后，GitHub Actions 会执行 npm ci、测试、类型检查和静态生成，再发布 .output/public。构建时 baseURL 固定为 /Endfield/，本地开发仍使用 /。网页版本无需 Android SDK；它只能验证页面流程和人工观察结果，不能读取第三方域名的 Cookie、Token 或 HttpOnly 数据。

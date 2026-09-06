# Android 环境与手机验证记录

日期：2026-09-02。此记录不包含设备唯一标识、真实 UID、Token 或完整寻访 URL。

## 已检查的本机环境

| 项目 | 实际观察 | 能说明什么 |
| --- | --- | --- |
| Node | v24.14.0，可运行 | 可执行纯 JS 合成验证 |
| Java | Oracle JDK 25.0.1；JAVA_HOME 指向已有 JDK | 未验证其与未来 Gradle/AGP 版本兼容 |
| adb | scrcpy 配套 adb 可运行；devices 列表为空 | 没有连接可测试的 Android 设备 |
| Rust | 2026-09-05 在项目外缓存安装 rustc/cargo/rustup 1.98.1，并安装 aarch64-linux-android target | Rust 就绪；原生编译仍缺 MSVC/Windows SDK，Android 仍缺 SDK/NDK |
| Android SDK/NDK | ANDROID_HOME / ANDROID_SDK_ROOT / NDK_HOME 未设置，常见 SDK/Studio 路径未发现 | scrcpy 的 adb 不等于完整 SDK/NDK |
| 构建结果 | Nuxt typecheck/generate 通过；tauri android init 因 Android SDK 缺失失败 | 已有可运行网页原型；没有 Android 工程或 APK，不能报告 Android 兼容 |

[Tauri 官方前置依赖](https://v2.tauri.app/start/prerequisites/#android)要求配置 Android Studio/SDK 平台、Platform Tools、Build Tools、Command-line Tools、NDK、Java 路径及 Rust Android targets。后续准备构建环境时按实际项目工具链锁定版本，保留已有全局 Java 配置，优先使用项目级环境设置；本轮未安装这些工具或修改全局配置。

## 用户操作反馈（2026-09-03）

2026-09-03 用户反馈：断网后仅显示“网络异常”，没有完整地址。此结果记为该次操作失败（用户报告）；设备、游戏版本、Android/WebView 版本和渠道尚未确认，不能泛化为所有 Android/渠道均失败。此前“有链接”的说法已被用户更正，未取得 URL 样本。

当前优先验证手机官方网页登录及 B服绑定授权；不要求重复同一断网操作。以下流程保留作其他条件下的研究方案，不能当作已成功的教程。

## 手机链接验证方案

不需要先把 Token 发给开发者，也不需要有 PC 才能做第一步。请在手机游戏中检查：

1. 正常联网进入寻访记录，是否有复制地址/分享入口。
2. 若没有，再检查断网后刷新/重开是否显示可复制的完整 URL；记录失败/截断/无复制选项。
3. 恢复网络。完整链接只保留在自己的设备上，不粘贴到聊天或提交仓库。
4. 记录下面的非秘密结果。取得链接只是第一门槛，后续仍需本地 PoC 验证授权和角色/武器分页。

| 字段 | 待填写结果 |
| --- | --- |
| 测试编号/日期 | U-001 / 2026-09-03 用户反馈；实际操作日期未确认 |
| 游戏版本 | 未提供 |
| 官服或 Bilibili 渠道 | 未确认，不按项目定位推断 |
| Android / WebView 版本 | 未提供 |
| 正常联网可复制/分享？ | UNKNOWN |
| 断网后可复制完整地址？ | 否，该次操作失败（用户报告） |
| 是否截断、仅显示错误信息？ | 仅显示“网络异常”，无完整地址 |
| 是否必须断网？ | UNKNOWN |
| 脱敏 host 与 path（不含 query） | 未收集 |
| 参数名列表（不含值） | 未收集 |
| 角色/武器页面能否分别取链接？ | UNKNOWN |

仅参数名、host/path 仍需检查是否含个人标识；若包含则只说明“存在个人字段”。不提供截图中的完整链接、不上传 Cookie/Authorization。

## 构建与在线验收仍待完成

工具链就绪后：固定基线→隔离桌面代码→最小 APK→安装→粘贴→权限/身份验证→角色/武器分页→SQLite→重启→重复导入→无秘密日志。官方/B服、不同游戏版本分别记录；失败结果不能泛化为所有 Android 都不支持。

## 云端 APK 构建（2026-09-06）

按用户要求避免安装本地 Android Studio，新增 GitHub Actions 手动/源码变更构建。工作流使用 Ubuntu、Node 22、Temurin JDK 17、NDK r29 和 Rust stable，只构建 ARM64 debug APK，产物保留 7 天。首次运行结果必须回填本节；工作流存在不等于 APK 已验证。

APK 不包含签名发布密钥、账号、Cookie 或 Token。debug APK 仅供当前登录壳 PoC 测试，不作为正式发行包。官方 tauri-action 的 mobile 支持仍标为 experimental；本项目先用显式 CLI 步骤以便定位 init/build 失败。

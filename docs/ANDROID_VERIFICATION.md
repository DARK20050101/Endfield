# Android 环境与手机验证记录

日期：2026-09-02。此记录不包含设备唯一标识、真实 UID、Token 或完整寻访 URL。

## 已检查的本机环境

| 项目 | 实际观察 | 能说明什么 |
| --- | --- | --- |
| Node | v24.14.0，可运行 | 可执行纯 JS 合成验证 |
| Java | Oracle JDK 25.0.1；JAVA_HOME 指向已有 JDK | 未验证其与未来 Gradle/AGP 版本兼容 |
| adb | scrcpy 配套 adb 可运行；devices 列表为空 | 没有连接可测试的 Android 设备 |
| Rust | PATH 中无 cargo/rustc/rustup，常见 .cargo 目录与候选目录未发现 | 当前没有确认可用的 Rust 工具链，不等于扫描了全盘 |
| Android SDK/NDK | ANDROID_HOME / ANDROID_SDK_ROOT / NDK_HOME 未设置，常见 SDK/Studio 路径未发现 | scrcpy 的 adb 不等于完整 SDK/NDK |
| 构建结果 | 未安装应用依赖，未执行 APK 构建 | 不能报告构建成功或 Android 兼容 |

[Tauri 官方前置依赖](https://v2.tauri.app/start/prerequisites/#android)要求配置 Android Studio/SDK 平台、Platform Tools、Build Tools、Command-line Tools、NDK、Java 路径及 Rust Android targets。后续准备构建环境时按实际项目工具链锁定版本，保留已有全局 Java 配置，优先使用项目级环境设置；本轮未安装这些工具或修改全局配置。

## 先验证手机游戏能否提供链接

不需要先把 Token 发给开发者，也不需要有 PC 才能做第一步。请在手机游戏中检查：

1. 正常联网进入寻访记录，是否有复制地址/分享入口。
2. 若没有，再检查断网后刷新/重开是否显示可复制的完整 URL；记录失败/截断/无复制选项。
3. 恢复网络。完整链接只保留在自己的设备上，不粘贴到聊天或提交仓库。
4. 记录下面的非秘密结果。取得链接只是第一门槛，后续仍需本地 PoC 验证授权和角色/武器分页。

| 字段 | 待填写结果 |
| --- | --- |
| 测试编号/日期 | 未测试 |
| 游戏版本 | 未测试 |
| 官服或 Bilibili 渠道 | 未测试 |
| Android / WebView 版本 | 未测试 |
| 正常联网可复制/分享？ | UNKNOWN |
| 断网后可复制完整地址？ | UNKNOWN |
| 是否截断、仅显示错误信息？ | UNKNOWN |
| 是否必须断网？ | UNKNOWN |
| 脱敏 host 与 path（不含 query） | 未收集 |
| 参数名列表（不含值） | 未收集 |
| 角色/武器页面能否分别取链接？ | UNKNOWN |

仅参数名、host/path 仍需检查是否含个人标识；若包含则只说明“存在个人字段”。不提供截图中的完整链接、不上传 Cookie/Authorization。

## 构建与在线验收仍待完成

工具链就绪后：固定基线→隔离桌面代码→最小 APK→安装→粘贴→权限/身份验证→角色/武器分页→SQLite→重启→重复导入→无秘密日志。官方/B服、不同游戏版本分别记录；失败结果不能泛化为所有 Android 都不支持。

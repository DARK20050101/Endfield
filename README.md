# Endfield Trace

计划开发的《明日方舟：终末地》寻访记录与分析工具：**Local-first、Android-first、Bilibili 渠道服优先**。

目标是 Android 与 Windows 两个可独立使用的完整客户端，后续提供 PWA 轻量客户端。无需注册云账号；游戏授权不上传云端；SQLite 保存本地历史，WebDAV 为可选数据同步。

当前已完成文档初始化、四个上游重点模块首轮审查及 9 项纯函数合成行为验证，尚无可安装 APK、可运行应用或已实测的 B服接口。计划优先支持粘贴寻访链接；Android 当前版本能否在游戏内取得完整链接仍待验证，不能据此宣称已经支持免登录分析。

## 从这里开始

- [项目背景、要求与当前状态](docs/PROJECT_CONTEXT.md)
- [架构与推荐目录](docs/ARCHITECTURE.md)
- [Android 路线图与验收](docs/ROADMAP.md)
- [寻访 URL 调研](docs/GACHA_URL_RESEARCH.md) / [API 证据](docs/API_RESEARCH.md)
- [B服授权时序](docs/BILIBILI_AUTH_FLOW.md)
- [数据库](docs/DATABASE.md) / [安全](docs/SECURITY.md) / [同步](docs/SYNC.md)
- [移动端](docs/MOBILE.md)
- [上游策略](docs/UPSTREAM_STRATEGY.md) / [参考矩阵](docs/reference/REFERENCE_MATRIX.md)
- [许可证审查](docs/LICENSE_REVIEW.md) / [第三方记录](THIRD_PARTY_NOTICES.md)
- [正式决定](docs/DECISIONS.md) / [协作入口](AGENTS.md)
- [Phase 0 续轮结论与阻塞项](docs/PHASE0_AUDIT.md) / [Android 环境与设备证据](docs/ANDROID_VERIFICATION.md)

在 Codex 中打开本仓库目录后开始任务，根目录 AGENTS.md 指引读取项目文档；新建于其他目录的无项目会话不会自动拥有这里的上下文。项目不依赖历史聊天，也不需要重复粘贴整份要求。

本项目尚未选定发布许可证，也未引入上游实现。许可证与素材来源分别审查，不将游戏原生 UI 资产视为可自由复制素材。

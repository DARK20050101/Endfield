# BoxCatTeam/endfield-cat

[固定版本](https://github.com/BoxCatTeam/endfield-cat/tree/eacc267309c4c592d76615f036f524fd1e8ad0fe)，2026-09-02 审查；根 LICENSE 为 GPL Version 2。

实际检查：仓库 metadata、根 LICENSE，以及下方列出的 IPC 入口、数据库/迁移和部分 API 代码。未完成全仓审查或运行验证。

研究目标：Tauri/Rust/Vue/Pinia/SQLite 的模块边界、IPC DTO、schema migration、元数据组织及图表数据组织。已确认范围以下方源码观察为准，未审查部分继续待办。

当前仅允许学习设计；在 [LICENSE_REVIEW](../LICENSE_REVIEW.md) 完成项目许可兼容审查前不得直接复制源码。若将来采用 GPL 兼容策略，须记录新的正式决定后重新审查文件与分发要求。

EndCat 历史格式可作为后续导入兼容目标，但格式研究与复制 GPL 导入器是不同事项。尚无本地衍生代码或直接复用文件。

## 第二轮：架构源码观察（不复制实现）

补读 src-tauri/src/lib.rs、database.rs、hg_api/auth.rs、hg_api/gacha.rs。仅架构/局部逻辑审查，未构建运行。

- lib.rs 用 app.manage 管理 DB pool 与 HTTP client，通过 Tauri commands 暴露账号、同步及存储用例；值得参考共享资源与 IPC 分层。
- database.rs 有 PRAGMA user_version、旧库位置迁移、建表/加列及重建表事务；但部分迁移错误被忽略，不应把“有版本字段”当成可靠迁移完成。
- **不继承存储安全策略**：accounts 表含 user_token/oauth_token/u8_token TEXT，且 UID 为主键；目录基于 current_exe。与本项目秘密分离、多维身份和 Android 应用目录要求不符。
- auth.rs 的开发日志存在 request_body 输出，该对象包含 Token；学习 Rust 服务边界不意味着可保留其日志做法。
- gacha.rs 将角色、武器池、武器分页分为命令；有基于 seqId 的增量停止，真实唯一范围和分页安全仍需独立验证。

来源：[lib.rs](https://github.com/BoxCatTeam/endfield-cat/blob/eacc267309c4c592d76615f036f524fd1e8ad0fe/src-tauri/src/lib.rs)、[database.rs](https://github.com/BoxCatTeam/endfield-cat/blob/eacc267309c4c592d76615f036f524fd1e8ad0fe/src-tauri/src/database.rs)、[auth.rs](https://github.com/BoxCatTeam/endfield-cat/blob/eacc267309c4c592d76615f036f524fd1e8ad0fe/src-tauri/src/hg_api/auth.rs)。GPL 复制限制保持不变。

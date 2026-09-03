# RoLingG/endfield-gacha-app

[固定版本](https://github.com/RoLingG/endfield-gacha-app/tree/f71165a63e86ce723a89109416c42d7657e868a6)，2026-09-02 审查；根 LICENSE 为 MIT。

实际检查：仓库 metadata、根 LICENSE，以及下方列出的 HTTP、API、模型与存储模块。此前打开的 README 明确警示旧 HGWebview.log 在线同步方式受日志变更影响；该警示不能泛化为所有授权方式失效。UI 登录与导出等模块仍待审查。

研究目标：官服/B服/UID 隔离、Web Token、URL/manual token、JSON 迁移、备份与导入/导出、恢复和元数据处理，并与主基线交叉核对 API。

复用边界：已确认下列核心实现为 Go，不引入第二套 runtime。优先依据协议及合成样本将适用行为重实现到 Rust。旧日志扫描不能成为 Android 主路径。

## 第二轮：实际实现

补读：internal/api/client.go、internal/api/fetcher.go、internal/model/types.go、internal/storage/manager.go，均为上述固定 commit。以下为源码确认，未运行 Go 应用或真实接口。

- client.go 复用 15 秒超时 HTTP client；fetcher.go 用 context 取消、重试、逐页 seq_id，先取得武器池再拉各池数据。请求序列可作为主基线交叉证据，Go runtime 不引入。
- 角色池列表在该文件包含 Special/Standard/Beginner，主基线还出现 Joint；池枚举不能把任一项目版本直接当成完整事实。
- GetPlayerBindings 用 isOfficial 与 channelName=`bilibili服` 识别渠道，并取第一个角色摘要。可借鉴显式渠道来源，但显示字符串和首角色回退不能成为本项目稳定身份策略。
- **角色查询存在协议差异**：GetUIDByU8Token 使用 QueryRoleRequest，types.go 实际 JSON 键是 `server`（整数），而 bhaoo 使用 `serverId`。两者可能反映接口兼容/版本差异，未实测前不选一个宣称正确；上游解析失败默认 1 也不能照搬。
- gachaSession.get 构造含 u8_token 的 Referer，而 bhaoo 主要显式设置 User-Agent。Header 是否必要未知，Referer 必须纳入脱敏。
- manager.go 按 UID 目录和 official/bilibili 文件名前缀隔离，合并键为 seqId，包含临时文件、备份、rename 失败恢复。值得借鉴写入恢复行为，不能复制其未知渠道默认 official、同键覆盖、损坏 JSON 后继续覆盖的行为。

候选移植/重实现清单：请求超时与取消语义、武器池枚举流程、备份恢复状态、历史 JSON 字段映射；暂未发现可不改造就引入的 Go 模块。尚未完整审查 UI 登录 helper、CSV/XLSX 导出和所有恢复路径。

来源：[fetcher.go](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/internal/api/fetcher.go)、[types.go](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/internal/model/types.go)、[manager.go](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/internal/storage/manager.go)。

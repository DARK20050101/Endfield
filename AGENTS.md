# Endfield Trace：仓库协作规则

## 开始任务

1. 先读 [项目上下文](docs/PROJECT_CONTEXT.md)、[正式决定](docs/DECISIONS.md) 和 [路线图](docs/ROADMAP.md)，再检查 Git 状态及相关实现。
2. 仓库文档是项目要求的 Source of Truth；SQLite 是运行时业务数据的 Source of Truth。不要依赖旧聊天、记忆或上游 README 补造决定。
3. 用户新指令优先。若其改变既有决定，同次修改更新对应主题文档及 DECISIONS；发现文档矛盾时明确指出，不悄悄沿用旧方案。
4. 文档初始化已完成；用户已要求继续，当前推进 Phase 0 与后续最小 PoC 准备。不要反复要求批准已经授权的调查或可逆准备工作；真实接口与设备证据缺失时如实记录，不跳过验收门槛开展完整产品开发。

## 当前验证路线（D-015）

用户报告断网后仅显示“网络异常”、无完整链接；这是单次操作反馈，不代表全渠道结论。当前优先验证 Android 官方网页登录与 B服绑定授权，URL 保留可选。不要继续把断网复制当作可用教程；网页登录仍需实证，不能默认可用。下方 URL-first 为原始条件策略，执行时以本节最新路线为准。

## 按任务读取

| 任务 | 必读文档 |
| --- | --- |
| 架构、模块边界 | [ARCHITECTURE](docs/ARCHITECTURE.md) |
| 游戏接口、凭据验证 | [API_RESEARCH](docs/API_RESEARCH.md)、[BILIBILI_AUTH_FLOW](docs/BILIBILI_AUTH_FLOW.md) |
| 寻访链接 | [GACHA_URL_RESEARCH](docs/GACHA_URL_RESEARCH.md)、[SECURITY](docs/SECURITY.md) |
| 数据库、身份、迁移 | [DATABASE](docs/DATABASE.md) |
| Token、Cookie、剪贴板、日志 | [SECURITY](docs/SECURITY.md) |
| Android、平台能力、移动端交互 | [MOBILE](docs/MOBILE.md) |
| 拉取、文件导入、WebDAV、冲突 | [SYNC](docs/SYNC.md) |
| 第三方代码复用 | [UPSTREAM_STRATEGY](docs/UPSTREAM_STRATEGY.md)、[LICENSE_REVIEW](docs/LICENSE_REVIEW.md)、[THIRD_PARTY_NOTICES](THIRD_PARTY_NOTICES.md) |

## 必守边界

- Android > Windows > PWA；只有手机的用户是第一用户。Android 必须能独立获取授权、拉取记录、本地保存和分析。
- V0.1 为 Android Gacha URL Import PoC。获取路径优先级：URL > 手动授权 > 官方网页登录；URL 不稳定时提升网页登录，不能引入 PC 必需步骤。
- URL 获取方法尚未实测。不得宣称 B服 Android 已支持断网复制链接或免登录同步。
- 共享核心从第一天建立：CredentialSource → ValidatedCredentialContext → Provider → SyncEngine。组件不包含游戏 API、Token 解析、去重或核心统计。
- UNKNOWN 接口不得进入业务核心。PARTIAL 只用于受控验证，不能冒充线上支持；状态、证据和测试范围遵循 API_RESEARCH。
- 密码永不保存；Token/Cookie 不进入普通数据库、普通日志、远程仓库或 WebDAV。URL 导入默认仅本次会话授权。
- 内部身份用 UUID；外部身份考虑 provider、region、channel、gameUid、roleId、serverId。昵称不是键，UID / seqId 不假设全局唯一。
- 未解析身份不能并入既有角色。原始记录仅保留脱敏的业务数据，不保留授权响应或完整寻访 URL。
- 优先复用经许可及验证的成熟模块；EndCat 在兼容性审查完成前只参考设计。所有衍生文件登记来源 commit、路径和改动。
- 不默认云同步、遥测或公共统计；规则与元数据必须有版本和证据。可用性不能豁免隐私要求。

## 完成任务

- 修改与任务相关的最小范围；不进行无关清理或重构。
- 对风险逻辑运行相关测试；已有工具链时运行相应 lint / typecheck。没有脚本时说明未配置，不能捏造成功。
- 文档阶段检查链接、术语、路线图、证据状态和敏感信息；SQL 草案用内存 SQLite 验证，不创建真实用户库。
- 同步更新主题文档、决定和任务状态。报告修改文件、验证结果、待验证事项及风险。
- 最小原型命令：npm test、npm run typecheck、npm run generate；原生先在 PowerShell 执行 . ./scripts/environment.ps1，再 npm run doctor。范围与限制见 docs/WEB_LOGIN_PROBE.md。

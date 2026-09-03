# 上游与复用策略

原则：reuse before rewrite，verify before assume。许可、行为正确性、Android 适配与安全边界同时通过才是可复用模块。

## 基线选择

第一基线：[bhaoo/endfield-gacha](https://github.com/bhaoo/endfield-gacha)。优先评估 fork 或以其代码起步，保留成熟功能及来源历史；不是为“原创”重写鉴权、分页、分析。

当前本仓库为独立文档仓起步，未 fork、未导入上游业务代码。续轮选择 bhaoo commit 72c526d49136fd23271f77e9ef33549de3721283 和其 Nuxt 4 静态前端作为后续基线，优先 fork / 保留来源历史，不切换纯 Vite。实际 Android 构建和源码引入尚未完成。

| 方案 | 收益 | 成本 / 采用条件 |
| --- | --- | --- |
| fork / 保留上游代码起步 | 成熟功能、历史可追溯、较容易对照修复 | 审查 Nuxt/Tauri Mobile、前端凭据与 JSON 存储迁移；适配可控时优先 |
| 独立壳 + 选择性移植 | 能先围绕 Android/session-only/SQLite 收敛 | 容易漏掉边界与重复开发；只有基线耦合成本明显更高时采用，并记录证据 |
| 完全重写 | 可自行安排模块 | 当前不推荐；不能以风格不同作为重写可靠模块的理由 |

源码引入前保留当前文档提交和差异记录；分离桌面登录、配置秘密与应用数据目录，才能进行 Android 验证。上游指令不能覆盖产品决定，不能整仓照搬后把手机验收标完成。

## 四个上游各自作用

- bhaoo：官服/B服/国际服、多账号、授权/绑定/角色、角色与武器分页、增量/全量、WebDAV、分析、Vue/Tauri。URL parser、manual token、U8、server_id/seq_id 优先审计。
- RoLingG：数据隔离、Web Token、多角色、JSON 迁移、备份、导入/导出和恢复。Go 逻辑参考协议和行为，不能为复用而引入第二套 Go runtime。
- MoguJunn：移动布局、纯统计/转换、数据清洗与大数据量处理。V0.x 不搬云架构，不为移植 React 组件破坏 Vue 技术栈。
- EndCat：IPC、SQLite migration、元数据与模块边界。根许可证为 GPL v2；在本项目兼容性审查完成前不直接复制源码，仅参考设计。

固定版本、文件审查程度和未知项见 [REFERENCE_MATRIX](reference/REFERENCE_MATRIX.md)；许可依据见 [LICENSE_REVIEW](LICENSE_REVIEW.md)。

## 决策顺序

1. 许可允许、实现稳定、测试可靠且适配边界满足 → 直接保留。
2. 技术栈兼容但耦合 UI/平台 → 提取和移植，保留行为与来源。
3. 不兼容 → 独立实现协议和可验证行为，不机械引入新 runtime。
4. 不兼容许可证 → 只参考设计。
5. 许可不明 → 不直接复制，先完成具体文件审查。

“根 LICENSE 为 MIT”不是对所有素材、子模块和依赖的无限授权。直接引入前审查文件头、目录许可证、依赖及资源来源；最终发布许可证仍待决定。

## 必须登记的来源

每个复制/修改/衍生模块在 [THIRD_PARTY_NOTICES](../THIRD_PARTY_NOTICES.md) 记录 Feature、Upstream project、Repository URL、License、Original file、Original commit、Local target file、Changes made、Reason for reuse、测试证据、审查日期。保留需要的版权与许可正文。

当前只进行源码调查与项目外临时合成验证，不将上游业务实现复制进本仓库。后续首次应用复用时不能继续写“尚未引入第三方代码”。

## 上游更新

引入后把 upstream 与 origin 分开，固定基线 commit，并记录本地改动列表。按具体安全修复/API 变化选择更新，不自动整体覆盖本地分支。不把上游默认行为视为项目新需求，也不自动建立定时任务。

升级先比较来源文件与本地差异，运行相关契约、合成样本、分页/去重/安全测试，再更新 API 证据、许可证和来源记录。UI 与凭据耦合不能因为来自成熟项目而免于改造。

## 目前可给出的复用结论

- bhaoo：Nuxt/Tauri 配置为保留候选；URL parser 已实证缺 host/scheme/重复参数校验，不能原样用于用户入口；凭据、目录、capability、CSP、角色回退需改造。WebDAV 条件写仍缺失。
- RoLingG：已审查 HTTP、绑定、分页和 JSON 备份恢复，复现协议/恢复语义，不引入 Go；server 与 serverId 的请求差异进入验证矩阵。
- MoguJunn：pityIntervals.js 无运行时依赖且合成测试确认排除首段，列为首批纯函数复用候选；输入提取和 normalizer 需要安全及 unknown 语义改造。
- EndCat：已检查 DB/HTTP 状态与迁移边界；凭据 TEXT、UID 主键和开发日志不符合目标；依然只参考设计，不复制源码。

该结论与附件中的候选能力清单不同：候选清单是研究目标，只有看过源码和测试后才成为事实。

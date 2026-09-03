# 项目上下文

更新：2026-09-03。本文管理产品定义；具体技术主题由下方文档负责，避免复制多份相互漂移的规范。

## 定位与用户

Endfield Trace 是 Local-first、Android-first、Bilibili 渠道服优先的《明日方舟：终末地》寻访记录与分析工具。价值在于可靠的手机独立使用、跨端共享核心、本地长期历史、其他工具历史迁移及可维护的分析能力。

首要场景：用户只有 Android 手机，不愿在第三方工具重新输入游戏账号密码。优先调查游戏寻访 URL 导入；该方案是产品方向，不是已证实的游戏能力。

最终支持 Android only、Windows only、Android + Windows、PWA/Web 轻量查看。Android、Windows 都是完整客户端；PWA 不代替 Android，也不承担核心游戏登录责任。

## 已确定的产品要求

- 平台优先级 **Android > Windows > PWA**，B服优先，身份模型兼容官服、国际服、多账号、多角色、多服务器。
- 允许一次主动粘贴链接或授权后自动分页获取记录；不要求逐条手工录入。
- 获取方式顺序：Gacha URL Import、Manual Token、Official Web Login。URL 路线被实测证明不可靠时，提升网页登录优先级。
- Local-first：不注册云账号、不启用云功能也能完整使用；SQLite 统一业务存储，离线可查看已有数据。
- 密码永不保存；游戏 Token/Cookie/OAuth 凭据不上传云端。URL 授权默认 session-only，可选持久化必须进入安全存储。
- WebDAV 是后续可选记录同步，不能成为 Android 取数前置条件；历史文件导入与凭据导入是不同边界。
- 规则、统计和数据转换脱离 UI。复用成熟实现优先于重写，但不得以复用为由保留不安全的凭据处理。
- 公共统计、运气百分位需明确 opt-in，默认关闭。无样本依据时不生成虚构排名。
- 视觉采用自主设计的工业终端风格，支持触摸、响应式、明暗主题和快速加载；不直接复制游戏 UI 资产。

## 默认技术方向与待选项

| 项目 | 当前方向 | 状态 |
| --- | --- | --- |
| UI | Vue 3、TypeScript、Pinia、Vue Router、ECharts | 默认技术栈，尚未安装 |
| 构建 | 沿用 bhaoo 的 Nuxt 4 静态前端 / Vite 底层，关闭 SSR | 续轮基线选择；实际构建待环境验证 |
| 客户端 | Tauri 2，Android 使用 Tauri Mobile | 方向确定，Android 本机可行性待 PoC |
| 共享核心 | Rust 为目标；可迁移的纯 TS 暂可复用 | 不维护两份重复业务规则 |
| 业务库 | SQLite + 版本化迁移 | 确定 |
| 凭据 | Windows 系统安全存储；Android Keystore / Stronghold 等候选 | 具体实现未选定；V0.1 默认不持久化 |
| 云同步 | 可选 WebDAV | V0.5；不上传授权 |

## 当前授权验证顺序

2026-09-03 用户反馈：断网后仅显示“网络异常”，没有完整地址。此结果记为该次操作失败（用户报告）；设备、游戏版本、Android/WebView 版本和渠道尚未确认，不能泛化为所有 Android/渠道均失败。此前“有链接”的说法已被用户更正，未取得 URL 样本。

按 D-015，当前优先验证 Android 官方网页登录与 B服绑定授权，URL 入口保留。并未证实网页登录可行，也未开发 APK。现有共享核心与本地存储目标保持适用。

## 版本目标

Phase 0 验证 URL 获取和上游；V0.1 Android URL Import PoC；V0.2 Android 完整同步与恢复；V0.3 Android 基础分析与 UI；V0.4 Windows；V0.5 WebDAV；V0.6 其他工具导入；V0.7 PWA；V0.8 欧非、年度报告、分享。详细验收以 [ROADMAP](ROADMAP.md) 为准。

分析范围：总抽数、各星级数量与占比、角色/武器/卡池统计、距上次六星抽数、六星间隔、平均/中位间隔、最短/最长间隔、UP 情况、时间线及月统计。涉及保底、免费抽和继承的指标，必须依赖已验证规则与历史覆盖范围，不能仅凭不完整记录宣称精确值。

## 当前仓库事实

- 初次检查为空目录，已初始化独立 Git 仓库 main；不是 bhaoo 的 fork，未导入任何第三方业务代码。
- 当前只有文档与仓库基础配置。没有应用依赖、构建脚本、用户数据库或真实凭据。
- 已阅读 bhaoo 的授权、绑定、角色、寻访分页及类型实现，已核对四个上游固定 commit 的根许可证。
- 四个项目均已完成重点模块首轮源码审查，见 [参考矩阵](reference/REFERENCE_MATRIX.md)；bhaoo/MoguJunn 纯函数另有 9 项合成行为验证。并非全仓安全审计或四个应用运行验证。
- 没有在真实 Android / B服账号上实测。完整链路、URL 取得方式、Token 生命周期、唯一性规则均未 VERIFIED。
- 文档初始化完成后用户已要求继续；当前在 Phase 0，结果见 [PHASE0_AUDIT](PHASE0_AUDIT.md)。未连接 Android 设备，当前环境未发现 Rust/Android SDK/NDK 可用配置，不能宣称已能构建 APK。
- 本地保留初始化提交 95972f3 与审查提交 7be9bce。用户已选择公有仓库，远程确认为 [DARK20050101/Endfield](https://github.com/DARK20050101/Endfield)，origin 已配置。2026-09-03 用户更新应用授权后，Endfield 已进入连接器授权范围；通过 GitHub 连接器发布文档快照，保留远程初始化提交。原生 Git 网络故障尚未解决；原有本地文档历史保存在 archive/documentation-before-publish 分支，main 对齐远程发布提交。
- 初始化文档验证：2026-09-02，13 个指定文件齐全，初始 21 份 Markdown 的 71 个内部链接有效；SQL 草案的 12 张表通过内存 SQLite 语法、外键、身份隔离、复合去重、大 ID 文本保真、未知布尔值与事务回滚检查。此结果不代表真实游戏接口、APK 或正式数据库迁移已验证。

## 文档责任

| 主题 | 权威文档 |
| --- | --- |
| 产品定义与状态 | 本文 |
| 模块、接口边界、目录 | [ARCHITECTURE](ARCHITECTURE.md) |
| 上游选择与来源管理 | [UPSTREAM_STRATEGY](UPSTREAM_STRATEGY.md)、[LICENSE_REVIEW](LICENSE_REVIEW.md) |
| API 证据与准入 | [API_RESEARCH](API_RESEARCH.md) |
| URL 获取可行性 | [GACHA_URL_RESEARCH](GACHA_URL_RESEARCH.md) |
| B服身份与时序 | [BILIBILI_AUTH_FLOW](BILIBILI_AUTH_FLOW.md) |
| 存储与迁移 | [DATABASE](DATABASE.md) |
| 授权、日志、输入安全 | [SECURITY](SECURITY.md) |
| Android 体验与能力 | [MOBILE](MOBILE.md) |
| 拉取、导入与跨端合并 | [SYNC](SYNC.md) |
| 阶段验收 | [ROADMAP](ROADMAP.md) |
| 决定变更及原因 | [DECISIONS](DECISIONS.md) |

两份 2026-09-02 项目定义已按主题归档于上述文件；其中 Android-first / Gacha URL Import 补丁取代原 Windows-first 排期。后续决定直接更新仓库，不以聊天记录作为隐藏前提。

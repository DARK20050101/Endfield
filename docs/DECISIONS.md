# 正式决定记录

本文件保存决定及演变。产品和技术细节仍以相应主题文档为准；变更决定时更新主题文档，并标明替代关系，避免维护两套排期。

## D-001：文档成为项目要求的 Source of Truth

- Date：2026-09-02；Status：ACCEPTED。
- Decision：根 AGENTS.md 指向项目上下文并按任务路由主题文档；新会话不依赖旧聊天。
- Reason：长期维护需要可审查的要求和证据。
- Alternatives：每次粘贴全部聊天；单篇超长提示。
- Consequences：变更实现必须同步更新相关要求、证据、决定；当前事实与目标能力分开。

## D-002：Android-first，双端完整客户端

- Date：2026-09-02；Status：ACCEPTED，取代早期 Windows-first 排期。
- Decision：Android > Windows > PWA；只有手机的用户是首要用户，Windows 保留完整独立能力。
- Reason：用户明确的 Android-first 补丁及手机高频查看场景。
- Alternatives：Windows 取数、手机只读；两端同时扩大实现范围。
- Consequences：V0.1 Android URL PoC，V0.4 Windows；PWA 后置，不能替代原生手机端。

## D-003：URL 授权优先，但可行性不预设

- Date：2026-09-02；Status：ACCEPTED（优先级），可行性 UNKNOWN。
- Decision：URL > 手动授权 > 官方网页登录；URL 不稳定时提升网页登录。
- Reason：可能减少平台依赖和重复输入账号；仍需证明当前 B服手机取链接能力。
- Alternatives：首先实现网页登录；仅日志扫描。
- Consequences：断网复制流程仅是待验证候选；宣传能力须 VERIFIED；手动授权 fallback 也必须不依赖 PC。

## D-004：统一 CredentialSource 与共享核心

- Date：2026-09-02；Status：ACCEPTED。
- Decision：多授权来源统一为 ValidatedCredentialContext，再交 Provider/SyncEngine；从 V0.1 建立共享边界。
- Reason：获取方式和平台变化不应重写同步与统计。
- Alternatives：UI 各自请求 API；后期再抽离。
- Consequences：parser、授权、分页、去重和 Analytics 不散落 Vue 页面；身份验证与授权有效性分别处理。

## D-005：Local-first 与会话授权

- Date：2026-09-02；Status：ACCEPTED。
- Decision：默认本地 SQLite、无云账号、URL 授权 session-only；持久化授权必须显式选择安全存储。
- Reason：减少秘密暴露，保留手机独立能力。
- Alternatives：默认保存 Token；云代理登录或同步授权。
- Consequences：WebDAV 不含游戏凭据；Token 失效重新取得，历史不受影响；便利性不豁免安全规则。

## D-006：内部 UUID 与外部身份分离

- Date：2026-09-02；Status：ACCEPTED（原则）；SQL 草案 PROPOSED。
- Decision：身份考虑 provider/region/channel/gameUid/roleId/serverId；未知归属暂存，URL 路线不强制 Account 登录。
- Reason：多账号、多渠道和跨端合并不能依赖昵称或 UID 全局唯一。
- Alternatives：UID 作为主键；授权能取数即自动并入当前角色。
- Consequences：需要身份解析及映射；seqId 唯一性必须实测，正式 migration 等待验证。

## D-007：优先复用 bhaoo，具体基线待审查

- Date：2026-09-02；Status：ACCEPTED（复用原则）；基线引入方式 PROPOSED。
- Decision：优先 fork / 以 bhaoo 代码起步；在 Android、安全和许可审查后决定 fork 或选择性移植。
- Reason：成熟模块应保留，Android-first 又要求改造现有平台耦合。
- Alternatives：完全重写；不经审查完整复制。
- Consequences：当前独立文档仓并非已 fork；构建 Vite/Nuxt 未定；不用 Go runtime 或 React 组件破坏目标栈。

## D-008：许可与来源逐项登记

- Date：2026-09-02；Status：ACCEPTED。
- Decision：复用记录 commit/原始路径/目标路径/许可/改动；EndCat 在兼容审查前只参考设计。
- Reason：根许可不能替代具体文件与素材审查。
- Alternatives：仅列项目名；认为开源即随意复制。
- Consequences：项目最终发布许可证待定；本轮没有直接引入第三方实现。

## D-009：无凭据 WebDAV 与集合合并

- Date：2026-09-02；Status：ACCEPTED（原则）；发布协议 PROPOSED。
- Decision：V0.5 可选 WebDAV，白名单业务快照、身份映射、冲突保留，不默认 last-write-wins。
- Reason：双设备并发修改不能覆盖历史，更不能传播 Token。
- Alternatives：上传整个 SQLite/配置目录；最新文件覆盖。
- Consequences：需服务器能力验证、条件更新及损坏恢复；不传播删除，后续需求再设计。

## D-010：本轮止于文档初始化

- Date：2026-09-02；Status：ACCEPTED。
- Decision：完成文档与一致性检查后提交变更摘要，不自动开展大规模业务开发。
- Reason：用户本轮明确范围。
- Alternatives：直接安装依赖、生成客户端、实现完整登录。
- Consequences：未做的真机验证、源码审计及 PoC 保持待办，不能因创建文件而标完成。

## D-011：采用 bhaoo 固定基线并保留 Nuxt

- Date：2026-09-02；Status：ACCEPTED（后续实现基线选择），细化 D-007；实际源码尚未引入。
- Decision：使用 bhaoo 72c526d49136fd23271f77e9ef33549de3721283 为候选代码起点，保留 Nuxt 4 静态前端/SSR 关闭，优先保留 fork/来源历史，不为换成纯 Vite 重写 UI。
- Reason：源码已有 Nuxt 静态输出配置，Tauri 官方提供 Nuxt 集成路径；主要风险在凭据、目录和平台权限，换 Vite 不会自动消除这些问题。
- Alternatives：纯 Vite 新壳并逐项移植；无改造直接整仓打 APK。
- Consequences：先隔离 URL parser、CredentialSource、Android 应用数据目录、IPC/capability、SQLite，再做构建验证；没有证明 Nuxt 成为实际 blocker 前不扩大迁移范围。包版本和生成目录最终以实际构建锁文件验证。

## D-012：继续 Phase 0，保留真实验证门槛

- Date：2026-09-02；Status：ACCEPTED，D-010 的首次汇报暂停点已履行。
- Decision：响应用户“继续”，完成上游重点模块审查、合成验证、本地 Git 提交及远程建仓尝试；继续最小 PoC 准备，不因文档先前的暂停语句反复求确认。
- Reason：后续任务已得到授权，但授权不能替代真实设备与协议证据。
- Alternatives：只重复汇报；未经证据直接开发完整产品。
- Consequences：9 个合成行为结果不升级 API/Android 为 VERIFIED；设备未连接和远程建仓通道不可用分别记录实际限制。

## D-013：使用公有项目仓库

- Date：2026-09-02；Status：ACCEPTED。
- Decision：按用户明确要求使用公有仓库 DARK20050101/Endfield，发布已审查的项目文档。
- Reason：用户选择公有仓库，API 已确认该仓库存在且账号具备写入权限。
- Consequences：只发布版本控制中的项目文件，不上传聊天附件、临时审查源码或凭据；原生 Git 受阻时可通过具有写权限的连接器发布快照，保留本地提交，后续协调提交历史。首次连接器上传返回 403；2026-09-03 用户更新授权后，此权限阻塞解除。公开仓库不等于已选定发布许可证，也不放宽第三方代码复制限制。

## D-014：连接器发布与本地历史保留

- Date：2026-09-03；Status：ACCEPTED。
- Decision：沿用远程初始化提交，通过 GitHub 连接器发布完整文档快照；原有本地提交保存到 archive/documentation-before-publish，主分支对齐远程。
- Reason：用户已更新权限并授权继续上传；原生 Git 连接仍受阻，需要使项目远程可用且不丢失任一侧历史。
- Consequences：不强推远程、不删除原有本地历史；对齐前校验远程提交及文件树，文档发布不代表 Android/API 验收完成。

## D-015：断网取链接失败后，优先验证手机网页登录

- Date：2026-09-03；Status：ACCEPTED，触发 D-003 的后备验证策略。
- Evidence：用户先更正为无法取得链接，再明确反馈“断网后显示网络异常，没有完整地址”。记录 U-001；未提供机型、游戏/系统版本及渠道确认，开发侧未独立复现。
- Decision：不继续依赖该次失败的断网取链接路径，优先验证 Android 官方网页登录、B服绑定前提和安全授权返回；URL 入口保留为候选。
- Consequences：不把失败推广至所有 Android/渠道，不把网页登录标为可用；手动 Token 须有独立手机获取路径才算兜底。共享 CredentialSource/Provider/SyncEngine 不变，先授权验证后业务取数；URL 专项验收不能被网页登录测试代替。

## D-016：先落地不接收凭据的网页登录观察原型

- Date：2026-09-04；Status：ACCEPTED，细化 D-011/D-015。
- Decision：选择性移植 bhaoo Nuxt 静态配置，建立最小 Tauri 外部官方页面入口，先验证页面/绑定可见性；不引入上游桌面 Token 注入/日志/query 回调。
- Evidence：已读固定版本 lib.rs open_login_window，存在明确的秘密输出及桌面耦合；没有官方 Android 授权回调契约证据。
- Consequences：页面打开、人工观察与应用授权严格区分；没有接入 Cookie/Token，不算 V0.1 取数验收。授权返回经验证后再接共享核心；当前代码不是完整 fork 或完整客户端。

## D-017：当前验证阶段优先发布静态网页

- Date：2026-09-06；Status：ACCEPTED，调整 D-002 的验证顺序，不改变完整客户端的长期目标。
- Decision：将无凭据的网页登录观察原型通过 GitHub Pages 发布，优先用手机浏览器验证页面和绑定可见性；Android Studio、SDK/NDK 与 APK 构建延后到确有原生能力需求时。
- Reason：用户希望免安装、通过网址直接访问；当前原型已经可以静态生成。
- Consequences：GitHub Pages 仅托管公开静态文件。浏览器同源、CORS、SameSite 与 HttpOnly 边界仍然成立，网页不能读取其他域的登录 Cookie 或绕过官方授权流程；若后续授权必须依赖原生 WebView/系统回调，再恢复 Android 构建验证。

## 后续决定模板

Date、ID、Status（PROPOSED/ACCEPTED/SUPERSEDED）、Decision、Reason、Alternatives、Consequences、证据、被替代/替代的决定。新增决定必须描述事实依据，不补造历史。

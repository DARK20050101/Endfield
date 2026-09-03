# Phase 0 续轮结果

日期：2026-09-02。范围：四个固定上游的重点模块审查、纯函数合成验证、Android 环境检查、本地 Git 归档与远程建仓尝试。没有完成四个应用全仓审计或真实游戏账号验证。

## 基线与移植建议

首选 bhaoo 72c526d49136fd23271f77e9ef33549de3721283 + Nuxt 4 静态前端，继续优先 fork/保留来源历史。其 SSR 关闭与 Tauri 静态输出方向可保留；没有证据表明换纯 Vite 能降低当前主要风险。具体改造见 [上游策略](UPSTREAM_STRATEGY.md)。

| 原要求汇报项 | 结论 |
| --- | --- |
| A bhaoo 原样保留 | Nuxt 静态前端结构、适用 UI/类型/纯函数作为候选；尚无通过 Android 发布验证的整文件名单 |
| B bhaoo 重构 | URL 输入校验、秘密生命周期、JSON 配置/SQLite、应用目录、权限/CSP、角色回退与 WebDAV 条件写 |
| C RoLingG 移植 | 超时/取消、武器池枚举、备份恢复与格式语义；不引入 Go runtime |
| D MoguJunn 移植 | pityIntervals.js 为无依赖纯函数候选；normalizer 问题预览可参考但保留 unknown；不搬云架构 |
| E EndCat 参考 | DB/HTTP 状态管理和 IPC 边界；不复制 GPL 源码，也不继承 Token TEXT 存储和日志 |
| F 许可风险 | 三个 MIT 根许可已查；文件/依赖/素材审查不等于全部完成；EndCat 兼容审查未完成 |
| G B服完整链 | 没有真实 VERIFIED 链；仅有固定源码交叉证据 |
| H 未验证节点 | Android 取得 URL、Token TTL/作用域、身份解析、字段分歧、同凭据角色/武器分页 |
| I Android blocker | 游戏能否手机独立取链接；本机缺已确认的 Rust/SDK/NDK 且 adb 无设备 |
| J 技术栈 | Vue/TS + Nuxt 静态前端、Tauri 2、共享 Rust 核心、SQLite；按需保留纯 TS 模块 |
| K 目录 | ARCHITECTURE 中的 app/ + src-tauri 分层；不在 UI 写同步核心 |
| L Schema | DATABASE 的 12 表草案，仍不是已验证生产 migration |
| M 第一阶段 | 真机取链接证据 + 工具链与最小 PoC，先确认身份再正式归档 |
| N 十大风险 | ROADMAP 风险清单继续适用；新增具体证据见各参考笔记 |
| O fork vs 新项目 | 继续优先基于 bhaoo，保留 Nuxt；先改造边界再验证 Mobile，不做无收益全重写 |
| P 下一步 | 按下方顺序，不因合成验证通过跳过手机门槛 |

## 本轮新增关键证据

1. bhaoo parser 接受非官方 host、HTTP 和重复 Token 后值覆盖，不能原样用作用户输入边界。
2. RoLingG 的 query_role_list 请求 JSON 是整数 server，bhaoo 是 serverId；Header 和池枚举也有差异。状态仍 PARTIAL。
3. MoguJunn 来源检测是字符串 includes，24 字符规则只校验格式；不能当作真实 U8/域名验证。
4. MoguJunn 完整出货区间函数排除首段，合成结果符合预期，是可复用候选。
5. 各上游存在赠礼/情报书过滤逻辑；正式记录不能把每一行都当一次抽取。
6. bhaoo WebDAV 的 bundle account 不含 Token 字段，但嵌套 Value 与无条件 PUT 仍需改造，不能直接视为本项目安全同步实现。

9 项合成行为断言均成立，详见 [CHARACTERIZATION](reference/CHARACTERIZATION.md)。这既包含正确行为，也包含被复现的安全缺口；不是“安全验收全通过”。

## 本轮仍未完成

没有真实游戏授权请求、没有 APK 构建/安装、没有设备验证、没有引入上游业务代码。设备/环境见 [ANDROID_VERIFICATION](ANDROID_VERIFICATION.md)。

首次汇报时远程建仓未完成：连接器无建仓接口，本机 gh 不可用，Git 凭据存储及浏览器导航受阻。后续用户选择公有仓库；现已通过 API 确认 [DARK20050101/Endfield](https://github.com/DARK20050101/Endfield) 存在且为 public，并配置 origin。原生 Git 推送仍遇到 TLS/网络错误；随后连接器创建 README 返回 403 Resource not accessible by integration，网页读取超时。这是首次发布尝试的结果；2026-09-03 用户更新授权后，Endfield 已进入授权范围，改由连接器完成文档发布。

本地文档初始化提交为 95972f3，续轮审查提交为 7be9bce，均保留。连接器发布沿用远程初始化提交，不覆盖远程历史。本地旧历史保存在 archive/documentation-before-publish，main 对齐远程；同步时核对 Git 对象哈希与文件树。准确状态以 git log 与远程 main 为准。

## 下一步顺序

1. 获取手机取链接的非秘密观察结果，不要求传完整 URL。
2. 准备兼容的 Rust、SDK/NDK/Java 工具链，保留现有全局环境。
3. 在候选基线上完成最小隔离和安全 parser，然后构建 Android PoC。
4. 使用用户本地会话授权验证 API-05 的字段分歧及完整归属，再验证角色/武器分页。
5. 满足 V0.1 全部门槛后，才进入完整同步和统计开发。

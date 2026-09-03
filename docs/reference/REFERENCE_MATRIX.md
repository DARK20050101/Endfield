# 上游参考矩阵

审查日期：2026-09-02。下列 commit 为当次读取的默认分支提交，不表示未来最新版；push 时间也不是运行验证时间。

| 项目 / 笔记 | 固定 commit | 已实际检查 | 下一步重点 | 可直接复制状态 |
| --- | --- | --- | --- | --- |
| [bhaoo](BHAOO.md) | 72c526d49136fd23271f77e9ef33549de3721283 | 根 LICENSE、授权/分页、parser、Nuxt/Tauri 配置、存储/WebDAV 重点代码 | 安全边界改造、Mobile 构建、真实协议契约 | 待具体文件与适配审查 |
| [RoLingG](ROLINGG.md) | f71165a63e86ce723a89109416c42d7657e868a6 | 根 LICENSE、HTTP/API/模型/JSON 存储恢复 | UI 登录 helper、导出、完整恢复路径与协议分歧 | 已列候选语义，不直接引入 Go |
| [MoguJunn](MOGUJUNN.md) | 0bb03e7d2febabac8fda1734cf69cb09cd65406b | 根 LICENSE、输入/标准化/区间统计及部分测试 | 移动 UX、完整统计依赖、规则与大数据量 | 纯函数为候选，待引入登记与适配 |
| [EndCat](ENDCAT.md) | eacc267309c4c592d76615f036f524fd1e8ad0fe | 根 LICENSE、IPC/DB/迁移与部分 API | metadata/图表边界、全流程迁移行为 | 当前禁止直接复制 |

## 续轮完成范围

2026-09-02：已完成四项目重点模块的首轮源码审查，见各项目笔记“第二轮”部分；不是全仓安全审计，也未运行四个完整应用。

| 项目 | 新检查范围 | 决策 |
| --- | --- | --- |
| bhaoo | parser、Nuxt/Tauri 配置、权限、Rust 存储/登录边界、WebDAV 关键写入与快照结构 | 继续作为首选基线，保留 Nuxt；parser/秘密/目录/权限先改造 |
| RoLingG | HTTP、角色/武器分页、绑定、角色参数结构、JSON 存储恢复 | 复用协议知识与恢复语义，不引入 Go；登记 server/serverId 分歧 |
| MoguJunn | 授权输入、字段标准化、完整区间统计、测试和统计依赖边界 | pityIntervals 为候选；输入识别不当作安全解析；保留 unknown |
| EndCat | DB/HTTP 状态管理、迁移与凭据存储、Rust API 命令 | 只参考边界，拒绝秘密入业务库与日志做法；不复制 GPL 源码 |

需求中未实际检查的模块继续待办。9 项合成行为验证见 [CHARACTERIZATION](CHARACTERIZATION.md)。手机取链接、真实鉴权、TTL 和端到端分页没有因此升级为 VERIFIED。

共同审计表：文件路径与 commit、输入输出、URL/manual token 支持、API/身份/分页行为、平台依赖、凭据处理、数据格式、测试、许可证、可保留部分、需重构部分、迁移成本和已知缺陷。

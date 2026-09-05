# 第三方来源与声明

更新：2026-09-02。

## 当前引入状态

2026-09-04 起新增最小授权观察原型，nuxt.config.ts 选择性衍生自主基线配置，其余原型代码独立编写；没有引入上游 Token 捕获、游戏业务代码或游戏素材。新增 Nuxt/Vue/Tauri 等依赖，版本以锁文件为准；完整分发依赖许可清单仍需发布前检查。

- [bhaoo/endfield-gacha](https://github.com/bhaoo/endfield-gacha)：主基线研究，根 LICENSE 为 MIT。
- [RoLingG/endfield-gacha-app](https://github.com/RoLingG/endfield-gacha-app)：隔离、迁移与恢复研究，根 LICENSE 为 MIT。
- [MoguJunn/endfield-gacha](https://github.com/MoguJunn/endfield-gacha)：移动体验及分析研究，根 LICENSE 为 MIT。
- [BoxCatTeam/endfield-cat](https://github.com/BoxCatTeam/endfield-cat)：架构研究，根 LICENSE 为 GPL v2；当前不直接复制源码。

固定版本与未完成审查项见 [LICENSE_REVIEW](docs/LICENSE_REVIEW.md)。游戏名称用于说明项目适用对象，不表示与官方存在合作关系；本轮未打包游戏 UI、角色图或其他资源。

## 已登记：Nuxt 静态构建配置

- Feature：Nuxt/Tauri 静态前端基础配置。
- Upstream：bhaoo/endfield-gacha。
- Original commit：72c526d49136fd23271f77e9ef33549de3721283。
- Original file / Local target：nuxt.config.ts → nuxt.config.ts。
- License / Copyright：MIT；Copyright (c) 2026 Bhao；完整原文见 [bhaoo MIT](licenses/bhaoo-MIT.txt)。
- Changes：保留静态 SPA、开发主机与 Vite 环境设置；移除图表/UI 模块、关闭 devtools，增加固定端口、忽略 Rust 目录和中文页面头。
- Reason：沿用已审查基线的静态构建约定，先隔离凭据和平台依赖，避免整仓引入桌面捕获逻辑。
- Validation：前端和原生验证结果见 [网页登录原型](docs/WEB_LOGIN_PROBE.md)；不等于 Android 已通过。
- Review date：2026-09-04；已阅读根 LICENSE 与配置文件，未发现配置文件独立授权声明。

## 引入登记模板

首次复用时更新“当前引入状态”，每个模块至少填写以下内容，不能保留未填占位符冒充已登记记录。

| 字段 | 必填内容 |
| --- | --- |
| Feature | 功能/模块 |
| Upstream project | 上游名称 |
| Repository URL | 仓库链接 |
| License | 实际文件适用许可与许可证保存位置 |
| Original file | 原始文件路径；多文件逐项列出 |
| Original commit | 完整 commit SHA |
| Local target file | 本地目标路径 |
| Changes made | 保留、提取、修复、平台适配的具体变化 |
| Reason for reuse | 复用原因及不重复实现的依据 |
| Copyright / notices | 上游署名及应保留的声明 |
| Validation | 测试和适配验证证据 |
| Review date | 审查日期 |

实现、依赖和素材分别登记；保留必要的完整许可正文，不能用一个仓库链接替代应随分发提供的声明。

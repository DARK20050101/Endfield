# 第三方来源与声明

更新：2026-09-02。

## 当前引入状态

本仓库当前仅有原创整理的项目文档、概念模型及配置，**尚未复制、修改或引入任何上游业务源码或游戏资源，也未安装应用依赖**。以下参考链接不表示对应源码已成为本项目的一部分。

- [bhaoo/endfield-gacha](https://github.com/bhaoo/endfield-gacha)：主基线研究，根 LICENSE 为 MIT。
- [RoLingG/endfield-gacha-app](https://github.com/RoLingG/endfield-gacha-app)：隔离、迁移与恢复研究，根 LICENSE 为 MIT。
- [MoguJunn/endfield-gacha](https://github.com/MoguJunn/endfield-gacha)：移动体验及分析研究，根 LICENSE 为 MIT。
- [BoxCatTeam/endfield-cat](https://github.com/BoxCatTeam/endfield-cat)：架构研究，根 LICENSE 为 GPL v2；当前不直接复制源码。

固定版本与未完成审查项见 [LICENSE_REVIEW](docs/LICENSE_REVIEW.md)。游戏名称用于说明项目适用对象，不表示与官方存在合作关系；本轮未打包游戏 UI、角色图或其他资源。

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

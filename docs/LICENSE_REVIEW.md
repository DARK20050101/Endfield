# 许可证审查

审查日期：2026-09-02。此文件记录实际读取的许可证与项目复用门槛，不构成已经完成全部依赖/素材审查的声明。

## 根许可证证据

| 项目 | 固定 commit | 根 LICENSE 观察 | 当前复用门槛 |
| --- | --- | --- | --- |
| bhaoo/endfield-gacha | 72c526d49136fd23271f77e9ef33549de3721283 | MIT；Copyright (c) 2026 Bhao | 文件级审查、通知保留、Android/安全验证后可考虑复用 |
| RoLingG/endfield-gacha-app | f71165a63e86ce723a89109416c42d7657e868a6 | MIT；Copyright (c) 2025 RoLingG | 同上；不引入 Go runtime |
| MoguJunn/endfield-gacha | 0bb03e7d2febabac8fda1734cf69cb09cd65406b | MIT；Copyright (c) 2024-2026 蘑菇菌__ | 同上；依赖、云服务与素材分开审查 |
| BoxCatTeam/endfield-cat | eacc267309c4c592d76615f036f524fd1e8ad0fe | LICENSE 正文为 GNU GPL Version 2；GitHub metadata 标 GPL-2.0 | 本项目目标许可证未定，兼容性未完成；不得直接复制 |

来源：[bhaoo LICENSE](https://github.com/bhaoo/endfield-gacha/blob/72c526d49136fd23271f77e9ef33549de3721283/LICENSE)、[RoLingG LICENSE](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/LICENSE)、[MoguJunn LICENSE](https://github.com/MoguJunn/endfield-gacha/blob/0bb03e7d2febabac8fda1734cf69cb09cd65406b/LICENSE)、[EndCat LICENSE](https://github.com/BoxCatTeam/endfield-cat/blob/eacc267309c4c592d76615f036f524fd1e8ad0fe/LICENSE)。

## 审查进度

- 根 LICENSE 文本与 commit：已读取核对。
- 具体待复用文件、目录许可证与文件头：尚未完成。
- vendored code、传递依赖、图片/字体/音频与游戏资源：尚未完成。
- EndCat 文件授权声明是否含版本选择条款、衍生作品兼容性与本项目发布策略：尚未完成，不由根 LICENSE 文本自行推断。
- 本项目最终发布许可证：未决定，本轮不创建一个假定授权范围的 LICENSE。

## 引入门槛

对具体文件记录路径/commit/许可、上游版权归属和本地变更；确认许可允许目标使用与分发。MIT 复用需按原许可保留通知，不能去掉上游署名后改称全原创。复制前登记 THIRD_PARTY_NOTICES 并保留对应许可文本。

若以后决定采用 GPL 兼容策略，先在 DECISIONS 记录决定，再重新评估 EndCat；当前不放开复制限制。根仓库许可证不能自动覆盖游戏原生素材，视觉系统应自主设计或使用有明确许可的资源。

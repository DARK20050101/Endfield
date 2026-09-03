# 固定上游源码的合成行为验证

日期：2026-09-02；运行环境：Node v24.14.0。9 项行为断言均成立；**这些测试描述上游行为，包括不满足本项目安全要求的行为，不代表安全测试通过。** 无真实游戏 Token，无网络请求。

源码固定版本：bhaoo 72c526d49136fd23271f77e9ef33549de3721283；MoguJunn 0bb03e7d2febabac8fda1734cf69cb09cd65406b。文件链接见 [BHAOO](BHAOO.md) 和 [MOGUJUNN](MOGUJUNN.md)。

方法：读取已审查的四个纯函数源文件，在临时 work 中保存源码快照；Node 的 stripTypeScriptTypes 仅去除 TypeScript 类型，移除模块导出声明后在受限 VM context 中调用函数。未提供文件/网络 API，单次加载有时间上限；不运行上游安装脚本。未将上游源码加入本仓库。

| 用例 | 合成输入/操作 | 实际行为 | 项目意义 |
| --- | --- | --- | --- |
| bhaoo 基本形状 | https 官方候选 host，u8_token=SYNTHETIC，pool_id=pool | 返回参数 | 只证明形状解析 |
| bhaoo 非官方 host | untrusted.invalid，保留同参数 | 仍返回参数 | 需精确 host 校验 |
| bhaoo HTTP | http scheme，保留同参数 | 仍返回参数 | 需 HTTPS 限制 |
| bhaoo 重复参数 | u8_token=FIRST 与 u8_token=SECOND | 取 SECOND | 需拒绝歧义输入 |
| bhaoo 缺 pool | 仅 u8_token | 返回 null | 上游必需字段不等于真实移动格式必需 |
| Mogu 来源提示 | 非官方 URL query 内写 hypergryph.com | cn / high | 文本提示不能作为可信身份 |
| Mogu 24 字符 | 24 个 A | 格式校验成功 | 不能证明 Token 类型/线上权限 |
| Mogu 完整区间 | 首次命中、再经 3 抽命中、再经 1 抽命中 | 首段不计，平均 2.00 | 纯区间函数可作为复用候选 |
| Mogu 缺 boolean | 空记录 | isFree/isNew=false | 本项目需改为 unknown |

后续可复现：按上述 commit 获取 gachaCalc.ts、officialImportInput.js、pityIntervals.js、officialImportRecordNormalizer.js，在无网络的函数测试环境逐项断言上述输出。上游 24 字符 token 格式与固定 pool 规则都不能成为本项目 API 契约。

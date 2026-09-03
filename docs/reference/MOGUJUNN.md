# MoguJunn/endfield-gacha

[固定版本](https://github.com/MoguJunn/endfield-gacha/tree/0bb03e7d2febabac8fda1734cf69cb09cd65406b)，2026-09-02 审查；根 LICENSE 为 MIT。

实际检查：仓库 metadata、根 LICENSE，以及下方列出的授权输入、标准化、区间统计模块与部分测试。移动布局、服务端和完整统计依赖仍待审查。

研究目标：手机响应式、分析输入输出、清洗、用户统计模型、缓存、大记录量与 UX；同时寻找 URL/manual token 入口及记录字段证据。

候选复用仅限许可与测试允许的纯业务函数、统计/转换与可兼容 UI 思路。不要迁移完整云架构，不引入强制云账号；不为了复用其他框架组件而破坏 Vue 栈。

公共统计不能自动继承：本项目默认不上传 UID、完整记录或设备信息。运气百分位需要样本方法和独立 opt-in。

## 第二轮：已定位的可迁移模块

补读：src/features/import/officialImportInput.js 及其测试、shared/officialImportRecordNormalizer.js、src/utils/pityIntervals.js；另检查 poolStats.js 的依赖边界，未完成其全部统计逻辑审查。

- officialImportInput.js 支持 Token、文本/URL、嵌套 JSON 提取；使用 24 字符格式规则，来源识别使用文本 includes。**这是账号授权输入整理器，不是经验证的游戏寻访 U8 URL parser**。合成样本确认：把 hypergryph.com 放在非官方 URL 的 query 中也能得到 cn/high 提示；不能用于可信 host 检查。
- officialImportRecordNormalizer.js 将多来源字段映射为统一结构，并产生 blocking/review/info 问题清单及最小原始数据。可借鉴“先预览问题再导入”的边界。上游会把缺失 isFree/isNew 变 false、按数字大小猜时间单位、限定 4–6 星；本项目保留 unknown、按协议证据转换，不整段照搬。
- **pityIntervals.js 为首批纯函数复用候选**：无 import/runtime 依赖；首个命中只建立起点，第二个命中起才记完整区间，空集合平均值为 null。合成验证确认首段排除和平均值结果。调用方仍需验证顺序、免费抽/保底规则，平均函数返回格式化字符串需适配 Domain DTO。
- poolStats.js 依赖资源经济、配额、池 capability、角色名解析等多个模块，不是独立通用统计器；不能为复用一个页面连同云端/React 整体引入。

许可仍需在实际引入文件时登记版权和原 commit。本轮没有把上述源码复制到应用目录；合成审查快照仅存在项目外临时 work 中。

来源：[输入解析](https://github.com/MoguJunn/endfield-gacha/blob/0bb03e7d2febabac8fda1734cf69cb09cd65406b/src/features/import/officialImportInput.js)、[标准化](https://github.com/MoguJunn/endfield-gacha/blob/0bb03e7d2febabac8fda1734cf69cb09cd65406b/shared/officialImportRecordNormalizer.js)、[区间统计](https://github.com/MoguJunn/endfield-gacha/blob/0bb03e7d2febabac8fda1734cf69cb09cd65406b/src/utils/pityIntervals.js)。

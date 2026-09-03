# bhaoo/endfield-gacha

[固定版本](https://github.com/bhaoo/endfield-gacha/tree/72c526d49136fd23271f77e9ef33549de3721283)，2026-09-02 审查；根 LICENSE 为 MIT。用途：第一代码基线候选。

实际阅读：app/components/AddAccount.vue，app/composables/gacha/useGachaAuth.ts、gachaApi.ts、useGachaRecords.ts，app/types/gacha.d.ts。

源码中观察到 grant→绑定→按 UID 换 U8；由凭据查询角色；角色分页、武器池列表和武器分页；字符串 seqId 比较及合并。具体接口记录于 [API_RESEARCH](../API_RESEARCH.md)，整体为 PARTIAL，未实测。

useGachaAuth.ts 调用 parseGachaParams 并保留桌面日志取 URL 路径；parser 本体已审查，发现输入校验缺口，详见下方。尚无经手机验证、可原样移植的 Android URL importer。README 提及网页登录和 B服账号绑定，不证明手机错误页能复制链接。

值得保留的候选：接口序列、独立角色/武器逻辑、分页边界处理经验、纯数据类型/转换。需要审查或改变：组件与 composable 持有凭据、固定国内服务器默认值、角色匹配失败取首项、JSON 配置/存储、全局水位和唯一范围假设。

## 第二轮：模块源码审查与合成验证

补读：app/utils/gachaCalc.ts、app/composables/useWebDav.ts、src-tauri/src/lib.rs、src-tauri/src/webdav.rs、package.json、nuxt.config.ts、src-tauri/Cargo.toml、src-tauri/tauri.conf.json、src-tauri/capabilities/default.json，均为上述固定 commit。

- **URL parser 不能原样保留**：parseGachaParams 仅要求 u8_token 与 pool_id，没有 scheme/host allowlist；Object.fromEntries 会让重复参数后值覆盖前值。合成执行确认接受非官方 host、HTTP 和重复 Token。日志错误处理亦需改为脱敏类别。该结论是函数行为，不是说上游所有入口都存在同样暴露。
- **Nuxt 可继续作为基线**：package.json 为 Nuxt 4.2.2 范围，nuxt.config.ts 关闭 SSR，Tauri 静态输出指向 .output/public。暂不为目录偏好换成纯 Vite；官方也有 [Nuxt/Tauri 集成指导](https://v2.tauri.app/start/frontend/nuxt/)。实际依赖和 Android 构建尚未运行。
- **Mobile 入口不等于 Mobile 适配完成**：lib.rs 有 mobile_entry_point，但 Android 会进入非 Linux/macOS 的 current_exe 旁 userData 回退；需要改为应用数据目录。网页登录使用 WebviewWindowBuilder，必须隔离到平台适配器验证。
- **凭据与权限边界需重构**：save_config 序列化整个 JSON，需防止继承明文 Token 配置；默认 capability 包含桌面日志/EXE 路径与广泛域名权限，tauri.conf 的 CSP 为空。新客户端不能直接保留这些配置。
- **WebDAV 分层值得参考**：AccountBundle / BundleAccount 不设 Token 字段，本地恢复保留原 Token；有内容 hash 与双端变化分支。但角色/武器仍以 Value payload 传递，不能据此保证任意嵌套 payload 无秘密；put_json_relative 的 PUT 没有 If-Match，manifest 也走该写法，不能直接满足本项目多端原子发布要求。
- **统计候选须参数化规则**：gachaCalc.ts 内含固定 120、各池免费抽及赠礼过滤分支；这些是上游实现事实，不是本项目 VERIFIED 游戏规则。

建议：保留 Nuxt/Tauri 结构、适用的 UI 和协议调用经验，先隔离 parser/credentials/storage/platform，再逐项复用统计与同步。没有任何文件因为本轮静态审查就被批准直接作为 Android 生产实现。

验证结果见 [CHARACTERIZATION](CHARACTERIZATION.md)，基线决定见 [DECISIONS D-011](../DECISIONS.md)。

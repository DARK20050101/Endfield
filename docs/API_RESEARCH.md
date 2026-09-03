# 游戏 API 证据台账

审查日期：2026-09-02。**没有任何游戏接口完成本项目真实账号实测。** 源码证据不等于当前 B服 Android 可用性。URL 获取可行性另见 [GACHA_URL_RESEARCH](GACHA_URL_RESEARCH.md)。

## 状态与准入

| Status | 含义与适用范围 |
| --- | --- |
| VERIFIED | 有可复现证据确认所述能力；必须写明来源、版本、平台、日期及验证范围。当前有效源码可确认源码事实，但只有源码、未运行的游戏链路仍标 PARTIAL |
| PARTIAL | 读到实现或只验证部分环节，尚未实测完整目标场景 |
| UNKNOWN | 尚无充分证据，或只有需求中的假设 |
| DEPRECATED | 历史实现被证据确认失效；注明具体版本/路径，不能泛化整个接口 |

记录 sourceReviewedAt 与 runtimeVerifiedAt 两个日期。所有下列条目 sourceReviewedAt=2026-09-02，runtimeVerifiedAt=未实测，Last verified=未实测。PARTIAL 可在隔离 PoC 中验证，不允许直接当作正式可用接口；UNKNOWN 不进入业务核心。

## 固定源码来源

主证据为 [bhaoo/endfield-gacha，commit 72c526d49136fd23271f77e9ef33549de3721283](https://github.com/bhaoo/endfield-gacha/tree/72c526d49136fd23271f77e9ef33549de3721283)：

- [AddAccount.vue](https://github.com/bhaoo/endfield-gacha/blob/72c526d49136fd23271f77e9ef33549de3721283/app/components/AddAccount.vue)：登录配置、grant、绑定列表。
- [useGachaAuth.ts](https://github.com/bhaoo/endfield-gacha/blob/72c526d49136fd23271f77e9ef33549de3721283/app/composables/gacha/useGachaAuth.ts)：UID 换临时凭据、角色查询、历史日志路径。
- [gachaApi.ts](https://github.com/bhaoo/endfield-gacha/blob/72c526d49136fd23271f77e9ef33549de3721283/app/composables/gacha/gachaApi.ts)：角色/武器接口与分页。
- [gacha.d.ts](https://github.com/bhaoo/endfield-gacha/blob/72c526d49136fd23271f77e9ef33549de3721283/app/types/gacha.d.ts)：上游响应类型声明；类型声明并非运行时校验。

以下 endpoint 仅是源码中观察到的中国大陆候选，不是已批准的生产 allowlist。不得把模板域名拼接能力开放给用户。

## 接口记录

### API-01 网页登录凭据取得

- Status：PARTIAL；Source project/file：bhaoo，AddAccount.vue。
- Endpoint：登录入口 `https://user.hypergryph.com/`；源码配置了 `https://web-api.hypergryph.com/account/info/hg`。
- Method / Request headers / Request parameters / Response structure：具体浏览器会话与捕获过程尚未完整审查，UNKNOWN；不凭 endpoint 猜 Cookie/Header。
- Authentication：用户在官方登录页面建立会话；凭据如何安全返回客户端待验证。
- Pagination：不适用。Error handling：需要处理用户取消、验证失败、回调丢失、页面变化；真实错误码未确认。
- Platform differences：Windows 捕获方案不能证明 Android WebView/系统浏览器具有相同能力。

### API-02 账号授权 grant

- Status：PARTIAL；Source：bhaoo，AddAccount.vue / useGachaAuth.ts。
- Endpoint / Method：`POST https://as.hypergryph.com/user/oauth2/v2/grant`。
- Request headers：源码使用 `Content-Type: application/json`、自定义 User-Agent；是否必要及 Android 差异待测。
- Request parameters：body 中 `type`、`appCode`、`token`；源码使用 type=1，appCode 为上游配置值，不在本项目硬编码为事实。
- Response structure：源码读取 `data.token`；status/msg 等响应封套和拒绝状态待样本确认。
- Authentication：账号级登录凭据输入，得到另一授权凭据；不能混同 U8 Token。
- Pagination：不适用。Error handling：上游对失败返回空值或抛错；项目需要明确授权过期/拒绝/协议变化。
- Platform differences：核心请求可抽象，但前置登录及凭据取得仍与平台有关。

### API-03 游戏绑定列表

- Status：PARTIAL；Source：bhaoo，AddAccount.vue / gacha.d.ts。
- Endpoint / Method：`GET https://binding-api-account-prod.hypergryph.com/account/binding/v1/binding_list`。
- Request headers：完整要求待验证；Request parameters：源码 query 包含 `token`、`appCode=endfield`。
- Response structure：源码读取 `data.list[]`，按 appCode 找游戏，再读 `bindingList[]`；类型声明包括 uid、channelMasterId、channelName、isOfficial、roles[]。
- Authentication：grant 得到的授权；Pagination：源码未展示，真实限制 UNKNOWN。
- Error handling：空列表、缺少终末地、未绑定 B服、封禁/删除字段、未知渠道需分别处理；禁止回退选择第一个其他游戏。
- Platform differences：Android/Windows 返回一致性未实测。

### API-04 按游戏 UID 换 U8 凭据

- Status：PARTIAL；Source：bhaoo，useGachaAuth.ts。
- Endpoint / Method：`POST https://binding-api-account-prod.hypergryph.com/account/binding/v1/u8_token_by_uid`。
- Request headers：源码 JSON Content-Type、User-Agent；Request parameters：body `{uid, token}`。
- Response structure：源码读取 `data.token`。
- Authentication：账号授权 + 已授权绑定 UID；不能用任意 UID 请求他人记录。
- Pagination：不适用。Error handling：拒绝、失效、UID 不匹配、无 token；不得静默换其他账号重试。
- Platform differences：协议可共享，Android 可用性未测。Token 角色/账号作用域与有效期 UNKNOWN。

### API-05 由 U8 凭据查询角色

- Status：PARTIAL；Source：bhaoo，useGachaAuth.ts。
- Endpoint / Method：`POST https://u8.hypergryph.com/game/role/v1/query_role_list`。
- Request headers：源码 `Content-Type: application/json;charset=UTF-8`、User-Agent；body：`token`、`serverId`。
- Response structure：源码检查 status，读取 `data.uid`、`data.roles[]` 中 roleId、serverId、nickname/nickName、serverName。
- Authentication：U8 凭据；Pagination：未见，UNKNOWN。
- Error handling：无 UID/角色应阻止归属；不能继承上游“匹配失败就取首角色”的回退。
- Platform differences：未测。该接口是否足以识别 B服 channel 尚不明确；上游国内 serverId=1 的做法不能成为项目通用事实。续轮发现 RoLingG 同 endpoint 发送的是整数 `server`，而 bhaoo 发送 `serverId`；属于未解决的协议差异，见下表。

### API-06 角色寻访

- Status：PARTIAL；Source：bhaoo，gachaApi.ts / gacha.d.ts。
- Endpoint / Method：`GET https://ef-webview.hypergryph.com/api/record/char`。
- Request headers：源码 User-Agent；query：`lang`、`token`、`server_id`、`pool_type`，后续页含 `seq_id`。
- Response structure：源码检查 code=0 及 `data.list`，读取 `data.hasMore`；类型中有 seqId、poolId、charId、charName、rarity、gachaTs、isNew、isFree。
- Pagination：上游以最后一条 seqId 作为下一页游标；结束条件包括空页、hasMore=false、已存记录。排序、游标包含边界和唯一范围待测。
- Authentication：U8 凭据；不能由 URL 的 pool 参数直接确定全角色授权范围。
- Error handling：上游存在最多 3 次重试与页面失败状态；这不是官方限速证据。项目还需限制循环并区分授权/限流/格式错误。
- Platform differences：Android 同凭据能否访问及 TLS/网络行为待测。

### API-07 武器卡池列表

- Status：PARTIAL；Source：bhaoo，gachaApi.ts。
- Endpoint / Method：`GET https://ef-webview.hypergryph.com/api/record/weapon/pool`。
- Request headers：源码 User-Agent；query：`lang`、`token`、`server_id`。
- Response structure：源码 code 与 `data[]`，元素 poolId、poolName。
- Pagination：源码未分页；Authentication：上游传入同类 U8 凭据，是否与角色 URL 凭据通用待测。
- Error handling：失败不能报告武器已同步；无池与请求失败分别展示。
- Platform differences：Android 未实测。

### API-08 武器寻访

- Status：PARTIAL；Source：bhaoo，gachaApi.ts / gacha.d.ts。
- Endpoint / Method：`GET https://ef-webview.hypergryph.com/api/record/weapon`。
- Request headers：源码 User-Agent；query：`lang`、`token`、`server_id`、`pool_id`、可选 `seq_id`。
- Response structure：`data.list` / `hasMore`；类型有 weaponId、weaponName、weaponType、rarity、gachaTs、seqId、isNew、poolId。
- Pagination：每个池单独分页，边界与排序待测；不能假定与角色池完全同构。
- Authentication：U8 凭据；Error handling：按池保留成功与失败结果，不覆盖旧历史。
- Platform differences：Android 未实测。

## URL allowlist 与类型验证

候选输入 host `ef-webview.hypergryph.com`，候选页面路径前缀 `/page/gacha_` 来自主基线 useGachaAuth.ts 的历史日志解析；当前状态 PARTIAL。国际服 `ef-webview.gryphline.com` 同为源码候选，V0.1 不自动启用。输入 host、路径、参数格式的实际准入待 [URL 调研](GACHA_URL_RESEARCH.md) 完成；生产启用列表目前为空。

一项准入记录必须包含：精确 https host/端口/路径规则、游戏版本、地区/渠道、可接受参数与重复参数策略、固定 Provider API host、证据链接、测试日期、验证人或匿名测试编号、失败边界。不得接受任意子域名或用户控制的接口地址。

所有响应运行时验证。缺失字段、未知枚举、单位不明的时间、超大 ID、非 JSON 响应、空列表与缺失列表分别处理。seqId、UID、roleId 均保留字符串；未知 boolean 不能默认为 false。

## 尚未验证的共同事项

Token TTL/刷新/作用域、URL 的角色与渠道归属、角色/武器是否共用授权、serverId 语义、记录保留期、分页顺序与 seqId 唯一范围、限速和真实错误码、卡池规则及免费抽含义。真实响应只在用户设备保存，进入仓库的样本必须合成或彻底脱敏。

## 续轮：跨源码差异（2026-09-02）

| 事项 | bhaoo 固定版本 | RoLingG 固定版本 | 处理 |
| --- | --- | --- | --- |
| query_role_list body | token + serverId | token + server，server 为整数 | PARTIAL/冲突未解决；真实授权下验证请求形状，不能静默选一个 |
| 角色返回 | 读取 UID + roles/server/nickname | 类型只读取 UID/appCode | 不证明任一路线已足以验证完整角色/渠道 |
| 寻访 Header | 显式 User-Agent | 构造含 u8_token 的 Referer | 是否必需 UNKNOWN；Referer 也需脱敏 |
| 角色池枚举 | 包含 Joint | fetcher.go 中仅 Special/Standard/Beginner | 按当前真实池验证，不能固定为三个或四个 |
| 渠道识别 | 存在绑定类型及日志 channel/subChannel 线索 | isOfficial + channelName 显示字符串 | 不直接写死稳定映射；取得可信返回证据 |

RoLingG 来源：[fetcher.go](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/internal/api/fetcher.go)、[types.go](https://github.com/RoLingG/endfield-gacha-app/blob/f71165a63e86ce723a89109416c42d7657e868a6/internal/model/types.go)。

源代码一致只能增加线索，不能将在线状态从 PARTIAL 改成 VERIFIED。受控实验应按固定 Provider 构造请求，记录响应字段形状/状态，不保留完整秘密请求。不要因查询角色失败回退伪造 server=1。

新增数据语义线索：bhaoo 与 MoguJunn 都存在 gift_intel_book / 赠礼的过滤实现。说明上游已处理“非一次抽取”的记录类型；真实枚举仍待验证，不用页面条数直接算总抽数。

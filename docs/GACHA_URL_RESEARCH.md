# Android 寻访链接研究

最后审查：2026-09-02。核心结论：**尚不能确认国服/B服 Android 当前版本能够独立取得可用寻访 URL。** 上游桌面日志解析不构成手机取链接证据。

## 状态

VERIFIED=在注明版本/平台/渠道成功复现；PARTIAL=只读到源码或部分成功；FAILED=在注明条件下明确失败；UNKNOWN=尚无证据。FAILED 不表示所有机型永久失效。历史废弃机制另在 API_RESEARCH 记 DEPRECATED。

## 验证矩阵

| 问题 | 官服 Android | B服 Android | 当前证据 / 下一步 |
| --- | --- | --- | --- |
| 游戏内能获得完整寻访 URL | UNKNOWN | UNKNOWN | 必须设备操作验证 |
| 断网后错误页允许完整复制 | UNKNOWN | UNKNOWN | 用户提出的候选流程，不能当教程宣传 |
| 不断网的复制/分享方式 | UNKNOWN | UNKNOWN | 优先寻找更简单的入口 |
| URL 含 token/u8_token 等凭据 | UNKNOWN | UNKNOWN | 桌面源码有 u8_token 解析线索，但不是移动样本 |
| server_id/serverId/server 等字段 | UNKNOWN | UNKNOWN | 不猜固定 server=1 |
| pool_type/pool_id、编码/fragment | UNKNOWN | UNKNOWN | 收集脱敏字段名及格式 |
| Token 对应 UID/role/channel | UNKNOWN | UNKNOWN | 分别验证 API-05 和渠道证据 |
| 有效期、单次/多次、刷新 | UNKNOWN | UNKNOWN | 有限时点重复验证，记录 lastSuccess/firstFailure |
| 能连续访问角色各页/各池 | UNKNOWN | UNKNOWN | 用同一授权验证分页及边界 |
| 能列武器池并拉取各页 | UNKNOWN | UNKNOWN | 不默认需新 URL，也不默认通用 |
| URL 含其他个人信息 | UNKNOWN | UNKNOWN | 只登记字段名，不提交真实 URL |

## 可复现的手机验证流程

1. 记录日期、游戏版本、官服/B服、Android 版本、设备测试编号和 WebView 版本；不记录设备唯一标识。
2. 正常联网打开游戏寻访记录，检查官方界面是否提供复制/分享地址能力。
3. 若没有，再验证候选“断网 → 刷新/重开 → 错误页复制地址”，记录能否复制、是否截断、是否缺参数；随后恢复网络。
4. 完整链接仅留在本地受控输入；只导出脱敏字段形状用于研究。避免包含链接的截图、剪贴板同步及调试日志。
5. 按可信候选 host 解析，在隔离 PoC 中调用固定接口验证授权、角色归属、角色寻访、武器卡池与武器寻访。
6. 验证过期、重复输入、重启、分页、离线与取消；成功条件必须覆盖全程无需 PC。

未提供 Android 设备或真实测试样本，本轮以上步骤均未执行。研究不得要求用户把真实 Token 上传到聊天或代码仓库。

## Parser 契约

GachaUrlParser 独立于 Vue；执行 URL/scheme/host/path 校验、提取 query、凭据与服务器/池上下文、规范化及脱敏。不得直接 fetch 用户输入 URL。安全规则以 [SECURITY](SECURITY.md) 为准。

ParseResult：SUCCESS、INVALID_URL、UNSUPPORTED_HOST、MISSING_CREDENTIAL、UNSUPPORTED_FORMAT。EXPIRED_OR_INVALID 属于后续在线验证失败，对外可以统一展示，但纯 parser 不得声称判断了真实有效期。失败不能回显原文。

账号/角色字段允许未知；输出为 CredentialCandidate，验证后才成为 ValidatedCredentialContext。缺渠道时展示 Unknown，不按 UID、昵称或用户粘贴字符串猜 B服。

## Phase 0 必答 Q1–Q12

| 编号 | 当前回答 |
| --- | --- |
| Q1 国服当前版本可取得 URL？ | UNKNOWN，待实机 |
| Q2 B服可取得 URL？ | UNKNOWN，待实机 |
| Q3 仅 Android 可完成？ | UNKNOWN，必须手机独立验收 |
| Q4 断网必需？ | UNKNOWN，不预设断网是正式步骤 |
| Q5 URL 身份/授权字段？ | 移动格式 UNKNOWN；源码线索为 u8_token、服务器及渠道字段，见 API_RESEARCH |
| Q6 有效多久？ | UNKNOWN；设计支持未知过期时间，不虚构 TTL |
| Q7 Character URL 能访问其他池？ | 源码使用凭据调用多个固定池接口，实际权限 PARTIAL；不能推导任意 URL |
| Q8 Weapon 是否需另一 URL？ | UNKNOWN，需相同凭据验证角色与武器 |
| Q9 谁已有 URL Import？ | 已读 bhaoo parseGachaParams：URL 参数解析但无 host/scheme 校验；MoguJunn 有账号 Token 文本/URL/JSON 提取。两者均不能证明手机游戏 WebView 能取得 URL，也不能原样当安全 U8 importer |
| Q10 哪些代码可移植？ | 三个上游根 LICENSE 为 MIT，但具体文件、依赖、测试仍需审查；EndCat 暂不复制 |
| Q11 V0.1 最少模块？ | 输入 UI、CredentialSource/parser、验证/身份、Provider、SyncEngine、Storage 六个逻辑模块；不是六套独立服务 |
| Q12 失效后 fallback？ | 优先仍可手机取得的手动授权；若需 PC 或同样依赖失效 URL 则不可算兜底，提升官方网页登录验证 |

## 决策门槛

手机 B服取链接、授权、正确归属、角色+武器分页都 VERIFIED 后，才可把“无需电脑、复制链接即可分析”写成已实现卖点。任一必需环节 FAILED 且没有稳定手机替代路径时，记录失败条件，提升网页登录；不继续围绕未经证实的 URL 做完整产品。

续轮进展：已完成 parser 本体及合成行为审查，见 [CHARACTERIZATION](reference/CHARACTERIZATION.md)。当前 adb 无设备，手机获取能力仍为 UNKNOWN，尚无足够证据把 URL 路线判为 FAILED 或提升网页登录为唯一主路线。设备验证记录表见 [ANDROID_VERIFICATION](ANDROID_VERIFICATION.md)。

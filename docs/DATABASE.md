# SQLite 数据模型与迁移

状态：**设计草案，尚非可发布 migration**。SQLite 是本机业务数据 Source of Truth；凭据秘密不属于该库。字段命名为内部模型，不表示官方响应已有同名字段。

## 身份与 Domain

Account 是登录身份容器；GameAccount 是 provider/region/channel 下的游戏账号；GameRole 是游戏账号下的角色和服务器。每层使用内部 UUID，不将昵称、游戏 UID 或手工拼接字符串作为外键。

URL 路线不强制存在账号级登录：game_accounts.account_id 可为 NULL。仅当得到可信绑定关系时补充 Account 关联，不用 gameUid 冒充登录身份。

已确认的外部角色身份至少由 `(provider, region, channel, gameUid, externalRoleId, serverId)` 标识；跨设备先用此身份映射本地 UUID。未知渠道、server 或角色不得填虚构默认值进入正式表，先进入 ingest_batches 暂存；未归属历史不计入正式账号分析。

凭据 Domain 对象包含类型、来源、expiresAt 可未知、invalidated/needsRefresh 等状态；秘密仅在内存或安全存储。credential_refs 只记录安全存储引用和非秘密元数据，session-only 不要求插入该表。

## 流水与去重

- 正式 gacha_records 一行表示一次抽取结果；如果上游一行是十连/礼包，Importer/Adapter 必须先按真实语义拆分，不能把页面行数当抽数。非抽取赠礼/情报书事件不计为抽数；未知 kind 先暂存等待分类，不能一律当普通抽取。来源线索见 API_RESEARCH 的跨源码差异。
- seqId/external ID 全部按 TEXT 保存，不经过 JS Number；排序方式在验证后指定，不能假定字符串字典序等于时间序。
- `UNIQUE(seq_id)` 禁止。`(role_id, record_type, seq_id)` 只是候选，也需要验证是否跨池唯一。
- 草案使用 `(role_id, record_type, record_namespace, external_record_id)` 表达经验证的唯一范围；namespace 由 Adapter 的稳定范围规则生成，不允许使用导入文件名或本次 run ID 导致重复。
- seqId 可被映射为 external_record_id，但只有在唯一范围验证后；其他来源需映射同一官方 ID。缺 ID 或歧义数据进入暂存，不简单用时间+物品哈希去重，避免吞掉同秒同物品的合法抽取。
- 同键不同内容记冲突并保留现有记录与候选，不做无条件覆盖。不同来源重复数据的统一见 [SYNC](SYNC.md)。

## 表责任

| 表 | 责任 |
| --- | --- |
| accounts / game_accounts / roles | 登录、游戏账号、角色和稳定身份 |
| credential_refs | 可选安全存储引用，不含 Token/Cookie |
| gacha_records | 标准化单次结果和脱敏源 payload |
| gacha_pools / pool_rules | 按 provider/region/channel 命名空间的池及版本规则 |
| sync_state | 每角色、记录类型、数据流的本地检查点与覆盖情况 |
| metadata | 有来源、版本、验证状态的静态业务数据 |
| app_settings | 非秘密设置；同步时仍需白名单 |
| schema_migrations | 迁移版本、校验和、执行时间 |
| ingest_batches | 未归属/不完整/冲突的脱敏候选；不混入正式历史 |

## 可执行语法草案

该 SQL 只用于内存模型校验。外部字段必需性、唯一范围、枚举映射和性能索引在真实样本验证后才能转为正式 migration。所有时间戳规范化为 UTC 毫秒 INTEGER，来源单位必须由 Adapter 证实；未知时间保留 NULL。

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE schema_migrations (
  version INTEGER PRIMARY KEY,
  checksum TEXT NOT NULL,
  applied_at INTEGER NOT NULL
);

CREATE TABLE accounts (
  id TEXT PRIMARY KEY NOT NULL,
  provider TEXT NOT NULL,
  external_subject TEXT,
  created_at INTEGER NOT NULL,
  UNIQUE(provider, external_subject)
);

CREATE TABLE game_accounts (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  provider TEXT NOT NULL,
  region TEXT NOT NULL,
  channel TEXT NOT NULL,
  game_uid TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  UNIQUE(provider, region, channel, game_uid)
);

CREATE TABLE roles (
  id TEXT PRIMARY KEY NOT NULL,
  game_account_id TEXT NOT NULL REFERENCES game_accounts(id),
  external_role_id TEXT NOT NULL,
  server_id TEXT NOT NULL,
  nickname TEXT,
  level INTEGER,
  identity_verified_at INTEGER NOT NULL,
  UNIQUE(game_account_id, server_id, external_role_id)
);

CREATE TABLE credential_refs (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT REFERENCES accounts(id),
  role_id TEXT REFERENCES roles(id),
  credential_type TEXT NOT NULL,
  source TEXT NOT NULL,
  secure_store_ref TEXT NOT NULL UNIQUE,
  expires_at INTEGER,
  state TEXT NOT NULL CHECK(state IN ('valid','unknown','invalidated','needs_refresh')),
  CHECK(account_id IS NOT NULL OR role_id IS NOT NULL)
);

CREATE TABLE pool_rules (
  id TEXT PRIMARY KEY NOT NULL,
  namespace TEXT NOT NULL,
  rule_key TEXT NOT NULL,
  version TEXT NOT NULL,
  effective_from INTEGER,
  effective_to INTEGER,
  rule_json TEXT NOT NULL,
  evidence_ref TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('VERIFIED','PARTIAL','UNKNOWN','DEPRECATED')),
  UNIQUE(namespace, rule_key, version),
  CHECK(effective_to IS NULL OR effective_from IS NULL OR effective_to > effective_from)
);

CREATE TABLE gacha_pools (
  id TEXT PRIMARY KEY NOT NULL,
  namespace TEXT NOT NULL,
  external_pool_id TEXT NOT NULL,
  record_type TEXT NOT NULL CHECK(record_type IN ('character','weapon')),
  pool_type TEXT,
  name TEXT,
  rule_id TEXT REFERENCES pool_rules(id),
  metadata_version TEXT,
  UNIQUE(namespace, record_type, external_pool_id)
);

CREATE TABLE gacha_records (
  id TEXT PRIMARY KEY NOT NULL,
  role_id TEXT NOT NULL REFERENCES roles(id),
  record_type TEXT NOT NULL CHECK(record_type IN ('character','weapon')),
  record_namespace TEXT NOT NULL,
  external_record_id TEXT NOT NULL,
  seq_id TEXT,
  pool_id TEXT REFERENCES gacha_pools(id),
  external_pool_id TEXT,
  item_id TEXT,
  item_name TEXT,
  rarity INTEGER CHECK(rarity IS NULL OR rarity > 0),
  gacha_time INTEGER,
  is_new INTEGER CHECK(is_new IS NULL OR is_new IN (0,1)),
  is_free INTEGER CHECK(is_free IS NULL OR is_free IN (0,1)),
  raw_json TEXT,
  source_adapter TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  imported_at INTEGER NOT NULL,
  UNIQUE(role_id, record_type, record_namespace, external_record_id)
);
CREATE INDEX records_role_time ON gacha_records(role_id, record_type, gacha_time);

CREATE TABLE sync_state (
  role_id TEXT NOT NULL REFERENCES roles(id),
  record_type TEXT NOT NULL CHECK(record_type IN ('character','weapon')),
  stream_key TEXT NOT NULL,
  adapter_version TEXT NOT NULL,
  resume_cursor TEXT,
  completed_watermark TEXT,
  last_attempt_at INTEGER,
  last_success_at INTEGER,
  earliest_observed_at INTEGER,
  coverage TEXT NOT NULL DEFAULT 'unknown'
    CHECK(coverage IN ('unknown','partial','available_window_complete','full_history_verified')),
  state TEXT NOT NULL DEFAULT 'idle'
    CHECK(state IN ('idle','running','partial','failed','cancelled','success')),
  PRIMARY KEY(role_id, record_type, stream_key)
);

CREATE TABLE metadata (
  namespace TEXT NOT NULL,
  key TEXT NOT NULL,
  version TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  evidence_ref TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('VERIFIED','PARTIAL','UNKNOWN','DEPRECATED')),
  PRIMARY KEY(namespace, key, version)
);

CREATE TABLE app_settings (
  key TEXT PRIMARY KEY NOT NULL,
  value_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE ingest_batches (
  id TEXT PRIMARY KEY NOT NULL,
  source_format TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('pending_identity','pending_validation','conflict','accepted','rejected')),
  sanitized_payload_json TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  diagnostic_code TEXT
);
```

JSON 格式及结构由运行时校验器验证；本文未假设 SQLite 编译时 JSON 扩展可用。UUID 格式由领域层验证。草案不把当前星级上限写死；保底具体规则不进入表约束。

## 迁移与保留

迁移按 version 顺序运行，检查 checksum，备份并在事务内升级；失败回滚，保留原库。测试空库、新旧样本与失败中断。遇到比当前应用更新的 schema，拒绝写入并提示升级，不清空重建。

启用外键；应用层校验 record_type 与池类型一致、provider/角色关系一致。page 数据与恢复游标同一事务提交；完成水位仅在该数据流无缺口完成后推进。

raw_json 不是 HTTP 抓包：仅允许脱敏后的业务记录，记录 parser_version 便于重解析。全量同步不删除 API 当前窗口外的旧记录。跨端同步不直接上传 SQLite 文件或 sync_state。

只有明确证明从账号历史起点完整覆盖，coverage 才能为 full_history_verified；拉完接口可见窗口仅为 available_window_complete。区间首个六星、未知免费抽和未验证继承不能按完整周期计算平均保底。

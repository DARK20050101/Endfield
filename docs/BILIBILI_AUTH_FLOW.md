# Bilibili 授权与数据归属

状态：源码线索 PARTIAL，Android 完整链 UNKNOWN；无实机 VERIFIED 节点。状态解释以 [API_RESEARCH](API_RESEARCH.md) 为准。

## 第一优先级：URL 授权

```mermaid
sequenceDiagram
    actor U as 手机用户
    participant G as 游戏寻访 WebView
    participant UI as Endfield Trace
    participant C as CredentialSource
    participant P as Provider
    participant S as SyncEngine
    participant D as SQLite
    U->>G: 打开寻访记录
    Note over U,G: UNKNOWN：当前版本是否可复制完整 URL，是否需要断网
    G-->>U: 候选寻访链接（UNKNOWN）
    U->>UI: 主动粘贴（默认仅本次授权）
    UI->>C: 受限输入传递；不写普通 store/日志
    Note over UI,C: UNKNOWN：本项目 parser 尚未实现
    C->>C: 校验 https/host/path；提取候选凭据
    C->>P: 验证授权与角色（API-05，PARTIAL）
    P-->>C: 权限、服务器、UID/角色、渠道证据
    alt 身份确定且属于目标渠道
        C-->>UI: 脱敏角色确认页
        U->>UI: 确认同步
        C->>S: ValidatedCredentialContext
        S->>P: 角色各池分页（API-06，PARTIAL）
        S->>P: 武器池列表（API-07，PARTIAL）
        S->>P: 武器各池分页（API-08，PARTIAL）
        S->>D: 校验、去重、事务与检查点（目标设计）
        D-->>UI: 可离线读取的业务记录
    else 授权有效但身份不明
        C-->>UI: Unknown / 待识别；不合并既有角色
        Note over UI,D: 可隔离暂存脱敏业务数据，不算 B服完整验收
    else 授权无效或过期
        C-->>UI: 重新复制最新链接；无效不一定是过期
    end
```

图中架构步骤为计划而非运行证据。具体 URL 获取矩阵见 [GACHA_URL_RESEARCH](GACHA_URL_RESEARCH.md)。

## 后备路线：官方网页登录与绑定

```mermaid
sequenceDiagram
    actor U as 用户
    participant W as 官方登录页面
    participant C as WebLoginCredentialSource
    participant A as 账号授权与绑定 API
    participant P as GameProvider
    U->>W: 官方域名登录（Android 捕获 UNKNOWN）
    W-->>C: 账号凭据（API-01，PARTIAL）
    C->>A: grant（API-02，PARTIAL）
    A-->>C: 账号授权凭据
    C->>A: binding_list（API-03，PARTIAL）
    A-->>C: 游戏账号 / 渠道 / 角色 / server
    C-->>U: 仅显示可信绑定的终末地 B服角色
    U->>C: 选择角色
    C->>A: 按授权绑定 UID 换 U8 Token（API-04，PARTIAL）
    C->>P: 验证权限、角色与服务器（PARTIAL）
    P-->>C: ValidatedCredentialContext
    Note over C,P: 后续复用同一 SyncEngine，不写第二套同步
```

主基线 README 提示 B服先在鹰角用户中心绑定；这是上游使用前提说明，本项目需验证当前账号/版本是否适用，不能默认为每个用户已绑定。

## 身份规则与节点清单

| 节点 | 状态 | 缺失证据 |
| --- | --- | --- |
| Android 游戏 URL 获取 | UNKNOWN | 游戏版本、官服/B服真机复现 |
| URL parser 与输入格式 | PARTIAL（上游线索） | parser 实现审计、移动样本、异常测试 |
| grant → binding → U8 | PARTIAL | 真实 B服授权与错误样本 |
| role/server 解析 | PARTIAL | 凭据作用域、歧义和多角色验证 |
| 渠道字段映射 | PARTIAL | 当前返回值及稳定性；类型声明不够 |
| Character / Weapon 分页 | PARTIAL | 同一授权可用性、唯一性和顺序 |
| Android 完整落库与重启 | UNKNOWN | APK/SQLite/设备实测 |
| HGWebview.log 路线 | DEPRECATED（作为本项目核心路径） | 上游曾报告日志显示变化；不据此认定所有历史版本均失效 |

内部 UUID 不来自昵称或 UID 截断。外部身份包含 provider、region、channel、gameUid、externalRoleId、serverId，未知值不伪填。URL 输入的身份声明不能替代可信 API 验证；不采用首个角色回退、不用昵称匹配，也不拉其他用户数据再过滤。

账号登录不是 URL 路线前置条件：没有账号级登录时 Account 可缺省，已验证的 GameAccount/GameRole 可以独立存在；细节见 [DATABASE](DATABASE.md)。

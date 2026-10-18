# DSH rc 兼容升级（2026-10-18）

- 目标版本：`0.2.1-rc.2`。查询官方 npm 的完整版本列表与 dist-tags，`next` 为该版本，`latest` 仍为 `0.2.0-rc.2`，因此不能只使用 latest 标签。
- 来源：[官方发布](https://github.com/deepseek-ai/deepseek-harness/releases/tag/dsh-v0.2.1-rc.2)、[官方 npm 元数据](https://registry.npmjs.org/@deepseek-ai%2fdsh)。所有直接 DSH 依赖均已核实存在 `0.2.1-rc.2`；下载完整性保存在 pnpm-lock.yaml。
- 本机 macOS 客户端 Info.plist 和自带 CLI 均为 `0.2.1-rc.2`，无需升级客户端。插件自身版本保持 `0.1.0`，以源码提交与安装包 SHA-256 标识本次构建。
- Cordis peer 与 workspace override 统一为 `4.0.5`，关联 Schemastery 升为 `3.18.5`、group 升为 `1.0.5`，保持目标 DSH 的兼容约束。
- 新 Typert generator 原生生成延迟 `create()` 工厂及 Remote info，无需旧的文本转换。直接使用官方生成产物；安装 smoke 实际执行 Host/Remote codecs，额外检查非空 invocation 和 strictCodec，避免仅靠字符串判断或空集合漏检。
- `pnpm install --frozen-lockfile` 与 `pnpm run check` 通过，含构建、Host/Client/test 类型检查、lint、86 项离线测试、临时 profile 安装和打包检查；可选实时行情用例按原规则跳过。
- 实际 desktop 安装与客户端加载另行验收，不以临时 profile smoke 替代。安装流程、数据保护及官方 CLI 入口见中英文 README。

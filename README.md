# dsh-fund-portfolio

English | [中文](README.zh.md)

Fund holding management for DeepSeek Harness. Enter each account's fund code, confirmed current shares, and average cost per share, then use the native right sidebar or Agent tools to compare intraday estimates, disclosed returns, market value, and floating profit.

> Returns use the currently entered shares. They are not a transaction ledger, settlement statement, dealing price, or investment advice.

## Requirements

- DeepSeek Harness `0.1.6-alpha.1`
- Node.js `^22.19.0 || >=24.0.0`
- The Web profile for the right-sidebar panel

The plugin supports ordinary off-exchange CNY funds, CNY-share QDII funds, and ordinary money-market funds with a CNY 1 unit value. It does not convert currencies, use exchange prices, reconstruct purchases or redemptions, or calculate historically credited returns. Fund classification is provider-derived and conservative; unsupported or ambiguous products are rejected instead of guessed.

## Install

Install a pinned GitHub revision so DSH uses the committed build artifacts:

```sh
dsh plugin --profile web add github:zsspub/dsh-fund-portfolio#<commit-sha>
```

Restart the profile and refresh the browser. Open **Fund** at the bottom of the sidebar. This command changes only the selected profile; the plugin does not edit other profiles.

For local development:

```sh
pnpm install --frozen-lockfile
pnpm run build
dsh plugin --profile web add /absolute/path/to/dsh-fund-portfolio
```

## Use

1. Click **Accounts**, create an account in the modal, and close it.
2. Select **Add holding** to open the modal, enter a six-digit fund code, and select **Verify fund**.
3. Confirm the returned name and category, then enter confirmed shares and average cost per share.
4. Save the holding. The visible panel refreshes immediately and then every 60 seconds. Hiding the tab stops polling.

The **All accounts** and individual account tabs filter holdings and every aggregate, with arrow-key navigation. New holdings default to the selected account. One account can contain a fund only once; use **Edit** to change its current shares or cost in a modal without leaving the portfolio. The same fund can exist in multiple accounts and shares one anonymous market-data refresh.

Account and holding deletion use an explicit confirmation. An account must be empty before deletion. Edits carry a record version; a stale panel or Agent call is rejected and must refresh first.

## Return rules

All input, persisted decimal values, and Remote fields are decimal strings. The Host uses decimal fixed-point calculations and rounds only for display.

| Metric | Rule |
| --- | --- |
| Holding cost | current shares × average cost per share |
| Market value | current shares × selected estimate or disclosed NAV |
| Estimated daily return | current shares × (estimate − verified prior NAV), only for a trusted single ordinary-fund interval |
| Disclosed return | current shares × (disclosed NAV − prior disclosed NAV), labelled with its disclosure date |
| Floating profit | current shares × (selected price − average cost per share) |
| Money-fund disclosed return | current shares ÷ 10,000 × income per 10,000 shares |

When a NAV for the same date is disclosed, it becomes the primary result while the last estimate remains visible for comparison. Missing or unreliable values remain pending and never become zero.

- **Money funds:** no intraday estimate is produced. Seven-day annualized yield is informational and never converted into daily income. Without a transaction ledger the plugin does not compound shares or show cumulative credited income.
- **QDII:** the panel separates estimate time, NAV date, and reference date. Reference changes are not included in today's total because the overseas return interval cannot be inferred reliably.
- **Corporate actions:** provider flags or a material mismatch between reported return and raw NAV change suppress daily-return calculation and request manual verification.
- **Non-trading days and delayed disclosure:** the latest valid record and date remain visible. The daily total includes only results whose date equals the portfolio date.
- **Zero cost:** market value and floating profit remain available, but a percentage return is not calculated.

## Market data and privacy

The Host reads:

- Sina `hq.sinajs.cn` `fu_<fund-code>` responses for reference estimates.
- Eastmoney fund search for exact metadata and `f10/lsjz` for disclosed NAV or income per 10,000 shares.

These public, read-only endpoints are unofficial integration dependencies and provide no stability or availability commitment. The Host validates HTTP status, exact fund code, category, dates, decimal values, units, and response structure. It decodes Sina as GB18030 text and parses the assignment as data; it never evaluates remote JavaScript. HTML error pages, empty history, duplicate/future dates, invalid fields, redirects, timeouts, and rate limits are failures.

Requests contain only fund codes. Account names, shares, costs, database contents, and backups are not sent to the quote providers. A failed fund refresh preserves dated cached data and does not block other fund codes.

## Storage and backup

SQLite defaults to `$DSH_HOME/fund-portfolio/portfolio.sqlite3`. The database uses WAL, foreign keys, a five-second busy timeout, transactions, schema versioning, and optimistic record versions. A schema newer than this release is rejected. Uninstalling the plugin does not delete the database.

Open the **Import / Export** menu: **Export JSON** downloads a version-1 backup of all accounts, current holdings, and verified fund metadata, but not quote caches. **Import JSON** opens a local `.json` file (up to 20 MiB), validates it, and previews records and conflicts in a modal before confirmation. Merge is blocked by conflicts; replacement requires explicitly checking the replacement option and runs in one transaction. Keep databases and backups out of Git because they contain real holdings.

## Agent tools

| Tools | Purpose |
| --- | --- |
| `fund_account_list/create/update/delete` | Manage named accounts; deletion requires native approval. |
| `fund_lookup` | Verify an exact fund name and supported category before adding it. |
| `fund_holding_list/add/update/delete` | Manage current holdings with optimistic versions; deletion requires native approval. |
| `fund_portfolio_summary` | Refresh once and return dated values, coverage, and missing reasons. |
| `fund_quote_refresh` | Request a manual refresh subject to the per-fund ten-second minimum interval. |
| `fund_portfolio_export/import` | Export, preview, and explicitly confirm JSON import. |

Tools and the panel call the same `ctx.fundPortfolio` Host service. Tool results include the selected price, dates, shares, calculated values, coverage, and missing reason. Ordinary DSH tool events preserve those results in the Session log, so replay does not fetch current quotes again. The plugin adds no Session event type or Session format version.

## Configuration

The bundle supplies the database path. Other defaults are:

| Field | Default | Meaning |
| --- | --- | --- |
| `busyTimeoutMs` | `5000` | SQLite lock wait. |
| `refreshIntervalMs` | `60000` | Visible-panel polling interval. |
| `estimateCacheMs` | `60000` | Estimate cache lifetime. |
| `navCacheMs` | `300000` | Disclosed NAV cache lifetime. |
| `fundCacheMs` | `86400000` | Fund metadata cache lifetime. |
| `minRefreshMs` | `10000` | Minimum interval between attempts for one code, including manual refresh. |
| `timeoutMs` | `10000` | HTTP request timeout. |
| `concurrency` | `4` | Maximum concurrent fund jobs. |

Override the `fund-portfolio` entry in the profile's `cordis.patch.yml` when needed. `databasePath` must be absolute. Unloading cancels provider requests, waits for active shared jobs, then closes SQLite.

## Development

```sh
pnpm install --frozen-lockfile
pnpm run check
pnpm run artifacts:check
DSH_FUND_LIVE=1 pnpm run test:live
```

The normal suite uses fixed clocks and fixtures and performs no live quote request. `test:live` is an optional read-only smoke for `005827`, `000198`, and `270042`; it checks categories and fields instead of prices.

Host and Client TypeScript faces compile separately. The build creates Typert Host and Remote declarations from installed DSH protocol declarations, then emits the DSH browser-loader bundle. Built `lib/` artifacts are committed for installation from a GitHub commit without a lifecycle build.

See [the return and data-source decision](docs/agent-notes/2026-09-15-return-and-data-sources.md) for durable design constraints.

## License

[MIT](LICENSE)

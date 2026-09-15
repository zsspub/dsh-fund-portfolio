# Agent Note: Current-share returns and public fund data

Status: implemented

English | [中文](2026-09-15-return-and-data-sources.zh.md)

## Problem

A current holding record contains an account, fund code, confirmed shares, and average cost per share. It does not contain purchases, redemptions, distributions, reinvestment, settlement adjustments, or platform fees. The plugin must therefore distinguish values that can be measured from current shares from returns that require a transaction ledger.

Fund categories also disclose data differently. Ordinary funds publish unit NAV after a trading day and may have an intraday estimate. Money funds publish income per 10,000 shares and seven-day annualized yield. CNY-share QDII funds can disclose NAV and estimates on dates that refer to different overseas market intervals.

## Decision

The Host calculates every amount from the current confirmed shares with decimal fixed-point arithmetic. Inputs, persisted values, Remote values, and tool results use decimal strings; rounding occurs only in the Client.

For an ordinary fund, a daily estimate is valid only when the estimate's reference value and reference date match a stored NAV and the date gap identifies one ordinary trading interval. A Monday estimate may use the prior Friday. Larger holiday gaps remain untrusted because calendar dates alone do not identify the represented return interval. A disclosed same-date NAV replaces the estimate as the primary daily result and valuation, while the stored estimate remains visible.

A QDII estimate is always a reference change rather than today's return. The plugin exposes its estimate date, time, reference NAV date, and change, but excludes it from daily totals. A disclosed QDII return belongs to its NAV date and enters today's total only when that date is today.

A money fund uses disclosed income per 10,000 shares: `shares / 10,000 × income`. It produces no intraday estimate and never converts seven-day annualized yield into daily income. Its market value is the confirmed shares under the supported CNY 1 unit convention. The plugin does not compound shares without a transaction ledger.

Provider corporate-action fields and a material mismatch between published return percentage and raw NAV change mark the date for review. The plugin then suppresses daily-return calculation. Floating profit remains a current cost-versus-price comparison and is labelled separately.

Portfolio totals include only valid daily results whose date equals the portfolio date. Missing, delayed, cross-date, unverified, or review-required rows remain missing rather than contributing zero.

## Data sources

The Host sends only a six-digit fund code to public read-only endpoints. Sina `hq.sinajs.cn` supplies reference estimates; Eastmoney fund search verifies exact metadata and `f10/lsjz` supplies disclosed NAV or income per 10,000 shares. These endpoints are unofficial integration dependencies with no availability or compatibility promise.

Every response is parsed as data. The Sina assignment must match one quoted assignment exactly after GB18030 decoding; no script runs. JSON, HTTP status, category, units, dates, decimal values, duplicates, and future records are validated. Redirects, HTML pages, empty results, invalid fields, timeouts, and rate limits are failures.

Each fund code owns one in-process refresh promise and one persistent quote record across accounts. Separate cache lifetimes apply to metadata, NAV, and estimate reads. Manual refresh bypasses expiry but not the ten-second per-code attempt interval. A provider failure preserves prior dated observations and records an error; other codes continue. Unload aborts provider requests, waits for shared jobs, and closes SQLite.

## Alternatives

**Infer exact credited returns from average cost and current shares.** Rejected. Distributions, fees, settlement, and reinvestment are absent, so such a result would claim data the plugin does not own.

**Use seven-day annualized yield for money-fund daily income.** Rejected. It is a rolling annualized indicator, not that date's credited income.

**Treat QDII estimate movement as today's return.** Rejected. The overseas valuation interval and the user's local date cannot be established from these fields.

**Evaluate provider JavaScript or scrape rendered pages.** Rejected. Exact text and JSON parsing keeps the accepted input small and testable and prevents remote code execution.

## Consequences

The panel can show partial totals, explicit dates, and reference-only values instead of presenting false precision. The calculation is useful for current exposure and indicative daily movement but cannot reconcile a platform statement. A future transaction-ledger feature must be a separate data model and must not reinterpret these records as historical trades.

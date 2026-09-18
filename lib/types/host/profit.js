/** Date-aware current-share valuations, not a transaction or settlement ledger. */
import { Decimal } from 'decimal.js';
import { priorCalendarDate } from "./validation.js";
const Money = Decimal.clone({ precision: 64 });
export function valueHolding(holding, account, fund, quote, today) {
    const shares = new Money(holding.shares);
    const cost = shares.mul(holding.costPrice);
    const nav = quote.navs[0];
    const previous = quote.navs[1];
    const estimate = quote.estimate;
    const result = {
        holding, accountName: account.name, fund, quote, cost: cost.toFixed(),
        marketValue: null, priceKind: null, priceDate: null, floatingProfit: null, floatingRate: null,
        confirmed: null, estimated: null, today: null, referenceChange: null, issue: 'pending',
        currentRatio: null, rebalance: null,
    };
    if (fund.kind === 'money') {
        result.marketValue = shares.toFixed();
        result.priceKind = 'money';
        if (nav) {
            result.confirmed = { amount: shares.div(10000).mul(nav.value).toFixed(), date: nav.date, basisDate: null, kind: 'confirmed' };
            result.priceDate = nav.date;
            if (nav.action) {
                result.confirmed = null;
                result.issue = 'review';
            }
        }
    }
    else {
        const action = Boolean(nav?.action);
        if (nav && previous && !action) {
            result.confirmed = {
                amount: shares.mul(new Money(nav.value).sub(previous.value)).toFixed(),
                date: nav.date, basisDate: previous.date, kind: 'confirmed',
            };
        }
        if (estimate && nav) {
            const referenceMatches = new Money(estimate.referenceValue).eq(nav.value);
            const referenceDateMatches = estimate.referenceDate === nav.date;
            const oneCalendarDay = priorCalendarDate(estimate.date) === nav.date;
            const mondayAfterFriday = new Date(`${estimate.date}T00:00:00Z`).getUTCDay() === 1
                && Date.parse(`${estimate.date}T00:00:00Z`) - Date.parse(`${nav.date}T00:00:00Z`) === 3 * 86400_000;
            const weekday = new Date(`${estimate.date}T00:00:00Z`).getUTCDay();
            const validInterval = fund.kind === 'nav' && (oneCalendarDay || mondayAfterFriday) && weekday > 0 && weekday < 6;
            result.referenceChange = shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed();
            if (referenceMatches && referenceDateMatches && validInterval && !action) {
                result.estimated = {
                    amount: shares.mul(new Money(estimate.value).sub(estimate.referenceValue)).toFixed(), date: estimate.date, basisDate: nav.date, kind: 'estimated',
                };
            }
            else if (estimate.date === today && nav.date !== today) {
                result.issue = 'baseline';
            }
        }
        const useEstimate = estimate !== null && estimate.date === today && (!nav || nav.date < estimate.date);
        const price = useEstimate ? estimate.value : nav?.value;
        if (price !== undefined) {
            const market = shares.mul(price);
            result.marketValue = market.toFixed();
            result.floatingProfit = market.sub(cost).toFixed();
            result.floatingRate = cost.isZero() ? null : market.sub(cost).div(cost).mul(100).toFixed();
            result.priceKind = useEstimate ? 'estimate' : 'nav';
            result.priceDate = useEstimate ? estimate.date : nav.date;
        }
        if (action)
            result.issue = 'review';
    }
    if (result.confirmed?.date === today)
        result.today = result.confirmed;
    else if (result.estimated?.date === today)
        result.today = result.estimated;
    if (result.today)
        result.issue = null;
    if (!nav && !estimate)
        result.issue = 'unavailable';
    return result;
}
function allocationFor(accountId, holdings) {
    if (!accountId)
        return null;
    const configured = holdings.filter(row => row.holding.targetRatio !== null);
    const targetTotal = configured.reduce((total, row) => total.add(row.holding.targetRatio), new Money(0));
    const marketComplete = holdings.length > 0
        && holdings.every(row => row.marketValue !== null && new Money(row.marketValue).gt(0));
    const totalMarketValue = marketComplete ? holdings.reduce((total, row) => total.add(row.marketValue), new Money(0)) : new Money(0);
    if (marketComplete && totalMarketValue.gt(0)) {
        for (const row of holdings) {
            row.currentRatio = new Money(row.marketValue).div(totalMarketValue).mul(100).toFixed();
        }
    }
    const base = {
        holdings: holdings.length,
        configured: configured.length,
        targetTotal: targetTotal.toFixed(),
        buyAmount: null,
        sellAmount: null,
    };
    if (configured.length !== holdings.length || holdings.length === 0) {
        return { ...base, status: 'unconfigured' };
    }
    if (!targetTotal.eq(100))
        return { ...base, status: 'invalid-target-total' };
    if (!marketComplete || !totalMarketValue.gt(0))
        return { ...base, status: 'market-incomplete' };
    let buyAmount = new Money(0);
    let sellAmount = new Money(0);
    for (const row of holdings) {
        const marketValue = new Money(row.marketValue);
        const targetValue = totalMarketValue.mul(row.holding.targetRatio).div(100);
        const delta = targetValue.sub(marketValue);
        const action = delta.gt(0) ? 'buy' : delta.lt(0) ? 'sell' : 'hold';
        const absoluteAmount = delta.abs();
        const price = marketValue.div(row.holding.shares);
        row.rebalance = {
            action,
            amount: absoluteAmount.toFixed(),
            shares: absoluteAmount.isZero() ? '0' : absoluteAmount.div(price).toFixed(),
        };
        if (delta.gt(0))
            buyAmount = buyAmount.add(delta);
        else if (delta.lt(0))
            sellAmount = sellAmount.add(delta.abs());
    }
    return {
        ...base,
        status: 'ready',
        buyAmount: buyAmount.toFixed(),
        sellAmount: sellAmount.toFixed(),
    };
}
export function summarize(date, accounts, holdings, refreshIntervalMs, accountId) {
    const sum = (values) => {
        const present = values.filter((value) => value !== null);
        return present.length ? present.reduce((total, value) => total.add(value), new Money(0)).toFixed() : null;
    };
    const incomes = holdings.map(row => row.today).filter((income) => income !== null);
    const confirmed = incomes.filter(income => income.kind === 'confirmed');
    const estimated = incomes.filter(income => income.kind === 'estimated');
    const allocation = allocationFor(accountId, holdings);
    return {
        date, accounts, holdings, refreshIntervalMs,
        cost: sum(holdings.map(row => row.cost)) ?? '0',
        marketValue: sum(holdings.map(row => row.marketValue)),
        marketCovered: holdings.filter(row => row.marketValue !== null).length,
        floatingProfit: sum(holdings.map(row => row.floatingProfit)),
        floatingCovered: holdings.filter(row => row.floatingProfit !== null).length,
        confirmedToday: sum(confirmed.map(income => income.amount)),
        estimatedToday: sum(estimated.map(income => income.amount)),
        todayTotal: sum(incomes.map(income => income.amount)),
        confirmedCount: confirmed.length, estimatedCount: estimated.length,
        missingCount: holdings.length - incomes.length,
        allocation,
    };
}

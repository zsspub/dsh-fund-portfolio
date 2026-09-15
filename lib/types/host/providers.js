/** Anonymous public-page adapters. Remote scripts are parsed as data, never evaluated. */
import { z } from 'zod';
import { Decimal } from 'decimal.js';
import { codeSchema, dateString, signedDecimalText, positiveText, todayAt } from "./validation.js";
const record = z.record(z.string(), z.unknown());
export function parseFundResponse(value, code, fetchedAt) {
    const response = z.object({ ErrCode: z.literal(0), Datas: z.array(record) }).parse(value);
    const found = response.Datas.find(item => item.CODE === code && item.CATEGORY === 700);
    if (!found)
        throw new Error('Fund code not found');
    const info = record.parse(found.FundBaseInfo);
    const name = z.string().min(1).parse(found.NAME);
    const type = z.string().parse(info.FUNDTYPE);
    const description = String(info.FTYPE ?? '');
    if (/美元|欧元|港币|港元|英镑|日元|澳元|外币|ETF(?!联接|连接)/i.test(name)
        || /场内|浮动净值/.test(description))
        throw new Error('Only CNY off-exchange funds are supported');
    const money = type === '005';
    if (money && !/普通货币/.test(description))
        throw new Error('Unsupported money fund unit convention');
    return {
        code, name, kind: money ? 'money' : /QDII/i.test(name) || type === '007' ? 'qdii' : 'nav',
        currency: 'CNY', fetchedAt,
    };
}
export function parseNavResponse(value, fund, today) {
    const response = z.object({
        ErrCode: z.literal(0),
        Data: z.object({ LSJZList: z.array(record), SYType: z.string().nullable().optional() }),
    }).parse(value);
    if ((response.Data.SYType === '每万份收益') !== (fund.kind === 'money'))
        throw new Error('Fund NAV unit mismatch');
    const rows = response.Data.LSJZList.map(item => {
        const date = dateString(item.FSRQ);
        if (date > today)
            throw new Error('Provider returned a future NAV date');
        const valueText = (fund.kind === 'money' ? signedDecimalText : positiveText).parse(item.DWJZ);
        const actions = [item.FHFCZ, item.FHFCZ10, item.FHFCBZ, item.FHSP]
            .filter(value => value !== null && value !== undefined && value !== '' && value !== '0');
        return {
            date, value: valueText,
            annualYield: fund.kind === 'money' ? signedDecimalText.parse(item.LJJZ) : null,
            action: actions.length ? actions.map(String).join('; ') : null,
            publishedRate: item.JZZZL,
        };
    }).sort((left, right) => right.date.localeCompare(left.date));
    if (!rows.length || new Set(rows.map(item => item.date)).size !== rows.length)
        throw new Error('Empty or duplicate NAV history');
    return rows.map((row, index) => {
        let action = row.action;
        const previous = rows[index + 1];
        if (fund.kind !== 'money' && previous && typeof row.publishedRate === 'string' && /^-?\d+(\.\d+)?$/.test(row.publishedRate)) {
            const calculated = new Decimal(row.value).div(previous.value).sub(1).mul(100);
            if (calculated.sub(row.publishedRate).abs().gt('0.03'))
                action ??= 'Published return differs from NAV change';
        }
        return { date: row.date, value: row.value, annualYield: row.annualYield, action };
    });
}
export function parseEstimateResponse(text, code, today) {
    codeSchema.parse(code);
    const match = new RegExp(`^\\s*var hq_str_fu_${code}="([^"\\r\\n]*)";\\s*$`).exec(text);
    if (!match)
        throw new Error('Invalid estimate response');
    if (!match[1])
        return null;
    const fields = match[1].split(',');
    if (fields.length < 8)
        throw new Error('Incomplete estimate response');
    const date = dateString(fields[7]);
    const time = z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/).parse(fields[1]);
    if (date > today)
        throw new Error('Provider returned a future estimate date');
    return {
        date, time, value: positiveText.parse(fields[2]), referenceValue: positiveText.parse(fields[3]),
        referenceDate: null,
    };
}
export class PublicFundProvider {
    options;
    fetcher;
    now;
    constructor(options) {
        this.options = options;
        this.fetcher = options.fetch ?? fetch;
        this.now = options.now ?? Date.now;
    }
    async request(url, signal, referer) {
        signal.throwIfAborted();
        const response = await this.fetcher(url, {
            signal: AbortSignal.any([signal, AbortSignal.timeout(this.options.timeoutMs)]),
            redirect: 'error', credentials: 'omit',
            headers: referer ? { Referer: referer } : {},
        });
        if (!response.ok)
            throw new Error(`Market data HTTP ${response.status}`);
        return response;
    }
    async fund(code, signal) {
        codeSchema.parse(code);
        const response = await this.request(`https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${code}`, signal);
        return parseFundResponse(await response.json(), code, new Date(this.now()).toISOString());
    }
    async nav(fund, signal) {
        codeSchema.parse(fund.code);
        const response = await this.request(`https://api.fund.eastmoney.com/f10/lsjz?fundCode=${fund.code}&pageIndex=1&pageSize=10`, signal, 'https://fundf10.eastmoney.com/');
        return parseNavResponse(await response.json(), fund, todayAt(this.now()));
    }
    async estimate(code, signal) {
        codeSchema.parse(code);
        const response = await this.request(`https://hq.sinajs.cn/list=fu_${code}`, signal, 'https://finance.sina.com.cn/');
        const text = new TextDecoder('gb18030').decode(await response.arrayBuffer());
        return parseEstimateResponse(text, code, todayAt(this.now()));
    }
}

import { describe, expect, it } from 'vitest'
import { parseEstimateResponse, parseFundResponse, parseNavResponse, PublicFundProvider } from '../src/host/providers.ts'
import { fund } from './fixtures.ts'

describe('public market data parsing', () => {
  it('selects the exact fund category, not a bond with the same code', () => {
    const response = { ErrCode: 0, Datas: [
      { CODE: fund.code, CATEGORY: 900, NAME: 'Wrong security' },
      { CODE: fund.code, CATEGORY: 700, NAME: '人民币指数基金', FundBaseInfo: { FUNDTYPE: '001', FTYPE: '股票型' } },
    ] }
    expect(parseFundResponse(response, fund.code, fund.fetchedAt).name).toBe('人民币指数基金')
  })

  it.each(['美元QDII', '港币基金', '沪深300ETF', '浮动净值货币'])('rejects unsupported %s units', name => {
    expect(() => parseFundResponse({ ErrCode: 0, Datas: [
      { CODE: fund.code, CATEGORY: 700, NAME: name, FundBaseInfo: { FUNDTYPE: '005', FTYPE: name } },
    ] }, fund.code, fund.fetchedAt)).toThrow()
  })

  it('parses estimates without executing JavaScript', () => {
    const text = `var hq_str_fu_${fund.code}="Example,14:05:00,1.32,1.30,1.30,0,1.53,2026-09-15";`
    expect(parseEstimateResponse(text, fund.code, '2026-09-15')?.value).toBe('1.32')
    expect(parseEstimateResponse(`var hq_str_fu_${fund.code}="";`, fund.code, '2026-09-15')).toBeNull()
    for (const invalid of [text + 'alert(1)', '<html>404</html>', text.replace('1.32', 'NaN'), text.replace('14:05:00', '25:05:00'), text.replace('2026-09-15', '2026-09-16')]) {
      expect(() => parseEstimateResponse(invalid, fund.code, '2026-09-15')).toThrow()
    }
  })

  it('validates NAV units and detects return mismatch around distributions', () => {
    const response = { ErrCode: 0, Data: { SYType: null, LSJZList: [
      { FSRQ: '2026-09-15', DWJZ: '0.9', JZZZL: '1.00' },
      { FSRQ: '2026-09-14', DWJZ: '1.0', JZZZL: '0.00' },
    ] } }
    expect(parseNavResponse(response, fund, '2026-09-15')[0]!.action).toMatch(/differs/)
    expect(() => parseNavResponse(response, { ...fund, kind: 'money' }, '2026-09-15')).toThrow(/unit/)
  })

  it('parses money yield separately from NAV and rejects future/duplicate dates', () => {
    const item = { FSRQ: '2026-09-15', DWJZ: '0.2332', LJJZ: '0.817' }
    const response = { ErrCode: 0, Data: { SYType: '每万份收益', LSJZList: [item] } }
    expect(parseNavResponse(response, { ...fund, kind: 'money' }, '2026-09-15')[0]).toMatchObject({ value: '0.2332', annualYield: '0.817' })
    expect(() => parseNavResponse(response, { ...fund, kind: 'money' }, '2026-09-14')).toThrow(/future/)
    response.Data.LSJZList.push(item)
    expect(() => parseNavResponse(response, { ...fund, kind: 'money' }, '2026-09-15')).toThrow(/duplicate/)
  })

  it('preserves negative money-fund disclosures instead of treating them as missing', () => {
    const response = { ErrCode: 0, Data: { SYType: '每万份收益', LSJZList: [
      { FSRQ: '2026-09-15', DWJZ: '-0.0012', LJJZ: '-0.010' },
    ] } }
    expect(parseNavResponse(response, { ...fund, kind: 'money' }, '2026-09-15')[0])
      .toMatchObject({ value: '-0.0012', annualYield: '-0.010' })
  })

  it('sends only the fund code and fails on rate limiting or HTML errors', async () => {
    const requests: string[] = []
    const provider = new PublicFundProvider({
      timeoutMs: 1000,
      fetch: async input => { requests.push(String(input)); return new Response('limited', { status: 429 }) },
    })
    await expect(provider.fund(fund.code, new AbortController().signal)).rejects.toThrow('429')
    expect(requests).toEqual([`https://fundsuggest.eastmoney.com/FundSearch/api/FundSearchAPI.ashx?m=1&key=${fund.code}`])
    const html = new PublicFundProvider({ timeoutMs: 1000, fetch: async () => new Response('<html>Not found</html>') })
    await expect(html.estimate(fund.code, new AbortController().signal)).rejects.toThrow(/Invalid estimate/)
  })

  it('decodes GB18030 estimate text without interpreting the fund name', async () => {
    const prefix = Buffer.from(`var hq_str_fu_${fund.code}="`, 'ascii')
    const chineseName = Buffer.from([0xbb, 0xf9, 0xbd, 0xf0])
    const suffix = Buffer.from(',14:05:00,1.32,1.30,1.30,0,1.53,2026-09-15";', 'ascii')
    const body = Buffer.concat([prefix, chineseName, suffix])
    const provider = new PublicFundProvider({
      timeoutMs: 1000,
      now: () => Date.parse('2026-09-15T06:00:00Z'),
      fetch: async () => new Response(body),
    })
    await expect(provider.estimate(fund.code, new AbortController().signal))
      .resolves.toMatchObject({ value: '1.32', date: '2026-09-15' })
  })

  it('honors request timeout and caller cancellation', async () => {
    const stalled: typeof fetch = async (_input, init) => new Promise<Response>((_resolve, reject) => {
      init!.signal!.addEventListener('abort', () => reject(init!.signal!.reason), { once: true })
    })
    const timed = new PublicFundProvider({ timeoutMs: 5, fetch: stalled })
    await expect(timed.fund(fund.code, new AbortController().signal)).rejects.toThrow()

    const controller = new AbortController()
    const cancelled = new PublicFundProvider({ timeoutMs: 1000, fetch: stalled }).fund(fund.code, controller.signal)
    controller.abort()
    await expect(cancelled).rejects.toThrow()
  })
})

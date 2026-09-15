import { describe, expect, it } from 'vitest'
import { remoteOperation } from '../src/host/errors.ts'

describe('Remote portfolio failures', () => {
  it('keeps user-correctable rejection messages and stable codes', async () => {
    const error = await remoteOperation('holding.add', new AbortController().signal, () => {
      throw new Error('Duplicate holding')
    }).catch(failure => failure)
    expect(error).toMatchObject({
      code: 'fund-portfolio/rejected',
      message: 'Duplicate holding',
      details: { operation: 'holding.add' },
    })
  })

  it('distinguishes public-data outages and caller cancellation', async () => {
    const unavailable = await remoteOperation('fund.lookup', new AbortController().signal, () => {
      throw new Error('Market data HTTP 429')
    }, true).catch(failure => failure)
    expect(unavailable).toMatchObject({ code: 'fund-portfolio/unavailable' })

    const controller = new AbortController()
    controller.abort()
    const cancelled = await remoteOperation('portfolio.summary', controller.signal, () => undefined).catch(failure => failure)
    expect(cancelled).toMatchObject({ code: 'gateway/cancelled' })
  })
})

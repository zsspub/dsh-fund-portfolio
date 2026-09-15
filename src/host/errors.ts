/** Stable Remote failures for user-correctable portfolio requests and public-data outages. */
import { RemoteError, remoteErrorOf } from '@deepseek-ai/dsh-typert-protocol'

export async function remoteOperation<Result>(
  operation: string,
  signal: AbortSignal,
  execute: () => Promise<Result> | Result,
  unavailable = false,
): Promise<Result> {
  try {
    signal.throwIfAborted()
    const result = await execute()
    signal.throwIfAborted()
    return result
  } catch (error) {
    if (remoteErrorOf(error)) throw error
    if (signal.aborted || (error instanceof Error && error.name === 'AbortError')) {
      throw new RemoteError('gateway/cancelled', `${operation} was cancelled`, {}, { cause: error })
    }
    const message = error instanceof Error ? error.message : String(error)
    throw new RemoteError(
      unavailable ? 'fund-portfolio/unavailable' : 'fund-portfolio/rejected',
      message,
      { operation },
      { cause: error },
    )
  }
}

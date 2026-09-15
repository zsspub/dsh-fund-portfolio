/** Per-tab refresh lifetime; mutations and poll responses never overwrite newer state. */
import type { Portfolio, PortfolioInput } from '../types.ts'

export interface PortfolioReader {
  summary(request: PortfolioInput, signal: AbortSignal): Promise<Portfolio>
}
export interface ViewState { data: Portfolio | null; busy: boolean; error: string | null }

export class PortfolioController {
  private state: ViewState = { data: null, busy: false, error: null }
  private readonly listeners = new Set<() => void>()
  private request: AbortController | null = null
  private timer: ReturnType<typeof setTimeout> | null = null
  private visible = false
  private disposed = false
  private generation = 0
  private filter: PortfolioInput = {}

  constructor(private readonly api: PortfolioReader) {}

  getSnapshot = (): ViewState => this.state
  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }
  private publish(patch: Partial<ViewState>): void {
    this.state = { ...this.state, ...patch }
    for (const listener of this.listeners) listener()
  }
  setVisible(visible: boolean): void {
    if (this.visible === visible || this.disposed) return
    this.visible = visible
    if (visible) void this.refresh()
    else {
      this.generation++
      this.request?.abort()
      this.request = null
      if (this.timer) clearTimeout(this.timer)
      this.timer = null
      this.publish({ busy: false })
    }
  }
  select(filter: PortfolioInput): void {
    this.filter = filter
    void this.refresh()
  }
  async refresh(force = false): Promise<void> {
    if (this.disposed || !this.visible) return
    const generation = ++this.generation
    this.request?.abort()
    if (this.timer) clearTimeout(this.timer)
    const request = new AbortController()
    this.request = request
    this.publish({ busy: true, error: null })
    try {
      const data = await this.api.summary({ ...this.filter, refresh: true, force }, request.signal)
      if (generation === this.generation && !this.disposed) this.publish({ data })
    } catch (error) {
      if (generation === this.generation && !request.signal.aborted) this.publish({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      if (generation === this.generation && !this.disposed) {
        this.publish({ busy: false })
        this.request = null
        if (this.visible) this.timer = setTimeout(() => void this.refresh(), this.state.data?.refreshIntervalMs ?? 60000)
      }
    }
  }
  dispose(): void {
    this.disposed = true
    this.generation++
    this.request?.abort()
    if (this.timer) clearTimeout(this.timer)
    this.listeners.clear()
  }
}

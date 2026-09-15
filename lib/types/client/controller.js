export class PortfolioController {
    api;
    state = { data: null, busy: false, error: null };
    listeners = new Set();
    request = null;
    timer = null;
    visible = false;
    disposed = false;
    generation = 0;
    filter = {};
    constructor(api) {
        this.api = api;
    }
    getSnapshot = () => this.state;
    subscribe = (listener) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };
    publish(patch) {
        this.state = { ...this.state, ...patch };
        for (const listener of this.listeners)
            listener();
    }
    setVisible(visible) {
        if (this.visible === visible || this.disposed)
            return;
        this.visible = visible;
        if (visible)
            void this.refresh();
        else {
            this.generation++;
            this.request?.abort();
            this.request = null;
            if (this.timer)
                clearTimeout(this.timer);
            this.timer = null;
            this.publish({ busy: false });
        }
    }
    select(filter) {
        this.filter = filter;
        void this.refresh();
    }
    async refresh(force = false) {
        if (this.disposed || !this.visible)
            return;
        const generation = ++this.generation;
        this.request?.abort();
        if (this.timer)
            clearTimeout(this.timer);
        const request = new AbortController();
        this.request = request;
        this.publish({ busy: true, error: null });
        try {
            const data = await this.api.summary({ ...this.filter, refresh: true, force }, request.signal);
            if (generation === this.generation && !this.disposed)
                this.publish({ data });
        }
        catch (error) {
            if (generation === this.generation && !request.signal.aborted)
                this.publish({ error: error instanceof Error ? error.message : String(error) });
        }
        finally {
            if (generation === this.generation && !this.disposed) {
                this.publish({ busy: false });
                this.request = null;
                if (this.visible)
                    this.timer = setTimeout(() => void this.refresh(), this.state.data?.refreshIntervalMs ?? 60000);
            }
        }
    }
    dispose() {
        this.disposed = true;
        this.generation++;
        this.request?.abort();
        if (this.timer)
            clearTimeout(this.timer);
        this.listeners.clear();
    }
}

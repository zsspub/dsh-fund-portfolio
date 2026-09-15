import remote from 'dsh-fund-portfolio/remote';
import { PortfolioPanel, PortfolioTrigger } from "./Panel.js";
import { en, NS, zh } from "./locales.js";
export const inject = ['slots', 'locale', 'remote', 'sidebarRight', 'sidebarRightTabs'];
function unwrap(result) {
    if (!result.ok)
        throw result.error;
    return result.value;
}
export async function apply(ctx) {
    ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'fund-portfolio: locales');
    const t = ctx.locale.bind(NS);
    const unmount = await ctx.remote.$mount(remote);
    const fiber = ctx.inject(['remote.fundPortfolio'], scope => {
        scope.effect(() => scope.sidebarRightTabs.register({
            id: 'dsh-fund-portfolio', kind: 'fund-portfolio', title: () => t('title'),
        }), 'fund-portfolio: tab');
        const api = {
            accountCreate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountCreate(input, signal)),
            accountUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountUpdate(input, signal)),
            accountDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountDelete(input, signal)),
            lookup: async (input, signal) => unwrap(await scope.remote.fundPortfolio.lookup(input, signal)),
            holdingAdd: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingAdd(input, signal)),
            holdingUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingUpdate(input, signal)),
            holdingDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingDelete(input, signal)),
            summary: async (input, signal) => unwrap(await scope.remote.fundPortfolio.summary(input, signal)),
            exportData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.exportData(input, signal)),
            previewImport: async (input, signal) => unwrap(await scope.remote.fundPortfolio.previewImport(input, signal)),
            importData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.importData(input, signal)),
        };
        scope.slots.inject('sidebar.footer.action', () => scope.slots.register({
            name: 'sidebar.footer.action', id: 'fund-portfolio', order: 60, locale: NS,
            inject: () => ({ openPanel: () => scope.sidebarRight.openTab('fund-portfolio') }),
        }, PortfolioTrigger));
        scope.slots.inject('sidebar.right.pane.tab', () => scope.slots.register({
            name: 'sidebar.right.pane.tab', key: 'dsh-fund-portfolio', locale: NS, inject: () => ({ api }),
        }, PortfolioPanel));
    });
    try {
        await fiber;
    }
    catch (error) {
        await unmount();
        throw error;
    }
    return async () => { await fiber.dispose(); await unmount(); };
}

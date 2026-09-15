import type { PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import type { FundApi } from './index.ts';
export interface PanelInjected {
    api: FundApi;
}
export interface TriggerInjected {
    openPanel: () => void;
}
type PanelProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.right.pane.tab'> & PanelInjected;
type TriggerProps = PropsLocale<'fundPortfolio'> & PropsRuntime<'sidebar.footer.action'> & TriggerInjected;
export declare function PortfolioTrigger({ t, wide, openPanel }: TriggerProps): import("react/jsx-runtime").JSX.Element;
export declare function PortfolioPanel({ t, api, useTabInfo }: PanelProps): import("react/jsx-runtime").JSX.Element;
export {};

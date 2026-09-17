import type { ReactNode } from 'react';
import type { PortfolioKey } from './locales.ts';
type Translate = (key: PortfolioKey) => string;
export declare function PortfolioModal({ title, closeLabel, busy, onClose, children, alert, initialFocusId }: {
    title: string;
    closeLabel: string;
    busy: boolean;
    onClose: () => void;
    children: ReactNode;
    alert?: boolean;
    initialFocusId?: string;
}): import("react/jsx-runtime").JSX.Element;
export declare function BackupMenu({ t, disabled, onImport, onExport }: {
    t: Translate;
    disabled: boolean;
    onImport: () => void;
    onExport: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};

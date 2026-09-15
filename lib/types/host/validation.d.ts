/** Validation of user input, stored JSON and provider data. */
import { z } from 'zod';
import type { Account, Fund, Holding } from '../types.ts';
export declare const decimalText: z.ZodString;
export declare const signedDecimalText: z.ZodString;
export declare const positiveText: z.ZodString;
export declare const codeSchema: z.ZodString;
export declare const nameSchema: z.ZodString;
export declare const idSchema: z.ZodString;
export declare const versionSchema: z.ZodNumber;
export declare const accountSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strict>;
export declare const holdingSchema: z.ZodObject<{
    id: z.ZodString;
    accountId: z.ZodString;
    fundCode: z.ZodString;
    shares: z.ZodString;
    costPrice: z.ZodString;
    version: z.ZodNumber;
}, z.core.$strict>;
export declare const fundSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    kind: z.ZodEnum<{
        nav: "nav";
        qdii: "qdii";
        money: "money";
    }>;
    currency: z.ZodLiteral<"CNY">;
    fetchedAt: z.ZodISODateTime;
}, z.core.$strict>;
export declare const backupSchema: z.ZodObject<{
    format: z.ZodLiteral<1>;
    accounts: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strict>>;
    holdings: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        accountId: z.ZodString;
        fundCode: z.ZodString;
        shares: z.ZodString;
        costPrice: z.ZodString;
        version: z.ZodNumber;
    }, z.core.$strict>>;
    funds: z.ZodArray<z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        kind: z.ZodEnum<{
            nav: "nav";
            qdii: "qdii";
            money: "money";
        }>;
        currency: z.ZodLiteral<"CNY">;
        fetchedAt: z.ZodISODateTime;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare function parseAccount(value: unknown): Account;
export declare function parseHolding(value: unknown): Holding;
export declare function parseFund(value: unknown): Fund;
export declare function dateString(value: unknown): string;
export declare function todayAt(time: number): string;
export declare function priorCalendarDate(date: string): string;

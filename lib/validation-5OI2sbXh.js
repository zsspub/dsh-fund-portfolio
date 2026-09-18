import { z } from "zod";
import { Decimal } from "decimal.js";
//#region lib/types/host/validation.js
/** Validation of user input, stored JSON and provider data. */
const decimalText = z.string().regex(/^(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/);
const signedDecimalText = z.string().regex(/^-?(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/);
const positiveText = decimalText.refine((value) => new Decimal(value).gt(0), "Must be positive");
const targetRatioText = z.string().regex(/^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/).refine((value) => new Decimal(value).lte(100), "Must be between 0 and 100");
const codeSchema = z.string().regex(/^\d{6}$/);
const nameSchema = z.string().trim().min(1).max(100);
const idSchema = z.string().uuid();
const versionSchema = z.number().int().positive();
const accountSchema = z.object({
	id: idSchema,
	name: nameSchema,
	version: versionSchema
}).strict();
const holdingFields = {
	id: idSchema,
	accountId: idSchema,
	fundCode: codeSchema,
	shares: positiveText,
	costPrice: decimalText,
	version: versionSchema
};
const legacyHoldingSchema = z.object(holdingFields).strict();
const holdingSchema = z.object({
	...holdingFields,
	targetRatio: targetRatioText.nullable()
}).strict();
const fundSchema = z.object({
	code: codeSchema,
	name: nameSchema,
	kind: z.enum([
		"nav",
		"qdii",
		"money"
	]),
	currency: z.literal("CNY"),
	fetchedAt: z.iso.datetime()
}).strict();
const backupFields = {
	accounts: z.array(accountSchema).max(1e3),
	funds: z.array(fundSchema).max(1e4)
};
const backupV1Schema = z.object({
	format: z.literal(1),
	...backupFields,
	holdings: z.array(legacyHoldingSchema).max(1e4)
}).strict();
const backupV2Schema = z.object({
	format: z.literal(2),
	...backupFields,
	holdings: z.array(holdingSchema).max(1e4)
}).strict();
const backupSchema = z.union([backupV1Schema, backupV2Schema]);
function parseAccount(value) {
	return accountSchema.parse(value);
}
function parseHolding(value) {
	return holdingSchema.parse(value);
}
function parseBackup(value) {
	const backup = backupSchema.parse(value);
	return backup.format === 2 ? backup : {
		...backup,
		format: 2,
		holdings: backup.holdings.map((holding) => ({
			...holding,
			targetRatio: null
		}))
	};
}
function parseFund(value) {
	return fundSchema.parse(value);
}
function dateString(value) {
	const text = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(value);
	const parsed = /* @__PURE__ */ new Date(`${text}T00:00:00Z`);
	if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) throw new Error("Invalid provider date");
	return text;
}
function todayAt(time) {
	return new Date(time + 8 * 36e5).toISOString().slice(0, 10);
}
function priorCalendarDate(date) {
	return (/* @__PURE__ */ new Date(Date.parse(`${date}T00:00:00Z`) - 864e5)).toISOString().slice(0, 10);
}
//#endregion
export { nameSchema as a, parseFund as c, priorCalendarDate as d, signedDecimalText as f, versionSchema as h, idSchema as i, parseHolding as l, todayAt as m, dateString as n, parseAccount as o, targetRatioText as p, decimalText as r, parseBackup as s, codeSchema as t, positiveText as u };

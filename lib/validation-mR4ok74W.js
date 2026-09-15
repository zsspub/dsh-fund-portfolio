import { z } from "zod";
import { Decimal } from "decimal.js";
//#region lib/types/host/validation.js
/** Validation of user input, stored JSON and provider data. */
const decimalText = z.string().regex(/^(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/);
const signedDecimalText = z.string().regex(/^-?(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/);
const positiveText = decimalText.refine((value) => new Decimal(value).gt(0), "Must be positive");
const codeSchema = z.string().regex(/^\d{6}$/);
const nameSchema = z.string().trim().min(1).max(100);
const idSchema = z.string().uuid();
const versionSchema = z.number().int().positive();
const accountSchema = z.object({
	id: idSchema,
	name: nameSchema,
	version: versionSchema
}).strict();
const holdingSchema = z.object({
	id: idSchema,
	accountId: idSchema,
	fundCode: codeSchema,
	shares: positiveText,
	costPrice: decimalText,
	version: versionSchema
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
const backupSchema = z.object({
	format: z.literal(1),
	accounts: z.array(accountSchema).max(1e3),
	holdings: z.array(holdingSchema).max(1e4),
	funds: z.array(fundSchema).max(1e4)
}).strict();
function parseAccount(value) {
	return accountSchema.parse(value);
}
function parseHolding(value) {
	return holdingSchema.parse(value);
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
export { idSchema as a, parseFund as c, priorCalendarDate as d, signedDecimalText as f, decimalText as i, parseHolding as l, versionSchema as m, codeSchema as n, nameSchema as o, todayAt as p, dateString as r, parseAccount as s, backupSchema as t, positiveText as u };

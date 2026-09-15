/** Validation of user input, stored JSON and provider data. */
import { z } from 'zod'
import { Decimal } from 'decimal.js'
import type { Account, Fund, Holding } from '../types.ts'

export const decimalText = z.string().regex(/^(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/)
export const signedDecimalText = z.string().regex(/^-?(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/)
export const positiveText = decimalText.refine(value => new Decimal(value).gt(0), 'Must be positive')
export const codeSchema = z.string().regex(/^\d{6}$/)
export const nameSchema = z.string().trim().min(1).max(100)
export const idSchema = z.string().uuid()
export const versionSchema = z.number().int().positive()
export const accountSchema = z.object({ id: idSchema, name: nameSchema, version: versionSchema }).strict()
export const holdingSchema = z.object({
  id: idSchema, accountId: idSchema, fundCode: codeSchema,
  shares: positiveText, costPrice: decimalText, version: versionSchema,
}).strict()
export const fundSchema = z.object({
  code: codeSchema, name: nameSchema, kind: z.enum(['nav', 'qdii', 'money']),
  currency: z.literal('CNY'), fetchedAt: z.iso.datetime(),
}).strict()
export const backupSchema = z.object({
  format: z.literal(1),
  accounts: z.array(accountSchema).max(1000),
  holdings: z.array(holdingSchema).max(10000),
  funds: z.array(fundSchema).max(10000),
}).strict()

export function parseAccount(value: unknown): Account {
  return accountSchema.parse(value) as Account
}

export function parseHolding(value: unknown): Holding {
  return holdingSchema.parse(value) as Holding
}

export function parseFund(value: unknown): Fund {
  return fundSchema.parse(value)
}

export function dateString(value: unknown): string {
  const text = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).parse(value)
  const parsed = new Date(`${text}T00:00:00Z`)
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== text) {
    throw new Error('Invalid provider date')
  }
  return text
}

export function todayAt(time: number): string {
  return new Date(time + 8 * 3600_000).toISOString().slice(0, 10)
}

export function priorCalendarDate(date: string): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) - 86400_000).toISOString().slice(0, 10)
}

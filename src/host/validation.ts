/** Validation of user input, stored JSON and provider data. */
import { z } from 'zod'
import { Decimal } from 'decimal.js'
import type { Account, BackupV2, Fund, Holding } from '../types.ts'

export const decimalText = z.string().regex(/^(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/)
export const signedDecimalText = z.string().regex(/^-?(?:0|[1-9]\d{0,17})(?:\.\d{1,12})?$/)
export const positiveText = decimalText.refine(value => new Decimal(value).gt(0), 'Must be positive')
export const targetRatioText = z.string()
  .regex(/^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/)
  .refine(value => new Decimal(value).lte(100), 'Must be between 0 and 100')
export const codeSchema = z.string().regex(/^\d{6}$/)
export const nameSchema = z.string().trim().min(1).max(100)
export const idSchema = z.string().uuid()
export const versionSchema = z.number().int().positive()
export const accountSchema = z.object({ id: idSchema, name: nameSchema, version: versionSchema }).strict()
const holdingFields = {
  id: idSchema, accountId: idSchema, fundCode: codeSchema,
  shares: positiveText, costPrice: decimalText, version: versionSchema,
}
export const legacyHoldingSchema = z.object(holdingFields).strict()
export const holdingSchema = z.object({ ...holdingFields, targetRatio: targetRatioText.nullable() }).strict()
export const fundSchema = z.object({
  code: codeSchema, name: nameSchema, kind: z.enum(['nav', 'qdii', 'money']),
  currency: z.literal('CNY'), fetchedAt: z.iso.datetime(),
}).strict()
const backupFields = {
  accounts: z.array(accountSchema).max(1000),
  funds: z.array(fundSchema).max(10000),
}
const backupV1Schema = z.object({
  format: z.literal(1),
  ...backupFields,
  holdings: z.array(legacyHoldingSchema).max(10000),
}).strict()
const backupV2Schema = z.object({
  format: z.literal(2),
  ...backupFields,
  holdings: z.array(holdingSchema).max(10000),
}).strict()
export const backupSchema = z.union([backupV1Schema, backupV2Schema])

export function parseAccount(value: unknown): Account {
  return accountSchema.parse(value) as Account
}

export function parseHolding(value: unknown): Holding {
  return holdingSchema.parse(value) as Holding
}

export function parseBackup(value: unknown): BackupV2 {
  const backup = backupSchema.parse(value)
  return backup.format === 2 ? backup as BackupV2 : {
    ...backup,
    format: 2,
    holdings: backup.holdings.map(holding => ({ ...holding, targetRatio: null })),
  } as BackupV2
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

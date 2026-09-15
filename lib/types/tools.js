import { defineTool } from '@deepseek-ai/dsh-tools';
import { z } from 'zod';
import { codeSchema, decimalText, idSchema, nameSchema, positiveText, versionSchema } from "./host/validation.js";
export const name = 'fund-portfolio-tools';
export const inject = ['fundPortfolio', 'tools', 'approval'];
const text = { type: 'string', required: true };
const version = { type: 'number', required: true, description: 'Expected record version from the latest list; refresh after a conflict.' };
const holdingFields = {
    accountId: text, fundCode: text,
    shares: { ...text, description: 'Positive decimal string for confirmed current shares.' },
    costPrice: { ...text, description: 'Nonnegative decimal string for average cost per share; money funds use 1.' },
};
const holdingInput = z.object({ accountId: idSchema, fundCode: codeSchema, shares: positiveText, costPrice: decimalText });
const portfolioInput = z.object({ accountId: idSchema.optional(), force: z.boolean().optional() });
export function apply(ctx) {
    function register(toolName, description, parameters, schema, execute, confirmation) {
        ctx.effect(() => ctx.tools.register(defineTool({
            name: toolName, description, parameters,
            output: { schema: { type: 'string' }, render: (_args, result) => [{ type: 'text', text: result }] },
            async execute(args, exec) {
                const input = schema.parse(args);
                const reason = confirmation?.(input);
                if (reason) {
                    if (!exec.agent)
                        throw new Error('Destructive operations require an interactive Agent');
                    const outcome = await ctx.approval.request({
                        agent: exec.agent, callId: exec.callId, toolName, reason, signal: exec.signal,
                    });
                    if (outcome !== 'allowed-once')
                        throw new Error(`Operation not approved: ${outcome}`);
                }
                exec.signal.throwIfAborted();
                return JSON.stringify(await execute(input, exec));
            },
            presentCall: args => ({ card: 'generic', title: toolName, kind: 'other', rawInput: args }),
        })), toolName);
    }
    const service = ctx.fundPortfolio;
    register('fund_account_list', '列出基金账户及记录版本。', {}, z.object({}), (_input, exec) => service.accountList({}, exec.signal));
    register('fund_account_create', '新增基金账户，例如支付宝或天天基金。', { name: text }, z.object({ name: nameSchema }), (input, exec) => service.accountCreate(input, exec.signal));
    register('fund_account_update', '重命名账户；传入最新版本，冲突时先刷新。', { id: text, version, name: text }, z.object({ id: idSchema, version: versionSchema, name: nameSchema }), (input, exec) => service.accountUpdate({ ...input, id: input.id }, exec.signal));
    register('fund_account_delete', '删除空账户，需要用户原生确认；先列出账户获取最新版本。', { id: text, version }, z.object({ id: idSchema, version: versionSchema }), (input, exec) => service.accountDelete({ ...input, id: input.id }, exec.signal), input => `删除空基金账户 ${input.id}（版本 ${input.version}）？此操作不可撤销。`);
    register('fund_lookup', '校验六位基金代码并获取名称和类别；新增前向用户确认该基金。', { code: text }, z.object({ code: codeSchema }), (input, exec) => service.lookup(input, exec.signal));
    register('fund_holding_list', '列出当前持仓、账户 ID 和版本；不代表交易账本。', {}, z.object({}), (_input, exec) => service.holdingList({}, exec.signal));
    register('fund_holding_add', '新增已查证且经用户确认的基金持仓。每账户同一基金只允许一条，不自动合并。', holdingFields, holdingInput, (input, exec) => service.holdingAdd({ ...input, accountId: input.accountId }, exec.signal));
    register('fund_holding_update', '替换当前持仓；金额及份额必须是十进制字符串，传入最新版本。不推导申赎历史。', { ...holdingFields, id: text, version }, holdingInput.extend({ id: idSchema, version: versionSchema }), (input, exec) => service.holdingUpdate({ ...input, id: input.id, accountId: input.accountId }, exec.signal));
    register('fund_holding_delete', '删除持仓，需要用户原生确认；先查询并向用户说明基金及份额。', { id: text, version }, z.object({ id: idSchema, version: versionSchema }), (input, exec) => service.holdingDelete({ ...input, id: input.id }, exec.signal), input => `永久删除基金持仓 ${input.id}（版本 ${input.version}）？此操作不可撤销。`);
    const summaryDescription = '按当前份额测算收益，不等于到账收益。结果区分当日已公布、当日估算和缺失；必须保留日期及覆盖数量。QDII参考估值和货币七日年化不得当作今日收益。';
    register('fund_portfolio_summary', summaryDescription, { accountId: { type: 'string' }, force: { type: 'boolean' } }, portfolioInput, (input, exec) => service.summary({ ...input, accountId: input.accountId, refresh: true }, exec.signal));
    register('fund_quote_refresh', `刷新行情并返回组合。${summaryDescription}`, { accountId: { type: 'string' } }, portfolioInput, (input, exec) => service.summary({ accountId: input.accountId, force: true, refresh: true }, exec.signal));
    register('fund_portfolio_export', '导出含私人账户和持仓的版本化 JSON；使用文件工具保存，不上传公开仓库。', {}, z.object({}), (_input, exec) => service.exportData({}, exec.signal));
    register('fund_portfolio_import', '先以 action=preview 预览备份；再次 action=commit 携带预览 token 和 merge/replace 模式，原生确认后事务导入。冲突不静默覆盖。', { json: text, action: { ...text, enum: ['preview', 'commit'] }, previewToken: { type: 'string' }, mode: { type: 'string', enum: ['merge', 'replace'] } }, z.object({ json: z.string(), action: z.enum(['preview', 'commit']), previewToken: z.string().optional(), mode: z.enum(['merge', 'replace']).optional() }), (input, exec) => {
        if (input.action === 'preview')
            return service.previewImport(input, exec.signal);
        if (!input.previewToken || !input.mode)
            throw new Error('Commit requires previewToken and mode');
        return service.importData({ json: input.json, previewToken: input.previewToken, mode: input.mode }, exec.signal);
    }, input => input.action === 'commit' ? `确认导入基金备份（${input.mode}）？replace 会替换全部账户和持仓。` : null);
}

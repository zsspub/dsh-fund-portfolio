window.__ModuleLoader__.load({
	id: "dsh-fund-portfolio",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/core.js
		var _a$1;
		function $constructor(name, initializer, params) {
			function init(inst, def) {
				if (!inst._zod) Object.defineProperty(inst, "_zod", {
					value: {
						def,
						constr: _,
						traits: /* @__PURE__ */ new Set()
					},
					enumerable: false
				});
				if (inst._zod.traits.has(name)) return;
				inst._zod.traits.add(name);
				initializer(inst, def);
				const proto = _.prototype;
				const keys = Object.keys(proto);
				for (let i = 0; i < keys.length; i++) {
					const k = keys[i];
					if (!(k in inst)) inst[k] = proto[k].bind(inst);
				}
			}
			const Parent = params?.Parent ?? Object;
			class Definition extends Parent {}
			Object.defineProperty(Definition, "name", { value: name });
			function _(def) {
				var _a;
				const inst = params?.Parent ? new Definition() : this;
				init(inst, def);
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				for (const fn of inst._zod.deferred) fn();
				return inst;
			}
			Object.defineProperty(_, "init", { value: init });
			Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
				if (params?.Parent && inst instanceof params.Parent) return true;
				return inst?._zod?.traits?.has(name);
			} });
			Object.defineProperty(_, "name", { value: name });
			return _;
		}
		var $ZodAsyncError = class extends Error {
			constructor() {
				super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
			}
		};
		var $ZodEncodeError = class extends Error {
			constructor(name) {
				super(`Encountered unidirectional transform during encode: ${name}`);
				this.name = "ZodEncodeError";
			}
		};
		(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
		const globalConfig = globalThis.__zod_globalConfig;
		function config$1(newConfig) {
			if (newConfig) Object.assign(globalConfig, newConfig);
			return globalConfig;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/util.js
		function getEnumValues(entries) {
			const numericValues = Object.values(entries).filter((v) => typeof v === "number");
			return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
		}
		function jsonStringifyReplacer(_, value) {
			if (typeof value === "bigint") return value.toString();
			return value;
		}
		function cached(getter) {
			return { get value() {
				{
					const value = getter();
					Object.defineProperty(this, "value", { value });
					return value;
				}
				throw new Error("cached value already set");
			} };
		}
		function nullish(input) {
			return input === null || input === void 0;
		}
		function cleanRegex(source) {
			const start = source.startsWith("^") ? 1 : 0;
			const end = source.endsWith("$") ? source.length - 1 : source.length;
			return source.slice(start, end);
		}
		function floatSafeRemainder(val, step) {
			const ratio = val / step;
			const roundedRatio = Math.round(ratio);
			const tolerance = Number.EPSILON * Math.max(Math.abs(ratio), 1);
			if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
			return ratio - roundedRatio;
		}
		const EVALUATING = /* @__PURE__*/ Symbol("evaluating");
		function defineLazy(object, key, getter) {
			let value = void 0;
			Object.defineProperty(object, key, {
				get() {
					if (value === EVALUATING) return;
					if (value === void 0) {
						value = EVALUATING;
						value = getter();
					}
					return value;
				},
				set(v) {
					Object.defineProperty(object, key, { value: v });
				},
				configurable: true
			});
		}
		function assignProp(target, prop, value) {
			Object.defineProperty(target, prop, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
		}
		function mergeDefs(...defs) {
			const mergedDescriptors = {};
			for (const def of defs) {
				const descriptors = Object.getOwnPropertyDescriptors(def);
				Object.assign(mergedDescriptors, descriptors);
			}
			return Object.defineProperties({}, mergedDescriptors);
		}
		function esc(str) {
			return JSON.stringify(str);
		}
		function slugify(input) {
			return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
		}
		const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
		function isObject(data) {
			return typeof data === "object" && data !== null && !Array.isArray(data);
		}
		const allowsEval = /* @__PURE__*/ cached(() => {
			if (globalConfig.jitless) return false;
			if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
			try {
				new Function("");
				return true;
			} catch (_) {
				return false;
			}
		});
		function isPlainObject(o) {
			if (isObject(o) === false) return false;
			const ctor = o.constructor;
			if (ctor === void 0) return true;
			if (typeof ctor !== "function") return true;
			const prot = ctor.prototype;
			if (isObject(prot) === false) return false;
			if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
			return true;
		}
		function shallowClone(o) {
			if (isPlainObject(o)) return { ...o };
			if (Array.isArray(o)) return [...o];
			if (o instanceof Map) return new Map(o);
			if (o instanceof Set) return new Set(o);
			return o;
		}
		const propertyKeyTypes = /* @__PURE__*/ new Set([
			"string",
			"number",
			"symbol"
		]);
		function escapeRegex(str) {
			return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
		function clone$1(inst, def, params) {
			const cl = new inst._zod.constr(def ?? inst._zod.def);
			if (!def || params?.parent) cl._zod.parent = inst;
			return cl;
		}
		function normalizeParams(_params) {
			const params = _params;
			if (!params) return {};
			if (typeof params === "string") return { error: () => params };
			if (params?.message !== void 0) {
				if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
				params.error = params.message;
			}
			delete params.message;
			if (typeof params.error === "string") return {
				...params,
				error: () => params.error
			};
			return params;
		}
		function optionalKeys(shape) {
			return Object.keys(shape).filter((k) => {
				return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
			});
		}
		const NUMBER_FORMAT_RANGES = {
			safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
			int32: [-2147483648, 2147483647],
			uint32: [0, 4294967295],
			float32: [-34028234663852886e22, 34028234663852886e22],
			float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
		};
		function pick(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
			return clone$1(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = {};
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						newShape[key] = currDef.shape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function omit(schema, mask) {
			const currDef = schema._zod.def;
			const checks = currDef.checks;
			if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
			return clone$1(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const newShape = { ...schema._zod.def.shape };
					for (const key in mask) {
						if (!(key in currDef.shape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						delete newShape[key];
					}
					assignProp(this, "shape", newShape);
					return newShape;
				},
				checks: []
			}));
		}
		function extend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) {
				const existingShape = schema._zod.def.shape;
				for (const key in shape) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
			}
			return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function safeExtend(schema, shape) {
			if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
			return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
				const _shape = {
					...schema._zod.def.shape,
					...shape
				};
				assignProp(this, "shape", _shape);
				return _shape;
			} }));
		}
		function merge(a, b) {
			if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
			return clone$1(a, mergeDefs(a._zod.def, {
				get shape() {
					const _shape = {
						...a._zod.def.shape,
						...b._zod.def.shape
					};
					assignProp(this, "shape", _shape);
					return _shape;
				},
				get catchall() {
					return b._zod.def.catchall;
				},
				checks: b._zod.def.checks ?? []
			}));
		}
		function partial(Class, schema, mask) {
			const checks = schema._zod.def.checks;
			if (checks && checks.length > 0) throw new Error(".partial() cannot be used on object schemas containing refinements");
			return clone$1(schema, mergeDefs(schema._zod.def, {
				get shape() {
					const oldShape = schema._zod.def.shape;
					const shape = { ...oldShape };
					if (mask) for (const key in mask) {
						if (!(key in oldShape)) throw new Error(`Unrecognized key: "${key}"`);
						if (!mask[key]) continue;
						shape[key] = Class ? new Class({
							type: "optional",
							innerType: oldShape[key]
						}) : oldShape[key];
					}
					else for (const key in oldShape) shape[key] = Class ? new Class({
						type: "optional",
						innerType: oldShape[key]
					}) : oldShape[key];
					assignProp(this, "shape", shape);
					return shape;
				},
				checks: []
			}));
		}
		function required(Class, schema, mask) {
			return clone$1(schema, mergeDefs(schema._zod.def, { get shape() {
				const oldShape = schema._zod.def.shape;
				const shape = { ...oldShape };
				if (mask) for (const key in mask) {
					if (!(key in shape)) throw new Error(`Unrecognized key: "${key}"`);
					if (!mask[key]) continue;
					shape[key] = new Class({
						type: "nonoptional",
						innerType: oldShape[key]
					});
				}
				else for (const key in oldShape) shape[key] = new Class({
					type: "nonoptional",
					innerType: oldShape[key]
				});
				assignProp(this, "shape", shape);
				return shape;
			} }));
		}
		function aborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
			return false;
		}
		function explicitlyAborted(x, startIndex = 0) {
			if (x.aborted === true) return true;
			for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
			return false;
		}
		function prefixIssues(path, issues) {
			return issues.map((iss) => {
				var _a;
				(_a = iss).path ?? (_a.path = []);
				iss.path.unshift(path);
				return iss;
			});
		}
		function unwrapMessage(message) {
			return typeof message === "string" ? message : message?.message;
		}
		function finalizeIssue(iss, ctx, config) {
			const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
			const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
			rest.path ?? (rest.path = []);
			rest.message = message;
			if (ctx?.reportInput) rest.input = _input;
			return rest;
		}
		function getLengthableOrigin(input) {
			if (Array.isArray(input)) return "array";
			if (typeof input === "string") return "string";
			return "unknown";
		}
		function issue(...args) {
			const [iss, input, inst] = args;
			if (typeof iss === "string") return {
				message: iss,
				code: "custom",
				input,
				inst
			};
			return { ...iss };
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/errors.js
		const initializer$1 = (inst, def) => {
			inst.name = "$ZodError";
			Object.defineProperty(inst, "_zod", {
				value: inst._zod,
				enumerable: false
			});
			Object.defineProperty(inst, "issues", {
				value: def,
				enumerable: false
			});
			inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
			Object.defineProperty(inst, "toString", {
				value: () => inst.message,
				enumerable: false
			});
		};
		const $ZodError = $constructor("$ZodError", initializer$1);
		const $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
		function flattenError(error, mapper = (issue) => issue.message) {
			const fieldErrors = {};
			const formErrors = [];
			for (const sub of error.issues) if (sub.path.length > 0) {
				fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
				fieldErrors[sub.path[0]].push(mapper(sub));
			} else formErrors.push(mapper(sub));
			return {
				formErrors,
				fieldErrors
			};
		}
		function formatError(error, mapper = (issue) => issue.message) {
			const fieldErrors = { _errors: [] };
			const processError = (error, path = []) => {
				for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
				else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
				else {
					const fullpath = [...path, ...issue.path];
					if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
					else {
						let curr = fieldErrors;
						let i = 0;
						while (i < fullpath.length) {
							const el = fullpath[i];
							if (!(i === fullpath.length - 1)) curr[el] = curr[el] || { _errors: [] };
							else {
								curr[el] = curr[el] || { _errors: [] };
								curr[el]._errors.push(mapper(issue));
							}
							curr = curr[el];
							i++;
						}
					}
				}
			};
			processError(error);
			return fieldErrors;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/parse.js
		const _parse = (_Err) => (schema, value, _ctx, _params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			if (result.issues.length) {
				const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())));
				captureStackTrace(e, _params?.callee);
				throw e;
			}
			return result.value;
		};
		const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			if (result.issues.length) {
				const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())));
				captureStackTrace(e, params?.callee);
				throw e;
			}
			return result.value;
		};
		const _safeParse = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: false
			} : { async: false };
			const result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) throw new $ZodAsyncError();
			return result.issues.length ? {
				success: false,
				error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParse$1 = /* @__PURE__*/ _safeParse($ZodRealError);
		const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				async: true
			} : { async: true };
			let result = schema._zod.run({
				value,
				issues: []
			}, ctx);
			if (result instanceof Promise) result = await result;
			return result.issues.length ? {
				success: false,
				error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())))
			} : {
				success: true,
				data: result.value
			};
		};
		const safeParseAsync$1 = /* @__PURE__*/ _safeParseAsync($ZodRealError);
		const _encode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parse(_Err)(schema, value, ctx);
		};
		const _decode = (_Err) => (schema, value, _ctx) => {
			return _parse(_Err)(schema, value, _ctx);
		};
		const _encodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _parseAsync(_Err)(schema, value, ctx);
		};
		const _decodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _parseAsync(_Err)(schema, value, _ctx);
		};
		const _safeEncode = (_Err) => (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParse(_Err)(schema, value, ctx);
		};
		const _safeDecode = (_Err) => (schema, value, _ctx) => {
			return _safeParse(_Err)(schema, value, _ctx);
		};
		const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
			const ctx = _ctx ? {
				..._ctx,
				direction: "backward"
			} : { direction: "backward" };
			return _safeParseAsync(_Err)(schema, value, ctx);
		};
		const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
			return _safeParseAsync(_Err)(schema, value, _ctx);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/regexes.js
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const cuid = /^[cC][0-9a-z]{6,}$/;
		const cuid2 = /^[0-9a-z]+$/;
		const ulid = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
		const xid = /^[0-9a-vA-V]{20}$/;
		const ksuid = /^[A-Za-z0-9]{27}$/;
		const nanoid = /^[a-zA-Z0-9_-]{21}$/;
		/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
		const duration$1 = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
		/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
		const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
		/** Returns a regex for validating an RFC 9562/4122 UUID.
		*
		* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
		const uuid = (version) => {
			if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
			return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
		};
		/** Practical email validation */
		const email = /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+\-\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
		const _emoji$1 = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
		function emoji() {
			return new RegExp(_emoji$1, "u");
		}
		const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
		const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
		const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
		const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|::|([0-9a-fA-F]{1,4})?::([0-9a-fA-F]{1,4}:?){0,6})\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
		const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
		const base64url = /^[A-Za-z0-9_-]*$/;
		const httpProtocol = /^https?$/;
		const e164 = /^\+[1-9]\d{6,14}$/;
		const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
		const date$1 = /*@__PURE__*/ new RegExp(`^${dateSource}$`);
		function timeSource(args) {
			const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
			return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
		}
		function time$1(args) {
			return new RegExp(`^${timeSource(args)}$`);
		}
		function datetime$1(args) {
			const time = timeSource({ precision: args.precision });
			const opts = ["Z"];
			if (args.local) opts.push("");
			if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
			const timeRegex = `${time}(?:${opts.join("|")})`;
			return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
		}
		const string$1 = (params) => {
			const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
			return new RegExp(`^${regex}$`);
		};
		const integer = /^-?\d+$/;
		const number$1 = /^-?\d+(?:\.\d+)?$/;
		const boolean$1 = /^(?:true|false)$/i;
		const _undefined$2 = /^undefined$/i;
		const lowercase = /^[^A-Z]*$/;
		const uppercase = /^[^a-z]*$/;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/checks.js
		const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
			var _a;
			inst._zod ?? (inst._zod = {});
			inst._zod.def = def;
			(_a = inst._zod).onattach ?? (_a.onattach = []);
		});
		const numericOriginMap = {
			number: "number",
			bigint: "bigint",
			object: "date"
		};
		const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.maximum : bag.exclusiveMaximum) ?? Number.POSITIVE_INFINITY;
				if (def.value < curr) if (def.inclusive) bag.maximum = def.value;
				else bag.exclusiveMaximum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
			$ZodCheck.init(inst, def);
			const origin = numericOriginMap[typeof def.value];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				const curr = (def.inclusive ? bag.minimum : bag.exclusiveMinimum) ?? Number.NEGATIVE_INFINITY;
				if (def.value > curr) if (def.inclusive) bag.minimum = def.value;
				else bag.exclusiveMinimum = def.value;
			});
			inst._zod.check = (payload) => {
				if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
					input: payload.value,
					inclusive: def.inclusive,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				var _a;
				(_a = inst._zod.bag).multipleOf ?? (_a.multipleOf = def.value);
			});
			inst._zod.check = (payload) => {
				if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
				if (typeof payload.value === "bigint" ? payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
				payload.issues.push({
					origin: typeof payload.value,
					code: "not_multiple_of",
					divisor: def.value,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
			$ZodCheck.init(inst, def);
			def.format = def.format || "float64";
			const isInt = def.format?.includes("int");
			const origin = isInt ? "int" : "number";
			const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				bag.minimum = minimum;
				bag.maximum = maximum;
				if (isInt) bag.pattern = integer;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (isInt) {
					if (!Number.isInteger(input)) {
						payload.issues.push({
							expected: origin,
							format: def.format,
							code: "invalid_type",
							continue: false,
							input,
							inst
						});
						return;
					}
					if (!Number.isSafeInteger(input)) {
						if (input > 0) payload.issues.push({
							input,
							code: "too_big",
							maximum: Number.MAX_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						else payload.issues.push({
							input,
							code: "too_small",
							minimum: Number.MIN_SAFE_INTEGER,
							note: "Integers must be within the safe integer range.",
							inst,
							origin,
							inclusive: true,
							continue: !def.abort
						});
						return;
					}
				}
				if (input < minimum) payload.issues.push({
					origin: "number",
					input,
					code: "too_small",
					minimum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
				if (input > maximum) payload.issues.push({
					origin: "number",
					input,
					code: "too_big",
					maximum,
					inclusive: true,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
				if (def.maximum < curr) inst._zod.bag.maximum = def.maximum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length <= def.maximum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_big",
					maximum: def.maximum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const curr = inst._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
				if (def.minimum > curr) inst._zod.bag.minimum = def.minimum;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				if (input.length >= def.minimum) return;
				const origin = getLengthableOrigin(input);
				payload.issues.push({
					origin,
					code: "too_small",
					minimum: def.minimum,
					inclusive: true,
					input,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
			var _a;
			$ZodCheck.init(inst, def);
			(_a = inst._zod.def).when ?? (_a.when = (payload) => {
				const val = payload.value;
				return !nullish(val) && val.length !== void 0;
			});
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.minimum = def.length;
				bag.maximum = def.length;
				bag.length = def.length;
			});
			inst._zod.check = (payload) => {
				const input = payload.value;
				const length = input.length;
				if (length === def.length) return;
				const origin = getLengthableOrigin(input);
				const tooBig = length > def.length;
				payload.issues.push({
					origin,
					...tooBig ? {
						code: "too_big",
						maximum: def.length
					} : {
						code: "too_small",
						minimum: def.length
					},
					inclusive: true,
					exact: true,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
			var _a, _b;
			$ZodCheck.init(inst, def);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.format = def.format;
				if (def.pattern) {
					bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
					bag.patterns.add(def.pattern);
				}
			});
			if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: def.format,
					input: payload.value,
					...def.pattern ? { pattern: def.pattern.toString() } : {},
					inst,
					continue: !def.abort
				});
			});
			else (_b = inst._zod).check ?? (_b.check = () => {});
		});
		const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				def.pattern.lastIndex = 0;
				if (def.pattern.test(payload.value)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "regex",
					input: payload.value,
					pattern: def.pattern.toString(),
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
			def.pattern ?? (def.pattern = lowercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
			def.pattern ?? (def.pattern = uppercase);
			$ZodCheckStringFormat.init(inst, def);
		});
		const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
			$ZodCheck.init(inst, def);
			const escapedRegex = escapeRegex(def.includes);
			const pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position}}${escapedRegex}` : escapedRegex);
			def.pattern = pattern;
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.includes(def.includes, def.position)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "includes",
					includes: def.includes,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.startsWith(def.prefix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "starts_with",
					prefix: def.prefix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
			$ZodCheck.init(inst, def);
			const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
			def.pattern ?? (def.pattern = pattern);
			inst._zod.onattach.push((inst) => {
				const bag = inst._zod.bag;
				bag.patterns ?? (bag.patterns = /* @__PURE__ */ new Set());
				bag.patterns.add(pattern);
			});
			inst._zod.check = (payload) => {
				if (payload.value.endsWith(def.suffix)) return;
				payload.issues.push({
					origin: "string",
					code: "invalid_format",
					format: "ends_with",
					suffix: def.suffix,
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
			$ZodCheck.init(inst, def);
			inst._zod.check = (payload) => {
				payload.value = def.tx(payload.value);
			};
		});
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/doc.js
		var Doc = class {
			constructor(args = []) {
				this.content = [];
				this.indent = 0;
				if (this) this.args = args;
			}
			indented(fn) {
				this.indent += 1;
				fn(this);
				this.indent -= 1;
			}
			write(arg) {
				if (typeof arg === "function") {
					arg(this, { execution: "sync" });
					arg(this, { execution: "async" });
					return;
				}
				const lines = arg.split("\n").filter((x) => x);
				const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
				const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
				for (const line of dedented) this.content.push(line);
			}
			compile() {
				const F = Function;
				const args = this?.args;
				const lines = [...(this?.content ?? [``]).map((x) => `  ${x}`)];
				return new F(...args, lines.join("\n"));
			}
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/versions.js
		const version = {
			major: 4,
			minor: 4,
			patch: 3
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/schemas.js
		const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
			var _a;
			inst ?? (inst = {});
			inst._zod.def = def;
			inst._zod.bag = inst._zod.bag || {};
			inst._zod.version = version;
			const checks = [...inst._zod.def.checks ?? []];
			if (inst._zod.traits.has("$ZodCheck")) checks.unshift(inst);
			for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
			if (checks.length === 0) {
				(_a = inst._zod).deferred ?? (_a.deferred = []);
				inst._zod.deferred?.push(() => {
					inst._zod.run = inst._zod.parse;
				});
			} else {
				const runChecks = (payload, checks, ctx) => {
					let isAborted = aborted(payload);
					let asyncResult;
					for (const ch of checks) {
						if (ch._zod.def.when) {
							if (explicitlyAborted(payload)) continue;
							if (!ch._zod.def.when(payload)) continue;
						} else if (isAborted) continue;
						const currLen = payload.issues.length;
						const _ = ch._zod.check(payload);
						if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
						if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
							await _;
							if (payload.issues.length === currLen) return;
							if (!isAborted) isAborted = aborted(payload, currLen);
						});
						else {
							if (payload.issues.length === currLen) continue;
							if (!isAborted) isAborted = aborted(payload, currLen);
						}
					}
					if (asyncResult) return asyncResult.then(() => {
						return payload;
					});
					return payload;
				};
				const handleCanaryResult = (canary, payload, ctx) => {
					if (aborted(canary)) {
						canary.aborted = true;
						return canary;
					}
					const checkResult = runChecks(payload, checks, ctx);
					if (checkResult instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
					}
					return inst._zod.parse(checkResult, ctx);
				};
				inst._zod.run = (payload, ctx) => {
					if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
					if (ctx.direction === "backward") {
						const canary = inst._zod.parse({
							value: payload.value,
							issues: []
						}, {
							...ctx,
							skipChecks: true
						});
						if (canary instanceof Promise) return canary.then((canary) => {
							return handleCanaryResult(canary, payload, ctx);
						});
						return handleCanaryResult(canary, payload, ctx);
					}
					const result = inst._zod.parse(payload, ctx);
					if (result instanceof Promise) {
						if (ctx.async === false) throw new $ZodAsyncError();
						return result.then((result) => runChecks(result, checks, ctx));
					}
					return runChecks(result, checks, ctx);
				};
			}
			defineLazy(inst, "~standard", () => ({
				validate: (value) => {
					try {
						const r = safeParse$1(inst, value);
						return r.success ? { value: r.data } : { issues: r.error?.issues };
					} catch (_) {
						return safeParseAsync$1(inst, value).then((r) => r.success ? { value: r.data } : { issues: r.error?.issues });
					}
				},
				vendor: "zod",
				version: 1
			}));
		});
		const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
			inst._zod.parse = (payload, _) => {
				if (def.coerce) try {
					payload.value = String(payload.value);
				} catch (_) {}
				if (typeof payload.value === "string") return payload;
				payload.issues.push({
					expected: "string",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
			$ZodCheckStringFormat.init(inst, def);
			$ZodString.init(inst, def);
		});
		const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
			def.pattern ?? (def.pattern = guid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
			if (def.version) {
				const v = {
					v1: 1,
					v2: 2,
					v3: 3,
					v4: 4,
					v5: 5,
					v6: 6,
					v7: 7,
					v8: 8
				}[def.version];
				if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
				def.pattern ?? (def.pattern = uuid(v));
			} else def.pattern ?? (def.pattern = uuid());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
			def.pattern ?? (def.pattern = email);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				try {
					const trimmed = payload.value.trim();
					if (!def.normalize && def.protocol?.source === httpProtocol.source) {
						if (!/^https?:\/\//i.test(trimmed)) {
							payload.issues.push({
								code: "invalid_format",
								format: "url",
								note: "Invalid URL format",
								input: payload.value,
								inst,
								continue: !def.abort
							});
							return;
						}
					}
					const url = new URL(trimmed);
					if (def.hostname) {
						def.hostname.lastIndex = 0;
						if (!def.hostname.test(url.hostname)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid hostname",
							pattern: def.hostname.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.protocol) {
						def.protocol.lastIndex = 0;
						if (!def.protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol)) payload.issues.push({
							code: "invalid_format",
							format: "url",
							note: "Invalid protocol",
							pattern: def.protocol.source,
							input: payload.value,
							inst,
							continue: !def.abort
						});
					}
					if (def.normalize) payload.value = url.href;
					else payload.value = trimmed;
					return;
				} catch (_) {
					payload.issues.push({
						code: "invalid_format",
						format: "url",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
			def.pattern ?? (def.pattern = emoji());
			$ZodStringFormat.init(inst, def);
		});
		const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
			def.pattern ?? (def.pattern = nanoid);
			$ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
			def.pattern ?? (def.pattern = cuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
			def.pattern ?? (def.pattern = cuid2);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
			def.pattern ?? (def.pattern = ulid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
			def.pattern ?? (def.pattern = xid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
			def.pattern ?? (def.pattern = ksuid);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
			def.pattern ?? (def.pattern = datetime$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
			def.pattern ?? (def.pattern = date$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
			def.pattern ?? (def.pattern = time$1(def));
			$ZodStringFormat.init(inst, def);
		});
		const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
			def.pattern ?? (def.pattern = duration$1);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
			def.pattern ?? (def.pattern = ipv4);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv4`;
		});
		const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
			def.pattern ?? (def.pattern = ipv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.format = `ipv6`;
			inst._zod.check = (payload) => {
				try {
					new URL(`http://[${payload.value}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "ipv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv4);
			$ZodStringFormat.init(inst, def);
		});
		const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
			def.pattern ?? (def.pattern = cidrv6);
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				const parts = payload.value.split("/");
				try {
					if (parts.length !== 2) throw new Error();
					const [address, prefix] = parts;
					if (!prefix) throw new Error();
					const prefixNum = Number(prefix);
					if (`${prefixNum}` !== prefix) throw new Error();
					if (prefixNum < 0 || prefixNum > 128) throw new Error();
					new URL(`http://[${address}]`);
				} catch {
					payload.issues.push({
						code: "invalid_format",
						format: "cidrv6",
						input: payload.value,
						inst,
						continue: !def.abort
					});
				}
			};
		});
		function isValidBase64(data) {
			if (data === "") return true;
			if (/\s/.test(data)) return false;
			if (data.length % 4 !== 0) return false;
			try {
				atob(data);
				return true;
			} catch {
				return false;
			}
		}
		const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
			def.pattern ?? (def.pattern = base64);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64";
			inst._zod.check = (payload) => {
				if (isValidBase64(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		function isValidBase64URL(data) {
			if (!base64url.test(data)) return false;
			const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
			return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
		}
		const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
			def.pattern ?? (def.pattern = base64url);
			$ZodStringFormat.init(inst, def);
			inst._zod.bag.contentEncoding = "base64url";
			inst._zod.check = (payload) => {
				if (isValidBase64URL(payload.value)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "base64url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
			def.pattern ?? (def.pattern = e164);
			$ZodStringFormat.init(inst, def);
		});
		function isValidJWT(token, algorithm = null) {
			try {
				const tokensParts = token.split(".");
				if (tokensParts.length !== 3) return false;
				const [header] = tokensParts;
				if (!header) return false;
				const parsedHeader = JSON.parse(atob(header));
				if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
				if (!parsedHeader.alg) return false;
				if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
				return true;
			} catch {
				return false;
			}
		}
		const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			inst._zod.check = (payload) => {
				if (isValidJWT(payload.value, def.alg)) return;
				payload.issues.push({
					code: "invalid_format",
					format: "jwt",
					input: payload.value,
					inst,
					continue: !def.abort
				});
			};
		});
		const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = inst._zod.bag.pattern ?? number$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Number(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
				const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? "Infinity" : void 0 : void 0;
				payload.issues.push({
					expected: "number",
					code: "invalid_type",
					input,
					inst,
					...received ? { received } : {}
				});
				return payload;
			};
		});
		const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
			$ZodCheckNumberFormat.init(inst, def);
			$ZodNumber.init(inst, def);
		});
		const $ZodBoolean = /*@__PURE__*/ $constructor("$ZodBoolean", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = boolean$1;
			inst._zod.parse = (payload, _ctx) => {
				if (def.coerce) try {
					payload.value = Boolean(payload.value);
				} catch (_) {}
				const input = payload.value;
				if (typeof input === "boolean") return payload;
				payload.issues.push({
					expected: "boolean",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUndefined = /*@__PURE__*/ $constructor("$ZodUndefined", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.pattern = _undefined$2;
			inst._zod.values = /* @__PURE__ */ new Set([void 0]);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (typeof input === "undefined") return payload;
				payload.issues.push({
					expected: "undefined",
					code: "invalid_type",
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload) => payload;
		});
		const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _ctx) => {
				payload.issues.push({
					expected: "never",
					code: "invalid_type",
					input: payload.value,
					inst
				});
				return payload;
			};
		});
		function handleArrayResult(result, final, index) {
			if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
			final.value[index] = result.value;
		}
		const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				if (!Array.isArray(input)) {
					payload.issues.push({
						expected: "array",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = Array(input.length);
				const proms = [];
				for (let i = 0; i < input.length; i++) {
					const item = input[i];
					const result = def.element._zod.run({
						value: item,
						issues: []
					}, ctx);
					if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
					else handleArrayResult(result, payload, i);
				}
				if (proms.length) return Promise.all(proms).then(() => payload);
				return payload;
			};
		});
		function handlePropertyResult(result, final, key, input, isOptionalIn, isOptionalOut) {
			const isPresent = key in input;
			if (result.issues.length) {
				if (isOptionalIn && isOptionalOut && !isPresent) return;
				final.issues.push(...prefixIssues(key, result.issues));
			}
			if (!isPresent && !isOptionalIn) {
				if (!result.issues.length) final.issues.push({
					code: "invalid_type",
					expected: "nonoptional",
					input: void 0,
					path: [key]
				});
				return;
			}
			if (result.value === void 0) {
				if (isPresent) final.value[key] = void 0;
			} else final.value[key] = result.value;
		}
		function normalizeDef(def) {
			const keys = Object.keys(def.shape);
			for (const k of keys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
			const okeys = optionalKeys(def.shape);
			return {
				...def,
				keys,
				keySet: new Set(keys),
				numKeys: keys.length,
				optionalKeys: new Set(okeys)
			};
		}
		function handleCatchall(proms, input, payload, ctx, def, inst) {
			const unrecognized = [];
			const keySet = def.keySet;
			const _catchall = def.catchall._zod;
			const t = _catchall.def.type;
			const isOptionalIn = _catchall.optin === "optional";
			const isOptionalOut = _catchall.optout === "optional";
			for (const key in input) {
				if (key === "__proto__") continue;
				if (keySet.has(key)) continue;
				if (t === "never") {
					unrecognized.push(key);
					continue;
				}
				const r = _catchall.run({
					value: input[key],
					issues: []
				}, ctx);
				if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
				else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
			}
			if (unrecognized.length) payload.issues.push({
				code: "unrecognized_keys",
				keys: unrecognized,
				input,
				inst
			});
			if (!proms.length) return payload;
			return Promise.all(proms).then(() => {
				return payload;
			});
		}
		const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
			$ZodType.init(inst, def);
			if (!Object.getOwnPropertyDescriptor(def, "shape")?.get) {
				const sh = def.shape;
				Object.defineProperty(def, "shape", { get: () => {
					const newSh = { ...sh };
					Object.defineProperty(def, "shape", { value: newSh });
					return newSh;
				} });
			}
			const _normalized = cached(() => normalizeDef(def));
			defineLazy(inst._zod, "propValues", () => {
				const shape = def.shape;
				const propValues = {};
				for (const key in shape) {
					const field = shape[key]._zod;
					if (field.values) {
						propValues[key] ?? (propValues[key] = /* @__PURE__ */ new Set());
						for (const v of field.values) propValues[key].add(v);
					}
				}
				return propValues;
			});
			const isObject$2 = isObject;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$2(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				payload.value = {};
				const proms = [];
				const shape = value.shape;
				for (const key of value.keys) {
					const el = shape[key];
					const isOptionalIn = el._zod.optin === "optional";
					const isOptionalOut = el._zod.optout === "optional";
					const r = el._zod.run({
						value: input[key],
						issues: []
					}, ctx);
					if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut)));
					else handlePropertyResult(r, payload, key, input, isOptionalIn, isOptionalOut);
				}
				if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
				return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
			};
		});
		const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
			$ZodObject.init(inst, def);
			const superParse = inst._zod.parse;
			const _normalized = cached(() => normalizeDef(def));
			const generateFastpass = (shape) => {
				const doc = new Doc([
					"shape",
					"payload",
					"ctx"
				]);
				const normalized = _normalized.value;
				const parseStr = (key) => {
					const k = esc(key);
					return `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
				};
				doc.write(`const input = payload.value;`);
				const ids = Object.create(null);
				let counter = 0;
				for (const key of normalized.keys) ids[key] = `key_${counter++}`;
				doc.write(`const newResult = {};`);
				for (const key of normalized.keys) {
					const id = ids[key];
					const k = esc(key);
					const schema = shape[key];
					const isOptionalIn = schema?._zod?.optin === "optional";
					const isOptionalOut = schema?._zod?.optout === "optional";
					doc.write(`const ${id} = ${parseStr(key)};`);
					if (isOptionalIn && isOptionalOut) doc.write(`
        if (${id}.issues.length) {
          if (${k} in input) {
            payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
              ...iss,
              path: iss.path ? [${k}, ...iss.path] : [${k}]
            })));
          }
        }

        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
					else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${k} in input;
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
        }

        if (${id}_present) {
          if (${id}.value === undefined) {
            newResult[${k}] = undefined;
          } else {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
					else doc.write(`
        if (${id}.issues.length) {
          payload.issues = payload.issues.concat(${id}.issues.map(iss => ({
            ...iss,
            path: iss.path ? [${k}, ...iss.path] : [${k}]
          })));
        }

        if (${id}.value === undefined) {
          if (${k} in input) {
            newResult[${k}] = undefined;
          }
        } else {
          newResult[${k}] = ${id}.value;
        }

      `);
				}
				doc.write(`payload.value = newResult;`);
				doc.write(`return payload;`);
				const fn = doc.compile();
				return (payload, ctx) => fn(shape, payload, ctx);
			};
			let fastpass;
			const isObject$1 = isObject;
			const jit = !globalConfig.jitless;
			const fastEnabled = jit && allowsEval.value;
			const catchall = def.catchall;
			let value;
			inst._zod.parse = (payload, ctx) => {
				value ?? (value = _normalized.value);
				const input = payload.value;
				if (!isObject$1(input)) {
					payload.issues.push({
						expected: "object",
						code: "invalid_type",
						input,
						inst
					});
					return payload;
				}
				if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
					if (!fastpass) fastpass = generateFastpass(def.shape);
					payload = fastpass(payload, ctx);
					if (!catchall) return payload;
					return handleCatchall([], input, payload, ctx, value, inst);
				}
				return superParse(payload, ctx);
			};
		});
		function handleUnionResults(results, final, inst, ctx) {
			for (const result of results) if (result.issues.length === 0) {
				final.value = result.value;
				return final;
			}
			const nonaborted = results.filter((r) => !aborted(r));
			if (nonaborted.length === 1) {
				final.value = nonaborted[0].value;
				return nonaborted[0];
			}
			final.issues.push({
				code: "invalid_union",
				input: final.value,
				inst,
				errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())))
			});
			return final;
		}
		const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.options.some((o) => o._zod.optin === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "optout", () => def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
			defineLazy(inst._zod, "values", () => {
				if (def.options.every((o) => o._zod.values)) return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
			});
			defineLazy(inst._zod, "pattern", () => {
				if (def.options.every((o) => o._zod.pattern)) {
					const patterns = def.options.map((o) => o._zod.pattern);
					return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
				}
			});
			const first = def.options.length === 1 ? def.options[0]._zod.run : null;
			inst._zod.parse = (payload, ctx) => {
				if (first) return first(payload, ctx);
				let async = false;
				const results = [];
				for (const option of def.options) {
					const result = option._zod.run({
						value: payload.value,
						issues: []
					}, ctx);
					if (result instanceof Promise) {
						results.push(result);
						async = true;
					} else {
						if (result.issues.length === 0) return result;
						results.push(result);
					}
				}
				if (!async) return handleUnionResults(results, payload, inst, ctx);
				return Promise.all(results).then((results) => {
					return handleUnionResults(results, payload, inst, ctx);
				});
			};
		});
		const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, ctx) => {
				const input = payload.value;
				const left = def.left._zod.run({
					value: input,
					issues: []
				}, ctx);
				const right = def.right._zod.run({
					value: input,
					issues: []
				}, ctx);
				if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
					return handleIntersectionResults(payload, left, right);
				});
				return handleIntersectionResults(payload, left, right);
			};
		});
		function mergeValues(a, b) {
			if (a === b) return {
				valid: true,
				data: a
			};
			if (a instanceof Date && b instanceof Date && +a === +b) return {
				valid: true,
				data: a
			};
			if (isPlainObject(a) && isPlainObject(b)) {
				const bKeys = Object.keys(b);
				const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
				const newObj = {
					...a,
					...b
				};
				for (const key of sharedKeys) {
					const sharedValue = mergeValues(a[key], b[key]);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
					};
					newObj[key] = sharedValue.data;
				}
				return {
					valid: true,
					data: newObj
				};
			}
			if (Array.isArray(a) && Array.isArray(b)) {
				if (a.length !== b.length) return {
					valid: false,
					mergeErrorPath: []
				};
				const newArray = [];
				for (let index = 0; index < a.length; index++) {
					const itemA = a[index];
					const itemB = b[index];
					const sharedValue = mergeValues(itemA, itemB);
					if (!sharedValue.valid) return {
						valid: false,
						mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
					};
					newArray.push(sharedValue.data);
				}
				return {
					valid: true,
					data: newArray
				};
			}
			return {
				valid: false,
				mergeErrorPath: []
			};
		}
		function handleIntersectionResults(result, left, right) {
			const unrecKeys = /* @__PURE__ */ new Map();
			let unrecIssue;
			for (const iss of left.issues) if (iss.code === "unrecognized_keys") {
				unrecIssue ?? (unrecIssue = iss);
				for (const k of iss.keys) {
					if (!unrecKeys.has(k)) unrecKeys.set(k, {});
					unrecKeys.get(k).l = true;
				}
			} else result.issues.push(iss);
			for (const iss of right.issues) if (iss.code === "unrecognized_keys") for (const k of iss.keys) {
				if (!unrecKeys.has(k)) unrecKeys.set(k, {});
				unrecKeys.get(k).r = true;
			}
			else result.issues.push(iss);
			const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
			if (bothKeys.length && unrecIssue) result.issues.push({
				...unrecIssue,
				keys: bothKeys
			});
			if (aborted(result)) return result;
			const merged = mergeValues(left.value, right.value);
			if (!merged.valid) throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
			result.value = merged.data;
			return result;
		}
		const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
			$ZodType.init(inst, def);
			const values = getEnumValues(def.entries);
			const valuesSet = new Set(values);
			inst._zod.values = valuesSet;
			inst._zod.pattern = new RegExp(`^(${values.filter((k) => propertyKeyTypes.has(typeof k)).map((o) => typeof o === "string" ? escapeRegex(o) : o.toString()).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (valuesSet.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
			$ZodType.init(inst, def);
			if (def.values.length === 0) throw new Error("Cannot create literal schema with no valid values");
			const values = new Set(def.values);
			inst._zod.values = values;
			inst._zod.pattern = new RegExp(`^(${def.values.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$`);
			inst._zod.parse = (payload, _ctx) => {
				const input = payload.value;
				if (values.has(input)) return payload;
				payload.issues.push({
					code: "invalid_value",
					values: def.values,
					input,
					inst
				});
				return payload;
			};
		});
		const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				const _out = def.transform(payload.value, payload);
				if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				if (_out instanceof Promise) throw new $ZodAsyncError();
				payload.value = _out;
				payload.fallback = true;
				return payload;
			};
		});
		function handleOptionalResult(result, input) {
			if (input === void 0 && (result.issues.length || result.fallback)) return {
				issues: [],
				value: void 0
			};
			return result;
		}
		const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			inst._zod.optout = "optional";
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
			});
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (def.innerType._zod.optin === "optional") {
					const input = payload.value;
					const result = def.innerType._zod.run(payload, ctx);
					if (result instanceof Promise) return result.then((r) => handleOptionalResult(r, input));
					return handleOptionalResult(result, input);
				}
				if (payload.value === void 0) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
			inst._zod.parse = (payload, ctx) => {
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "pattern", () => {
				const pattern = def.innerType._zod.pattern;
				return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
			});
			defineLazy(inst._zod, "values", () => {
				return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				if (payload.value === null) return payload;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) {
					payload.value = def.defaultValue;
					/**
					* $ZodDefault returns the default value immediately in forward direction.
					* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
					return payload;
				}
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
				return handleDefaultResult(result, def);
			};
		});
		function handleDefaultResult(payload, def) {
			if (payload.value === void 0) payload.value = def.defaultValue;
			return payload;
		}
		const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				if (payload.value === void 0) payload.value = def.defaultValue;
				return def.innerType._zod.run(payload, ctx);
			};
		});
		const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => {
				const v = def.innerType._zod.values;
				return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
			});
			inst._zod.parse = (payload, ctx) => {
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
				return handleNonOptionalResult(result, inst);
			};
		});
		function handleNonOptionalResult(payload, inst) {
			if (!payload.issues.length && payload.value === void 0) payload.issues.push({
				code: "invalid_type",
				expected: "nonoptional",
				input: payload.value,
				inst
			});
			return payload;
		}
		const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
			$ZodType.init(inst, def);
			inst._zod.optin = "optional";
			defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then((result) => {
					payload.value = result.value;
					if (result.issues.length) {
						payload.value = def.catchValue({
							...payload,
							error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())) },
							input: payload.value
						});
						payload.issues = [];
						payload.fallback = true;
					}
					return payload;
				});
				payload.value = result.value;
				if (result.issues.length) {
					payload.value = def.catchValue({
						...payload,
						error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config$1())) },
						input: payload.value
					});
					payload.issues = [];
					payload.fallback = true;
				}
				return payload;
			};
		});
		const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "values", () => def.in._zod.values);
			defineLazy(inst._zod, "optin", () => def.in._zod.optin);
			defineLazy(inst._zod, "optout", () => def.out._zod.optout);
			defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") {
					const right = def.out._zod.run(payload, ctx);
					if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
					return handlePipeResult(right, def.in, ctx);
				}
				const left = def.in._zod.run(payload, ctx);
				if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
				return handlePipeResult(left, def.out, ctx);
			};
		});
		function handlePipeResult(left, next, ctx) {
			if (left.issues.length) {
				left.aborted = true;
				return left;
			}
			return next._zod.run({
				value: left.value,
				issues: left.issues,
				fallback: left.fallback
			}, ctx);
		}
		const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
			$ZodType.init(inst, def);
			defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
			defineLazy(inst._zod, "values", () => def.innerType._zod.values);
			defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
			defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
			inst._zod.parse = (payload, ctx) => {
				if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
				const result = def.innerType._zod.run(payload, ctx);
				if (result instanceof Promise) return result.then(handleReadonlyResult);
				return handleReadonlyResult(result);
			};
		});
		function handleReadonlyResult(payload) {
			payload.value = Object.freeze(payload.value);
			return payload;
		}
		const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
			$ZodCheck.init(inst, def);
			$ZodType.init(inst, def);
			inst._zod.parse = (payload, _) => {
				return payload;
			};
			inst._zod.check = (payload) => {
				const input = payload.value;
				const r = def.fn(input);
				if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
				handleRefineResult(r, payload, input, inst);
			};
		});
		function handleRefineResult(result, payload, input, inst) {
			if (!result) {
				const _iss = {
					code: "custom",
					input,
					inst,
					path: [...inst._zod.def.path ?? []],
					continue: !inst._zod.def.abort
				};
				if (inst._zod.def.params) _iss.params = inst._zod.def.params;
				payload.issues.push(issue(_iss));
			}
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/registries.js
		var _a;
		var $ZodRegistry = class {
			constructor() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
			}
			add(schema, ..._meta) {
				const meta = _meta[0];
				this._map.set(schema, meta);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
				return this;
			}
			clear() {
				this._map = /* @__PURE__ */ new WeakMap();
				this._idmap = /* @__PURE__ */ new Map();
				return this;
			}
			remove(schema) {
				const meta = this._map.get(schema);
				if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
				this._map.delete(schema);
				return this;
			}
			get(schema) {
				const p = schema._zod.parent;
				if (p) {
					const pm = { ...this.get(p) ?? {} };
					delete pm.id;
					const f = {
						...pm,
						...this._map.get(schema)
					};
					return Object.keys(f).length ? f : void 0;
				}
				return this._map.get(schema);
			}
			has(schema) {
				return this._map.has(schema);
			}
		};
		function registry() {
			return new $ZodRegistry();
		}
		(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
		const globalRegistry = globalThis.__zod_globalRegistry;
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/api.js
		// @__NO_SIDE_EFFECTS__
		function _string(Class, params) {
			return new Class({
				type: "string",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _email(Class, params) {
			return new Class({
				type: "string",
				format: "email",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _guid(Class, params) {
			return new Class({
				type: "string",
				format: "guid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuid(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv4(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v4",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv6(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v6",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uuidv7(Class, params) {
			return new Class({
				type: "string",
				format: "uuid",
				check: "string_format",
				abort: false,
				version: "v7",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _url(Class, params) {
			return new Class({
				type: "string",
				format: "url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _emoji(Class, params) {
			return new Class({
				type: "string",
				format: "emoji",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _nanoid(Class, params) {
			return new Class({
				type: "string",
				format: "nanoid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link _cuid2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		// @__NO_SIDE_EFFECTS__
		function _cuid(Class, params) {
			return new Class({
				type: "string",
				format: "cuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cuid2(Class, params) {
			return new Class({
				type: "string",
				format: "cuid2",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ulid(Class, params) {
			return new Class({
				type: "string",
				format: "ulid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _xid(Class, params) {
			return new Class({
				type: "string",
				format: "xid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ksuid(Class, params) {
			return new Class({
				type: "string",
				format: "ksuid",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv4(Class, params) {
			return new Class({
				type: "string",
				format: "ipv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _ipv6(Class, params) {
			return new Class({
				type: "string",
				format: "ipv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv4(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv4",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _cidrv6(Class, params) {
			return new Class({
				type: "string",
				format: "cidrv6",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64(Class, params) {
			return new Class({
				type: "string",
				format: "base64",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _base64url(Class, params) {
			return new Class({
				type: "string",
				format: "base64url",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _e164(Class, params) {
			return new Class({
				type: "string",
				format: "e164",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _jwt(Class, params) {
			return new Class({
				type: "string",
				format: "jwt",
				check: "string_format",
				abort: false,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDateTime(Class, params) {
			return new Class({
				type: "string",
				format: "datetime",
				check: "string_format",
				offset: false,
				local: false,
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDate(Class, params) {
			return new Class({
				type: "string",
				format: "date",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoTime(Class, params) {
			return new Class({
				type: "string",
				format: "time",
				check: "string_format",
				precision: null,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _isoDuration(Class, params) {
			return new Class({
				type: "string",
				format: "duration",
				check: "string_format",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _number(Class, params) {
			return new Class({
				type: "number",
				checks: [],
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _int(Class, params) {
			return new Class({
				type: "number",
				check: "number_format",
				abort: false,
				format: "safeint",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _boolean(Class, params) {
			return new Class({
				type: "boolean",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _undefined$1(Class, params) {
			return new Class({
				type: "undefined",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _unknown(Class) {
			return new Class({ type: "unknown" });
		}
		// @__NO_SIDE_EFFECTS__
		function _never(Class, params) {
			return new Class({
				type: "never",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lt(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lte(value, params) {
			return new $ZodCheckLessThan({
				check: "less_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gt(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: false
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _gte(value, params) {
			return new $ZodCheckGreaterThan({
				check: "greater_than",
				...normalizeParams(params),
				value,
				inclusive: true
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _multipleOf(value, params) {
			return new $ZodCheckMultipleOf({
				check: "multiple_of",
				...normalizeParams(params),
				value
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _maxLength(maximum, params) {
			return new $ZodCheckMaxLength({
				check: "max_length",
				...normalizeParams(params),
				maximum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _minLength(minimum, params) {
			return new $ZodCheckMinLength({
				check: "min_length",
				...normalizeParams(params),
				minimum
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _length(length, params) {
			return new $ZodCheckLengthEquals({
				check: "length_equals",
				...normalizeParams(params),
				length
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _regex(pattern, params) {
			return new $ZodCheckRegex({
				check: "string_format",
				format: "regex",
				...normalizeParams(params),
				pattern
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _lowercase(params) {
			return new $ZodCheckLowerCase({
				check: "string_format",
				format: "lowercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _uppercase(params) {
			return new $ZodCheckUpperCase({
				check: "string_format",
				format: "uppercase",
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _includes(includes, params) {
			return new $ZodCheckIncludes({
				check: "string_format",
				format: "includes",
				...normalizeParams(params),
				includes
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _startsWith(prefix, params) {
			return new $ZodCheckStartsWith({
				check: "string_format",
				format: "starts_with",
				...normalizeParams(params),
				prefix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _endsWith(suffix, params) {
			return new $ZodCheckEndsWith({
				check: "string_format",
				format: "ends_with",
				...normalizeParams(params),
				suffix
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _overwrite(tx) {
			return new $ZodCheckOverwrite({
				check: "overwrite",
				tx
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _normalize(form) {
			return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
		}
		// @__NO_SIDE_EFFECTS__
		function _trim() {
			return /* @__PURE__ */ _overwrite((input) => input.trim());
		}
		// @__NO_SIDE_EFFECTS__
		function _toLowerCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _toUpperCase() {
			return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
		}
		// @__NO_SIDE_EFFECTS__
		function _slugify() {
			return /* @__PURE__ */ _overwrite((input) => slugify(input));
		}
		// @__NO_SIDE_EFFECTS__
		function _array(Class, element, params) {
			return new Class({
				type: "array",
				element,
				...normalizeParams(params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _refine(Class, fn, _params) {
			return new Class({
				type: "custom",
				check: "custom",
				fn,
				...normalizeParams(_params)
			});
		}
		// @__NO_SIDE_EFFECTS__
		function _superRefine(fn, params) {
			const ch = /* @__PURE__ */ _check((payload) => {
				payload.addIssue = (issue$2) => {
					if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
					else {
						const _issue = issue$2;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = ch);
						_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
						payload.issues.push(issue(_issue));
					}
				};
				return fn(payload.value, payload);
			}, params);
			return ch;
		}
		// @__NO_SIDE_EFFECTS__
		function _check(fn, params) {
			const ch = new $ZodCheck({
				check: "custom",
				...normalizeParams(params)
			});
			ch._zod.check = fn;
			return ch;
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/to-json-schema.js
		function initializeContext(params) {
			let target = params?.target ?? "draft-2020-12";
			if (target === "draft-4") target = "draft-04";
			if (target === "draft-7") target = "draft-07";
			return {
				processors: params.processors ?? {},
				metadataRegistry: params?.metadata ?? globalRegistry,
				target,
				unrepresentable: params?.unrepresentable ?? "throw",
				override: params?.override ?? (() => {}),
				io: params?.io ?? "output",
				counter: 0,
				seen: /* @__PURE__ */ new Map(),
				cycles: params?.cycles ?? "ref",
				reused: params?.reused ?? "inline",
				external: params?.external ?? void 0
			};
		}
		function process(schema, ctx, _params = {
			path: [],
			schemaPath: []
		}) {
			var _a;
			const def = schema._zod.def;
			const seen = ctx.seen.get(schema);
			if (seen) {
				seen.count++;
				if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
				return seen.schema;
			}
			const result = {
				schema: {},
				count: 1,
				cycle: void 0,
				path: _params.path
			};
			ctx.seen.set(schema, result);
			const overrideSchema = schema._zod.toJSONSchema?.();
			if (overrideSchema) result.schema = overrideSchema;
			else {
				const params = {
					..._params,
					schemaPath: [..._params.schemaPath, schema],
					path: _params.path
				};
				if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
				else {
					const _json = result.schema;
					const processor = ctx.processors[def.type];
					if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
					processor(schema, ctx, _json, params);
				}
				const parent = schema._zod.parent;
				if (parent) {
					if (!result.ref) result.ref = parent;
					process(parent, ctx, params);
					ctx.seen.get(parent).isParent = true;
				}
			}
			const meta = ctx.metadataRegistry.get(schema);
			if (meta) Object.assign(result.schema, meta);
			if (ctx.io === "input" && isTransforming(schema)) {
				delete result.schema.examples;
				delete result.schema.default;
			}
			if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
			delete result.schema._prefault;
			return ctx.seen.get(schema).schema;
		}
		function extractDefs(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const idToSchema = /* @__PURE__ */ new Map();
			for (const entry of ctx.seen.entries()) {
				const id = ctx.metadataRegistry.get(entry[0])?.id;
				if (id) {
					const existing = idToSchema.get(id);
					if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
					idToSchema.set(id, entry[0]);
				}
			}
			const makeURI = (entry) => {
				const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
				if (ctx.external) {
					const externalId = ctx.external.registry.get(entry[0])?.id;
					const uriGenerator = ctx.external.uri ?? ((id) => id);
					if (externalId) return { ref: uriGenerator(externalId) };
					const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
					entry[1].defId = id;
					return {
						defId: id,
						ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}`
					};
				}
				if (entry[1] === root) return { ref: "#" };
				const defUriPrefix = `#/${defsSegment}/`;
				const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
				return {
					defId,
					ref: defUriPrefix + defId
				};
			};
			const extractToDef = (entry) => {
				if (entry[1].schema.$ref) return;
				const seen = entry[1];
				const { ref, defId } = makeURI(entry);
				seen.def = { ...seen.schema };
				if (defId) seen.defId = defId;
				const schema = seen.schema;
				for (const key in schema) delete schema[key];
				schema.$ref = ref;
			};
			if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
			}
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (schema === entry[0]) {
					extractToDef(entry);
					continue;
				}
				if (ctx.external) {
					const ext = ctx.external.registry.get(entry[0])?.id;
					if (schema !== entry[0] && ext) {
						extractToDef(entry);
						continue;
					}
				}
				if (ctx.metadataRegistry.get(entry[0])?.id) {
					extractToDef(entry);
					continue;
				}
				if (seen.cycle) {
					extractToDef(entry);
					continue;
				}
				if (seen.count > 1) {
					if (ctx.reused === "ref") {
						extractToDef(entry);
						continue;
					}
				}
			}
		}
		function finalize(ctx, schema) {
			const root = ctx.seen.get(schema);
			if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
			const flattenRef = (zodSchema) => {
				const seen = ctx.seen.get(zodSchema);
				if (seen.ref === null) return;
				const schema = seen.def ?? seen.schema;
				const _cached = { ...schema };
				const ref = seen.ref;
				seen.ref = null;
				if (ref) {
					flattenRef(ref);
					const refSeen = ctx.seen.get(ref);
					const refSchema = refSeen.schema;
					if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
						schema.allOf = schema.allOf ?? [];
						schema.allOf.push(refSchema);
					} else Object.assign(schema, refSchema);
					Object.assign(schema, _cached);
					if (zodSchema._zod.parent === ref) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (!(key in _cached)) delete schema[key];
					}
					if (refSchema.$ref && refSeen.def) for (const key in schema) {
						if (key === "$ref" || key === "allOf") continue;
						if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
					}
				}
				const parent = zodSchema._zod.parent;
				if (parent && parent !== ref) {
					flattenRef(parent);
					const parentSeen = ctx.seen.get(parent);
					if (parentSeen?.schema.$ref) {
						schema.$ref = parentSeen.schema.$ref;
						if (parentSeen.def) for (const key in schema) {
							if (key === "$ref" || key === "allOf") continue;
							if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
						}
					}
				}
				ctx.override({
					zodSchema,
					jsonSchema: schema,
					path: seen.path ?? []
				});
			};
			for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
			const result = {};
			if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
			else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
			else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
			else if (ctx.target === "openapi-3.0") {}
			if (ctx.external?.uri) {
				const id = ctx.external.registry.get(schema)?.id;
				if (!id) throw new Error("Schema is missing an `id` property");
				result.$id = ctx.external.uri(id);
			}
			Object.assign(result, root.def ?? root.schema);
			const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
			if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
			const defs = ctx.external?.defs ?? {};
			for (const entry of ctx.seen.entries()) {
				const seen = entry[1];
				if (seen.def && seen.defId) {
					if (seen.def.id === seen.defId) delete seen.def.id;
					defs[seen.defId] = seen.def;
				}
			}
			if (ctx.external) {} else if (Object.keys(defs).length > 0) if (ctx.target === "draft-2020-12") result.$defs = defs;
			else result.definitions = defs;
			try {
				const finalized = JSON.parse(JSON.stringify(result));
				Object.defineProperty(finalized, "~standard", {
					value: {
						...schema["~standard"],
						jsonSchema: {
							input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
							output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
						}
					},
					enumerable: false,
					writable: false
				});
				return finalized;
			} catch (_err) {
				throw new Error("Error converting schema to JSON.");
			}
		}
		function isTransforming(_schema, _ctx) {
			const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
			if (ctx.seen.has(_schema)) return false;
			ctx.seen.add(_schema);
			const def = _schema._zod.def;
			if (def.type === "transform") return true;
			if (def.type === "array") return isTransforming(def.element, ctx);
			if (def.type === "set") return isTransforming(def.valueType, ctx);
			if (def.type === "lazy") return isTransforming(def.getter(), ctx);
			if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") return isTransforming(def.innerType, ctx);
			if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
			if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
			if (def.type === "pipe") {
				if (_schema._zod.traits.has("$ZodCodec")) return true;
				return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
			}
			if (def.type === "object") {
				for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
				return false;
			}
			if (def.type === "union") {
				for (const option of def.options) if (isTransforming(option, ctx)) return true;
				return false;
			}
			if (def.type === "tuple") {
				for (const item of def.items) if (isTransforming(item, ctx)) return true;
				if (def.rest && isTransforming(def.rest, ctx)) return true;
				return false;
			}
			return false;
		}
		/**
		* Creates a toJSONSchema method for a schema instance.
		* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
		*/
		const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
			const ctx = initializeContext({
				...params,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
			const { libraryOptions, target } = params ?? {};
			const ctx = initializeContext({
				...libraryOptions ?? {},
				target,
				io,
				processors
			});
			process(schema, ctx);
			extractDefs(ctx, schema);
			return finalize(ctx, schema);
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/core/json-schema-processors.js
		const formatMap = {
			guid: "uuid",
			url: "uri",
			datetime: "date-time",
			json_string: "json-string",
			regex: ""
		};
		const stringProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			json.type = "string";
			const { minimum, maximum, format, patterns, contentEncoding } = schema._zod.bag;
			if (typeof minimum === "number") json.minLength = minimum;
			if (typeof maximum === "number") json.maxLength = maximum;
			if (format) {
				json.format = formatMap[format] ?? format;
				if (json.format === "") delete json.format;
				if (format === "time") delete json.format;
			}
			if (contentEncoding) json.contentEncoding = contentEncoding;
			if (patterns && patterns.size > 0) {
				const regexes = [...patterns];
				if (regexes.length === 1) json.pattern = regexes[0].source;
				else if (regexes.length > 1) json.allOf = [...regexes.map((regex) => ({
					...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
					pattern: regex.source
				}))];
			}
		};
		const numberProcessor = (schema, ctx, _json, _params) => {
			const json = _json;
			const { minimum, maximum, format, multipleOf, exclusiveMaximum, exclusiveMinimum } = schema._zod.bag;
			if (typeof format === "string" && format.includes("int")) json.type = "integer";
			else json.type = "number";
			const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
			const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
			const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
			if (exMin) if (legacy) {
				json.minimum = exclusiveMinimum;
				json.exclusiveMinimum = true;
			} else json.exclusiveMinimum = exclusiveMinimum;
			else if (typeof minimum === "number") json.minimum = minimum;
			if (exMax) if (legacy) {
				json.maximum = exclusiveMaximum;
				json.exclusiveMaximum = true;
			} else json.exclusiveMaximum = exclusiveMaximum;
			else if (typeof maximum === "number") json.maximum = maximum;
			if (typeof multipleOf === "number") json.multipleOf = multipleOf;
		};
		const booleanProcessor = (_schema, _ctx, json, _params) => {
			json.type = "boolean";
		};
		const undefinedProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Undefined cannot be represented in JSON Schema");
		};
		const neverProcessor = (_schema, _ctx, json, _params) => {
			json.not = {};
		};
		const enumProcessor = (schema, _ctx, json, _params) => {
			const def = schema._zod.def;
			const values = getEnumValues(def.entries);
			if (values.every((v) => typeof v === "number")) json.type = "number";
			if (values.every((v) => typeof v === "string")) json.type = "string";
			json.enum = values;
		};
		const literalProcessor = (schema, ctx, json, _params) => {
			const def = schema._zod.def;
			const vals = [];
			for (const val of def.values) if (val === void 0) {
				if (ctx.unrepresentable === "throw") throw new Error("Literal `undefined` cannot be represented in JSON Schema");
			} else if (typeof val === "bigint") if (ctx.unrepresentable === "throw") throw new Error("BigInt literals cannot be represented in JSON Schema");
			else vals.push(Number(val));
			else vals.push(val);
			if (vals.length === 0) {} else if (vals.length === 1) {
				const val = vals[0];
				json.type = val === null ? "null" : typeof val;
				if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
				else json.const = val;
			} else {
				if (vals.every((v) => typeof v === "number")) json.type = "number";
				if (vals.every((v) => typeof v === "string")) json.type = "string";
				if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
				if (vals.every((v) => v === null)) json.type = "null";
				json.enum = vals;
			}
		};
		const customProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Custom types cannot be represented in JSON Schema");
		};
		const transformProcessor = (_schema, ctx, _json, _params) => {
			if (ctx.unrepresentable === "throw") throw new Error("Transforms cannot be represented in JSON Schema");
		};
		const arrayProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			const { minimum, maximum } = schema._zod.bag;
			if (typeof minimum === "number") json.minItems = minimum;
			if (typeof maximum === "number") json.maxItems = maximum;
			json.type = "array";
			json.items = process(def.element, ctx, {
				...params,
				path: [...params.path, "items"]
			});
		};
		const objectProcessor = (schema, ctx, _json, params) => {
			const json = _json;
			const def = schema._zod.def;
			json.type = "object";
			json.properties = {};
			const shape = def.shape;
			for (const key in shape) json.properties[key] = process(shape[key], ctx, {
				...params,
				path: [
					...params.path,
					"properties",
					key
				]
			});
			const allKeys = new Set(Object.keys(shape));
			const requiredKeys = new Set([...allKeys].filter((key) => {
				const v = def.shape[key]._zod;
				if (ctx.io === "input") return v.optin === void 0;
				else return v.optout === void 0;
			}));
			if (requiredKeys.size > 0) json.required = Array.from(requiredKeys);
			if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
			else if (!def.catchall) {
				if (ctx.io === "output") json.additionalProperties = false;
			} else if (def.catchall) json.additionalProperties = process(def.catchall, ctx, {
				...params,
				path: [...params.path, "additionalProperties"]
			});
		};
		const unionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const isExclusive = def.inclusive === false;
			const options = def.options.map((x, i) => process(x, ctx, {
				...params,
				path: [
					...params.path,
					isExclusive ? "oneOf" : "anyOf",
					i
				]
			}));
			if (isExclusive) json.oneOf = options;
			else json.anyOf = options;
		};
		const intersectionProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const a = process(def.left, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					0
				]
			});
			const b = process(def.right, ctx, {
				...params,
				path: [
					...params.path,
					"allOf",
					1
				]
			});
			const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
			json.allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
		};
		const nullableProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			const inner = process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			if (ctx.target === "openapi-3.0") {
				seen.ref = def.innerType;
				json.nullable = true;
			} else json.anyOf = [inner, { type: "null" }];
		};
		const nonoptionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		const defaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.default = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const prefaultProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			if (ctx.io === "input") json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
		};
		const catchProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			let catchValue;
			try {
				catchValue = def.catchValue(void 0);
			} catch {
				throw new Error("Dynamic catch values are not supported in JSON Schema");
			}
			json.default = catchValue;
		};
		const pipeProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			const inIsTransform = def.in._zod.traits.has("$ZodTransform");
			const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
			process(innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = innerType;
		};
		const readonlyProcessor = (schema, ctx, json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
			json.readOnly = true;
		};
		const optionalProcessor = (schema, ctx, _json, params) => {
			const def = schema._zod.def;
			process(def.innerType, ctx, params);
			const seen = ctx.seen.get(schema);
			seen.ref = def.innerType;
		};
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/iso.js
		const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
			$ZodISODateTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function datetime(params) {
			return /* @__PURE__ */ _isoDateTime(ZodISODateTime, params);
		}
		const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
			$ZodISODate.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function date(params) {
			return /* @__PURE__ */ _isoDate(ZodISODate, params);
		}
		const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
			$ZodISOTime.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function time(params) {
			return /* @__PURE__ */ _isoTime(ZodISOTime, params);
		}
		const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
			$ZodISODuration.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		function duration(params) {
			return /* @__PURE__ */ _isoDuration(ZodISODuration, params);
		}
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/errors.js
		const initializer = (inst, issues) => {
			$ZodError.init(inst, issues);
			inst.name = "ZodError";
			Object.defineProperties(inst, {
				format: { value: (mapper) => formatError(inst, mapper) },
				flatten: { value: (mapper) => flattenError(inst, mapper) },
				addIssue: { value: (issue) => {
					inst.issues.push(issue);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				addIssues: { value: (issues) => {
					inst.issues.push(...issues);
					inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
				} },
				isEmpty: { get() {
					return inst.issues.length === 0;
				} }
			});
		};
		const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, { Parent: Error });
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/parse.js
		const parse = /* @__PURE__ */ _parse(ZodRealError);
		const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
		const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
		const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
		const encode = /* @__PURE__ */ _encode(ZodRealError);
		const decode = /* @__PURE__ */ _decode(ZodRealError);
		const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
		const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
		const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
		const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
		const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
		const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
		//#endregion
		//#region node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/schemas.js
		const _installedGroups = /* @__PURE__ */ new WeakMap();
		function _installLazyMethods(inst, group, methods) {
			const proto = Object.getPrototypeOf(inst);
			let installed = _installedGroups.get(proto);
			if (!installed) {
				installed = /* @__PURE__ */ new Set();
				_installedGroups.set(proto, installed);
			}
			if (installed.has(group)) return;
			installed.add(group);
			for (const key in methods) {
				const fn = methods[key];
				Object.defineProperty(proto, key, {
					configurable: true,
					enumerable: false,
					get() {
						const bound = fn.bind(this);
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: bound
						});
						return bound;
					},
					set(v) {
						Object.defineProperty(this, key, {
							configurable: true,
							writable: true,
							enumerable: true,
							value: v
						});
					}
				});
			}
		}
		const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
			$ZodType.init(inst, def);
			Object.assign(inst["~standard"], { jsonSchema: {
				input: createStandardJSONSchemaMethod(inst, "input"),
				output: createStandardJSONSchemaMethod(inst, "output")
			} });
			inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
			inst.def = def;
			inst.type = def.type;
			Object.defineProperty(inst, "_def", { value: def });
			inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
			inst.safeParse = (data, params) => safeParse(inst, data, params);
			inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
			inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
			inst.spa = inst.safeParseAsync;
			inst.encode = (data, params) => encode(inst, data, params);
			inst.decode = (data, params) => decode(inst, data, params);
			inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
			inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
			inst.safeEncode = (data, params) => safeEncode(inst, data, params);
			inst.safeDecode = (data, params) => safeDecode(inst, data, params);
			inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
			inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
			_installLazyMethods(inst, "ZodType", {
				check(...chks) {
					const def = this.def;
					return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
						check: ch,
						def: { check: "custom" },
						onattach: []
					} } : ch)] }), { parent: true });
				},
				with(...chks) {
					return this.check(...chks);
				},
				clone(def, params) {
					return clone$1(this, def, params);
				},
				brand() {
					return this;
				},
				register(reg, meta) {
					reg.add(this, meta);
					return this;
				},
				refine(check, params) {
					return this.check(refine(check, params));
				},
				superRefine(refinement, params) {
					return this.check(superRefine(refinement, params));
				},
				overwrite(fn) {
					return this.check(/* @__PURE__ */ _overwrite(fn));
				},
				optional() {
					return optional(this);
				},
				exactOptional() {
					return exactOptional(this);
				},
				nullable() {
					return nullable(this);
				},
				nullish() {
					return optional(nullable(this));
				},
				nonoptional(params) {
					return nonoptional(this, params);
				},
				array() {
					return array(this);
				},
				or(arg) {
					return union([this, arg]);
				},
				and(arg) {
					return intersection(this, arg);
				},
				transform(tx) {
					return pipe(this, transform(tx));
				},
				default(d) {
					return _default(this, d);
				},
				prefault(d) {
					return prefault(this, d);
				},
				catch(params) {
					return _catch(this, params);
				},
				pipe(target) {
					return pipe(this, target);
				},
				readonly() {
					return readonly(this);
				},
				describe(description) {
					const cl = this.clone();
					globalRegistry.add(cl, { description });
					return cl;
				},
				meta(...args) {
					if (args.length === 0) return globalRegistry.get(this);
					const cl = this.clone();
					globalRegistry.add(cl, args[0]);
					return cl;
				},
				isOptional() {
					return this.safeParse(void 0).success;
				},
				isNullable() {
					return this.safeParse(null).success;
				},
				apply(fn) {
					return fn(this);
				}
			});
			Object.defineProperty(inst, "description", {
				get() {
					return globalRegistry.get(inst)?.description;
				},
				configurable: true
			});
			return inst;
		});
		/** @internal */
		const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
			const bag = inst._zod.bag;
			inst.format = bag.format ?? null;
			inst.minLength = bag.minimum ?? null;
			inst.maxLength = bag.maximum ?? null;
			_installLazyMethods(inst, "_ZodString", {
				regex(...args) {
					return this.check(/* @__PURE__ */ _regex(...args));
				},
				includes(...args) {
					return this.check(/* @__PURE__ */ _includes(...args));
				},
				startsWith(...args) {
					return this.check(/* @__PURE__ */ _startsWith(...args));
				},
				endsWith(...args) {
					return this.check(/* @__PURE__ */ _endsWith(...args));
				},
				min(...args) {
					return this.check(/* @__PURE__ */ _minLength(...args));
				},
				max(...args) {
					return this.check(/* @__PURE__ */ _maxLength(...args));
				},
				length(...args) {
					return this.check(/* @__PURE__ */ _length(...args));
				},
				nonempty(...args) {
					return this.check(/* @__PURE__ */ _minLength(1, ...args));
				},
				lowercase(params) {
					return this.check(/* @__PURE__ */ _lowercase(params));
				},
				uppercase(params) {
					return this.check(/* @__PURE__ */ _uppercase(params));
				},
				trim() {
					return this.check(/* @__PURE__ */ _trim());
				},
				normalize(...args) {
					return this.check(/* @__PURE__ */ _normalize(...args));
				},
				toLowerCase() {
					return this.check(/* @__PURE__ */ _toLowerCase());
				},
				toUpperCase() {
					return this.check(/* @__PURE__ */ _toUpperCase());
				},
				slugify() {
					return this.check(/* @__PURE__ */ _slugify());
				}
			});
		});
		const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
			$ZodString.init(inst, def);
			_ZodString.init(inst, def);
			inst.email = (params) => inst.check(/* @__PURE__ */ _email(ZodEmail, params));
			inst.url = (params) => inst.check(/* @__PURE__ */ _url(ZodURL, params));
			inst.jwt = (params) => inst.check(/* @__PURE__ */ _jwt(ZodJWT, params));
			inst.emoji = (params) => inst.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.uuid = (params) => inst.check(/* @__PURE__ */ _uuid(ZodUUID, params));
			inst.uuidv4 = (params) => inst.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
			inst.uuidv6 = (params) => inst.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
			inst.uuidv7 = (params) => inst.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
			inst.nanoid = (params) => inst.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
			inst.guid = (params) => inst.check(/* @__PURE__ */ _guid(ZodGUID, params));
			inst.cuid = (params) => inst.check(/* @__PURE__ */ _cuid(ZodCUID, params));
			inst.cuid2 = (params) => inst.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
			inst.ulid = (params) => inst.check(/* @__PURE__ */ _ulid(ZodULID, params));
			inst.base64 = (params) => inst.check(/* @__PURE__ */ _base64(ZodBase64, params));
			inst.base64url = (params) => inst.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
			inst.xid = (params) => inst.check(/* @__PURE__ */ _xid(ZodXID, params));
			inst.ksuid = (params) => inst.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
			inst.ipv4 = (params) => inst.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
			inst.ipv6 = (params) => inst.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
			inst.cidrv4 = (params) => inst.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
			inst.cidrv6 = (params) => inst.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
			inst.e164 = (params) => inst.check(/* @__PURE__ */ _e164(ZodE164, params));
			inst.datetime = (params) => inst.check(datetime(params));
			inst.date = (params) => inst.check(date(params));
			inst.time = (params) => inst.check(time(params));
			inst.duration = (params) => inst.check(duration(params));
		});
		function string(params) {
			return /* @__PURE__ */ _string(ZodString, params);
		}
		const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
			$ZodStringFormat.init(inst, def);
			_ZodString.init(inst, def);
		});
		const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
			$ZodEmail.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
			$ZodGUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
			$ZodUUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
			$ZodURL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
			$ZodEmoji.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
			$ZodNanoID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		/**
		* @deprecated CUID v1 is deprecated by its authors due to information leakage
		* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
		* See https://github.com/paralleldrive/cuid.
		*/
		const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
			$ZodCUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
			$ZodCUID2.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
			$ZodULID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
			$ZodXID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
			$ZodKSUID.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
			$ZodIPv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
			$ZodIPv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
			$ZodCIDRv4.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
			$ZodCIDRv6.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
			$ZodBase64.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
			$ZodBase64URL.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
			$ZodE164.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
			$ZodJWT.init(inst, def);
			ZodStringFormat.init(inst, def);
		});
		const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
			$ZodNumber.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
			_installLazyMethods(inst, "ZodNumber", {
				gt(value, params) {
					return this.check(/* @__PURE__ */ _gt(value, params));
				},
				gte(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				min(value, params) {
					return this.check(/* @__PURE__ */ _gte(value, params));
				},
				lt(value, params) {
					return this.check(/* @__PURE__ */ _lt(value, params));
				},
				lte(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				max(value, params) {
					return this.check(/* @__PURE__ */ _lte(value, params));
				},
				int(params) {
					return this.check(int(params));
				},
				safe(params) {
					return this.check(int(params));
				},
				positive(params) {
					return this.check(/* @__PURE__ */ _gt(0, params));
				},
				nonnegative(params) {
					return this.check(/* @__PURE__ */ _gte(0, params));
				},
				negative(params) {
					return this.check(/* @__PURE__ */ _lt(0, params));
				},
				nonpositive(params) {
					return this.check(/* @__PURE__ */ _lte(0, params));
				},
				multipleOf(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				step(value, params) {
					return this.check(/* @__PURE__ */ _multipleOf(value, params));
				},
				finite() {
					return this;
				}
			});
			const bag = inst._zod.bag;
			inst.minValue = Math.max(bag.minimum ?? Number.NEGATIVE_INFINITY, bag.exclusiveMinimum ?? Number.NEGATIVE_INFINITY) ?? null;
			inst.maxValue = Math.min(bag.maximum ?? Number.POSITIVE_INFINITY, bag.exclusiveMaximum ?? Number.POSITIVE_INFINITY) ?? null;
			inst.isInt = (bag.format ?? "").includes("int") || Number.isSafeInteger(bag.multipleOf ?? .5);
			inst.isFinite = true;
			inst.format = bag.format ?? null;
		});
		function number(params) {
			return /* @__PURE__ */ _number(ZodNumber, params);
		}
		const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
			$ZodNumberFormat.init(inst, def);
			ZodNumber.init(inst, def);
		});
		function int(params) {
			return /* @__PURE__ */ _int(ZodNumberFormat, params);
		}
		const ZodBoolean = /*@__PURE__*/ $constructor("ZodBoolean", (inst, def) => {
			$ZodBoolean.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
		});
		function boolean(params) {
			return /* @__PURE__ */ _boolean(ZodBoolean, params);
		}
		const ZodUndefined = /*@__PURE__*/ $constructor("ZodUndefined", (inst, def) => {
			$ZodUndefined.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => undefinedProcessor(inst, ctx, json, params);
		});
		function _undefined(params) {
			return /* @__PURE__ */ _undefined$1(ZodUndefined, params);
		}
		const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
			$ZodUnknown.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => void 0;
		});
		function unknown() {
			return /* @__PURE__ */ _unknown(ZodUnknown);
		}
		const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
			$ZodNever.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
		});
		function never(params) {
			return /* @__PURE__ */ _never(ZodNever, params);
		}
		const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
			$ZodArray.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
			inst.element = def.element;
			_installLazyMethods(inst, "ZodArray", {
				min(n, params) {
					return this.check(/* @__PURE__ */ _minLength(n, params));
				},
				nonempty(params) {
					return this.check(/* @__PURE__ */ _minLength(1, params));
				},
				max(n, params) {
					return this.check(/* @__PURE__ */ _maxLength(n, params));
				},
				length(n, params) {
					return this.check(/* @__PURE__ */ _length(n, params));
				},
				unwrap() {
					return this.element;
				}
			});
		});
		function array(element, params) {
			return /* @__PURE__ */ _array(ZodArray, element, params);
		}
		const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
			$ZodObjectJIT.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
			defineLazy(inst, "shape", () => {
				return def.shape;
			});
			_installLazyMethods(inst, "ZodObject", {
				keyof() {
					return _enum(Object.keys(this._zod.def.shape));
				},
				catchall(catchall) {
					return this.clone({
						...this._zod.def,
						catchall
					});
				},
				passthrough() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				loose() {
					return this.clone({
						...this._zod.def,
						catchall: unknown()
					});
				},
				strict() {
					return this.clone({
						...this._zod.def,
						catchall: never()
					});
				},
				strip() {
					return this.clone({
						...this._zod.def,
						catchall: void 0
					});
				},
				extend(incoming) {
					return extend(this, incoming);
				},
				safeExtend(incoming) {
					return safeExtend(this, incoming);
				},
				merge(other) {
					return merge(this, other);
				},
				pick(mask) {
					return pick(this, mask);
				},
				omit(mask) {
					return omit(this, mask);
				},
				partial(...args) {
					return partial(ZodOptional, this, args[0]);
				},
				required(...args) {
					return required(ZodNonOptional, this, args[0]);
				}
			});
		});
		function object(shape, params) {
			const def = {
				type: "object",
				shape: shape ?? {},
				...normalizeParams(params)
			};
			return new ZodObject(def);
		}
		const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
			$ZodUnion.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
			inst.options = def.options;
		});
		function union(options, params) {
			return new ZodUnion({
				type: "union",
				options,
				...normalizeParams(params)
			});
		}
		const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
			$ZodIntersection.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
		});
		function intersection(left, right) {
			return new ZodIntersection({
				type: "intersection",
				left,
				right
			});
		}
		const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
			$ZodEnum.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
			inst.enum = def.entries;
			inst.options = Object.values(def.entries);
			const keys = new Set(Object.keys(def.entries));
			inst.extract = (values, params) => {
				const newEntries = {};
				for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
			inst.exclude = (values, params) => {
				const newEntries = { ...def.entries };
				for (const value of values) if (keys.has(value)) delete newEntries[value];
				else throw new Error(`Key ${value} not found in enum`);
				return new ZodEnum({
					...def,
					checks: [],
					...normalizeParams(params),
					entries: newEntries
				});
			};
		});
		function _enum(values, params) {
			const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
			return new ZodEnum({
				type: "enum",
				entries,
				...normalizeParams(params)
			});
		}
		const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
			$ZodLiteral.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
			inst.values = new Set(def.values);
			Object.defineProperty(inst, "value", { get() {
				if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
				return def.values[0];
			} });
		});
		function literal(value, params) {
			return new ZodLiteral({
				type: "literal",
				values: Array.isArray(value) ? value : [value],
				...normalizeParams(params)
			});
		}
		const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
			$ZodTransform.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
			inst._zod.parse = (payload, _ctx) => {
				if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
				payload.addIssue = (issue$1) => {
					if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
					else {
						const _issue = issue$1;
						if (_issue.fatal) _issue.continue = false;
						_issue.code ?? (_issue.code = "custom");
						_issue.input ?? (_issue.input = payload.value);
						_issue.inst ?? (_issue.inst = inst);
						payload.issues.push(issue(_issue));
					}
				};
				const output = def.transform(payload.value, payload);
				if (output instanceof Promise) return output.then((output) => {
					payload.value = output;
					payload.fallback = true;
					return payload;
				});
				payload.value = output;
				payload.fallback = true;
				return payload;
			};
		});
		function transform(fn) {
			return new ZodTransform({
				type: "transform",
				transform: fn
			});
		}
		const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
			$ZodOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function optional(innerType) {
			return new ZodOptional({
				type: "optional",
				innerType
			});
		}
		const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
			$ZodExactOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function exactOptional(innerType) {
			return new ZodExactOptional({
				type: "optional",
				innerType
			});
		}
		const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
			$ZodNullable.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nullable(innerType) {
			return new ZodNullable({
				type: "nullable",
				innerType
			});
		}
		const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
			$ZodDefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeDefault = inst.unwrap;
		});
		function _default(innerType, defaultValue) {
			return new ZodDefault({
				type: "default",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
			$ZodPrefault.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function prefault(innerType, defaultValue) {
			return new ZodPrefault({
				type: "prefault",
				innerType,
				get defaultValue() {
					return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
				}
			});
		}
		const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
			$ZodNonOptional.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function nonoptional(innerType, params) {
			return new ZodNonOptional({
				type: "nonoptional",
				innerType,
				...normalizeParams(params)
			});
		}
		const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
			$ZodCatch.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
			inst.removeCatch = inst.unwrap;
		});
		function _catch(innerType, catchValue) {
			return new ZodCatch({
				type: "catch",
				innerType,
				catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
			});
		}
		const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
			$ZodPipe.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
			inst.in = def.in;
			inst.out = def.out;
		});
		function pipe(in_, out) {
			return new ZodPipe({
				type: "pipe",
				in: in_,
				out
			});
		}
		const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
			$ZodReadonly.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
			inst.unwrap = () => inst._zod.def.innerType;
		});
		function readonly(innerType) {
			return new ZodReadonly({
				type: "readonly",
				innerType
			});
		}
		const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
			$ZodCustom.init(inst, def);
			ZodType.init(inst, def);
			inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
		});
		function refine(fn, _params = {}) {
			return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
		}
		function superRefine(fn, params) {
			return /* @__PURE__ */ _superRefine(fn, params);
		}
		//#endregion
		//#region lib/typert.remote-client.js
		const dsh_fund_portfolio_fundPortfolio_accountCreate_parameter_0$schema = object({ "name": string() });
		const dsh_fund_portfolio_fundPortfolio_accountCreate_result$schema = object({
			"id": intersection(string(), unknown()),
			"name": string(),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_accountDelete_parameter_0$schema = object({
			"id": intersection(string(), unknown()),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_accountDelete_result$schema = object({ "ok": boolean() });
		const dsh_fund_portfolio_fundPortfolio_accountList_parameter_0$schema = object({ "unused": _undefined().readonly().optional() });
		const dsh_fund_portfolio_fundPortfolio_accountList_result$schema = array(object({
			"id": intersection(string(), unknown()),
			"name": string(),
			"version": number()
		}));
		const dsh_fund_portfolio_fundPortfolio_accountUpdate_parameter_0$schema = object({
			"id": intersection(string(), unknown()),
			"version": number(),
			"name": string()
		});
		const dsh_fund_portfolio_fundPortfolio_accountUpdate_result$schema = object({
			"id": intersection(string(), unknown()),
			"name": string(),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_allocationUpdate_parameter_0$schema = object({
			"accountId": intersection(string(), unknown()),
			"allocations": array(object({
				"id": intersection(string(), unknown()),
				"version": number(),
				"targetRatio": string()
			}))
		});
		const dsh_fund_portfolio_fundPortfolio_allocationUpdate_result$schema = array(object({
			"id": intersection(string(), unknown()),
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string(),
			"targetRatio": union([literal(null), string()]),
			"version": number()
		}));
		const dsh_fund_portfolio_fundPortfolio_exportData_parameter_0$schema = object({ "unused": _undefined().readonly().optional() });
		const dsh_fund_portfolio_fundPortfolio_exportData_result$schema = object({
			"filename": string(),
			"json": string()
		});
		const dsh_fund_portfolio_fundPortfolio_holdingAdd_parameter_0$schema = object({
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string()
		});
		const dsh_fund_portfolio_fundPortfolio_holdingAdd_result$schema = object({
			"id": intersection(string(), unknown()),
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string(),
			"targetRatio": union([literal(null), string()]),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_holdingDelete_parameter_0$schema = object({
			"id": intersection(string(), unknown()),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_holdingDelete_result$schema = object({ "ok": boolean() });
		const dsh_fund_portfolio_fundPortfolio_holdingList_parameter_0$schema = object({ "unused": _undefined().readonly().optional() });
		const dsh_fund_portfolio_fundPortfolio_holdingList_result$schema = array(object({
			"id": intersection(string(), unknown()),
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string(),
			"targetRatio": union([literal(null), string()]),
			"version": number()
		}));
		const dsh_fund_portfolio_fundPortfolio_holdingUpdate_parameter_0$schema = object({
			"id": intersection(string(), unknown()),
			"version": number(),
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string()
		});
		const dsh_fund_portfolio_fundPortfolio_holdingUpdate_result$schema = object({
			"id": intersection(string(), unknown()),
			"accountId": intersection(string(), unknown()),
			"fundCode": string(),
			"shares": string(),
			"costPrice": string(),
			"targetRatio": union([literal(null), string()]),
			"version": number()
		});
		const dsh_fund_portfolio_fundPortfolio_importData_parameter_0$schema = object({
			"json": string(),
			"previewToken": string(),
			"mode": union([literal("merge"), literal("replace")])
		});
		const dsh_fund_portfolio_fundPortfolio_importData_result$schema = object({ "ok": boolean() });
		const dsh_fund_portfolio_fundPortfolio_lookup_parameter_0$schema = object({ "code": string() });
		const dsh_fund_portfolio_fundPortfolio_lookup_result$schema = object({
			"code": string(),
			"name": string(),
			"kind": union([
				literal("nav"),
				literal("qdii"),
				literal("money")
			]),
			"currency": literal("CNY"),
			"fetchedAt": string()
		});
		const dsh_fund_portfolio_fundPortfolio_previewImport_parameter_0$schema = object({ "json": string() });
		const dsh_fund_portfolio_fundPortfolio_previewImport_result$schema = object({
			"previewToken": string(),
			"accounts": number(),
			"holdings": number(),
			"conflicts": array(string())
		});
		const dsh_fund_portfolio_fundPortfolio_summary_parameter_0$schema = object({
			"accountId": union([_undefined(), intersection(string(), unknown())]).optional(),
			"refresh": union([
				_undefined(),
				literal(false),
				literal(true)
			]).optional(),
			"force": union([
				_undefined(),
				literal(false),
				literal(true)
			]).optional()
		});
		const dsh_fund_portfolio_fundPortfolio_summary_result$schema = object({
			"date": string(),
			"accounts": array(object({
				"id": intersection(string(), unknown()),
				"name": string(),
				"version": number()
			})),
			"holdings": array(object({
				"holding": object({
					"id": intersection(string(), unknown()),
					"accountId": intersection(string(), unknown()),
					"fundCode": string(),
					"shares": string(),
					"costPrice": string(),
					"targetRatio": union([literal(null), string()]),
					"version": number()
				}),
				"accountName": string(),
				"fund": object({
					"code": string(),
					"name": string(),
					"kind": union([
						literal("nav"),
						literal("qdii"),
						literal("money")
					]),
					"currency": literal("CNY"),
					"fetchedAt": string()
				}),
				"quote": object({
					"code": string(),
					"navs": array(object({
						"date": string(),
						"value": string(),
						"annualYield": union([literal(null), string()]),
						"action": union([literal(null), string()])
					})),
					"estimate": union([literal(null), object({
						"date": string(),
						"time": string(),
						"value": string(),
						"referenceValue": string(),
						"referenceDate": union([literal(null), string()])
					})]),
					"navFetchedAt": union([literal(null), string()]),
					"estimateFetchedAt": union([literal(null), string()]),
					"error": union([literal(null), string()])
				}),
				"cost": string(),
				"marketValue": union([literal(null), string()]),
				"priceKind": union([
					literal(null),
					literal("nav"),
					literal("money"),
					literal("estimate")
				]),
				"priceDate": union([literal(null), string()]),
				"floatingProfit": union([literal(null), string()]),
				"floatingRate": union([literal(null), string()]),
				"confirmed": union([literal(null), object({
					"amount": string(),
					"date": string(),
					"basisDate": union([literal(null), string()]),
					"kind": union([literal("confirmed"), literal("estimated")])
				})]),
				"estimated": union([literal(null), object({
					"amount": string(),
					"date": string(),
					"basisDate": union([literal(null), string()]),
					"kind": union([literal("confirmed"), literal("estimated")])
				})]),
				"today": union([literal(null), object({
					"amount": string(),
					"date": string(),
					"basisDate": union([literal(null), string()]),
					"kind": union([literal("confirmed"), literal("estimated")])
				})]),
				"referenceChange": union([literal(null), string()]),
				"issue": union([
					literal(null),
					literal("pending"),
					literal("review"),
					literal("baseline"),
					literal("unavailable")
				]),
				"currentRatio": union([literal(null), string()]),
				"rebalance": union([literal(null), object({
					"action": union([
						literal("buy"),
						literal("sell"),
						literal("hold")
					]),
					"amount": string(),
					"shares": string()
				})])
			})),
			"cost": string(),
			"marketValue": union([literal(null), string()]),
			"marketCovered": number(),
			"floatingProfit": union([literal(null), string()]),
			"floatingCovered": number(),
			"confirmedToday": union([literal(null), string()]),
			"estimatedToday": union([literal(null), string()]),
			"todayTotal": union([literal(null), string()]),
			"confirmedCount": number(),
			"estimatedCount": number(),
			"missingCount": number(),
			"refreshIntervalMs": number(),
			"allocation": union([literal(null), object({
				"status": union([
					literal("unconfigured"),
					literal("invalid-target-total"),
					literal("market-incomplete"),
					literal("ready")
				]),
				"holdings": number(),
				"configured": number(),
				"targetTotal": string(),
				"buyAmount": union([literal(null), string()]),
				"sellAmount": union([literal(null), string()])
			})])
		});
		const TYPERT_REMOTE = {
			package: "dsh-fund-portfolio",
			descriptors: [
				{
					id: "dsh-fund-portfolio#fundPortfolio/accountCreate",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "accountCreate",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#AccountInput",
							create: () => dsh_fund_portfolio_fundPortfolio_accountCreate_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Account",
						create: () => dsh_fund_portfolio_fundPortfolio_accountCreate_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 69,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/accountDelete",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "accountDelete",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#AccountRef",
							create: () => dsh_fund_portfolio_fundPortfolio_accountDelete_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#MutationResult",
						create: () => dsh_fund_portfolio_fundPortfolio_accountDelete_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 81,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/accountList",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "accountList",
					invocation: { kind: "direct" },
					parameters: [{
						name: "_request",
						wire: "_request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#EmptyInput",
							create: () => dsh_fund_portfolio_fundPortfolio_accountList_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio#fundPortfolio/accountList:result",
						create: () => dsh_fund_portfolio_fundPortfolio_accountList_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 63,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/accountUpdate",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "accountUpdate",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#AccountEdit",
							create: () => dsh_fund_portfolio_fundPortfolio_accountUpdate_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Account",
						create: () => dsh_fund_portfolio_fundPortfolio_accountUpdate_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 75,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/allocationUpdate",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "allocationUpdate",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#AllocationUpdateInput",
							create: () => dsh_fund_portfolio_fundPortfolio_allocationUpdate_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio#fundPortfolio/allocationUpdate:result",
						create: () => dsh_fund_portfolio_fundPortfolio_allocationUpdate_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 123,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/exportData",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "exportData",
					invocation: { kind: "direct" },
					parameters: [{
						name: "_request",
						wire: "_request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#EmptyInput",
							create: () => dsh_fund_portfolio_fundPortfolio_exportData_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#BackupFile",
						create: () => dsh_fund_portfolio_fundPortfolio_exportData_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 156,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/holdingAdd",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "holdingAdd",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#HoldingInput",
							create: () => dsh_fund_portfolio_fundPortfolio_holdingAdd_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Holding",
						create: () => dsh_fund_portfolio_fundPortfolio_holdingAdd_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 102,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/holdingDelete",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "holdingDelete",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#HoldingRef",
							create: () => dsh_fund_portfolio_fundPortfolio_holdingDelete_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#MutationResult",
						create: () => dsh_fund_portfolio_fundPortfolio_holdingDelete_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 114,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/holdingList",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "holdingList",
					invocation: { kind: "direct" },
					parameters: [{
						name: "_request",
						wire: "_request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#EmptyInput",
							create: () => dsh_fund_portfolio_fundPortfolio_holdingList_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio#fundPortfolio/holdingList:result",
						create: () => dsh_fund_portfolio_fundPortfolio_holdingList_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 96,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/holdingUpdate",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "holdingUpdate",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#HoldingEdit",
							create: () => dsh_fund_portfolio_fundPortfolio_holdingUpdate_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Holding",
						create: () => dsh_fund_portfolio_fundPortfolio_holdingUpdate_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 108,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/importData",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "importData",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#ImportCommit",
							create: () => dsh_fund_portfolio_fundPortfolio_importData_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#MutationResult",
						create: () => dsh_fund_portfolio_fundPortfolio_importData_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 171,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/lookup",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "lookup",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#LookupInput",
							create: () => dsh_fund_portfolio_fundPortfolio_lookup_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Fund",
						create: () => dsh_fund_portfolio_fundPortfolio_lookup_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 90,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/previewImport",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "previewImport",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#ImportInput",
							create: () => dsh_fund_portfolio_fundPortfolio_previewImport_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#ImportPreview",
						create: () => dsh_fund_portfolio_fundPortfolio_previewImport_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 165,
						"column": 9
					}
				},
				{
					id: "dsh-fund-portfolio#fundPortfolio/summary",
					service: "fundPortfolio",
					namespace: "fundPortfolio",
					method: "summary",
					invocation: { kind: "direct" },
					parameters: [{
						name: "request",
						wire: "request",
						source: "json",
						codec: {
							mode: "strict",
							typeSymbol: "dsh-fund-portfolio/types#PortfolioInput",
							create: () => dsh_fund_portfolio_fundPortfolio_summary_parameter_0$schema
						}
					}],
					cancellation: { parameter: "signal" },
					result: {
						mode: "strict",
						typeSymbol: "dsh-fund-portfolio/types#Portfolio",
						create: () => dsh_fund_portfolio_fundPortfolio_summary_result$schema
					},
					sourceLocation: {
						"file": "packages/portfolio/src/index.ts",
						"line": 129,
						"column": 9
					}
				}
			]
		};
		//#endregion
		//#region node_modules/.pnpm/decimal.js@10.6.0/node_modules/decimal.js/decimal.mjs
		/*!
		*  decimal.js v10.6.0
		*  An arbitrary-precision Decimal type for JavaScript.
		*  https://github.com/MikeMcl/decimal.js
		*  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
		*  MIT Licence
		*/
		var EXP_LIMIT = 9e15;
		var MAX_DIGITS = 1e9;
		var NUMERALS = "0123456789abcdef";
		var LN10 = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
		var PI = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
		var DEFAULTS = {
			precision: 20,
			rounding: 4,
			modulo: 1,
			toExpNeg: -7,
			toExpPos: 21,
			minE: -EXP_LIMIT,
			maxE: EXP_LIMIT,
			crypto: false
		};
		var inexact;
		var quadrant;
		var external = true;
		var decimalError = "[DecimalError] ";
		var invalidArgument = decimalError + "Invalid argument: ";
		var precisionLimitExceeded = decimalError + "Precision limit exceeded";
		var cryptoUnavailable = decimalError + "crypto unavailable";
		var tag = "[object Decimal]";
		var mathfloor = Math.floor;
		var mathpow = Math.pow;
		var isBinary = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
		var isHex = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
		var isOctal = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
		var isDecimal = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
		var BASE = 1e7;
		var LOG_BASE = 7;
		var MAX_SAFE_INTEGER = 9007199254740991;
		var LN10_PRECISION = LN10.length - 1;
		var PI_PRECISION = PI.length - 1;
		var P = { toStringTag: tag };
		P.absoluteValue = P.abs = function() {
			var x = new this.constructor(this);
			if (x.s < 0) x.s = 1;
			return finalise(x);
		};
		P.ceil = function() {
			return finalise(new this.constructor(this), this.e + 1, 2);
		};
		P.clampedTo = P.clamp = function(min, max) {
			var k, x = this, Ctor = x.constructor;
			min = new Ctor(min);
			max = new Ctor(max);
			if (!min.s || !max.s) return new Ctor(NaN);
			if (min.gt(max)) throw Error(invalidArgument + max);
			k = x.cmp(min);
			return k < 0 ? min : x.cmp(max) > 0 ? max : new Ctor(x);
		};
		P.comparedTo = P.cmp = function(y) {
			var i, j, xdL, ydL, x = this, xd = x.d, yd = (y = new x.constructor(y)).d, xs = x.s, ys = y.s;
			if (!xd || !yd) return !xs || !ys ? NaN : xs !== ys ? xs : xd === yd ? 0 : !xd ^ xs < 0 ? 1 : -1;
			if (!xd[0] || !yd[0]) return xd[0] ? xs : yd[0] ? -ys : 0;
			if (xs !== ys) return xs;
			if (x.e !== y.e) return x.e > y.e ^ xs < 0 ? 1 : -1;
			xdL = xd.length;
			ydL = yd.length;
			for (i = 0, j = xdL < ydL ? xdL : ydL; i < j; ++i) if (xd[i] !== yd[i]) return xd[i] > yd[i] ^ xs < 0 ? 1 : -1;
			return xdL === ydL ? 0 : xdL > ydL ^ xs < 0 ? 1 : -1;
		};
		P.cosine = P.cos = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.d) return new Ctor(NaN);
			if (!x.d[0]) return new Ctor(1);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
			Ctor.rounding = 1;
			x = cosine(Ctor, toLessThanHalfPi(Ctor, x));
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant == 2 || quadrant == 3 ? x.neg() : x, pr, rm, true);
		};
		P.cubeRoot = P.cbrt = function() {
			var e, m, n, r, rep, s, sd, t, t3, t3plusx, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			external = false;
			s = x.s * mathpow(x.s * x, 1 / 3);
			if (!s || Math.abs(s) == Infinity) {
				n = digitsToString(x.d);
				e = x.e;
				if (s = (e - n.length + 1) % 3) n += s == 1 || s == -2 ? "0" : "00";
				s = mathpow(n, 1 / 3);
				e = mathfloor((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2));
				if (s == Infinity) n = "5e" + e;
				else {
					n = s.toExponential();
					n = n.slice(0, n.indexOf("e") + 1) + e;
				}
				r = new Ctor(n);
				r.s = x.s;
			} else r = new Ctor(s.toString());
			sd = (e = Ctor.precision) + 3;
			for (;;) {
				t = r;
				t3 = t.times(t).times(t);
				t3plusx = t3.plus(x);
				r = divide(t3plusx.plus(x).times(t), t3plusx.plus(t3), sd + 2, 1);
				if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
					n = n.slice(sd - 3, sd + 1);
					if (n == "9999" || !rep && n == "4999") {
						if (!rep) {
							finalise(t, e + 1, 0);
							if (t.times(t).times(t).eq(x)) {
								r = t;
								break;
							}
						}
						sd += 4;
						rep = 1;
					} else {
						if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
							finalise(r, e + 1, 1);
							m = !r.times(r).times(r).eq(x);
						}
						break;
					}
				}
			}
			external = true;
			return finalise(r, e, Ctor.rounding, m);
		};
		P.decimalPlaces = P.dp = function() {
			var w, d = this.d, n = NaN;
			if (d) {
				w = d.length - 1;
				n = (w - mathfloor(this.e / LOG_BASE)) * LOG_BASE;
				w = d[w];
				if (w) for (; w % 10 == 0; w /= 10) n--;
				if (n < 0) n = 0;
			}
			return n;
		};
		P.dividedBy = P.div = function(y) {
			return divide(this, new this.constructor(y));
		};
		P.dividedToIntegerBy = P.divToInt = function(y) {
			var x = this, Ctor = x.constructor;
			return finalise(divide(x, new Ctor(y), 0, 1, 1), Ctor.precision, Ctor.rounding);
		};
		P.equals = P.eq = function(y) {
			return this.cmp(y) === 0;
		};
		P.floor = function() {
			return finalise(new this.constructor(this), this.e + 1, 3);
		};
		P.greaterThan = P.gt = function(y) {
			return this.cmp(y) > 0;
		};
		P.greaterThanOrEqualTo = P.gte = function(y) {
			var k = this.cmp(y);
			return k == 1 || k === 0;
		};
		P.hyperbolicCosine = P.cosh = function() {
			var k, n, pr, rm, len, x = this, Ctor = x.constructor, one = new Ctor(1);
			if (!x.isFinite()) return new Ctor(x.s ? Infinity : NaN);
			if (x.isZero()) return one;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
			Ctor.rounding = 1;
			len = x.d.length;
			if (len < 32) {
				k = Math.ceil(len / 3);
				n = (1 / tinyPow(4, k)).toString();
			} else {
				k = 16;
				n = "2.3283064365386962890625e-10";
			}
			x = taylorSeries(Ctor, 1, x.times(n), new Ctor(1), true);
			var cosh2_x, i = k, d8 = new Ctor(8);
			for (; i--;) {
				cosh2_x = x.times(x);
				x = one.minus(cosh2_x.times(d8.minus(cosh2_x.times(d8))));
			}
			return finalise(x, Ctor.precision = pr, Ctor.rounding = rm, true);
		};
		P.hyperbolicSine = P.sinh = function() {
			var k, pr, rm, len, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + 4;
			Ctor.rounding = 1;
			len = x.d.length;
			if (len < 3) x = taylorSeries(Ctor, 2, x, x, true);
			else {
				k = 1.4 * Math.sqrt(len);
				k = k > 16 ? 16 : k | 0;
				x = x.times(1 / tinyPow(5, k));
				x = taylorSeries(Ctor, 2, x, x, true);
				var sinh2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
				for (; k--;) {
					sinh2_x = x.times(x);
					x = x.times(d5.plus(sinh2_x.times(d16.times(sinh2_x).plus(d20))));
				}
			}
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(x, pr, rm, true);
		};
		P.hyperbolicTangent = P.tanh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(x.s);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 7;
			Ctor.rounding = 1;
			return divide(x.sinh(), x.cosh(), Ctor.precision = pr, Ctor.rounding = rm);
		};
		P.inverseCosine = P.acos = function() {
			var x = this, Ctor = x.constructor, k = x.abs().cmp(1), pr = Ctor.precision, rm = Ctor.rounding;
			if (k !== -1) return k === 0 ? x.isNeg() ? getPi(Ctor, pr, rm) : new Ctor(0) : new Ctor(NaN);
			if (x.isZero()) return getPi(Ctor, pr + 4, rm).times(.5);
			Ctor.precision = pr + 6;
			Ctor.rounding = 1;
			x = new Ctor(1).minus(x).div(x.plus(1)).sqrt().atan();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(2);
		};
		P.inverseHyperbolicCosine = P.acosh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (x.lte(1)) return new Ctor(x.eq(1) ? 0 : NaN);
			if (!x.isFinite()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(Math.abs(x.e), x.sd()) + 4;
			Ctor.rounding = 1;
			external = false;
			x = x.times(x).minus(1).sqrt().plus(x);
			external = true;
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.ln();
		};
		P.inverseHyperbolicSine = P.asinh = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite() || x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 2 * Math.max(Math.abs(x.e), x.sd()) + 6;
			Ctor.rounding = 1;
			external = false;
			x = x.times(x).plus(1).sqrt().plus(x);
			external = true;
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.ln();
		};
		P.inverseHyperbolicTangent = P.atanh = function() {
			var pr, rm, wpr, xsd, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.e >= 0) return new Ctor(x.abs().eq(1) ? x.s / 0 : x.isZero() ? x : NaN);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			xsd = x.sd();
			if (Math.max(xsd, pr) < 2 * -x.e - 1) return finalise(new Ctor(x), pr, rm, true);
			Ctor.precision = wpr = xsd - x.e;
			x = divide(x.plus(1), new Ctor(1).minus(x), wpr + pr, 1);
			Ctor.precision = pr + 4;
			Ctor.rounding = 1;
			x = x.ln();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(.5);
		};
		P.inverseSine = P.asin = function() {
			var halfPi, k, pr, rm, x = this, Ctor = x.constructor;
			if (x.isZero()) return new Ctor(x);
			k = x.abs().cmp(1);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (k !== -1) {
				if (k === 0) {
					halfPi = getPi(Ctor, pr + 4, rm).times(.5);
					halfPi.s = x.s;
					return halfPi;
				}
				return new Ctor(NaN);
			}
			Ctor.precision = pr + 6;
			Ctor.rounding = 1;
			x = x.div(new Ctor(1).minus(x.times(x)).sqrt().plus(1)).atan();
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return x.times(2);
		};
		P.inverseTangent = P.atan = function() {
			var i, j, k, n, px, t, r, wpr, x2, x = this, Ctor = x.constructor, pr = Ctor.precision, rm = Ctor.rounding;
			if (!x.isFinite()) {
				if (!x.s) return new Ctor(NaN);
				if (pr + 4 <= PI_PRECISION) {
					r = getPi(Ctor, pr + 4, rm).times(.5);
					r.s = x.s;
					return r;
				}
			} else if (x.isZero()) return new Ctor(x);
			else if (x.abs().eq(1) && pr + 4 <= PI_PRECISION) {
				r = getPi(Ctor, pr + 4, rm).times(.25);
				r.s = x.s;
				return r;
			}
			Ctor.precision = wpr = pr + 10;
			Ctor.rounding = 1;
			k = Math.min(28, wpr / LOG_BASE + 2 | 0);
			for (i = k; i; --i) x = x.div(x.times(x).plus(1).sqrt().plus(1));
			external = false;
			j = Math.ceil(wpr / LOG_BASE);
			n = 1;
			x2 = x.times(x);
			r = new Ctor(x);
			px = x;
			for (; i !== -1;) {
				px = px.times(x2);
				t = r.minus(px.div(n += 2));
				px = px.times(x2);
				r = t.plus(px.div(n += 2));
				if (r.d[j] !== void 0) for (i = j; r.d[i] === t.d[i] && i--;);
			}
			if (k) r = r.times(2 << k - 1);
			external = true;
			return finalise(r, Ctor.precision = pr, Ctor.rounding = rm, true);
		};
		P.isFinite = function() {
			return !!this.d;
		};
		P.isInteger = P.isInt = function() {
			return !!this.d && mathfloor(this.e / LOG_BASE) > this.d.length - 2;
		};
		P.isNaN = function() {
			return !this.s;
		};
		P.isNegative = P.isNeg = function() {
			return this.s < 0;
		};
		P.isPositive = P.isPos = function() {
			return this.s > 0;
		};
		P.isZero = function() {
			return !!this.d && this.d[0] === 0;
		};
		P.lessThan = P.lt = function(y) {
			return this.cmp(y) < 0;
		};
		P.lessThanOrEqualTo = P.lte = function(y) {
			return this.cmp(y) < 1;
		};
		P.logarithm = P.log = function(base) {
			var isBase10, d, denominator, k, inf, num, sd, r, arg = this, Ctor = arg.constructor, pr = Ctor.precision, rm = Ctor.rounding, guard = 5;
			if (base == null) {
				base = new Ctor(10);
				isBase10 = true;
			} else {
				base = new Ctor(base);
				d = base.d;
				if (base.s < 0 || !d || !d[0] || base.eq(1)) return new Ctor(NaN);
				isBase10 = base.eq(10);
			}
			d = arg.d;
			if (arg.s < 0 || !d || !d[0] || arg.eq(1)) return new Ctor(d && !d[0] ? -Infinity : arg.s != 1 ? NaN : d ? 0 : Infinity);
			if (isBase10) if (d.length > 1) inf = true;
			else {
				for (k = d[0]; k % 10 === 0;) k /= 10;
				inf = k !== 1;
			}
			external = false;
			sd = pr + guard;
			num = naturalLogarithm(arg, sd);
			denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
			r = divide(num, denominator, sd, 1);
			if (checkRoundingDigits(r.d, k = pr, rm)) do {
				sd += 10;
				num = naturalLogarithm(arg, sd);
				denominator = isBase10 ? getLn10(Ctor, sd + 10) : naturalLogarithm(base, sd);
				r = divide(num, denominator, sd, 1);
				if (!inf) {
					if (+digitsToString(r.d).slice(k + 1, k + 15) + 1 == 0x5af3107a4000) r = finalise(r, pr + 1, 0);
					break;
				}
			} while (checkRoundingDigits(r.d, k += 10, rm));
			external = true;
			return finalise(r, pr, rm);
		};
		P.minus = P.sub = function(y) {
			var d, e, i, j, k, len, pr, rm, xd, xe, xLTy, yd, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.d) {
				if (!x.s || !y.s) y = new Ctor(NaN);
				else if (x.d) y.s = -y.s;
				else y = new Ctor(y.d || x.s !== y.s ? x : NaN);
				return y;
			}
			if (x.s != y.s) {
				y.s = -y.s;
				return x.plus(y);
			}
			xd = x.d;
			yd = y.d;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (!xd[0] || !yd[0]) {
				if (yd[0]) y.s = -y.s;
				else if (xd[0]) y = new Ctor(x);
				else return new Ctor(rm === 3 ? -0 : 0);
				return external ? finalise(y, pr, rm) : y;
			}
			e = mathfloor(y.e / LOG_BASE);
			xe = mathfloor(x.e / LOG_BASE);
			xd = xd.slice();
			k = xe - e;
			if (k) {
				xLTy = k < 0;
				if (xLTy) {
					d = xd;
					k = -k;
					len = yd.length;
				} else {
					d = yd;
					e = xe;
					len = xd.length;
				}
				i = Math.max(Math.ceil(pr / LOG_BASE), len) + 2;
				if (k > i) {
					k = i;
					d.length = 1;
				}
				d.reverse();
				for (i = k; i--;) d.push(0);
				d.reverse();
			} else {
				i = xd.length;
				len = yd.length;
				xLTy = i < len;
				if (xLTy) len = i;
				for (i = 0; i < len; i++) if (xd[i] != yd[i]) {
					xLTy = xd[i] < yd[i];
					break;
				}
				k = 0;
			}
			if (xLTy) {
				d = xd;
				xd = yd;
				yd = d;
				y.s = -y.s;
			}
			len = xd.length;
			for (i = yd.length - len; i > 0; --i) xd[len++] = 0;
			for (i = yd.length; i > k;) {
				if (xd[--i] < yd[i]) {
					for (j = i; j && xd[--j] === 0;) xd[j] = BASE - 1;
					--xd[j];
					xd[i] += BASE;
				}
				xd[i] -= yd[i];
			}
			for (; xd[--len] === 0;) xd.pop();
			for (; xd[0] === 0; xd.shift()) --e;
			if (!xd[0]) return new Ctor(rm === 3 ? -0 : 0);
			y.d = xd;
			y.e = getBase10Exponent(xd, e);
			return external ? finalise(y, pr, rm) : y;
		};
		P.modulo = P.mod = function(y) {
			var q, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.s || y.d && !y.d[0]) return new Ctor(NaN);
			if (!y.d || x.d && !x.d[0]) return finalise(new Ctor(x), Ctor.precision, Ctor.rounding);
			external = false;
			if (Ctor.modulo == 9) {
				q = divide(x, y.abs(), 0, 3, 1);
				q.s *= y.s;
			} else q = divide(x, y, 0, Ctor.modulo, 1);
			q = q.times(y);
			external = true;
			return x.minus(q);
		};
		P.naturalExponential = P.exp = function() {
			return naturalExponential(this);
		};
		P.naturalLogarithm = P.ln = function() {
			return naturalLogarithm(this);
		};
		P.negated = P.neg = function() {
			var x = new this.constructor(this);
			x.s = -x.s;
			return finalise(x);
		};
		P.plus = P.add = function(y) {
			var carry, d, e, i, k, len, pr, rm, xd, yd, x = this, Ctor = x.constructor;
			y = new Ctor(y);
			if (!x.d || !y.d) {
				if (!x.s || !y.s) y = new Ctor(NaN);
				else if (!x.d) y = new Ctor(y.d || x.s === y.s ? x : NaN);
				return y;
			}
			if (x.s != y.s) {
				y.s = -y.s;
				return x.minus(y);
			}
			xd = x.d;
			yd = y.d;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (!xd[0] || !yd[0]) {
				if (!yd[0]) y = new Ctor(x);
				return external ? finalise(y, pr, rm) : y;
			}
			k = mathfloor(x.e / LOG_BASE);
			e = mathfloor(y.e / LOG_BASE);
			xd = xd.slice();
			i = k - e;
			if (i) {
				if (i < 0) {
					d = xd;
					i = -i;
					len = yd.length;
				} else {
					d = yd;
					e = k;
					len = xd.length;
				}
				k = Math.ceil(pr / LOG_BASE);
				len = k > len ? k + 1 : len + 1;
				if (i > len) {
					i = len;
					d.length = 1;
				}
				d.reverse();
				for (; i--;) d.push(0);
				d.reverse();
			}
			len = xd.length;
			i = yd.length;
			if (len - i < 0) {
				i = len;
				d = yd;
				yd = xd;
				xd = d;
			}
			for (carry = 0; i;) {
				carry = (xd[--i] = xd[i] + yd[i] + carry) / BASE | 0;
				xd[i] %= BASE;
			}
			if (carry) {
				xd.unshift(carry);
				++e;
			}
			for (len = xd.length; xd[--len] == 0;) xd.pop();
			y.d = xd;
			y.e = getBase10Exponent(xd, e);
			return external ? finalise(y, pr, rm) : y;
		};
		P.precision = P.sd = function(z) {
			var k, x = this;
			if (z !== void 0 && z !== !!z && z !== 1 && z !== 0) throw Error(invalidArgument + z);
			if (x.d) {
				k = getPrecision(x.d);
				if (z && x.e + 1 > k) k = x.e + 1;
			} else k = NaN;
			return k;
		};
		P.round = function() {
			var x = this, Ctor = x.constructor;
			return finalise(new Ctor(x), x.e + 1, Ctor.rounding);
		};
		P.sine = P.sin = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + Math.max(x.e, x.sd()) + LOG_BASE;
			Ctor.rounding = 1;
			x = sine(Ctor, toLessThanHalfPi(Ctor, x));
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant > 2 ? x.neg() : x, pr, rm, true);
		};
		P.squareRoot = P.sqrt = function() {
			var m, n, sd, r, rep, t, x = this, d = x.d, e = x.e, s = x.s, Ctor = x.constructor;
			if (s !== 1 || !d || !d[0]) return new Ctor(!s || s < 0 && (!d || d[0]) ? NaN : d ? x : Infinity);
			external = false;
			s = Math.sqrt(+x);
			if (s == 0 || s == Infinity) {
				n = digitsToString(d);
				if ((n.length + e) % 2 == 0) n += "0";
				s = Math.sqrt(n);
				e = mathfloor((e + 1) / 2) - (e < 0 || e % 2);
				if (s == Infinity) n = "5e" + e;
				else {
					n = s.toExponential();
					n = n.slice(0, n.indexOf("e") + 1) + e;
				}
				r = new Ctor(n);
			} else r = new Ctor(s.toString());
			sd = (e = Ctor.precision) + 3;
			for (;;) {
				t = r;
				r = t.plus(divide(x, t, sd + 2, 1)).times(.5);
				if (digitsToString(t.d).slice(0, sd) === (n = digitsToString(r.d)).slice(0, sd)) {
					n = n.slice(sd - 3, sd + 1);
					if (n == "9999" || !rep && n == "4999") {
						if (!rep) {
							finalise(t, e + 1, 0);
							if (t.times(t).eq(x)) {
								r = t;
								break;
							}
						}
						sd += 4;
						rep = 1;
					} else {
						if (!+n || !+n.slice(1) && n.charAt(0) == "5") {
							finalise(r, e + 1, 1);
							m = !r.times(r).eq(x);
						}
						break;
					}
				}
			}
			external = true;
			return finalise(r, e, Ctor.rounding, m);
		};
		P.tangent = P.tan = function() {
			var pr, rm, x = this, Ctor = x.constructor;
			if (!x.isFinite()) return new Ctor(NaN);
			if (x.isZero()) return new Ctor(x);
			pr = Ctor.precision;
			rm = Ctor.rounding;
			Ctor.precision = pr + 10;
			Ctor.rounding = 1;
			x = x.sin();
			x.s = 1;
			x = divide(x, new Ctor(1).minus(x.times(x)).sqrt(), pr + 10, 0);
			Ctor.precision = pr;
			Ctor.rounding = rm;
			return finalise(quadrant == 2 || quadrant == 4 ? x.neg() : x, pr, rm, true);
		};
		P.times = P.mul = function(y) {
			var carry, e, i, k, r, rL, t, xdL, ydL, x = this, Ctor = x.constructor, xd = x.d, yd = (y = new Ctor(y)).d;
			y.s *= x.s;
			if (!xd || !xd[0] || !yd || !yd[0]) return new Ctor(!y.s || xd && !xd[0] && !yd || yd && !yd[0] && !xd ? NaN : !xd || !yd ? y.s / 0 : y.s * 0);
			e = mathfloor(x.e / LOG_BASE) + mathfloor(y.e / LOG_BASE);
			xdL = xd.length;
			ydL = yd.length;
			if (xdL < ydL) {
				r = xd;
				xd = yd;
				yd = r;
				rL = xdL;
				xdL = ydL;
				ydL = rL;
			}
			r = [];
			rL = xdL + ydL;
			for (i = rL; i--;) r.push(0);
			for (i = ydL; --i >= 0;) {
				carry = 0;
				for (k = xdL + i; k > i;) {
					t = r[k] + yd[i] * xd[k - i - 1] + carry;
					r[k--] = t % BASE | 0;
					carry = t / BASE | 0;
				}
				r[k] = (r[k] + carry) % BASE | 0;
			}
			for (; !r[--rL];) r.pop();
			if (carry) ++e;
			else r.shift();
			y.d = r;
			y.e = getBase10Exponent(r, e);
			return external ? finalise(y, Ctor.precision, Ctor.rounding) : y;
		};
		P.toBinary = function(sd, rm) {
			return toStringBinary(this, 2, sd, rm);
		};
		P.toDecimalPlaces = P.toDP = function(dp, rm) {
			var x = this, Ctor = x.constructor;
			x = new Ctor(x);
			if (dp === void 0) return x;
			checkInt32(dp, 0, MAX_DIGITS);
			if (rm === void 0) rm = Ctor.rounding;
			else checkInt32(rm, 0, 8);
			return finalise(x, dp + x.e + 1, rm);
		};
		P.toExponential = function(dp, rm) {
			var str, x = this, Ctor = x.constructor;
			if (dp === void 0) str = finiteToString(x, true);
			else {
				checkInt32(dp, 0, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				x = finalise(new Ctor(x), dp + 1, rm);
				str = finiteToString(x, true, dp + 1);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toFixed = function(dp, rm) {
			var str, y, x = this, Ctor = x.constructor;
			if (dp === void 0) str = finiteToString(x);
			else {
				checkInt32(dp, 0, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				y = finalise(new Ctor(x), dp + x.e + 1, rm);
				str = finiteToString(y, false, dp + y.e + 1);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toFraction = function(maxD) {
			var d, d0, d1, d2, e, k, n, n0, n1, pr, q, r, x = this, xd = x.d, Ctor = x.constructor;
			if (!xd) return new Ctor(x);
			n1 = d0 = new Ctor(1);
			d1 = n0 = new Ctor(0);
			d = new Ctor(d1);
			e = d.e = getPrecision(xd) - x.e - 1;
			k = e % LOG_BASE;
			d.d[0] = mathpow(10, k < 0 ? LOG_BASE + k : k);
			if (maxD == null) maxD = e > 0 ? d : n1;
			else {
				n = new Ctor(maxD);
				if (!n.isInt() || n.lt(n1)) throw Error(invalidArgument + n);
				maxD = n.gt(d) ? e > 0 ? d : n1 : n;
			}
			external = false;
			n = new Ctor(digitsToString(xd));
			pr = Ctor.precision;
			Ctor.precision = e = xd.length * LOG_BASE * 2;
			for (;;) {
				q = divide(n, d, 0, 1, 1);
				d2 = d0.plus(q.times(d1));
				if (d2.cmp(maxD) == 1) break;
				d0 = d1;
				d1 = d2;
				d2 = n1;
				n1 = n0.plus(q.times(d2));
				n0 = d2;
				d2 = d;
				d = n.minus(q.times(d2));
				n = d2;
			}
			d2 = divide(maxD.minus(d0), d1, 0, 1, 1);
			n0 = n0.plus(d2.times(n1));
			d0 = d0.plus(d2.times(d1));
			n0.s = n1.s = x.s;
			r = divide(n1, d1, e, 1).minus(x).abs().cmp(divide(n0, d0, e, 1).minus(x).abs()) < 1 ? [n1, d1] : [n0, d0];
			Ctor.precision = pr;
			external = true;
			return r;
		};
		P.toHexadecimal = P.toHex = function(sd, rm) {
			return toStringBinary(this, 16, sd, rm);
		};
		P.toNearest = function(y, rm) {
			var x = this, Ctor = x.constructor;
			x = new Ctor(x);
			if (y == null) {
				if (!x.d) return x;
				y = new Ctor(1);
				rm = Ctor.rounding;
			} else {
				y = new Ctor(y);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				if (!x.d) return y.s ? x : y;
				if (!y.d) {
					if (y.s) y.s = x.s;
					return y;
				}
			}
			if (y.d[0]) {
				external = false;
				x = divide(x, y, 0, rm, 1).times(y);
				external = true;
				finalise(x);
			} else {
				y.s = x.s;
				x = y;
			}
			return x;
		};
		P.toNumber = function() {
			return +this;
		};
		P.toOctal = function(sd, rm) {
			return toStringBinary(this, 8, sd, rm);
		};
		P.toPower = P.pow = function(y) {
			var e, k, pr, r, rm, s, x = this, Ctor = x.constructor, yn = +(y = new Ctor(y));
			if (!x.d || !y.d || !x.d[0] || !y.d[0]) return new Ctor(mathpow(+x, yn));
			x = new Ctor(x);
			if (x.eq(1)) return x;
			pr = Ctor.precision;
			rm = Ctor.rounding;
			if (y.eq(1)) return finalise(x, pr, rm);
			e = mathfloor(y.e / LOG_BASE);
			if (e >= y.d.length - 1 && (k = yn < 0 ? -yn : yn) <= MAX_SAFE_INTEGER) {
				r = intPow(Ctor, x, k, pr);
				return y.s < 0 ? new Ctor(1).div(r) : finalise(r, pr, rm);
			}
			s = x.s;
			if (s < 0) {
				if (e < y.d.length - 1) return new Ctor(NaN);
				if ((y.d[e] & 1) == 0) s = 1;
				if (x.e == 0 && x.d[0] == 1 && x.d.length == 1) {
					x.s = s;
					return x;
				}
			}
			k = mathpow(+x, yn);
			e = k == 0 || !isFinite(k) ? mathfloor(yn * (Math.log("0." + digitsToString(x.d)) / Math.LN10 + x.e + 1)) : new Ctor(k + "").e;
			if (e > Ctor.maxE + 1 || e < Ctor.minE - 1) return new Ctor(e > 0 ? s / 0 : 0);
			external = false;
			Ctor.rounding = x.s = 1;
			k = Math.min(12, (e + "").length);
			r = naturalExponential(y.times(naturalLogarithm(x, pr + k)), pr);
			if (r.d) {
				r = finalise(r, pr + 5, 1);
				if (checkRoundingDigits(r.d, pr, rm)) {
					e = pr + 10;
					r = finalise(naturalExponential(y.times(naturalLogarithm(x, e + k)), e), e + 5, 1);
					if (+digitsToString(r.d).slice(pr + 1, pr + 15) + 1 == 0x5af3107a4000) r = finalise(r, pr + 1, 0);
				}
			}
			r.s = s;
			external = true;
			Ctor.rounding = rm;
			return finalise(r, pr, rm);
		};
		P.toPrecision = function(sd, rm) {
			var str, x = this, Ctor = x.constructor;
			if (sd === void 0) str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			else {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
				x = finalise(new Ctor(x), sd, rm);
				str = finiteToString(x, sd <= x.e || x.e <= Ctor.toExpNeg, sd);
			}
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.toSignificantDigits = P.toSD = function(sd, rm) {
			var x = this, Ctor = x.constructor;
			if (sd === void 0) {
				sd = Ctor.precision;
				rm = Ctor.rounding;
			} else {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
			}
			return finalise(new Ctor(x), sd, rm);
		};
		P.toString = function() {
			var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			return x.isNeg() && !x.isZero() ? "-" + str : str;
		};
		P.truncated = P.trunc = function() {
			return finalise(new this.constructor(this), this.e + 1, 1);
		};
		P.valueOf = P.toJSON = function() {
			var x = this, Ctor = x.constructor, str = finiteToString(x, x.e <= Ctor.toExpNeg || x.e >= Ctor.toExpPos);
			return x.isNeg() ? "-" + str : str;
		};
		function digitsToString(d) {
			var i, k, ws, indexOfLastWord = d.length - 1, str = "", w = d[0];
			if (indexOfLastWord > 0) {
				str += w;
				for (i = 1; i < indexOfLastWord; i++) {
					ws = d[i] + "";
					k = LOG_BASE - ws.length;
					if (k) str += getZeroString(k);
					str += ws;
				}
				w = d[i];
				ws = w + "";
				k = LOG_BASE - ws.length;
				if (k) str += getZeroString(k);
			} else if (w === 0) return "0";
			for (; w % 10 === 0;) w /= 10;
			return str + w;
		}
		function checkInt32(i, min, max) {
			if (i !== ~~i || i < min || i > max) throw Error(invalidArgument + i);
		}
		function checkRoundingDigits(d, i, rm, repeating) {
			var di, k, r, rd;
			for (k = d[0]; k >= 10; k /= 10) --i;
			if (--i < 0) {
				i += LOG_BASE;
				di = 0;
			} else {
				di = Math.ceil((i + 1) / LOG_BASE);
				i %= LOG_BASE;
			}
			k = mathpow(10, LOG_BASE - i);
			rd = d[di] % k | 0;
			if (repeating == null) if (i < 3) {
				if (i == 0) rd = rd / 100 | 0;
				else if (i == 1) rd = rd / 10 | 0;
				r = rm < 4 && rd == 99999 || rm > 3 && rd == 49999 || rd == 5e4 || rd == 0;
			} else r = (rm < 4 && rd + 1 == k || rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 100 | 0) == mathpow(10, i - 2) - 1 || (rd == k / 2 || rd == 0) && (d[di + 1] / k / 100 | 0) == 0;
			else if (i < 4) {
				if (i == 0) rd = rd / 1e3 | 0;
				else if (i == 1) rd = rd / 100 | 0;
				else if (i == 2) rd = rd / 10 | 0;
				r = (repeating || rm < 4) && rd == 9999 || !repeating && rm > 3 && rd == 4999;
			} else r = ((repeating || rm < 4) && rd + 1 == k || !repeating && rm > 3 && rd + 1 == k / 2) && (d[di + 1] / k / 1e3 | 0) == mathpow(10, i - 3) - 1;
			return r;
		}
		function convertBase(str, baseIn, baseOut) {
			var j, arr = [0], arrL, i = 0, strL = str.length;
			for (; i < strL;) {
				for (arrL = arr.length; arrL--;) arr[arrL] *= baseIn;
				arr[0] += NUMERALS.indexOf(str.charAt(i++));
				for (j = 0; j < arr.length; j++) if (arr[j] > baseOut - 1) {
					if (arr[j + 1] === void 0) arr[j + 1] = 0;
					arr[j + 1] += arr[j] / baseOut | 0;
					arr[j] %= baseOut;
				}
			}
			return arr.reverse();
		}
		function cosine(Ctor, x) {
			var k, len, y;
			if (x.isZero()) return x;
			len = x.d.length;
			if (len < 32) {
				k = Math.ceil(len / 3);
				y = (1 / tinyPow(4, k)).toString();
			} else {
				k = 16;
				y = "2.3283064365386962890625e-10";
			}
			Ctor.precision += k;
			x = taylorSeries(Ctor, 1, x.times(y), new Ctor(1));
			for (var i = k; i--;) {
				var cos2x = x.times(x);
				x = cos2x.times(cos2x).minus(cos2x).times(8).plus(1);
			}
			Ctor.precision -= k;
			return x;
		}
		var divide = (function() {
			function multiplyInteger(x, k, base) {
				var temp, carry = 0, i = x.length;
				for (x = x.slice(); i--;) {
					temp = x[i] * k + carry;
					x[i] = temp % base | 0;
					carry = temp / base | 0;
				}
				if (carry) x.unshift(carry);
				return x;
			}
			function compare(a, b, aL, bL) {
				var i, r;
				if (aL != bL) r = aL > bL ? 1 : -1;
				else for (i = r = 0; i < aL; i++) if (a[i] != b[i]) {
					r = a[i] > b[i] ? 1 : -1;
					break;
				}
				return r;
			}
			function subtract(a, b, aL, base) {
				var i = 0;
				for (; aL--;) {
					a[aL] -= i;
					i = a[aL] < b[aL] ? 1 : 0;
					a[aL] = i * base + a[aL] - b[aL];
				}
				for (; !a[0] && a.length > 1;) a.shift();
			}
			return function(x, y, pr, rm, dp, base) {
				var cmp, e, i, k, logBase, more, prod, prodL, q, qd, rem, remL, rem0, sd, t, xi, xL, yd0, yL, yz, Ctor = x.constructor, sign = x.s == y.s ? 1 : -1, xd = x.d, yd = y.d;
				if (!xd || !xd[0] || !yd || !yd[0]) return new Ctor(!x.s || !y.s || (xd ? yd && xd[0] == yd[0] : !yd) ? NaN : xd && xd[0] == 0 || !yd ? sign * 0 : sign / 0);
				if (base) {
					logBase = 1;
					e = x.e - y.e;
				} else {
					base = BASE;
					logBase = LOG_BASE;
					e = mathfloor(x.e / logBase) - mathfloor(y.e / logBase);
				}
				yL = yd.length;
				xL = xd.length;
				q = new Ctor(sign);
				qd = q.d = [];
				for (i = 0; yd[i] == (xd[i] || 0); i++);
				if (yd[i] > (xd[i] || 0)) e--;
				if (pr == null) {
					sd = pr = Ctor.precision;
					rm = Ctor.rounding;
				} else if (dp) sd = pr + (x.e - y.e) + 1;
				else sd = pr;
				if (sd < 0) {
					qd.push(1);
					more = true;
				} else {
					sd = sd / logBase + 2 | 0;
					i = 0;
					if (yL == 1) {
						k = 0;
						yd = yd[0];
						sd++;
						for (; (i < xL || k) && sd--; i++) {
							t = k * base + (xd[i] || 0);
							qd[i] = t / yd | 0;
							k = t % yd | 0;
						}
						more = k || i < xL;
					} else {
						k = base / (yd[0] + 1) | 0;
						if (k > 1) {
							yd = multiplyInteger(yd, k, base);
							xd = multiplyInteger(xd, k, base);
							yL = yd.length;
							xL = xd.length;
						}
						xi = yL;
						rem = xd.slice(0, yL);
						remL = rem.length;
						for (; remL < yL;) rem[remL++] = 0;
						yz = yd.slice();
						yz.unshift(0);
						yd0 = yd[0];
						if (yd[1] >= base / 2) ++yd0;
						do {
							k = 0;
							cmp = compare(yd, rem, yL, remL);
							if (cmp < 0) {
								rem0 = rem[0];
								if (yL != remL) rem0 = rem0 * base + (rem[1] || 0);
								k = rem0 / yd0 | 0;
								if (k > 1) {
									if (k >= base) k = base - 1;
									prod = multiplyInteger(yd, k, base);
									prodL = prod.length;
									remL = rem.length;
									cmp = compare(prod, rem, prodL, remL);
									if (cmp == 1) {
										k--;
										subtract(prod, yL < prodL ? yz : yd, prodL, base);
									}
								} else {
									if (k == 0) cmp = k = 1;
									prod = yd.slice();
								}
								prodL = prod.length;
								if (prodL < remL) prod.unshift(0);
								subtract(rem, prod, remL, base);
								if (cmp == -1) {
									remL = rem.length;
									cmp = compare(yd, rem, yL, remL);
									if (cmp < 1) {
										k++;
										subtract(rem, yL < remL ? yz : yd, remL, base);
									}
								}
								remL = rem.length;
							} else if (cmp === 0) {
								k++;
								rem = [0];
							}
							qd[i++] = k;
							if (cmp && rem[0]) rem[remL++] = xd[xi] || 0;
							else {
								rem = [xd[xi]];
								remL = 1;
							}
						} while ((xi++ < xL || rem[0] !== void 0) && sd--);
						more = rem[0] !== void 0;
					}
					if (!qd[0]) qd.shift();
				}
				if (logBase == 1) {
					q.e = e;
					inexact = more;
				} else {
					for (i = 1, k = qd[0]; k >= 10; k /= 10) i++;
					q.e = i + e * logBase - 1;
					finalise(q, dp ? pr + q.e + 1 : pr, rm, more);
				}
				return q;
			};
		})();
		function finalise(x, sd, rm, isTruncated) {
			var digits, i, j, k, rd, roundUp, w, xd, xdi, Ctor = x.constructor;
			out: if (sd != null) {
				xd = x.d;
				if (!xd) return x;
				for (digits = 1, k = xd[0]; k >= 10; k /= 10) digits++;
				i = sd - digits;
				if (i < 0) {
					i += LOG_BASE;
					j = sd;
					w = xd[xdi = 0];
					rd = w / mathpow(10, digits - j - 1) % 10 | 0;
				} else {
					xdi = Math.ceil((i + 1) / LOG_BASE);
					k = xd.length;
					if (xdi >= k) if (isTruncated) {
						for (; k++ <= xdi;) xd.push(0);
						w = rd = 0;
						digits = 1;
						i %= LOG_BASE;
						j = i - LOG_BASE + 1;
					} else break out;
					else {
						w = k = xd[xdi];
						for (digits = 1; k >= 10; k /= 10) digits++;
						i %= LOG_BASE;
						j = i - LOG_BASE + digits;
						rd = j < 0 ? 0 : w / mathpow(10, digits - j - 1) % 10 | 0;
					}
				}
				isTruncated = isTruncated || sd < 0 || xd[xdi + 1] !== void 0 || (j < 0 ? w : w % mathpow(10, digits - j - 1));
				roundUp = rm < 4 ? (rd || isTruncated) && (rm == 0 || rm == (x.s < 0 ? 3 : 2)) : rd > 5 || rd == 5 && (rm == 4 || isTruncated || rm == 6 && (i > 0 ? j > 0 ? w / mathpow(10, digits - j) : 0 : xd[xdi - 1]) % 10 & 1 || rm == (x.s < 0 ? 8 : 7));
				if (sd < 1 || !xd[0]) {
					xd.length = 0;
					if (roundUp) {
						sd -= x.e + 1;
						xd[0] = mathpow(10, (LOG_BASE - sd % LOG_BASE) % LOG_BASE);
						x.e = -sd || 0;
					} else xd[0] = x.e = 0;
					return x;
				}
				if (i == 0) {
					xd.length = xdi;
					k = 1;
					xdi--;
				} else {
					xd.length = xdi + 1;
					k = mathpow(10, LOG_BASE - i);
					xd[xdi] = j > 0 ? (w / mathpow(10, digits - j) % mathpow(10, j) | 0) * k : 0;
				}
				if (roundUp) for (;;) if (xdi == 0) {
					for (i = 1, j = xd[0]; j >= 10; j /= 10) i++;
					j = xd[0] += k;
					for (k = 1; j >= 10; j /= 10) k++;
					if (i != k) {
						x.e++;
						if (xd[0] == BASE) xd[0] = 1;
					}
					break;
				} else {
					xd[xdi] += k;
					if (xd[xdi] != BASE) break;
					xd[xdi--] = 0;
					k = 1;
				}
				for (i = xd.length; xd[--i] === 0;) xd.pop();
			}
			if (external) {
				if (x.e > Ctor.maxE) {
					x.d = null;
					x.e = NaN;
				} else if (x.e < Ctor.minE) {
					x.e = 0;
					x.d = [0];
				}
			}
			return x;
		}
		function finiteToString(x, isExp, sd) {
			if (!x.isFinite()) return nonFiniteToString(x);
			var k, e = x.e, str = digitsToString(x.d), len = str.length;
			if (isExp) {
				if (sd && (k = sd - len) > 0) str = str.charAt(0) + "." + str.slice(1) + getZeroString(k);
				else if (len > 1) str = str.charAt(0) + "." + str.slice(1);
				str = str + (x.e < 0 ? "e" : "e+") + x.e;
			} else if (e < 0) {
				str = "0." + getZeroString(-e - 1) + str;
				if (sd && (k = sd - len) > 0) str += getZeroString(k);
			} else if (e >= len) {
				str += getZeroString(e + 1 - len);
				if (sd && (k = sd - e - 1) > 0) str = str + "." + getZeroString(k);
			} else {
				if ((k = e + 1) < len) str = str.slice(0, k) + "." + str.slice(k);
				if (sd && (k = sd - len) > 0) {
					if (e + 1 === len) str += ".";
					str += getZeroString(k);
				}
			}
			return str;
		}
		function getBase10Exponent(digits, e) {
			var w = digits[0];
			for (e *= LOG_BASE; w >= 10; w /= 10) e++;
			return e;
		}
		function getLn10(Ctor, sd, pr) {
			if (sd > LN10_PRECISION) {
				external = true;
				if (pr) Ctor.precision = pr;
				throw Error(precisionLimitExceeded);
			}
			return finalise(new Ctor(LN10), sd, 1, true);
		}
		function getPi(Ctor, sd, rm) {
			if (sd > PI_PRECISION) throw Error(precisionLimitExceeded);
			return finalise(new Ctor(PI), sd, rm, true);
		}
		function getPrecision(digits) {
			var w = digits.length - 1, len = w * LOG_BASE + 1;
			w = digits[w];
			if (w) {
				for (; w % 10 == 0; w /= 10) len--;
				for (w = digits[0]; w >= 10; w /= 10) len++;
			}
			return len;
		}
		function getZeroString(k) {
			var zs = "";
			for (; k--;) zs += "0";
			return zs;
		}
		function intPow(Ctor, x, n, pr) {
			var isTruncated, r = new Ctor(1), k = Math.ceil(pr / LOG_BASE + 4);
			external = false;
			for (;;) {
				if (n % 2) {
					r = r.times(x);
					if (truncate(r.d, k)) isTruncated = true;
				}
				n = mathfloor(n / 2);
				if (n === 0) {
					n = r.d.length - 1;
					if (isTruncated && r.d[n] === 0) ++r.d[n];
					break;
				}
				x = x.times(x);
				truncate(x.d, k);
			}
			external = true;
			return r;
		}
		function isOdd(n) {
			return n.d[n.d.length - 1] & 1;
		}
		function maxOrMin(Ctor, args, n) {
			var k, y, x = new Ctor(args[0]), i = 0;
			for (; ++i < args.length;) {
				y = new Ctor(args[i]);
				if (!y.s) {
					x = y;
					break;
				}
				k = x.cmp(y);
				if (k === n || k === 0 && x.s === n) x = y;
			}
			return x;
		}
		function naturalExponential(x, sd) {
			var denominator, guard, j, pow, sum, t, wpr, rep = 0, i = 0, k = 0, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
			if (!x.d || !x.d[0] || x.e > 17) return new Ctor(x.d ? !x.d[0] ? 1 : x.s < 0 ? 0 : Infinity : x.s ? x.s < 0 ? 0 : x : NaN);
			if (sd == null) {
				external = false;
				wpr = pr;
			} else wpr = sd;
			t = new Ctor(.03125);
			while (x.e > -2) {
				x = x.times(t);
				k += 5;
			}
			guard = Math.log(mathpow(2, k)) / Math.LN10 * 2 + 5 | 0;
			wpr += guard;
			denominator = pow = sum = new Ctor(1);
			Ctor.precision = wpr;
			for (;;) {
				pow = finalise(pow.times(x), wpr, 1);
				denominator = denominator.times(++i);
				t = sum.plus(divide(pow, denominator, wpr, 1));
				if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
					j = k;
					while (j--) sum = finalise(sum.times(sum), wpr, 1);
					if (sd == null) if (rep < 3 && checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
						Ctor.precision = wpr += 10;
						denominator = pow = t = new Ctor(1);
						i = 0;
						rep++;
					} else return finalise(sum, Ctor.precision = pr, rm, external = true);
					else {
						Ctor.precision = pr;
						return sum;
					}
				}
				sum = t;
			}
		}
		function naturalLogarithm(y, sd) {
			var c, c0, denominator, e, numerator, rep, sum, t, wpr, x1, x2, n = 1, guard = 10, x = y, xd = x.d, Ctor = x.constructor, rm = Ctor.rounding, pr = Ctor.precision;
			if (x.s < 0 || !xd || !xd[0] || !x.e && xd[0] == 1 && xd.length == 1) return new Ctor(xd && !xd[0] ? -Infinity : x.s != 1 ? NaN : xd ? 0 : x);
			if (sd == null) {
				external = false;
				wpr = pr;
			} else wpr = sd;
			Ctor.precision = wpr += guard;
			c = digitsToString(xd);
			c0 = c.charAt(0);
			if (Math.abs(e = x.e) < 0x5543df729c000) {
				while (c0 < 7 && c0 != 1 || c0 == 1 && c.charAt(1) > 3) {
					x = x.times(y);
					c = digitsToString(x.d);
					c0 = c.charAt(0);
					n++;
				}
				e = x.e;
				if (c0 > 1) {
					x = new Ctor("0." + c);
					e++;
				} else x = new Ctor(c0 + "." + c.slice(1));
			} else {
				t = getLn10(Ctor, wpr + 2, pr).times(e + "");
				x = naturalLogarithm(new Ctor(c0 + "." + c.slice(1)), wpr - guard).plus(t);
				Ctor.precision = pr;
				return sd == null ? finalise(x, pr, rm, external = true) : x;
			}
			x1 = x;
			sum = numerator = x = divide(x.minus(1), x.plus(1), wpr, 1);
			x2 = finalise(x.times(x), wpr, 1);
			denominator = 3;
			for (;;) {
				numerator = finalise(numerator.times(x2), wpr, 1);
				t = sum.plus(divide(numerator, new Ctor(denominator), wpr, 1));
				if (digitsToString(t.d).slice(0, wpr) === digitsToString(sum.d).slice(0, wpr)) {
					sum = sum.times(2);
					if (e !== 0) sum = sum.plus(getLn10(Ctor, wpr + 2, pr).times(e + ""));
					sum = divide(sum, new Ctor(n), wpr, 1);
					if (sd == null) if (checkRoundingDigits(sum.d, wpr - guard, rm, rep)) {
						Ctor.precision = wpr += guard;
						t = numerator = x = divide(x1.minus(1), x1.plus(1), wpr, 1);
						x2 = finalise(x.times(x), wpr, 1);
						denominator = rep = 1;
					} else return finalise(sum, Ctor.precision = pr, rm, external = true);
					else {
						Ctor.precision = pr;
						return sum;
					}
				}
				sum = t;
				denominator += 2;
			}
		}
		function nonFiniteToString(x) {
			return String(x.s * x.s / 0);
		}
		function parseDecimal(x, str) {
			var e, i, len;
			if ((e = str.indexOf(".")) > -1) str = str.replace(".", "");
			if ((i = str.search(/e/i)) > 0) {
				if (e < 0) e = i;
				e += +str.slice(i + 1);
				str = str.substring(0, i);
			} else if (e < 0) e = str.length;
			for (i = 0; str.charCodeAt(i) === 48; i++);
			for (len = str.length; str.charCodeAt(len - 1) === 48; --len);
			str = str.slice(i, len);
			if (str) {
				len -= i;
				x.e = e = e - i - 1;
				x.d = [];
				i = (e + 1) % LOG_BASE;
				if (e < 0) i += LOG_BASE;
				if (i < len) {
					if (i) x.d.push(+str.slice(0, i));
					for (len -= LOG_BASE; i < len;) x.d.push(+str.slice(i, i += LOG_BASE));
					str = str.slice(i);
					i = LOG_BASE - str.length;
				} else i -= len;
				for (; i--;) str += "0";
				x.d.push(+str);
				if (external) {
					if (x.e > x.constructor.maxE) {
						x.d = null;
						x.e = NaN;
					} else if (x.e < x.constructor.minE) {
						x.e = 0;
						x.d = [0];
					}
				}
			} else {
				x.e = 0;
				x.d = [0];
			}
			return x;
		}
		function parseOther(x, str) {
			var base, Ctor, divisor, i, isFloat, len, p, xd, xe;
			if (str.indexOf("_") > -1) {
				str = str.replace(/(\d)_(?=\d)/g, "$1");
				if (isDecimal.test(str)) return parseDecimal(x, str);
			} else if (str === "Infinity" || str === "NaN") {
				if (!+str) x.s = NaN;
				x.e = NaN;
				x.d = null;
				return x;
			}
			if (isHex.test(str)) {
				base = 16;
				str = str.toLowerCase();
			} else if (isBinary.test(str)) base = 2;
			else if (isOctal.test(str)) base = 8;
			else throw Error(invalidArgument + str);
			i = str.search(/p/i);
			if (i > 0) {
				p = +str.slice(i + 1);
				str = str.substring(2, i);
			} else str = str.slice(2);
			i = str.indexOf(".");
			isFloat = i >= 0;
			Ctor = x.constructor;
			if (isFloat) {
				str = str.replace(".", "");
				len = str.length;
				i = len - i;
				divisor = intPow(Ctor, new Ctor(base), i, i * 2);
			}
			xd = convertBase(str, base, BASE);
			xe = xd.length - 1;
			for (i = xe; xd[i] === 0; --i) xd.pop();
			if (i < 0) return new Ctor(x.s * 0);
			x.e = getBase10Exponent(xd, xe);
			x.d = xd;
			external = false;
			if (isFloat) x = divide(x, divisor, len * 4);
			if (p) x = x.times(Math.abs(p) < 54 ? mathpow(2, p) : Decimal.pow(2, p));
			external = true;
			return x;
		}
		function sine(Ctor, x) {
			var k, len = x.d.length;
			if (len < 3) return x.isZero() ? x : taylorSeries(Ctor, 2, x, x);
			k = 1.4 * Math.sqrt(len);
			k = k > 16 ? 16 : k | 0;
			x = x.times(1 / tinyPow(5, k));
			x = taylorSeries(Ctor, 2, x, x);
			var sin2_x, d5 = new Ctor(5), d16 = new Ctor(16), d20 = new Ctor(20);
			for (; k--;) {
				sin2_x = x.times(x);
				x = x.times(d5.plus(sin2_x.times(d16.times(sin2_x).minus(d20))));
			}
			return x;
		}
		function taylorSeries(Ctor, n, x, y, isHyperbolic) {
			var j, t, u, x2, i = 1, pr = Ctor.precision, k = Math.ceil(pr / LOG_BASE);
			external = false;
			x2 = x.times(x);
			u = new Ctor(y);
			for (;;) {
				t = divide(u.times(x2), new Ctor(n++ * n++), pr, 1);
				u = isHyperbolic ? y.plus(t) : y.minus(t);
				y = divide(t.times(x2), new Ctor(n++ * n++), pr, 1);
				t = u.plus(y);
				if (t.d[k] !== void 0) {
					for (j = k; t.d[j] === u.d[j] && j--;);
					if (j == -1) break;
				}
				j = u;
				u = y;
				y = t;
				t = j;
				i++;
			}
			external = true;
			t.d.length = k + 1;
			return t;
		}
		function tinyPow(b, e) {
			var n = b;
			while (--e) n *= b;
			return n;
		}
		function toLessThanHalfPi(Ctor, x) {
			var t, isNeg = x.s < 0, pi = getPi(Ctor, Ctor.precision, 1), halfPi = pi.times(.5);
			x = x.abs();
			if (x.lte(halfPi)) {
				quadrant = isNeg ? 4 : 1;
				return x;
			}
			t = x.divToInt(pi);
			if (t.isZero()) quadrant = isNeg ? 3 : 2;
			else {
				x = x.minus(t.times(pi));
				if (x.lte(halfPi)) {
					quadrant = isOdd(t) ? isNeg ? 2 : 3 : isNeg ? 4 : 1;
					return x;
				}
				quadrant = isOdd(t) ? isNeg ? 1 : 4 : isNeg ? 3 : 2;
			}
			return x.minus(pi).abs();
		}
		function toStringBinary(x, baseOut, sd, rm) {
			var base, e, i, k, len, roundUp, str, xd, y, Ctor = x.constructor, isExp = sd !== void 0;
			if (isExp) {
				checkInt32(sd, 1, MAX_DIGITS);
				if (rm === void 0) rm = Ctor.rounding;
				else checkInt32(rm, 0, 8);
			} else {
				sd = Ctor.precision;
				rm = Ctor.rounding;
			}
			if (!x.isFinite()) str = nonFiniteToString(x);
			else {
				str = finiteToString(x);
				i = str.indexOf(".");
				if (isExp) {
					base = 2;
					if (baseOut == 16) sd = sd * 4 - 3;
					else if (baseOut == 8) sd = sd * 3 - 2;
				} else base = baseOut;
				if (i >= 0) {
					str = str.replace(".", "");
					y = new Ctor(1);
					y.e = str.length - i;
					y.d = convertBase(finiteToString(y), 10, base);
					y.e = y.d.length;
				}
				xd = convertBase(str, 10, base);
				e = len = xd.length;
				for (; xd[--len] == 0;) xd.pop();
				if (!xd[0]) str = isExp ? "0p+0" : "0";
				else {
					if (i < 0) e--;
					else {
						x = new Ctor(x);
						x.d = xd;
						x.e = e;
						x = divide(x, y, sd, rm, 0, base);
						xd = x.d;
						e = x.e;
						roundUp = inexact;
					}
					i = xd[sd];
					k = base / 2;
					roundUp = roundUp || xd[sd + 1] !== void 0;
					roundUp = rm < 4 ? (i !== void 0 || roundUp) && (rm === 0 || rm === (x.s < 0 ? 3 : 2)) : i > k || i === k && (rm === 4 || roundUp || rm === 6 && xd[sd - 1] & 1 || rm === (x.s < 0 ? 8 : 7));
					xd.length = sd;
					if (roundUp) for (; ++xd[--sd] > base - 1;) {
						xd[sd] = 0;
						if (!sd) {
							++e;
							xd.unshift(1);
						}
					}
					for (len = xd.length; !xd[len - 1]; --len);
					for (i = 0, str = ""; i < len; i++) str += NUMERALS.charAt(xd[i]);
					if (isExp) {
						if (len > 1) if (baseOut == 16 || baseOut == 8) {
							i = baseOut == 16 ? 4 : 3;
							for (--len; len % i; len++) str += "0";
							xd = convertBase(str, base, baseOut);
							for (len = xd.length; !xd[len - 1]; --len);
							for (i = 1, str = "1."; i < len; i++) str += NUMERALS.charAt(xd[i]);
						} else str = str.charAt(0) + "." + str.slice(1);
						str = str + (e < 0 ? "p" : "p+") + e;
					} else if (e < 0) {
						for (; ++e;) str = "0" + str;
						str = "0." + str;
					} else if (++e > len) for (e -= len; e--;) str += "0";
					else if (e < len) str = str.slice(0, e) + "." + str.slice(e);
				}
				str = (baseOut == 16 ? "0x" : baseOut == 2 ? "0b" : baseOut == 8 ? "0o" : "") + str;
			}
			return x.s < 0 ? "-" + str : str;
		}
		function truncate(arr, len) {
			if (arr.length > len) {
				arr.length = len;
				return true;
			}
		}
		function abs(x) {
			return new this(x).abs();
		}
		function acos(x) {
			return new this(x).acos();
		}
		function acosh(x) {
			return new this(x).acosh();
		}
		function add(x, y) {
			return new this(x).plus(y);
		}
		function asin(x) {
			return new this(x).asin();
		}
		function asinh(x) {
			return new this(x).asinh();
		}
		function atan(x) {
			return new this(x).atan();
		}
		function atanh(x) {
			return new this(x).atanh();
		}
		function atan2(y, x) {
			y = new this(y);
			x = new this(x);
			var r, pr = this.precision, rm = this.rounding, wpr = pr + 4;
			if (!y.s || !x.s) r = new this(NaN);
			else if (!y.d && !x.d) {
				r = getPi(this, wpr, 1).times(x.s > 0 ? .25 : .75);
				r.s = y.s;
			} else if (!x.d || y.isZero()) {
				r = x.s < 0 ? getPi(this, pr, rm) : new this(0);
				r.s = y.s;
			} else if (!y.d || x.isZero()) {
				r = getPi(this, wpr, 1).times(.5);
				r.s = y.s;
			} else if (x.s < 0) {
				this.precision = wpr;
				this.rounding = 1;
				r = this.atan(divide(y, x, wpr, 1));
				x = getPi(this, wpr, 1);
				this.precision = pr;
				this.rounding = rm;
				r = y.s < 0 ? r.minus(x) : r.plus(x);
			} else r = this.atan(divide(y, x, wpr, 1));
			return r;
		}
		function cbrt(x) {
			return new this(x).cbrt();
		}
		function ceil(x) {
			return finalise(x = new this(x), x.e + 1, 2);
		}
		function clamp(x, min, max) {
			return new this(x).clamp(min, max);
		}
		function config(obj) {
			if (!obj || typeof obj !== "object") throw Error(decimalError + "Object expected");
			var i, p, v, useDefaults = obj.defaults === true, ps = [
				"precision",
				1,
				MAX_DIGITS,
				"rounding",
				0,
				8,
				"toExpNeg",
				-EXP_LIMIT,
				0,
				"toExpPos",
				0,
				EXP_LIMIT,
				"maxE",
				0,
				EXP_LIMIT,
				"minE",
				-EXP_LIMIT,
				0,
				"modulo",
				0,
				9
			];
			for (i = 0; i < ps.length; i += 3) {
				if (p = ps[i], useDefaults) this[p] = DEFAULTS[p];
				if ((v = obj[p]) !== void 0) if (mathfloor(v) === v && v >= ps[i + 1] && v <= ps[i + 2]) this[p] = v;
				else throw Error(invalidArgument + p + ": " + v);
			}
			if (p = "crypto", useDefaults) this[p] = DEFAULTS[p];
			if ((v = obj[p]) !== void 0) if (v === true || v === false || v === 0 || v === 1) if (v) if (typeof crypto != "undefined" && crypto && (crypto.getRandomValues || crypto.randomBytes)) this[p] = true;
			else throw Error(cryptoUnavailable);
			else this[p] = false;
			else throw Error(invalidArgument + p + ": " + v);
			return this;
		}
		function cos(x) {
			return new this(x).cos();
		}
		function cosh(x) {
			return new this(x).cosh();
		}
		function clone(obj) {
			var i, p, ps;
			function Decimal(v) {
				var e, i, t, x = this;
				if (!(x instanceof Decimal)) return new Decimal(v);
				x.constructor = Decimal;
				if (isDecimalInstance(v)) {
					x.s = v.s;
					if (external) if (!v.d || v.e > Decimal.maxE) {
						x.e = NaN;
						x.d = null;
					} else if (v.e < Decimal.minE) {
						x.e = 0;
						x.d = [0];
					} else {
						x.e = v.e;
						x.d = v.d.slice();
					}
					else {
						x.e = v.e;
						x.d = v.d ? v.d.slice() : v.d;
					}
					return;
				}
				t = typeof v;
				if (t === "number") {
					if (v === 0) {
						x.s = 1 / v < 0 ? -1 : 1;
						x.e = 0;
						x.d = [0];
						return;
					}
					if (v < 0) {
						v = -v;
						x.s = -1;
					} else x.s = 1;
					if (v === ~~v && v < 1e7) {
						for (e = 0, i = v; i >= 10; i /= 10) e++;
						if (external) if (e > Decimal.maxE) {
							x.e = NaN;
							x.d = null;
						} else if (e < Decimal.minE) {
							x.e = 0;
							x.d = [0];
						} else {
							x.e = e;
							x.d = [v];
						}
						else {
							x.e = e;
							x.d = [v];
						}
						return;
					}
					if (v * 0 !== 0) {
						if (!v) x.s = NaN;
						x.e = NaN;
						x.d = null;
						return;
					}
					return parseDecimal(x, v.toString());
				}
				if (t === "string") {
					if ((i = v.charCodeAt(0)) === 45) {
						v = v.slice(1);
						x.s = -1;
					} else {
						if (i === 43) v = v.slice(1);
						x.s = 1;
					}
					return isDecimal.test(v) ? parseDecimal(x, v) : parseOther(x, v);
				}
				if (t === "bigint") {
					if (v < 0) {
						v = -v;
						x.s = -1;
					} else x.s = 1;
					return parseDecimal(x, v.toString());
				}
				throw Error(invalidArgument + v);
			}
			Decimal.prototype = P;
			Decimal.ROUND_UP = 0;
			Decimal.ROUND_DOWN = 1;
			Decimal.ROUND_CEIL = 2;
			Decimal.ROUND_FLOOR = 3;
			Decimal.ROUND_HALF_UP = 4;
			Decimal.ROUND_HALF_DOWN = 5;
			Decimal.ROUND_HALF_EVEN = 6;
			Decimal.ROUND_HALF_CEIL = 7;
			Decimal.ROUND_HALF_FLOOR = 8;
			Decimal.EUCLID = 9;
			Decimal.config = Decimal.set = config;
			Decimal.clone = clone;
			Decimal.isDecimal = isDecimalInstance;
			Decimal.abs = abs;
			Decimal.acos = acos;
			Decimal.acosh = acosh;
			Decimal.add = add;
			Decimal.asin = asin;
			Decimal.asinh = asinh;
			Decimal.atan = atan;
			Decimal.atanh = atanh;
			Decimal.atan2 = atan2;
			Decimal.cbrt = cbrt;
			Decimal.ceil = ceil;
			Decimal.clamp = clamp;
			Decimal.cos = cos;
			Decimal.cosh = cosh;
			Decimal.div = div;
			Decimal.exp = exp;
			Decimal.floor = floor;
			Decimal.hypot = hypot;
			Decimal.ln = ln;
			Decimal.log = log;
			Decimal.log10 = log10;
			Decimal.log2 = log2;
			Decimal.max = max;
			Decimal.min = min;
			Decimal.mod = mod;
			Decimal.mul = mul;
			Decimal.pow = pow;
			Decimal.random = random;
			Decimal.round = round;
			Decimal.sign = sign;
			Decimal.sin = sin;
			Decimal.sinh = sinh;
			Decimal.sqrt = sqrt;
			Decimal.sub = sub;
			Decimal.sum = sum;
			Decimal.tan = tan;
			Decimal.tanh = tanh;
			Decimal.trunc = trunc;
			if (obj === void 0) obj = {};
			if (obj) {
				if (obj.defaults !== true) {
					ps = [
						"precision",
						"rounding",
						"toExpNeg",
						"toExpPos",
						"maxE",
						"minE",
						"modulo",
						"crypto"
					];
					for (i = 0; i < ps.length;) if (!obj.hasOwnProperty(p = ps[i++])) obj[p] = this[p];
				}
			}
			Decimal.config(obj);
			return Decimal;
		}
		function div(x, y) {
			return new this(x).div(y);
		}
		function exp(x) {
			return new this(x).exp();
		}
		function floor(x) {
			return finalise(x = new this(x), x.e + 1, 3);
		}
		function hypot() {
			var i, n, t = new this(0);
			external = false;
			for (i = 0; i < arguments.length;) {
				n = new this(arguments[i++]);
				if (!n.d) {
					if (n.s) {
						external = true;
						return new this(Infinity);
					}
					t = n;
				} else if (t.d) t = t.plus(n.times(n));
			}
			external = true;
			return t.sqrt();
		}
		function isDecimalInstance(obj) {
			return obj instanceof Decimal || obj && obj.toStringTag === tag || false;
		}
		function ln(x) {
			return new this(x).ln();
		}
		function log(x, y) {
			return new this(x).log(y);
		}
		function log2(x) {
			return new this(x).log(2);
		}
		function log10(x) {
			return new this(x).log(10);
		}
		function max() {
			return maxOrMin(this, arguments, -1);
		}
		function min() {
			return maxOrMin(this, arguments, 1);
		}
		function mod(x, y) {
			return new this(x).mod(y);
		}
		function mul(x, y) {
			return new this(x).mul(y);
		}
		function pow(x, y) {
			return new this(x).pow(y);
		}
		function random(sd) {
			var d, e, k, n, i = 0, r = new this(1), rd = [];
			if (sd === void 0) sd = this.precision;
			else checkInt32(sd, 1, MAX_DIGITS);
			k = Math.ceil(sd / LOG_BASE);
			if (!this.crypto) for (; i < k;) rd[i++] = Math.random() * 1e7 | 0;
			else if (crypto.getRandomValues) {
				d = crypto.getRandomValues(new Uint32Array(k));
				for (; i < k;) {
					n = d[i];
					if (n >= 429e7) d[i] = crypto.getRandomValues(/* @__PURE__ */ new Uint32Array(1))[0];
					else rd[i++] = n % 1e7;
				}
			} else if (crypto.randomBytes) {
				d = crypto.randomBytes(k *= 4);
				for (; i < k;) {
					n = d[i] + (d[i + 1] << 8) + (d[i + 2] << 16) + ((d[i + 3] & 127) << 24);
					if (n >= 214e7) crypto.randomBytes(4).copy(d, i);
					else {
						rd.push(n % 1e7);
						i += 4;
					}
				}
				i = k / 4;
			} else throw Error(cryptoUnavailable);
			k = rd[--i];
			sd %= LOG_BASE;
			if (k && sd) {
				n = mathpow(10, LOG_BASE - sd);
				rd[i] = (k / n | 0) * n;
			}
			for (; rd[i] === 0; i--) rd.pop();
			if (i < 0) {
				e = 0;
				rd = [0];
			} else {
				e = -1;
				for (; rd[0] === 0; e -= LOG_BASE) rd.shift();
				for (k = 1, n = rd[0]; n >= 10; n /= 10) k++;
				if (k < LOG_BASE) e -= LOG_BASE - k;
			}
			r.e = e;
			r.d = rd;
			return r;
		}
		function round(x) {
			return finalise(x = new this(x), x.e + 1, this.rounding);
		}
		function sign(x) {
			x = new this(x);
			return x.d ? x.d[0] ? x.s : 0 * x.s : x.s || NaN;
		}
		function sin(x) {
			return new this(x).sin();
		}
		function sinh(x) {
			return new this(x).sinh();
		}
		function sqrt(x) {
			return new this(x).sqrt();
		}
		function sub(x, y) {
			return new this(x).sub(y);
		}
		function sum() {
			var i = 0, args = arguments, x = new this(args[i]);
			external = false;
			for (; x.s && ++i < args.length;) x = x.plus(args[i]);
			external = true;
			return finalise(x, this.precision, this.rounding);
		}
		function tan(x) {
			return new this(x).tan();
		}
		function tanh(x) {
			return new this(x).tanh();
		}
		function trunc(x) {
			return finalise(x = new this(x), x.e + 1, 1);
		}
		P[Symbol.for("nodejs.util.inspect.custom")] = P.toString;
		P[Symbol.toStringTag] = "Decimal";
		var Decimal = P.constructor = clone(DEFAULTS);
		LN10 = new Decimal(LN10);
		PI = new Decimal(PI);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const mergeClasses = (...classes) => classes.filter((className, index, array) => {
			return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
		}).join(" ").trim();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toCamelCase = (string) => string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) => p2 ? p2.toUpperCase() : p1.toLowerCase());
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const toPascalCase = (string) => {
			const camelCase = toCamelCase(string);
			return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/defaultAttributes.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		var defaultAttributes = {
			xmlns: "http://www.w3.org/2000/svg",
			width: 24,
			height: 24,
			viewBox: "0 0 24 24",
			fill: "none",
			stroke: "currentColor",
			strokeWidth: 2,
			strokeLinecap: "round",
			strokeLinejoin: "round"
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const hasA11yProp = (props) => {
			for (const prop in props) if (prop.startsWith("aria-") || prop === "role" || prop === "title") return true;
			return false;
		};
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/context.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const LucideContext = (0, react.createContext)({});
		const useLucideContext = () => (0, react.useContext)(LucideContext);
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/Icon.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const Icon = (0, react.forwardRef)(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref) => {
			const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = useLucideContext() ?? {};
			const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
			return (0, react.createElement)("svg", {
				ref,
				...defaultAttributes,
				width: size ?? contextSize ?? defaultAttributes.width,
				height: size ?? contextSize ?? defaultAttributes.height,
				stroke: color ?? contextColor,
				strokeWidth: calculatedStrokeWidth,
				className: mergeClasses("lucide", contextClass, className),
				...!children && !hasA11yProp(rest) && { "aria-hidden": "true" },
				...rest
			}, [...iconNode.map(([tag, attrs]) => (0, react.createElement)(tag, attrs)), ...Array.isArray(children) ? children : [children]]);
		});
		//#endregion
		//#region node_modules/.pnpm/lucide-react@1.41.0_react@18.3.1/node_modules/lucide-react/dist/esm/createLucideIcon.mjs
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const createLucideIcon = (iconName, iconNode) => {
			const Component = (0, react.forwardRef)(({ className, ...props }, ref) => (0, react.createElement)(Icon, {
				ref,
				iconNode,
				className: mergeClasses(`lucide-${toKebabCase(toPascalCase(iconName))}`, `lucide-${iconName}`, className),
				...props
			}));
			Component.displayName = toPascalCase(iconName);
			return Component;
		};
		/**
		* @license lucide-react v1.41.0 - ISC
		*
		* This source code is licensed under the ISC license.
		* See the LICENSE file in the root directory of this source tree.
		*/
		const ChartNoAxesColumnIncreasing = createLucideIcon("chart-no-axes-column-increasing", [
			["path", {
				d: "M5 21v-6",
				key: "1hz6c0"
			}],
			["path", {
				d: "M12 21V9",
				key: "uvy0l4"
			}],
			["path", {
				d: "M19 21V3",
				key: "11j9sm"
			}]
		]);
		//#endregion
		//#region lib/types/client/controller.js
		var PortfolioController = class {
			api;
			state = {
				data: null,
				busy: false,
				error: null
			};
			listeners = /* @__PURE__ */ new Set();
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
				this.state = {
					...this.state,
					...patch
				};
				for (const listener of this.listeners) listener();
			}
			setVisible(visible) {
				if (this.visible === visible || this.disposed) return;
				this.visible = visible;
				if (visible) this.refresh();
				else {
					this.generation++;
					this.request?.abort();
					this.request = null;
					if (this.timer) clearTimeout(this.timer);
					this.timer = null;
					this.publish({ busy: false });
				}
			}
			select(filter) {
				this.filter = filter;
				this.refresh();
			}
			async refresh(force = false) {
				if (this.disposed || !this.visible) return;
				const generation = ++this.generation;
				this.request?.abort();
				if (this.timer) clearTimeout(this.timer);
				const request = new AbortController();
				this.request = request;
				this.publish({
					busy: true,
					error: null
				});
				try {
					const data = await this.api.summary({
						...this.filter,
						refresh: true,
						force
					}, request.signal);
					if (generation === this.generation && !this.disposed) this.publish({ data });
				} catch (error) {
					if (generation === this.generation && !request.signal.aborted) this.publish({ error: error instanceof Error ? error.message : String(error) });
				} finally {
					if (generation === this.generation && !this.disposed) {
						this.publish({ busy: false });
						this.request = null;
						if (this.visible) this.timer = setTimeout(() => void this.refresh(), this.state.data?.refreshIntervalMs ?? 6e4);
					}
				}
			}
			dispose() {
				this.disposed = true;
				this.generation++;
				this.request?.abort();
				if (this.timer) clearTimeout(this.timer);
				this.listeners.clear();
			}
		};
		//#endregion
		//#region lib/types/client/overlays.js
		function ModalFocusScope({ busy, children, alert = false, initialFocusId }) {
			const contentRef = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				const dialog = contentRef.current.closest("[aria-modal=true]");
				const closeButton = dialog.querySelector("button");
				closeButton.disabled = busy;
				dialog.setAttribute("aria-busy", String(busy));
			}, [busy]);
			(0, react.useLayoutEffect)(() => {
				const dialog = contentRef.current.closest("[aria-modal=true]");
				dialog.setAttribute("role", alert ? "alertdialog" : "dialog");
				dialog.tabIndex = -1;
				const trigger = document.activeElement;
				const overlay = dialog.parentElement;
				const siblings = Array.from(document.body.children).filter((element) => element instanceof HTMLElement && element !== overlay);
				const inertStates = siblings.map((element) => element.inert);
				siblings.forEach((element) => {
					element.inert = true;
				});
				const focusable = () => Array.from(dialog.querySelectorAll("button:not(:disabled), input:not(:disabled), select:not(:disabled), [tabindex=\"0\"]"));
				((initialFocusId ? document.getElementById(initialFocusId) : null) ?? focusable()[0] ?? dialog).focus({ preventScroll: true });
				const onKeyDown = (event) => {
					if (event.key !== "Tab") return;
					event.stopPropagation();
					const items = focusable();
					const first = items[0];
					const last = items[items.length - 1];
					if (!first) {
						event.preventDefault();
						dialog.focus();
					} else if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
						event.preventDefault();
						last?.focus();
					} else if (!event.shiftKey && document.activeElement === last) {
						event.preventDefault();
						first.focus();
					}
				};
				dialog.addEventListener("keydown", onKeyDown);
				return () => {
					dialog.removeEventListener("keydown", onKeyDown);
					siblings.forEach((element, index) => {
						element.inert = inertStates[index];
					});
					queueMicrotask(() => {
						if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
					});
				};
			}, [alert, initialFocusId]);
			return (0, react_jsx_runtime.jsx)("div", {
				ref: contentRef,
				className: "fp-modal-body",
				children
			});
		}
		function BackupMenu({ t, disabled, onImport, onExport }) {
			const anchorRef = (0, react.useRef)(null);
			const [open, setOpen] = (0, react.useState)(false);
			const [focusLast, setFocusLast] = (0, react.useState)(false);
			const focusTrigger = () => anchorRef.current?.querySelector("button")?.focus();
			(0, react.useEffect)(() => {
				if (open && focusLast) {
					const items = (document.activeElement?.closest("[role=menu]"))?.querySelectorAll("[role=menuitem]");
					items?.[items.length - 1]?.focus();
				}
			}, [open, focusLast]);
			return (0, react_jsx_runtime.jsx)("span", {
				ref: anchorRef,
				onKeyDown: (event) => {
					if (open && event.key === "Tab") {
						setOpen(false);
						focusTrigger();
					}
				},
				children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Menu, {
					open,
					portal: true,
					autoFocus: true,
					align: "end",
					onClose: () => setOpen(false),
					items: [{
						id: "import",
						label: t("import"),
						disabled
					}, {
						id: "export",
						label: t("export"),
						disabled
					}],
					onSelect: (id) => {
						setOpen(false);
						focusTrigger();
						if (id === "import") onImport();
						else onExport();
					},
					anchor: (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "outline",
						disabled,
						"aria-haspopup": "menu",
						"aria-expanded": open,
						onClick: () => {
							setFocusLast(false);
							setOpen(!open);
						},
						onKeyDown: (event) => {
							if (event.key === "ArrowDown" || event.key === "ArrowUp") {
								event.preventDefault();
								event.stopPropagation();
								setFocusLast(event.key === "ArrowUp");
								setOpen(true);
							}
						},
						children: [t("transfer"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutline14, {})]
					})
				})
			});
		}
		//#endregion
		//#region lib/types/client/styles.js
		/** Scoped portfolio styles use host surfaces and tab-width responsiveness. */
		const triggerStyles = `
.fp-trigger{display:inline-flex;align-self:stretch;align-items:center;justify-content:center;gap:8px;width:36px;height:36px;margin:0;padding:0;border:0;border-radius:50%;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;cursor:pointer}.fp-trigger:hover{background:var(--dsw-alias-interactive-bg-hover)}.fp-trigger:focus-visible{outline:2px solid var(--dsw-alias-brand-primary-new-colorprimary-new-color);outline-offset:2px}.fp-trigger>svg{flex:none}.fp-trigger[data-wide=true]{width:100%;height:42px;justify-content:flex-start;padding:0 10px 0 8px;border-radius:12px;text-align:left}.fp-trigger span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
`;
		const styles = `
.fp{--fp-gain:color-mix(in srgb,var(--dsw-alias-state-error-primary) 78%,black);--fp-loss:color-mix(in srgb,var(--dsw-alias-state-success-primary) 60%,black);--fp-estimate:color-mix(in srgb,var(--dsw-alias-link) 78%,black);container-type:inline-size;display:flex;box-sizing:border-box;width:100%;height:100%;min-width:0;min-height:0;flex-direction:column;overflow:hidden;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1.5}
body[data-ds-dark-theme] .fp{--fp-gain:var(--dsw-alias-state-error-primary);--fp-loss:var(--dsw-alias-state-success-primary);--fp-estimate:var(--dsw-alias-link)}
.fp h2,.fp h3,.fp p{margin:0}.fp h2{font-size:16px;line-height:24px;font-weight:500;letter-spacing:-.01em}.fp h3{font-size:14px;line-height:22px;font-weight:600}.fp ::selection{background:color-mix(in srgb,var(--dsw-alias-brand-primary-new-colorprimary-new-color) 24%,transparent)}
.fp-sub,.fp-muted{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.fp-sub{margin-top:4px!important;overflow-wrap:anywhere}
.fp-body{display:flex;flex:1;min-height:0;flex-direction:column;gap:20px;overflow:auto;padding:20px 24px 24px;scrollbar-width:thin;scrollbar-color:var(--dsw-alias-border-l3) transparent}.fp-body>*{flex:none}.fp-body::-webkit-scrollbar{width:8px}.fp-body::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:8px;background:var(--dsw-alias-border-l3);background-clip:padding-box}
.fp-overview{overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-1)}.fp-hero{display:flex;flex-direction:column;gap:20px;padding:20px}.fp-total{min-width:0}.fp-total-label{display:flex;align-items:center;flex-wrap:wrap;gap:8px;font-size:13px}.fp-big{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px;margin-top:8px;font-size:32px;line-height:40px;font-weight:600;letter-spacing:-.02em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}.fp-currency{color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:400;letter-spacing:0}.fp-split{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.fp-split>div{min-width:0}.fp-split strong{display:block;margin-top:4px;color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px;font-weight:500;font-variant-numeric:tabular-nums;white-space:normal;overflow-wrap:anywhere}
.fp-metrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--dsw-alias-border-l2)}.fp-metrics>div{min-width:0;padding:16px 20px}.fp-metrics>div+div{border-left:1px solid var(--dsw-alias-border-l2)}.fp-metrics .fp-muted{display:flex;align-items:center;flex-wrap:wrap;gap:6px}.fp-metrics strong{display:block;margin-top:4px;overflow-wrap:anywhere;font-size:18px;line-height:26px;font-weight:600;font-variant-numeric:tabular-nums;white-space:normal}
.fp-allocation-summary{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:14px 20px;border-top:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb,var(--dsw-alias-interactive-bg-hover) 28%,transparent)}.fp-allocation-summary>div:first-child{min-width:0}.fp-allocation-summary span,.fp-allocation-summary small{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.fp-allocation-summary>div:first-child>strong{display:block;margin-top:2px;font-size:13px;line-height:20px}.fp-allocation-summary small{display:block;margin-top:2px}.fp-allocation-totals{display:flex;flex:none;align-items:center;gap:20px;text-align:right}.fp-allocation-totals strong{display:block;color:var(--dsw-alias-label-primary);font-size:14px;font-variant-numeric:tabular-nums}
.fp-content{display:flex;min-width:0;flex-direction:column;gap:20px}.fp-content:focus-visible{outline:2px solid var(--dsw-alias-brand-primary-new-colorprimary-new-color);outline-offset:-2px}.fp-controls{display:flex;min-width:0;flex-direction:column;gap:12px}.fp-line{display:flex;align-items:center;justify-content:space-between;gap:12px}.fp-global-actions,.fp-accountbar{display:flex;align-items:center;justify-content:space-between;gap:8px 20px;min-width:0}.fp-tabs{display:flex;flex:0 1 auto;min-width:0;gap:4px;overflow-x:auto;scrollbar-width:none}.fp-tabs::-webkit-scrollbar{display:none}.fp-secondary-actions,.fp-primary-actions,.fp-account-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;min-width:0}.fp-primary-actions,.fp-account-actions{flex:none;margin-left:auto}
.fp-modal-body select{min-width:0;height:32px;padding:0 8px;border:.5px solid var(--dsw-alias-border-l4);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}.fp-modal-body select:focus{border-color:var(--dsw-alias-brand-primary)}
.fp-list{display:grid;gap:0;overflow:hidden;border:1px solid var(--dsw-alias-border-l2);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}.fp-list:empty{display:none}.fp-card{min-width:0;padding:16px 20px 8px}.fp-card+.fp-card{border-top:1px solid var(--dsw-alias-border-l2)}.fp-card:hover{background:color-mix(in srgb,var(--dsw-alias-interactive-bg-hover) 35%,transparent)}.fp-card-main{display:grid;gap:12px;align-items:start}.fp-card-heading{min-width:0}.fp-card-heading h3{overflow-wrap:anywhere}.fp-card-meta{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px}.fp-card-actions{display:flex;flex:none;align-items:center;gap:4px}
.fp-number{font-variant-numeric:tabular-nums;white-space:nowrap}.fp .fp-positive{color:var(--fp-gain)}.fp .fp-negative{color:var(--fp-loss)}.fp-pair{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.fp-pair>div{min-width:0}.fp-pair strong{display:block;margin-top:4px;overflow-wrap:anywhere;white-space:normal;color:var(--dsw-alias-label-primary);font-size:16px;line-height:24px;font-weight:600}.fp-caption{display:block;margin-top:4px;color:var(--dsw-alias-label-secondary);font-size:11px;line-height:18px;white-space:normal;overflow-wrap:anywhere}
.fp-card-footer{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:0 12px;margin-top:8px}.fp-details{grid-column:1/-1;grid-row:1;min-width:0}.fp-card-actions{grid-column:2;grid-row:1}.fp-details-body{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:8px 16px;margin:8px 0;padding:16px 0 8px;border-top:1px solid var(--dsw-alias-border-l2);font-size:12px;line-height:20px}.fp-details-body dt{color:var(--dsw-alias-label-secondary)}.fp-details-body dd{margin:0;text-align:right;white-space:normal;overflow-wrap:anywhere;font-variant-numeric:tabular-nums}
.fp .fp-quote-note{display:flex;align-items:baseline;gap:8px;margin:12px 0 4px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:20px;overflow-wrap:anywhere}.fp-note-label{flex:none;color:var(--dsw-alias-label-primary)}.fp-quote-note[data-warning=true] .fp-note-label{color:color-mix(in srgb,var(--dsw-alias-state-warn-label) 65%,var(--dsw-alias-label-primary))}
.fp-rebalance{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:12px 0 4px;padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-interactive-bg-hover) 44%,transparent);font-size:12px;line-height:18px}.fp-rebalance-ratio{display:flex;align-items:center;flex-wrap:wrap;gap:5px;color:var(--dsw-alias-label-secondary)}.fp-rebalance-ratio strong{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.fp-rebalance-action{flex:none;text-align:right}.fp-rebalance-action strong{display:block}.fp-rebalance-action span,.fp-rebalance>p{margin:0;color:var(--dsw-alias-label-secondary);font-size:11px}.fp-rebalance-action[data-action=buy] strong{color:var(--fp-gain)}.fp-rebalance-action[data-action=sell] strong{color:var(--fp-loss)}
.fp-note{padding:10px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:19px}.fp-warning{margin:12px 0 0;padding:10px 12px;border-radius:10px;background:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 12%,var(--dsw-alias-bg-layer-1));color:var(--dsw-alias-state-warn-label);font-size:12px;line-height:19px}.fp-error{padding:10px 12px;border-radius:10px;background:var(--dsw-alias-state-error-secondary);color:var(--dsw-alias-label-error);font-size:13px;line-height:20px;overflow-wrap:anywhere}
.fp-empty{display:flex;min-height:240px;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:32px 20px;text-align:center}.fp-empty-icon{display:grid;place-items:center;width:64px;height:64px;margin-bottom:6px;border-radius:16px;background:var(--dsw-alias-bg-layer-3);color:var(--dsw-alias-label-secondary)}.fp-empty h3{font-size:15px;line-height:22px;font-weight:500}.fp-empty p{max-width:280px;color:var(--dsw-alias-label-secondary);font-size:13px;line-height:21px}
.fp-modal-body label{display:flex;flex-direction:column;gap:7px;margin:12px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}.fp-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:16px}.fp-account{padding:12px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}.fp-account>span{min-width:0;overflow-wrap:anywhere}.fp-account>.fp-line{flex:none;gap:8px}.fp-account:last-of-type{border-bottom:0}.fp-footer{margin-top:4px;padding-top:12px;border-top:1px solid var(--dsw-alias-border-l2)}.fp-footer .fp-note{padding:0 0 4px}
.fp-modal-body{box-sizing:border-box;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;line-height:1.5}.fp-modal-body p{margin:0}.fp-modal-body h3{margin:0;font-size:14px;line-height:22px;font-weight:600}.fp-account-form{margin-top:16px;padding-top:16px;border-top:1px solid var(--dsw-alias-border-l2)}.fp-modal-body .fp-note{overflow-wrap:anywhere}.fp-filename{margin-top:16px!important;font-weight:600;overflow-wrap:anywhere}.fp-import-summary{display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px 0;border-block:1px solid var(--dsw-alias-border-l2)}.fp-import-summary span{color:var(--dsw-alias-label-secondary);font-size:12px}.fp-import-summary strong{display:block;font-size:24px;font-variant-numeric:tabular-nums}.fp-switch-row{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:12px 0;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}
.fp-allocation-editor{margin-top:8px;border-block:1px solid var(--dsw-alias-border-l2)}.fp-modal-body label.fp-allocation-row{margin:0;padding:12px 0}.fp-allocation-row+.fp-allocation-row{border-top:1px solid var(--dsw-alias-border-l2)}.fp-allocation-row>span:first-child{min-width:0}.fp-allocation-row strong{display:block;overflow-wrap:anywhere;color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px}.fp-allocation-row small{display:block;margin-top:2px;color:var(--dsw-alias-label-secondary);font-size:11px;font-variant-numeric:tabular-nums}.fp-percent-input{display:flex;align-items:center;gap:6px;color:var(--dsw-alias-label-secondary)}.fp-allocation-progress{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:14px 0;border-bottom:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);font-size:11px}.fp-allocation-progress strong{display:block;margin-top:3px;color:var(--dsw-alias-label-primary);font-size:13px;font-variant-numeric:tabular-nums}
@container(min-width:760px){.fp-hero{flex-direction:row;align-items:center;justify-content:space-between;gap:32px}.fp-split{width:48%;max-width:520px}.fp-card-main{grid-template-columns:minmax(220px,1fr) minmax(0,1.5fr);gap:32px}.fp-pair{text-align:right}.fp-card-footer{margin-top:0}.fp-details-body{grid-template-columns:minmax(0,1fr) minmax(0,2fr);max-width:720px}}
@container(max-width:600px){.fp-body{gap:16px;padding:16px 12px}.fp-content{gap:16px}.fp-global-actions{align-items:stretch;flex-direction:column}.fp-secondary-actions{width:100%;flex-wrap:nowrap;overflow-x:auto;padding-bottom:2px;scrollbar-width:thin}.fp-primary-actions{width:100%;justify-content:flex-end}.fp-accountbar{align-items:center}.fp-account-actions{align-self:stretch}.fp-hero{padding:16px}.fp-metrics>div{padding:12px}.fp-metrics strong{font-size:15px;line-height:22px}.fp-allocation-summary{align-items:flex-start;flex-direction:column;gap:10px;padding:12px 16px}.fp-allocation-totals{width:100%;justify-content:space-between;text-align:left}.fp-card{padding:16px 16px 8px}.fp-pair{gap:12px}.fp-pair strong{font-size:14px;line-height:22px}.fp-rebalance{align-items:flex-start;flex-direction:column;gap:6px}.fp-rebalance-action{text-align:left}}
@container(max-width:380px){.fp-big{font-size:28px}.fp-split{gap:8px}.fp-split strong{font-size:13px}.fp-metrics{grid-template-columns:1fr}.fp-metrics>div{display:flex;align-items:baseline;justify-content:space-between;gap:8px;padding:8px 16px}.fp-metrics>div+div{border-top:1px solid var(--dsw-alias-border-l2);border-left:0}.fp-metrics strong{margin-top:0;text-align:right}.fp-pair{grid-template-columns:repeat(2,minmax(0,1fr))}.fp-pair>div:last-child{grid-column:1/-1;display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px}.fp-pair>div:last-child strong{margin:0 0 0 auto}.fp-pair>div:last-child .fp-caption{width:100%;margin-top:0;text-align:right}}
`;
		//#endregion
		//#region lib/types/client/Panel.js
		/** Portfolio view with explicit dated coverage and user-confirmed mutations. */
		function errorMessage(error, t) {
			if (typeof error === "object" && error !== null && "code" in error && error.code === "fund-portfolio/duplicate-holding") return t("duplicateHolding");
			return error instanceof Error ? error.message : String(error);
		}
		function amount(value, signed = false) {
			if (value === null) return "—";
			const decimal = new Decimal(value);
			const [integer, fraction] = decimal.toFixed(2).split(".");
			return `${signed && decimal.gt(0) ? "+" : ""}${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`;
		}
		function tone(value) {
			if (value === null || new Decimal(value).isZero()) return "fp-number";
			return new Decimal(value).gt(0) ? "fp-number fp-positive" : "fp-number fp-negative";
		}
		function compact(value) {
			const decimal = new Decimal(value);
			if (!decimal.isZero() && decimal.abs().lt(.01)) return "<0.01";
			return amount(decimal.abs().toFixed());
		}
		function percentage(value) {
			return value === null ? "—" : `${new Decimal(value).toFixed(2)}%`;
		}
		function PortfolioTrigger({ t, wide, openPanel }) {
			return (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("style", { children: triggerStyles }), (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "fp-trigger",
				"aria-label": t("sidebarLabel"),
				title: t("sidebarLabel"),
				"data-wide": wide,
				onClick: openPanel,
				children: [(0, react_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, {
					size: wide ? 16 : 18,
					strokeWidth: 1.6,
					"aria-hidden": "true"
				}), wide && (0, react_jsx_runtime.jsx)("span", { children: t("sidebarLabel") })]
			})] });
		}
		function allocationStatusText(status, t) {
			if (status === "ready") return t("allocationReady");
			if (status === "market-incomplete") return t("allocationMarketIncomplete");
			if (status === "invalid-target-total") return t("allocationInvalid");
			return t("allocationUnconfigured");
		}
		function HoldingCard({ row, allocation, t, edit, remove }) {
			const [detailsOpen, setDetailsOpen] = (0, react.useState)(false);
			const money = row.fund.kind === "money";
			const nav = row.quote.navs[0];
			const estimate = row.quote.estimate;
			const estimateUnavailable = !money && !estimate && row.quote.error === "Estimate unavailable";
			const issue = row.issue && row.issue !== "pending" ? row.issue : null;
			const quoteNotice = issue ? t(issue) : estimateUnavailable ? t(row.today ? "estimateUnavailable" : "estimatePending") : row.quote.error ? t(nav || estimate ? "stale" : "unavailable") : null;
			return (0, react_jsx_runtime.jsxs)("article", {
				className: "fp-card",
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: "fp-card-main",
						children: [(0, react_jsx_runtime.jsxs)("header", {
							className: "fp-card-heading",
							children: [(0, react_jsx_runtime.jsx)("h3", { children: row.fund.name }), (0, react_jsx_runtime.jsxs)("p", {
								className: "fp-sub fp-card-meta",
								children: [(0, react_jsx_runtime.jsxs)("span", { children: [
									row.fund.code,
									" · ",
									row.accountName
								] }), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
									tone: "quiet",
									children: t(money ? "money" : row.fund.kind === "qdii" ? "qdii" : "navFund")
								})]
							})]
						}), (0, react_jsx_runtime.jsxs)("div", {
							className: "fp-pair",
							children: [
								(0, react_jsx_runtime.jsxs)("div", { children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "fp-muted",
										children: t("today")
									}),
									(0, react_jsx_runtime.jsx)("strong", {
										className: tone(row.today?.amount ?? null),
										children: amount(row.today?.amount ?? null, true)
									}),
									(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
										tone: row.today?.kind === "confirmed" ? "success" : row.today?.kind === "estimated" ? "info" : "neutral",
										children: row.today ? t(row.today.kind) : t("pending")
									})
								] }),
								(0, react_jsx_runtime.jsxs)("div", { children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "fp-muted",
										children: t(money ? "annual" : "floating")
									}),
									(0, react_jsx_runtime.jsx)("strong", {
										className: money ? "fp-number" : tone(row.floatingProfit),
										children: money ? nav?.annualYield ? `${nav.annualYield}%` : t("noData") : amount(row.floatingProfit, true)
									}),
									!money && (0, react_jsx_runtime.jsx)("span", {
										className: `fp-caption ${tone(row.floatingRate)}`,
										children: row.floatingRate === null ? t("zeroCost") : `${amount(row.floatingRate, true)}%`
									})
								] }),
								(0, react_jsx_runtime.jsxs)("div", { children: [
									(0, react_jsx_runtime.jsx)("span", {
										className: "fp-muted",
										children: t("market")
									}),
									(0, react_jsx_runtime.jsx)("strong", {
										className: "fp-number",
										children: amount(row.marketValue)
									}),
									(0, react_jsx_runtime.jsx)("span", {
										className: "fp-caption",
										title: t("priceDate"),
										children: row.priceDate ?? t("noData")
									})
								] })
							]
						})]
					}),
					quoteNotice && (0, react_jsx_runtime.jsxs)("p", {
						className: "fp-quote-note",
						"data-warning": Boolean(issue || row.quote.error && !estimateUnavailable),
						children: [(0, react_jsx_runtime.jsx)("span", {
							className: "fp-note-label",
							children: t("quoteStatus")
						}), (0, react_jsx_runtime.jsx)("span", { children: quoteNotice })]
					}),
					allocation && (0, react_jsx_runtime.jsxs)("div", {
						className: "fp-rebalance",
						"data-status": allocation.status,
						children: [(0, react_jsx_runtime.jsxs)("div", {
							className: "fp-rebalance-ratio",
							children: [
								(0, react_jsx_runtime.jsxs)("span", { children: [
									t("currentRatio"),
									" ",
									(0, react_jsx_runtime.jsx)("strong", { children: percentage(row.currentRatio) })
								] }),
								(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14, { "aria-hidden": "true" }),
								(0, react_jsx_runtime.jsxs)("span", { children: [
									t("targetRatio"),
									" ",
									(0, react_jsx_runtime.jsx)("strong", { children: percentage(row.holding.targetRatio) })
								] })
							]
						}), row.rebalance ? (0, react_jsx_runtime.jsxs)("div", {
							className: "fp-rebalance-action",
							"data-action": row.rebalance.action,
							children: [(0, react_jsx_runtime.jsx)("strong", { children: t(row.rebalance.action === "buy" ? "theoreticalBuy" : row.rebalance.action === "sell" ? "theoreticalSell" : "theoreticalHold") }), row.rebalance.action !== "hold" && (0, react_jsx_runtime.jsxs)("span", { children: [
								compact(row.rebalance.amount),
								" CNY · ",
								t("estimatedShares"),
								" ",
								compact(row.rebalance.shares)
							] })]
						}) : (0, react_jsx_runtime.jsx)("p", { children: allocationStatusText(allocation.status, t) })]
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "fp-card-footer",
						children: [(0, react_jsx_runtime.jsx)("div", {
							className: "fp-details",
							children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.DisclosureRow, {
								title: t("details"),
								icon: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronRightOutline14, {}),
								open: detailsOpen,
								expandable: true,
								expandOnRowClick: true,
								onToggle: () => setDetailsOpen((open) => !open),
								children: (0, react_jsx_runtime.jsxs)("dl", {
									className: "fp-details-body",
									children: [
										row.quote.error && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("quoteDetails") }), (0, react_jsx_runtime.jsx)("dd", { children: estimateUnavailable ? t("estimateUnavailable") : row.quote.error })] }),
										(0, react_jsx_runtime.jsx)("dt", { children: t(money ? "moneyYield" : "nav") }),
										(0, react_jsx_runtime.jsxs)("dd", { children: [
											nav?.value ?? t("noData"),
											" · ",
											nav?.date ?? t("noData")
										] }),
										!money && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											(0, react_jsx_runtime.jsx)("dt", { children: t("estimate") }),
											(0, react_jsx_runtime.jsx)("dd", { children: estimate?.value ?? t("noData") }),
											(0, react_jsx_runtime.jsx)("dt", { children: t("estimateTime") }),
											(0, react_jsx_runtime.jsx)("dd", { children: estimate ? `${estimate.date} ${estimate.time}` : t("noData") })
										] }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("shares") }),
										(0, react_jsx_runtime.jsx)("dd", { children: row.holding.shares }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("costPrice") }),
										(0, react_jsx_runtime.jsx)("dd", { children: row.holding.costPrice }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("market") }),
										(0, react_jsx_runtime.jsx)("dd", { children: amount(row.marketValue) }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("priceDate") }),
										(0, react_jsx_runtime.jsx)("dd", { children: row.priceDate ?? t("noData") }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("recent") }),
										(0, react_jsx_runtime.jsxs)("dd", {
											className: tone(row.confirmed?.amount ?? null),
											children: [
												amount(row.confirmed?.amount ?? null, true),
												" · ",
												row.confirmed?.date ?? t("noData")
											]
										}),
										!money && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
											(0, react_jsx_runtime.jsx)("dt", { children: t("referenceDate") }),
											(0, react_jsx_runtime.jsx)("dd", { children: estimate?.referenceDate ?? t("noData") }),
											(0, react_jsx_runtime.jsx)("dt", { children: t("reference") }),
											(0, react_jsx_runtime.jsx)("dd", { children: amount(row.referenceChange, true) }),
											(0, react_jsx_runtime.jsx)("dt", { children: t("rate") }),
											(0, react_jsx_runtime.jsx)("dd", { children: row.floatingRate === null ? t("zeroCost") : `${amount(row.floatingRate, true)}%` })
										] }),
										money && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)("dt", { children: t("annual") }), (0, react_jsx_runtime.jsx)("dd", { children: nav?.annualYield ? `${nav.annualYield}%` : t("noData") })] }),
										(0, react_jsx_runtime.jsx)("dt", { children: t("fetched") }),
										(0, react_jsx_runtime.jsx)("dd", { children: row.quote.navFetchedAt ?? t("noData") })
									]
								})
							})
						}), (0, react_jsx_runtime.jsxs)("div", {
							className: "fp-card-actions",
							children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								"aria-label": `${t("edit")} ${row.fund.name}`,
								onClick: edit,
								children: t("edit")
							}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								size: "sm",
								"aria-label": `${t("delete")} ${row.fund.name}`,
								onClick: remove,
								children: t("delete")
							})]
						})]
					})
				]
			});
		}
		function PortfolioPanel({ t, api, useTabInfo }) {
			const [controller] = (0, react.useState)(() => new PortfolioController(api));
			const { data, busy, error } = (0, react.useSyncExternalStore)(controller.subscribe, controller.getSnapshot);
			const { tab } = useTabInfo();
			const lifetime = (0, react.useRef)(new AbortController());
			const [documentVisible, setDocumentVisible] = (0, react.useState)(document.visibilityState !== "hidden");
			const [filter, setFilter] = (0, react.useState)("");
			const [localError, setLocalError] = (0, react.useState)(null);
			const [working, setWorking] = (0, react.useState)(false);
			const [modal, setModal] = (0, react.useState)(null);
			const [form, setForm] = (0, react.useState)(null);
			const [allocationForm, setAllocationForm] = (0, react.useState)(null);
			const [accountForm, setAccountForm] = (0, react.useState)({ name: "" });
			const [deleting, setDeleting] = (0, react.useState)(null);
			const [importFile, setImportFile] = (0, react.useState)(null);
			const [preview, setPreview] = (0, react.useState)(null);
			const [replace, setReplace] = (0, react.useState)(false);
			const fileInputRef = (0, react.useRef)(null);
			const accountNameId = (0, react.useId)();
			const tabsId = (0, react.useId)();
			const holdingFormFocusId = (0, react.useId)();
			const allocationFocusId = (0, react.useId)();
			const accountFormId = `${accountNameId}-form`;
			const holdingFormId = `${holdingFormFocusId}-form`;
			const allocationFormId = `${allocationFocusId}-form`;
			(0, react.useEffect)(() => {
				const onVisibility = () => setDocumentVisible(document.visibilityState !== "hidden");
				document.addEventListener("visibilitychange", onVisibility);
				return () => document.removeEventListener("visibilitychange", onVisibility);
			}, []);
			(0, react.useEffect)(() => {
				controller.setVisible(tab.visible && documentVisible);
			}, [
				controller,
				tab.visible,
				documentVisible
			]);
			(0, react.useEffect)(() => () => {
				lifetime.current.abort();
				controller.dispose();
			}, [controller]);
			(0, react.useEffect)(() => {
				if (data && filter && !data.accounts.some((account) => account.id === filter)) {
					setFilter("");
					controller.select({});
				}
			}, [
				data,
				filter,
				controller
			]);
			const openHoldingForm = (next) => {
				setLocalError(null);
				setForm(next);
			};
			const closeHoldingForm = () => {
				setForm(null);
				setLocalError(null);
			};
			const run = async (operation, done) => {
				setWorking(true);
				setLocalError(null);
				let succeeded = false;
				try {
					await operation();
					if (lifetime.current.signal.aborted) return;
					await controller.refresh();
					if (lifetime.current.signal.aborted) return;
					succeeded = true;
				} catch (failure) {
					if (!lifetime.current.signal.aborted) setLocalError(errorMessage(failure, t));
				} finally {
					if (!lifetime.current.signal.aborted) {
						setWorking(false);
						if (succeeded) done?.();
					}
				}
			};
			const saveHolding = (event) => {
				event.preventDefault();
				if (working || !form?.fund || !form.accountId) return;
				const input = {
					accountId: form.accountId,
					fundCode: form.fund.code,
					shares: form.shares,
					costPrice: form.costPrice
				};
				run(() => form.holding ? api.holdingUpdate({
					...input,
					id: form.holding.id,
					version: form.holding.version
				}, lifetime.current.signal) : api.holdingAdd(input, lifetime.current.signal), closeHoldingForm);
			};
			const exportBackup = () => void run(async () => {
				const file = await api.exportData({}, lifetime.current.signal);
				if (lifetime.current.signal.aborted) return;
				const url = URL.createObjectURL(new Blob([file.json], { type: "application/json" }));
				const anchor = document.createElement("a");
				anchor.href = url;
				anchor.download = file.filename;
				anchor.click();
				setTimeout(() => URL.revokeObjectURL(url), 1e3);
			});
			const closeModal = () => {
				setModal(null);
				setLocalError(null);
				setPreview(null);
				setImportFile(null);
				setReplace(false);
				setAccountForm({ name: "" });
				setAllocationForm(null);
			};
			const importBackup = (file) => {
				setModal("import");
				setImportFile({
					name: file.name,
					json: ""
				});
				setPreview(null);
				setReplace(false);
				run(async () => {
					if (!/\.json$/i.test(file.name)) throw new Error(t("jsonFileOnly"));
					if (file.size > 20 * 1024 * 1024) throw new Error(t("fileTooLarge"));
					const json = await new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.onload = () => resolve(String(reader.result).replace(/^\uFEFF/, ""));
						reader.onerror = () => reject(new Error(t("fileReadError")));
						reader.readAsText(file);
					});
					try {
						JSON.parse(json);
					} catch {
						throw new Error(t("invalidJson"));
					}
					if (lifetime.current.signal.aborted) return;
					const result = await api.previewImport({ json }, lifetime.current.signal);
					if (lifetime.current.signal.aborted) return;
					setImportFile({
						name: file.name,
						json
					});
					setPreview(result);
				});
			};
			const accounts = [{
				id: "",
				name: t("allAccounts")
			}, ...data?.accounts ?? []];
			const allocationTotal = allocationForm?.items.reduce((total, item) => {
				try {
					return total.add(item.targetRatio || 0);
				} catch {
					return total;
				}
			}, new Decimal(0)) ?? new Decimal(0);
			const allocationValuesValid = allocationForm?.items.every((item) => /^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/.test(item.targetRatio) && new Decimal(item.targetRatio).lte(100)) ?? false;
			const allocationCanSave = Boolean(allocationForm?.items.length) && allocationValuesValid && allocationTotal.eq(100);
			const openAllocation = () => {
				if (!filter || !data?.holdings.length) return;
				setLocalError(null);
				setAllocationForm({
					accountId: filter,
					items: data.holdings.map((row) => ({
						holding: row.holding,
						fund: row.fund,
						targetRatio: row.holding.targetRatio ?? ""
					}))
				});
				setModal("allocation");
			};
			const selectAccount = (id) => {
				setFilter(id);
				controller.select(id ? { accountId: id } : {});
			};
			const modalError = localError && (0, react_jsx_runtime.jsxs)("p", {
				role: "alert",
				className: "fp-error",
				children: [
					t("error"),
					": ",
					localError
				]
			});
			const backgroundBusy = working && !form && !modal && !deleting;
			return (0, react_jsx_runtime.jsxs)("section", {
				className: "fp",
				"aria-label": t("title"),
				children: [
					(0, react_jsx_runtime.jsx)("style", { children: styles }),
					(0, react_jsx_runtime.jsxs)("div", {
						className: "fp-body",
						children: [
							(error || localError && !modal && !deleting && !form) && (0, react_jsx_runtime.jsxs)("p", {
								role: "alert",
								className: "fp-error",
								children: [
									t("error"),
									": ",
									error ?? localError
								]
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "fp-controls",
								children: [(0, react_jsx_runtime.jsxs)("div", {
									className: "fp-global-actions",
									children: [(0, react_jsx_runtime.jsxs)("div", {
										className: "fp-secondary-actions",
										children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											disabled: backgroundBusy,
											onClick: () => {
												setLocalError(null);
												setModal("accounts");
											},
											children: t("accounts")
										}), (0, react_jsx_runtime.jsx)(BackupMenu, {
											t,
											disabled: backgroundBusy,
											onImport: () => fileInputRef.current?.click(),
											onExport: exportBackup
										})]
									}), (0, react_jsx_runtime.jsxs)("div", {
										className: "fp-primary-actions",
										children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											icon: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconRefreshOutline16, {}),
											"aria-busy": busy,
											disabled: busy,
											onClick: () => void controller.refresh(true),
											children: t(busy ? "refreshing" : "refresh")
										}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "primary",
											disabled: backgroundBusy,
											onClick: () => {
												openHoldingForm({
													accountId: filter || data?.accounts[0]?.id || "",
													code: "",
													shares: "",
													costPrice: "",
													fund: null
												});
											},
											icon: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconPlusOutline16, {}),
											children: t("addHolding")
										})]
									})]
								}), (0, react_jsx_runtime.jsxs)("div", {
									className: "fp-accountbar",
									children: [(0, react_jsx_runtime.jsx)("div", {
										className: "fp-tabs",
										role: "tablist",
										"aria-label": t("account"),
										children: accounts.map((account, index) => (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Pill, {
											role: "tab",
											id: `${tabsId}-tab-${account.id || "all"}`,
											"aria-controls": `${tabsId}-panel`,
											"aria-selected": filter === account.id,
											tabIndex: filter === account.id ? 0 : -1,
											active: filter === account.id,
											onClick: () => selectAccount(account.id),
											onKeyDown: (event) => {
												if (![
													"ArrowRight",
													"ArrowLeft",
													"Home",
													"End"
												].includes(event.key)) return;
												event.preventDefault();
												const next = event.key === "Home" ? 0 : event.key === "End" ? accounts.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + accounts.length) % accounts.length;
												const buttons = event.currentTarget.parentElement.querySelectorAll("[role=tab]");
												buttons[next]?.focus();
												buttons[next]?.scrollIntoView({
													block: "nearest",
													inline: "nearest"
												});
												selectAccount(accounts[next].id);
											},
											children: account.name
										}, account.id))
									}), filter && (0, react_jsx_runtime.jsx)("div", {
										className: "fp-account-actions",
										children: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
											variant: "outline",
											size: "sm",
											disabled: backgroundBusy || busy || !data?.holdings.length,
											onClick: openAllocation,
											children: t("allocation")
										})
									})]
								})]
							}),
							(0, react_jsx_runtime.jsx)("input", {
								ref: fileInputRef,
								type: "file",
								hidden: true,
								accept: ".json,application/json",
								"aria-label": t("import"),
								onChange: (event) => {
									const file = event.currentTarget.files?.[0];
									event.currentTarget.value = "";
									if (file) importBackup(file);
								}
							}),
							(0, react_jsx_runtime.jsxs)("div", {
								className: "fp-content",
								role: "tabpanel",
								id: `${tabsId}-panel`,
								"aria-labelledby": `${tabsId}-tab-${filter || "all"}`,
								"aria-busy": busy,
								tabIndex: 0,
								children: [
									data && (0, react_jsx_runtime.jsxs)("div", {
										className: "fp-overview",
										children: [
											(0, react_jsx_runtime.jsxs)("div", {
												className: "fp-hero",
												children: [(0, react_jsx_runtime.jsxs)("div", {
													className: "fp-total",
													children: [(0, react_jsx_runtime.jsxs)("div", {
														className: "fp-total-label",
														children: [
															(0, react_jsx_runtime.jsx)("span", { children: t("today") }),
															(0, react_jsx_runtime.jsx)("time", {
																className: "fp-muted",
																children: data.date
															}),
															data.missingCount > 0 && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
																tone: "warning",
																children: t("partial")
															})
														]
													}), (0, react_jsx_runtime.jsxs)("div", {
														className: `fp-big ${tone(data.todayTotal)}`,
														children: [amount(data.todayTotal, true), (0, react_jsx_runtime.jsx)("span", {
															className: "fp-currency",
															children: "CNY"
														})]
													})]
												}), (0, react_jsx_runtime.jsxs)("div", {
													className: "fp-split",
													children: [
														(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsxs)("span", { children: [
															t("confirmed"),
															" · ",
															data.confirmedCount
														] }), (0, react_jsx_runtime.jsx)("strong", {
															className: tone(data.confirmedToday),
															children: amount(data.confirmedToday, true)
														})] }),
														(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsxs)("span", { children: [
															t("estimated"),
															" · ",
															data.estimatedCount
														] }), (0, react_jsx_runtime.jsx)("strong", {
															className: tone(data.estimatedToday),
															children: amount(data.estimatedToday, true)
														})] }),
														(0, react_jsx_runtime.jsxs)("div", { children: [t("missing"), (0, react_jsx_runtime.jsx)("strong", { children: data.missingCount })] })
													]
												})]
											}),
											(0, react_jsx_runtime.jsxs)("div", {
												className: "fp-metrics",
												children: [
													(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsxs)("span", {
														className: "fp-muted",
														children: [
															t("market"),
															" ",
															(0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
																tone: "neutral",
																children: [
																	data.marketCovered,
																	"/",
																	data.holdings.length
																]
															})
														]
													}), (0, react_jsx_runtime.jsx)("strong", { children: amount(data.marketValue) })] }),
													(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", {
														className: "fp-muted",
														children: t("cost")
													}), (0, react_jsx_runtime.jsx)("strong", { children: amount(data.cost) })] }),
													(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsxs)("span", {
														className: "fp-muted",
														children: [
															t("floating"),
															" ",
															(0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
																tone: "neutral",
																children: [
																	data.floatingCovered,
																	"/",
																	data.holdings.length
																]
															})
														]
													}), (0, react_jsx_runtime.jsx)("strong", {
														className: tone(data.floatingProfit),
														children: amount(data.floatingProfit, true)
													})] })
												]
											}),
											data.allocation && (0, react_jsx_runtime.jsxs)("div", {
												className: "fp-allocation-summary",
												"data-status": data.allocation.status,
												children: [(0, react_jsx_runtime.jsxs)("div", { children: [
													(0, react_jsx_runtime.jsx)("span", { children: t("allocation") }),
													(0, react_jsx_runtime.jsx)("strong", { children: allocationStatusText(data.allocation.status, t) }),
													(0, react_jsx_runtime.jsxs)("small", { children: [
														t("configured"),
														" ",
														data.allocation.configured,
														"/",
														data.allocation.holdings,
														" · ",
														t("targetTotal"),
														" ",
														percentage(data.allocation.targetTotal)
													] })
												] }), data.allocation.status === "ready" && (0, react_jsx_runtime.jsxs)("div", {
													className: "fp-allocation-totals",
													children: [(0, react_jsx_runtime.jsxs)("span", { children: [
														t("theoreticalBuy"),
														" ",
														(0, react_jsx_runtime.jsx)("strong", { children: amount(data.allocation.buyAmount) })
													] }), (0, react_jsx_runtime.jsxs)("span", { children: [
														t("theoreticalSell"),
														" ",
														(0, react_jsx_runtime.jsx)("strong", { children: amount(data.allocation.sellAmount) })
													] })]
												})]
											})
										]
									}),
									!data && (0, react_jsx_runtime.jsx)("p", {
										className: "fp-note",
										children: t("loading")
									}),
									data?.holdings.length === 0 && (0, react_jsx_runtime.jsxs)("div", {
										className: "fp-empty",
										children: [
											(0, react_jsx_runtime.jsx)("span", {
												className: "fp-empty-icon",
												children: (0, react_jsx_runtime.jsx)(ChartNoAxesColumnIncreasing, {
													size: 28,
													strokeWidth: 1.5,
													"aria-hidden": "true"
												})
											}),
											(0, react_jsx_runtime.jsx)("h3", { children: t("empty") }),
											(0, react_jsx_runtime.jsx)("p", { children: t("emptyHint") })
										]
									}),
									(0, react_jsx_runtime.jsx)("div", {
										className: "fp-list",
										children: data?.holdings.map((row) => (0, react_jsx_runtime.jsx)(HoldingCard, {
											row,
											allocation: data.allocation,
											t,
											edit: () => openHoldingForm({
												holding: row.holding,
												accountId: row.holding.accountId,
												code: row.fund.code,
												shares: row.holding.shares,
												costPrice: row.holding.costPrice,
												fund: row.fund
											}),
											remove: () => {
												setLocalError(null);
												setDeleting({
													label: `${row.fund.name} · ${row.accountName} · ${row.holding.shares} · ${row.holding.costPrice}`,
													action: () => api.holdingDelete({
														id: row.holding.id,
														version: row.holding.version
													}, lifetime.current.signal)
												});
											}
										}, row.holding.id))
									}),
									(0, react_jsx_runtime.jsxs)("footer", {
										className: "fp-footer",
										children: [
											(0, react_jsx_runtime.jsx)("p", {
												className: "fp-note",
												children: t("disclaimer")
											}),
											data?.allocation && (0, react_jsx_runtime.jsx)("p", {
												className: "fp-note",
												children: t("allocationDisclaimer")
											}),
											(0, react_jsx_runtime.jsx)("p", {
												className: "fp-muted",
												children: t("source")
											})
										]
									})
								]
							})
						]
					}),
					form && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						title: t(form.holding ? "editHolding" : "addHolding"),
						closeLabel: t("close"),
						onClose: () => {
							if (!working) closeHoldingForm();
						},
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: working,
							onClick: closeHoldingForm,
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "submit",
							form: holdingFormId,
							variant: "primary",
							disabled: working || !form.fund || !form.accountId,
							children: t("confirmFund")
						})] }),
						children: (0, react_jsx_runtime.jsxs)(ModalFocusScope, {
							busy: working,
							initialFocusId: holdingFormFocusId,
							children: [modalError, (0, react_jsx_runtime.jsxs)("form", {
								id: holdingFormId,
								className: "fp-modal-form",
								onSubmit: saveHolding,
								children: [
									!data?.accounts.length && (0, react_jsx_runtime.jsx)("p", {
										className: "fp-warning",
										children: t("chooseAccount")
									}),
									(0, react_jsx_runtime.jsxs)("label", { children: [t("account"), (0, react_jsx_runtime.jsxs)("select", {
										required: true,
										disabled: working,
										value: form.accountId,
										onChange: (event) => setForm({
											...form,
											accountId: event.target.value
										}),
										children: [(0, react_jsx_runtime.jsx)("option", {
											value: "",
											children: t("account")
										}), data?.accounts.map((account) => (0, react_jsx_runtime.jsx)("option", {
											value: account.id,
											children: account.name
										}, account.id))]
									})] }),
									(0, react_jsx_runtime.jsxs)("label", { children: [t("code"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: form.holding ? void 0 : holdingFormFocusId,
										required: true,
										disabled: working,
										pattern: "[0-9]{6}",
										maxLength: 6,
										inputMode: "numeric",
										value: form.code,
										onChange: (event) => setForm({
											...form,
											code: event.target.value,
											fund: null
										})
									})] }),
									(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
										variant: "outline",
										disabled: working || !/^\d{6}$/.test(form.code),
										onClick: () => {
											const code = form.code;
											run(async () => {
												const fund = await api.lookup({ code }, lifetime.current.signal);
												if (lifetime.current.signal.aborted) return;
												setForm((current) => current?.code === code ? {
													...current,
													fund,
													costPrice: fund.kind === "money" ? "1" : current.costPrice
												} : current);
											});
										},
										children: t("lookup")
									}),
									form.fund && (0, react_jsx_runtime.jsxs)("p", {
										className: "fp-note",
										children: [
											t("validated"),
											": ",
											form.fund.name,
											" · ",
											form.fund.code
										]
									}),
									(0, react_jsx_runtime.jsxs)("label", { children: [t("shares"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: form.holding ? holdingFormFocusId : void 0,
										required: true,
										disabled: working,
										inputMode: "decimal",
										value: form.shares,
										onChange: (event) => setForm({
											...form,
											shares: event.target.value
										})
									})] }),
									(0, react_jsx_runtime.jsxs)("label", { children: [t("costPrice"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										required: true,
										disabled: working,
										inputMode: "decimal",
										readOnly: form.fund?.kind === "money",
										value: form.costPrice,
										onChange: (event) => setForm({
											...form,
											costPrice: event.target.value
										})
									})] })
								]
							})]
						})
					}),
					modal === "accounts" && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						title: t("accounts"),
						closeLabel: t("close"),
						onClose: () => {
							if (!working) closeModal();
						},
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [accountForm.account && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: working,
							onClick: () => setAccountForm({ name: "" }),
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "submit",
							form: accountFormId,
							variant: "primary",
							disabled: working || !accountForm.name.trim(),
							children: t(accountForm.account ? "save" : "addAccount")
						})] }),
						children: (0, react_jsx_runtime.jsxs)(ModalFocusScope, {
							busy: working,
							children: [
								!deleting && modalError,
								(0, react_jsx_runtime.jsx)("p", {
									className: "fp-note",
									children: t("accountHelp")
								}),
								(0, react_jsx_runtime.jsx)("div", {
									className: "fp-account-list",
									children: data?.accounts.map((account) => (0, react_jsx_runtime.jsxs)("div", {
										className: "fp-line fp-account",
										children: [(0, react_jsx_runtime.jsx)("span", { children: account.name }), (0, react_jsx_runtime.jsxs)("div", {
											className: "fp-line",
											children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												size: "sm",
												disabled: working,
												"aria-label": `${t("rename")} ${account.name}`,
												onClick: () => {
													setAccountForm({
														account,
														name: account.name
													});
													document.getElementById(accountNameId)?.focus();
												},
												children: t("rename")
											}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
												size: "sm",
												disabled: working,
												"aria-label": `${t("delete")} ${account.name}`,
												onClick: () => {
													setLocalError(null);
													setDeleting({
														label: account.name,
														action: async () => {
															await api.accountDelete({
																id: account.id,
																version: account.version
															}, lifetime.current.signal);
															if (filter === account.id) selectAccount("");
															if (accountForm.account?.id === account.id) setAccountForm({ name: "" });
														}
													});
												},
												children: t("delete")
											})]
										})]
									}, account.id))
								}),
								(0, react_jsx_runtime.jsxs)("form", {
									id: accountFormId,
									className: "fp-account-form",
									onSubmit: (event) => {
										event.preventDefault();
										run(() => accountForm.account ? api.accountUpdate({
											...accountForm.account,
											name: accountForm.name
										}, lifetime.current.signal) : api.accountCreate({ name: accountForm.name }, lifetime.current.signal), () => setAccountForm({ name: "" }));
									},
									children: [(0, react_jsx_runtime.jsx)("h3", { children: t(accountForm.account ? "rename" : "addAccount") }), (0, react_jsx_runtime.jsxs)("label", { children: [t("accountName"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
										id: accountNameId,
										required: true,
										maxLength: 100,
										disabled: working,
										value: accountForm.name,
										onChange: (event) => setAccountForm({
											...accountForm,
											name: event.target.value
										})
									})] })]
								})
							]
						})
					}),
					modal === "allocation" && allocationForm && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						title: t("allocation"),
						closeLabel: t("close"),
						onClose: () => {
							if (!working) closeModal();
						},
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "outline",
							disabled: working,
							onClick: closeModal,
							children: t("cancel")
						}), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							type: "submit",
							form: allocationFormId,
							variant: "primary",
							disabled: working || !allocationCanSave,
							children: t("save")
						})] }),
						children: (0, react_jsx_runtime.jsxs)(ModalFocusScope, {
							busy: working,
							initialFocusId: allocationFocusId,
							children: [
								modalError,
								(0, react_jsx_runtime.jsx)("p", {
									className: "fp-note",
									children: t("allocationHelp")
								}),
								(0, react_jsx_runtime.jsxs)("form", {
									id: allocationFormId,
									className: "fp-modal-form",
									onSubmit: (event) => {
										event.preventDefault();
										if (!allocationCanSave || working) return;
										run(() => api.allocationUpdate({
											accountId: allocationForm.accountId,
											allocations: allocationForm.items.map((item) => ({
												id: item.holding.id,
												version: item.holding.version,
												targetRatio: item.targetRatio
											}))
										}, lifetime.current.signal), closeModal);
									},
									children: [
										(0, react_jsx_runtime.jsx)("div", {
											className: "fp-allocation-editor",
											children: allocationForm.items.map((item, index) => {
												const inputId = index === 0 ? allocationFocusId : `${allocationFocusId}-${index}`;
												return (0, react_jsx_runtime.jsxs)("label", {
													className: "fp-allocation-row",
													htmlFor: inputId,
													children: [(0, react_jsx_runtime.jsxs)("span", { children: [(0, react_jsx_runtime.jsx)("strong", { children: item.fund.name }), (0, react_jsx_runtime.jsx)("small", { children: item.fund.code })] }), (0, react_jsx_runtime.jsxs)("span", {
														className: "fp-percent-input",
														children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Input, {
															id: inputId,
															type: "number",
															min: "0",
															max: "100",
															step: "0.01",
															required: true,
															disabled: working,
															inputMode: "decimal",
															"aria-label": `${item.fund.name} ${t("targetRatio")}`,
															value: item.targetRatio,
															onChange: (event) => setAllocationForm((current) => current ? {
																...current,
																items: current.items.map((entry, itemIndex) => itemIndex === index ? {
																	...entry,
																	targetRatio: event.target.value
																} : entry)
															} : current)
														}), (0, react_jsx_runtime.jsx)("span", {
															"aria-hidden": "true",
															children: "%"
														})]
													})]
												}, item.holding.id);
											})
										}),
										(0, react_jsx_runtime.jsxs)("div", {
											className: "fp-allocation-progress",
											"aria-live": "polite",
											children: [
												(0, react_jsx_runtime.jsxs)("span", { children: [
													t("configured"),
													" ",
													(0, react_jsx_runtime.jsxs)("strong", { children: [
														allocationForm.items.filter((item) => item.targetRatio !== "").length,
														"/",
														allocationForm.items.length
													] })
												] }),
												(0, react_jsx_runtime.jsxs)("span", { children: [
													t("targetTotal"),
													" ",
													(0, react_jsx_runtime.jsxs)("strong", { children: [allocationTotal.toFixed(2), "%"] })
												] }),
												(0, react_jsx_runtime.jsxs)("span", { children: [
													t("remaining"),
													" ",
													(0, react_jsx_runtime.jsxs)("strong", { children: [new Decimal(100).sub(allocationTotal).toFixed(2), "%"] })
												] })
											]
										}),
										!allocationCanSave && (0, react_jsx_runtime.jsx)("p", {
											className: "fp-warning",
											children: t(allocationValuesValid ? "allocationInvalid" : "allocationUnconfigured")
										}),
										(0, react_jsx_runtime.jsx)("p", {
											className: "fp-note",
											children: t("allocationDisclaimer")
										})
									]
								})
							]
						})
					}),
					modal === "import" && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						title: t("importReady"),
						closeLabel: t("close"),
						onClose: () => {
							if (!working) closeModal();
						},
						footer: (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
							(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: working,
								onClick: closeModal,
								children: t("cancel")
							}),
							!preview && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								variant: "outline",
								disabled: working,
								onClick: () => fileInputRef.current?.click(),
								children: t("chooseFile")
							}),
							preview && (0, react_jsx_runtime.jsxs)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								disabled: working || !replace && preview.conflicts.length > 0,
								variant: "primary",
								onClick: () => void run(() => api.importData({
									json: importFile.json,
									previewToken: preview.previewToken,
									mode: replace ? "replace" : "merge"
								}, lifetime.current.signal), () => {
									closeModal();
									setForm(null);
									selectAccount("");
								}),
								children: [
									t("confirm"),
									" · ",
									t(replace ? "replace" : "merge")
								]
							})
						] }),
						children: (0, react_jsx_runtime.jsxs)(ModalFocusScope, {
							busy: working,
							children: [
								modalError,
								(0, react_jsx_runtime.jsx)("p", {
									className: "fp-filename",
									children: importFile?.name
								}),
								(0, react_jsx_runtime.jsx)("p", {
									className: "fp-note",
									children: t("privacy")
								}),
								!preview && working && (0, react_jsx_runtime.jsx)("p", {
									role: "status",
									className: "fp-note",
									children: t("readingFile")
								}),
								preview && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
									(0, react_jsx_runtime.jsxs)("div", {
										className: "fp-import-summary",
										children: [(0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", { children: t("accounts") }), (0, react_jsx_runtime.jsx)("strong", { children: preview.accounts })] }), (0, react_jsx_runtime.jsxs)("div", { children: [(0, react_jsx_runtime.jsx)("span", { children: t("holdings") }), (0, react_jsx_runtime.jsx)("strong", { children: preview.holdings })] })]
									}),
									(0, react_jsx_runtime.jsxs)("div", {
										className: "fp-switch-row",
										children: [(0, react_jsx_runtime.jsx)("span", { children: t("replace") }), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Switch, {
											checked: replace,
											disabled: working,
											label: t("replace"),
											onChange: setReplace
										})]
									}),
									(0, react_jsx_runtime.jsxs)("p", {
										className: "fp-note",
										children: [
											t("conflict"),
											": ",
											preview.conflicts.join(", ") || t("noConflicts")
										]
									}),
									replace && (0, react_jsx_runtime.jsx)("p", {
										className: "fp-warning",
										children: t("importWarning")
									})
								] })
							]
						})
					}),
					deleting && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
						open: true,
						title: t("deleteQuestion"),
						closeLabel: t("cancel"),
						onClose: () => {
							if (!working) {
								setDeleting(null);
								setLocalError(null);
							}
						},
						description: deleting.label,
						footer: (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							disabled: working,
							onClick: () => void run(deleting.action, () => setDeleting(null)),
							children: t("delete")
						}),
						children: (0, react_jsx_runtime.jsx)(ModalFocusScope, {
							alert: true,
							busy: working,
							children: modalError
						})
					})
				]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** Typed copy for all portfolio controls, metrics and empty/error states. */
		const NS = "fundPortfolio";
		const en = {
			title: "Fund portfolio",
			sidebarLabel: "Fund",
			subtitle: "Current-share returns · CNY",
			today: "Today’s return",
			confirmed: "Disclosed",
			estimated: "Estimated",
			missing: "Awaiting data",
			market: "Market value",
			cost: "Holding cost",
			floating: "Floating P&L",
			covered: "covered",
			accounts: "Accounts",
			allAccounts: "All accounts",
			addAccount: "Add account",
			accountName: "Account name",
			rename: "Rename",
			delete: "Delete",
			addHolding: "Add holding",
			editHolding: "Edit holding",
			edit: "Edit",
			refresh: "Refresh",
			refreshing: "Refreshing…",
			save: "Save",
			cancel: "Cancel",
			lookup: "Verify fund",
			code: "Fund code",
			shares: "Confirmed shares",
			costPrice: "Average cost per share",
			account: "Account",
			name: "Fund",
			nav: "Disclosed NAV",
			estimate: "Reference estimate",
			noData: "—",
			pending: "Awaiting disclosure",
			baseline: "Daily estimate unavailable: baseline not verified",
			review: "Corporate action or return mismatch: verify with your platform",
			unavailable: "Market data unavailable",
			reference: "Change vs. reference NAV (not today’s return)",
			recent: "Latest disclosed return",
			empty: "Your portfolio starts here",
			emptyHint: "Create an account, verify a fund, then enter confirmed shares and average cost.",
			disclaimer: "Calculated using your current entered shares. Not a transaction ledger or actual credited return. Estimates are not dealing prices.",
			source: "Estimates: Sina · Disclosures: Eastmoney",
			backup: "Backup",
			export: "Export JSON",
			import: "Import JSON",
			preview: "Preview import",
			replace: "Replace all holdings",
			merge: "Merge without conflicts",
			importWarning: "Replacement permanently overwrites all accounts and holdings. Market history is retained.",
			confirm: "Confirm",
			deleteQuestion: "Permanently delete this record?",
			conflict: "Conflicts",
			privacy: "Backups contain private holdings. Keep them outside public repositories.",
			moneyYield: "Income per 10,000 shares",
			annual: "7-day annualized yield",
			money: "Money market",
			qdii: "QDII",
			navFund: "NAV fund",
			amount: "Amount",
			date: "Date",
			priceDate: "Price date",
			estimateTime: "Estimate time",
			referenceDate: "Reference NAV date",
			fetched: "Last fetched",
			error: "Operation failed",
			duplicateHolding: "This account already has the fund. Edit the existing holding instead.",
			chooseAccount: "Create or select an account first",
			validated: "Verified fund",
			confirmFund: "Confirm fund and save",
			close: "Close",
			viewData: "Data",
			details: "Details",
			zeroCost: "Return rate unavailable for zero cost",
			loading: "Loading portfolio…",
			importReady: "Import preview",
			noConflicts: "No conflicts",
			holdings: "Holdings",
			partial: "Partial total",
			stale: "Cached data; check the dates",
			rate: "Floating return rate",
			quoteStatus: "Market data",
			quoteDetails: "Data source details",
			estimateUnavailable: "No intraday estimate available",
			estimatePending: "No intraday estimate; awaiting NAV disclosure",
			transfer: "Import / Export",
			chooseFile: "Choose JSON file",
			readingFile: "Reading and validating backup…",
			jsonFileOnly: "Choose a .json backup file",
			fileTooLarge: "Backup files must not exceed 20 MiB",
			invalidJson: "Invalid JSON file. Check the file and try again.",
			fileReadError: "Could not read the file. Choose it again.",
			accountHelp: "Create or rename accounts here. Remove all holdings before deleting an account.",
			allocation: "Target allocation",
			allocationHelp: "Set every current holding’s target. The total must equal exactly 100%.",
			targetRatio: "Target allocation",
			currentRatio: "Current allocation",
			targetTotal: "Target total",
			remaining: "Remaining",
			configured: "Configured",
			allocationUnconfigured: "Target allocation is incomplete",
			allocationInvalid: "Target allocation must total exactly 100%",
			allocationMarketIncomplete: "Complete market values are required before rebalancing",
			allocationReady: "Theoretical rebalance is ready",
			theoreticalBuy: "Theoretical buy",
			theoreticalSell: "Theoretical sell",
			theoreticalHold: "No adjustment",
			estimatedShares: "Estimated shares",
			allocationDisclaimer: "Theoretical estimate only. Excludes fees, dealing limits, minimum amounts, confirmation and settlement time. Not investment or executable trading advice."
		};
		const zh = {
			title: "基金持仓",
			sidebarLabel: "基金",
			subtitle: "按当前份额测算 · 人民币",
			today: "今日收益",
			confirmed: "已公布",
			estimated: "估算中",
			missing: "待公布／缺失",
			market: "持仓市值",
			cost: "持仓成本",
			floating: "持仓浮盈",
			covered: "已覆盖",
			accounts: "账户管理",
			allAccounts: "全部账户",
			addAccount: "新增账户",
			accountName: "账户名称",
			rename: "重命名",
			delete: "删除",
			addHolding: "新增持仓",
			editHolding: "编辑持仓",
			edit: "编辑",
			refresh: "刷新",
			refreshing: "刷新中…",
			save: "保存",
			cancel: "取消",
			lookup: "查证基金",
			code: "基金代码",
			shares: "已确认份额",
			costPrice: "持仓平均成本单价",
			account: "账户",
			name: "基金",
			nav: "已公布净值",
			estimate: "参考估值",
			noData: "—",
			pending: "待公布",
			baseline: "无法确认单日基准，暂无可靠今日估算",
			review: "存在分红、拆分或收益口径异常，请与交易平台核对",
			unavailable: "暂无行情数据",
			reference: "相对基准净值变动（非今日收益）",
			recent: "最近已公布收益",
			empty: "从第一笔持仓开始",
			emptyHint: "先创建账户，查证基金后录入已确认份额与平均成本。",
			disclaimer: "按当前录入份额测算，不是交易账本，也不等同于实际到账收益。估值不是可成交价格。",
			source: "估值：新浪 · 披露净值：天天基金",
			backup: "数据备份",
			export: "导出 JSON",
			import: "导入 JSON",
			preview: "预览导入",
			replace: "替换全部持仓",
			merge: "无冲突合并",
			importWarning: "替换会永久覆盖全部账户和持仓；行情历史保留。",
			confirm: "确认",
			deleteQuestion: "确定永久删除这条记录？",
			conflict: "冲突",
			privacy: "备份包含私人持仓，请勿上传公开仓库。",
			moneyYield: "每万份收益",
			annual: "七日年化",
			money: "货币基金",
			qdii: "QDII",
			navFund: "净值型基金",
			amount: "金额",
			date: "日期",
			priceDate: "价格日期",
			estimateTime: "估值时间",
			referenceDate: "基准净值日期",
			fetched: "最近抓取",
			error: "操作失败",
			duplicateHolding: "该账户已存在这只基金，请编辑原有持仓。",
			chooseAccount: "请先创建或选择账户",
			validated: "已查证基金",
			confirmFund: "确认基金并保存",
			close: "关闭",
			viewData: "数据",
			details: "详情",
			zeroCost: "零成本不计算收益率",
			loading: "正在读取持仓…",
			importReady: "导入预览",
			noConflicts: "无冲突",
			holdings: "持仓",
			partial: "部分合计",
			stale: "缓存行情，请注意日期",
			rate: "持仓收益率",
			quoteStatus: "行情提示",
			quoteDetails: "行情来源详情",
			estimateUnavailable: "暂无盘中估值",
			estimatePending: "暂无盘中估值，等待净值公布",
			transfer: "导入导出",
			chooseFile: "选择 JSON 文件",
			readingFile: "正在读取并校验备份…",
			jsonFileOnly: "请选择 .json 格式的备份文件",
			fileTooLarge: "备份文件不能超过 20 MiB",
			invalidJson: "JSON 文件格式不正确，请检查后重试。",
			fileReadError: "无法读取文件，请重新选择。",
			accountHelp: "在这里新增或重命名账户。删除账户前，需要先清空该账户的持仓。",
			allocation: "目标占比",
			allocationHelp: "为当前账户的每只基金设置目标占比，合计必须精确为 100%。",
			targetRatio: "目标占比",
			currentRatio: "当前占比",
			targetTotal: "目标合计",
			remaining: "剩余比例",
			configured: "已配置",
			allocationUnconfigured: "目标占比尚未配置完整",
			allocationInvalid: "目标占比合计必须精确为 100%",
			allocationMarketIncomplete: "行情市值完整后才能计算再平衡",
			allocationReady: "理论再平衡已就绪",
			theoreticalBuy: "理论买入",
			theoreticalSell: "理论卖出",
			theoreticalHold: "无需调整",
			estimatedShares: "对应份额",
			allocationDisclaimer: "仅为理论测算，未计手续费、申赎限制、最低交易额、确认及到账时间，不构成投资建议或可直接执行的交易指令。"
		};
		//#endregion
		//#region lib/types/client/index.js
		const inject = [
			"slots",
			"locale",
			"remote",
			"sidebarRight",
			"sidebarRightTabs"
		];
		function unwrap(result) {
			if (!result.ok) throw result.error;
			return result.value;
		}
		async function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "fund-portfolio: locales");
			const t = ctx.locale.bind(NS);
			const unmount = await ctx.remote.$mount(TYPERT_REMOTE);
			const fiber = ctx.inject(["remote.fundPortfolio"], (scope) => {
				scope.effect(() => scope.sidebarRightTabs.register({
					id: "dsh-fund-portfolio",
					kind: "fund-portfolio",
					title: () => t("title")
				}), "fund-portfolio: tab");
				const api = {
					accountCreate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountCreate(input, signal)),
					accountUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountUpdate(input, signal)),
					accountDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.accountDelete(input, signal)),
					lookup: async (input, signal) => unwrap(await scope.remote.fundPortfolio.lookup(input, signal)),
					holdingAdd: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingAdd(input, signal)),
					holdingUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingUpdate(input, signal)),
					holdingDelete: async (input, signal) => unwrap(await scope.remote.fundPortfolio.holdingDelete(input, signal)),
					allocationUpdate: async (input, signal) => unwrap(await scope.remote.fundPortfolio.allocationUpdate(input, signal)),
					summary: async (input, signal) => unwrap(await scope.remote.fundPortfolio.summary(input, signal)),
					exportData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.exportData(input, signal)),
					previewImport: async (input, signal) => unwrap(await scope.remote.fundPortfolio.previewImport(input, signal)),
					importData: async (input, signal) => unwrap(await scope.remote.fundPortfolio.importData(input, signal))
				};
				scope.slots.inject("sidebar.footer.action", () => scope.slots.register({
					name: "sidebar.footer.action",
					id: "fund-portfolio",
					order: 60,
					locale: NS,
					inject: () => ({ openPanel: () => scope.sidebarRight.openTab("fund-portfolio") })
				}, PortfolioTrigger));
				scope.slots.inject("sidebar.right.pane.tab", () => scope.slots.register({
					name: "sidebar.right.pane.tab",
					key: "dsh-fund-portfolio",
					locale: NS,
					inject: () => ({ api })
				}, PortfolioPanel));
			});
			try {
				await fiber;
			} catch (error) {
				await unmount();
				throw error;
			}
			return async () => {
				await fiber.dispose();
				await unmount();
			};
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

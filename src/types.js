/**
 * @exports
 * @template T
 * @template {keyof any} K
 * @typedef {K extends keyof T ? true : false} KeyExists
 */

/** @typedef {KeyExists<typeof globalThis, "NodeJS">} IsNodeRuntime */
/** @typedef {KeyExists<typeof globalThis, "Bun">} IsBunRuntime */
/** @typedef {KeyExists<typeof globalThis, "Deno">} IsDenoRuntime */

/** @typedef {"node"} NodeRuntime */
/** @typedef {"bun"} BunRuntime */
/** @typedef {"deno"} DenoRuntime */
/** @typedef {BunRuntime | DenoRuntime} WebRuntime */
/** @typedef {NodeRuntime | WebRuntime} JsRuntime */
/** @typedef {IsNodeRuntime extends true ? NodeRuntime : IsBunRuntime extends true ? BunRuntime : IsDenoRuntime extends true ? DenoRuntime : never} CurrentJsRuntime */

/** @typedef {{ params: Record<string, string | undefined>, searchParams: Record<string, string> }} RouteRequestExtras */
/** @typedef {Request & RouteRequestExtras} RouteRequest */
/** @typedef {import("node:http").IncomingMessage & RouteRequestExtras} RouteIncomingMessage */

/** @typedef {(error?: any) => Promise<void> | void} NodeNext */
/** @typedef {(error?: any) => Promise<Response> | Response} WebNext */

/**
 * @template {JsRuntime} [R=CurrentJsRuntime]
 * @typedef {R extends NodeRuntime ? NodeMiddleware : R extends WebRuntime ? WebMiddleware : never} Middleware
 */
/** @typedef {(request: import("node:http").IncomingMessage, response: import("node:http").ServerResponse, next: NodeNext) => Promise<void> | void} NodeMiddleware */
/** @typedef {(request: Request, next: WebNext) => Promise<Response> | Response} WebMiddleware */

/**
 * @template {JsRuntime} [R=CurrentJsRuntime]
 * @typedef {R extends NodeRuntime ? NodeRouteMiddleware : R extends WebRuntime ? WebRouteMiddleware : never} RouteMiddleware
 */
/** @typedef {(request: RouteIncomingMessage, response: import("node:http").ServerResponse, next: NodeNext) => Promise<void> | void} NodeRouteMiddleware */
/** @typedef {(request: RouteRequest, next: WebNext) => Promise<Response> | Response} WebRouteMiddleware */

/**
 * @template {JsRuntime} [R=CurrentJsRuntime]
 * @typedef {R extends NodeRuntime ? NodeHandler : R extends WebRuntime ? WebHandler : never} Handler
 */
/** @typedef {(request: import("node:http").IncomingMessage, response: import("node:http").ServerResponse) => Promise<void> | void} NodeHandler */
/** @typedef {(request: Request) => Promise<Response> | Response} WebHandler */

/**
 * @template {JsRuntime} [R=CurrentJsRuntime]
 * @typedef {R extends NodeRuntime ? NodeErrorHandler : R extends WebRuntime ? WebErrorHandler : never} ErrorHandler
 */
/** @typedef {(error: unknown, request: import("node:http").IncomingMessage, response: import("node:http").ServerResponse) => Promise<void> | void} NodeErrorHandler */
/** @typedef {(error: unknown, request: Request) => Promise<Response> | Response} WebErrorHandler */

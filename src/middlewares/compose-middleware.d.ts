export default composeMiddleware;
/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 * @param {Array<types.Middleware<R>>} fns
 * @returns {types.Handler<R>}
 */
declare function composeMiddleware<R extends types.JsRuntime = types.CurrentJsRuntime>(fns: types.Middleware<R>[]): types.Handler<R>;
import * as types from "../types.js";

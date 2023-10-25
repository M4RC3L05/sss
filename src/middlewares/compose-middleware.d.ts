export default composeMiddleware;
declare function composeMiddleware<R extends types.JsRuntime = types.CurrentJsRuntime>(fns: types.Middleware<R>[]): types.Handler<R>;
import * as types from "../types.js";

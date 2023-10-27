export default composeMiddleware;
declare function composeMiddleware<R extends types.JsRuntime = types.CurrentJsRuntime>(...middlewares: types.Middleware<R>[]): types.Middleware<R>;
import * as types from "../types.js";

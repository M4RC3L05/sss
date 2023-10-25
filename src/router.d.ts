export default Router;
declare class Router<R extends types.JsRuntime = types.CurrentJsRuntime> {
    setup(config?: Object | undefined): Promise<this>;
    get(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    head(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    post(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    put(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    delete(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    connect(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    options(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    trace(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    path(path: string, ...middlewares: types.RouteMiddleware<R>[]): void;
    middleware(): types.Middleware<R>;
    #private;
}
import * as types from "./types.js";

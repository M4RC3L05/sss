export default Router;
/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
declare class Router<R extends types.JsRuntime = types.CurrentJsRuntime> {
    /**
     * @param {Object} [config]
     */
    setup(config?: Object | undefined): Promise<this>;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    get(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    head(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    post(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    put(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    delete(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    connect(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    options(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    trace(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @param {string} path
     * @param  {...types.Middleware<R>} middlewares
     */
    path(path: string, ...middlewares: types.Middleware<R>[]): void;
    /**
     * @returns {types.Middleware<R>}
     */
    middleware(): types.Middleware<R>;
    #private;
}
import * as types from "./types.js";

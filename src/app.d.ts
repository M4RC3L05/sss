export default App;
/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
declare class App<R extends types.JsRuntime = types.CurrentJsRuntime> {
    /**
     * @param  {Array<types.Middleware<R>>} m
     */
    use(...m: Array<types.Middleware<R>>): void;
    /**
     * @param  {types.ErrorHandler<R>} errorHandler
     */
    onError(errorHandler: types.ErrorHandler<R>): void;
    /**
     * @returns {types.Handler<R>}
     */
    handle(): types.Handler<R>;
    #private;
}
import * as types from "./types.js";

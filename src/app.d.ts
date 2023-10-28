export default App;
declare class App<R extends types.JsRuntime = types.CurrentJsRuntime> {
    get errorHandler(): types.ErrorHandler<R> | undefined;
    use(...middlewares: types.Middleware<R>[]): void;
    onError(errorHandler: types.ErrorHandler<R>): void;
    handle(): types.Handler<R>;
    #private;
}
import * as types from "./types.js";

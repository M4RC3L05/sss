// eslint-disable-next-line no-unused-vars
import * as types from "./types.js";
import { compose } from "./middlewares/mod.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
class App {
  /** @type {Array<types.Middleware<R>>} */
  #middlewares = [];

  /** @type {types.Handler<R> | undefined} */
  #handler;

  /** @type {types.ErrorHandler<R> | undefined} */
  #errorHandler;

  /**
   * @param  {Array<types.Middleware<R>>} m
   */
  use(...m) {
    this.#middlewares.push(...m.filter((f) => typeof f === "function"));
    this.#handler = compose(this.#middlewares);
  }

  /**
   * @param  {types.ErrorHandler<R>} errorHandler
   */
  onError(errorHandler) {
    this.#errorHandler = errorHandler;
  }

  /**
   * @returns {types.Handler<R>}
   */
  handle() {
    // eslint-disable-next-line unicorn/no-this-assignment
    const self = this;

    return function handler(request, response) {
      try {
        return Promise.resolve(self.#handler?.(request, response)).catch((error) =>
          self.#errorHandler?.(error, request, response),
        );
      } catch (error) {
        return self.#errorHandler?.(error, request, response);
      }
    };
  }
}

export default App;

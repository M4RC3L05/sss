// eslint-disable-next-line no-unused-vars
import * as types from "./types.js";
import { compose } from "./middlewares/mod.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
class App {
  /** @type {Array<types.Middleware<R>>} */
  #middlewares = [];

  /** @type {types.Middleware<R> | undefined} */
  #handler;

  /** @type {types.ErrorHandler<R> | undefined} */
  #errorHandler;

  /**
   * @returns {types.ErrorHandler<R> | undefined}
   */
  get errorHandler() {
    return this.#errorHandler?.bind(this);
  }

  /**
   * @param {...types.Middleware<R>} middlewares
   */
  use(...middlewares) {
    this.#middlewares.push(...middlewares.filter((f) => typeof f === "function"));
    this.#handler = compose(this.#errorHandler?.bind(this), ...this.#middlewares);
  }

  /**
   * @param {types.ErrorHandler<R>} errorHandler
   */
  onError(errorHandler) {
    this.#errorHandler = errorHandler;
    this.#handler = compose(this.#errorHandler?.bind(this), ...this.#middlewares);
  }

  /**
   * @returns {types.NodeHandler}
   */
  #handeNode() {
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

  /**
   * @returns {types.WebHandler}
   */
  #handleWeb() {
    // eslint-disable-next-line unicorn/no-this-assignment
    const self = this;

    return function handler(request) {
      try {
        return Promise.resolve(self.#handler?.(request)).catch((error) =>
          self.#errorHandler?.(error, request),
        );
      } catch (error) {
        return self.#errorHandler?.(error, request);
      }
    };
  }

  /**
   * @returns {types.Handler<R>}
   */
  handle() {
    // eslint-disable-next-line no-undef
    if (typeof Bun !== "undefined" || typeof Deno !== "undefined") {
      return this.#handleWeb();
    }

    return this.#handeNode();
  }
}

export default App;

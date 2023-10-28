// eslint-disable-next-line no-unused-vars
import * as types from "./types.js";
import { compose } from "./middlewares/mod.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
class Router {
  /** @type {import("find-my-way").Instance<import("find-my-way").HTTPVersion.V1> | undefined} */
  #router;

  /** @type {{ errorHandler: types.ErrorHandler<R> } | undefined} */
  #app;

  /**
   * @param {{ errorHandler: types.ErrorHandler<R> | undefined }} [app]
   */
  constructor(app) {
    this.#app = app;
  }

  /**
   * @param {Object} [config]
   */
  async setup(config) {
    const dep = await ("Deno" in globalThis
      ? import("npm:find-my-way@7.7.0")
      : import("find-my-way"));

    this.#router = dep.default(config);

    return this;
  }

  /**
   * @param {string} method
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  #bind(method, path, ...middlewares) {
    this.#router?.[method]?.(path, compose(this.#app?.errorHandler, ...middlewares));
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  get(path, ...middlewares) {
    this.#bind("get", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  head(path, ...middlewares) {
    this.#bind("head", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  post(path, ...middlewares) {
    this.#bind("post", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  put(path, ...middlewares) {
    this.#bind("put", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  delete(path, ...middlewares) {
    this.#bind("delete", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  connect(path, ...middlewares) {
    this.#bind("connect", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  options(path, ...middlewares) {
    this.#bind("options", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  trace(path, ...middlewares) {
    this.#bind("trace", path, ...middlewares);
  }

  /**
   * @param {string} path
   * @param {...types.RouteMiddleware<R>} middlewares
   */
  patch(path, ...middlewares) {
    this.#bind("patch", path, ...middlewares);
  }

  /**
   * @returns {types.Middleware<R>}
   */
  middleware() {
    // eslint-disable-next-line unicorn/no-this-assignment
    const self = this;

    return function handler(request, responseOrNext, next) {
      const match = self.#router?.find(request.method, request.url);

      if (!match) return (next ?? responseOrNext)();

      request.params = match.params;
      request.searchParams = match.searchParams;

      return match.handler(request, responseOrNext ?? next, next);
    };
  }
}

export default Router;

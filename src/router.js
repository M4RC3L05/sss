// eslint-disable-next-line no-unused-vars
import * as types from "./types.js";
import { compose } from "./middlewares/mod.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 */
class Router {
  /** @type {import("find-my-way").Instance<import("find-my-way").HTTPVersion.V1> | undefined} */
  #router;

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
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  get(path, ...middlewares) {
    this.#router?.get(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  head(path, ...middlewares) {
    this.#router?.head(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  post(path, ...middlewares) {
    this.#router?.post(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  put(path, ...middlewares) {
    this.#router?.put(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  delete(path, ...middlewares) {
    this.#router?.delete(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  connect(path, ...middlewares) {
    this.#router?.connect(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  options(path, ...middlewares) {
    this.#router?.options(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  trace(path, ...middlewares) {
    this.#router?.trace(path, compose(middlewares));
  }

  /**
   * @param {string} path
   * @param  {...types.RouteMiddleware<R>} middlewares
   */
  path(path, ...middlewares) {
    this.#router?.patch(path, compose(middlewares));
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

      return match.handler(request, responseOrNext, next);
    };
  }
}

export default Router;

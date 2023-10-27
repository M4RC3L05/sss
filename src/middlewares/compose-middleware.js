// eslint-disable-next-line no-unused-vars
import * as types from "../types.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 * @param {...types.Middleware<R>} middlewares
 * @returns {types.Middleware<R>}
 */
const composeMiddleware = (...middlewares) => {
  return function handler(request, responseOrNext, next) {
    let i = 0;

    return step();

    function step() {
      const m = middlewares[i];

      if (!m) {
        const n = next ?? responseOrNext;

        if (n && typeof n === "function") {
          return n();
        }

        return;
      }

      i += 1;

      return m(request, responseOrNext ?? step, step);
    }
  };
};

export default composeMiddleware;

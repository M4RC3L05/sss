// eslint-disable-next-line no-unused-vars
import * as types from "../types.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 * @param {...types.Middleware<R>} middlewares
 * @returns {types.Handler<R>}
 */
const composeMiddleware = (...middlewares) => {
  return function handler(request, response) {
    let i = 0;

    return step();

    async function step() {
      const m = middlewares[i];

      if (!m) return;

      i += 1;

      return m(request, response ?? step, step);
    }
  };
};

export default composeMiddleware;

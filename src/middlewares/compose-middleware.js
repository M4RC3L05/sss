// eslint-disable-next-line no-unused-vars
import * as types from "../types.js";

/**
 * @template {types.JsRuntime} [R=types.CurrentJsRuntime]
 * @param {Array<types.Middleware<R>>} fns
 * @returns {types.Handler<R>}
 */
const composeMiddleware = (fns) => {
  return function handler(request, response) {
    let i = 0;

    return step();

    async function step() {
      const m = fns[i];

      if (!m) return;

      i += 1;

      return m(request, response ?? step, step);
    }
  };
};

export default composeMiddleware;

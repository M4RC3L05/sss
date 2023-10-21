/** @typedef {import("node:http").IncomingMessage} Request */
/** @typedef {import("node:http").ServerResponse} Response */
/** @typedef {(req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void} Middleware */

/**
 * @param {Middleware[]} fns
 * @returns {Middleware}
 */
const composeMiddleware = (fns) => {
	return function handler(request, response) {
		let i = 0;

		return step();

		function step() {
			const m = fns[i];

			if (!m) return;

			i += 1;

			return m(request, response, step);
		}
	};
};

export default composeMiddleware;

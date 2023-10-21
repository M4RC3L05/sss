import fmw from "find-my-way";

/** @typedef {import("node:http").IncomingMessage} Request */
/** @typedef {import("node:http").ServerResponse} Response */
/** @typedef {(req: Request, req: Response, next: () => Promise<void> | void) => Promise<void> | void} Middleware */

/**
 * @param {(router: fmw.Instance) => void} routes
 * @param {fmw.Config} [options]
 * @returns {Middleware}
 */
const routerMiddleware = (routes, options) => {
	const router = fmw(options);

	routes(router);

	return function handler(request, response, next) {
		// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
		const match = router.find(request.method, request.url);

		if (!match) return next();

		request.params = match.params;
		request.searchParams = match.searchParams;
		return match.handler(request, response);
	};
};

export default routerMiddleware;

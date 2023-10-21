import fmw, { type HTTPMethod, type Config, type Instance } from "find-my-way";
import { type Middleware } from "./types.js";

const routerMiddleware = (
	routes: (router: Instance<fmw.HTTPVersion.V1>) => void,
	options?: Config<fmw.HTTPVersion.V1>,
): Middleware => {
	const router = fmw(options);

	routes(router);

	return function handler(request, response, next) {
		// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
		const match = router.find(request.method as HTTPMethod, request.url!);

		if (!match) return next();

		(request as any).params = match.params;
		(request as any).searchParams = match.searchParams;

		return (match.handler as any as Middleware)(request, response, next);
	};
};

export default routerMiddleware;

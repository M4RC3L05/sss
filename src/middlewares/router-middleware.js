import fmw from "find-my-way";
const routerMiddleware = (routes, options) => {
    const router = fmw(options);
    routes(router);
    return function handler(request, response, next) {
        // eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument
        const match = router.find(request.method, request.url);
        if (!match)
            return next();
        request.params = match.params;
        request.searchParams = match.searchParams;
        return match.handler(request, response, next);
    };
};
export default routerMiddleware;

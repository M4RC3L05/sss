import fmw from "find-my-way";

const routerMiddleware = (routes, options = {}) => {
  const router = fmw(options);
  
  routes(router);

  return function handler(req, res, next) {
    const match = router.find(req.method, req.url);

    if (!match) return next();

    req.params = match.params;
    req.searchParams = match.searchParams
    return match.handler(req, res);
  }
}

export default routerMiddleware;
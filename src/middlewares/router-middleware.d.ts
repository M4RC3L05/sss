export default routerMiddleware;
export type Request = import("node:http").IncomingMessage;
export type Response = import("node:http").ServerResponse;
export type Middleware = (req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void;
declare function routerMiddleware(routes: (router: any) => void, options?: any): Middleware;

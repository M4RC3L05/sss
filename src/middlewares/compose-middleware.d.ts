export default composeMiddleware;
export type Request = import("node:http").IncomingMessage;
export type Response = import("node:http").ServerResponse;
export type Middleware = (req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void;
declare function composeMiddleware(fns: Middleware[]): Middleware;

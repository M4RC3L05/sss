import { type Middleware, type ErrorHandle, type ErrorLog } from "../types.js";
declare const errorHandlerMiddleware: (handlers: ErrorHandle[], log?: ErrorLog) => Middleware;
export default errorHandlerMiddleware;

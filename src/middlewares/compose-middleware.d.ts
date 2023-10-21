import { type Handler, type Middleware } from "../types.js";
declare const composeMiddleware: (fns: Middleware[]) => Handler;
export default composeMiddleware;

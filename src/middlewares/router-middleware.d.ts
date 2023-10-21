import fmw, { type Config, type Instance } from "find-my-way";
import { type Middleware } from "./types.js";
declare const routerMiddleware: (routes: (router: Instance<fmw.HTTPVersion.V1>) => void, options?: Config<fmw.HTTPVersion.V1>) => Middleware;
export default routerMiddleware;

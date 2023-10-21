export default errorMappermiddleware;
export type Request = import("node:http").IncomingMessage;
export type Response = import("node:http").ServerResponse;
export type Middleware = (req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void;
export type MappedError = {
    headers?: Record<string, unknown>;
    body?: Record<string, unknown>;
};
export type ErrorMapper = {
    shouldHandle: (error: any) => boolean;
    map: (error: any) => MappedError;
};
declare function errorMappermiddleware(mappers?: ErrorMapper[], log?: (error: any) => void): Middleware;

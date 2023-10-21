const errorHandlerMiddleware = (handlers, log) => {
    return async function handler(request, response, next) {
        try {
            await next();
        }
        catch (error) {
            log?.(error);
            const handler = handlers.find((m) => m.shouldHandle(error));
            if (handler) {
                return handler.handle(request, response, error);
            }
            throw new Error("No handler for error", { cause: error });
        }
    };
};
export default errorHandlerMiddleware;

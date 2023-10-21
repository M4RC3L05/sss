export default App;
export type Request = import("node:http").IncomingMessage;
export type Response = import("node:http").ServerResponse;
export type Middleware = (req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void;
declare class App {
    use(...m: Middleware[]): void;
    handle(): Middleware;
    #private;
}

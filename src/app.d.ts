import { type Handler, type Middleware } from "./types.js";
declare class App {
    #private;
    use(...m: Middleware[]): void;
    handle(): Handler;
}
export default App;
export * from "./types.js";

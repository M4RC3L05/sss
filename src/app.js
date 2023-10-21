import { compose } from "./middlewares/mod.js";
class App {
    #middlewares = [];
    #middleware;
    use(...m) {
        this.#middlewares.push(...m.filter((f) => typeof f === "function"));
        this.#middleware = compose(this.#middlewares);
    }
    handle() {
        return this.#middleware;
    }
}
export default App;
export * from "./types.js";

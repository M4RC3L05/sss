import { compose } from "./middlewares/mod.js";
import { type Handler, type Middleware } from "./types.js";

class App {
	#middlewares: Middleware[] = [];
	#middleware?: Handler;

	use(...m: Middleware[]) {
		this.#middlewares.push(...m.filter((f) => typeof f === "function"));
		this.#middleware = compose(this.#middlewares);
	}

	handle() {
		return this.#middleware!;
	}
}

export default App;

export * from "./types.js";

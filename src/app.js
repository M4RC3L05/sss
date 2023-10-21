import { compose } from "./middlewares/mod.js";

/** @typedef {import("node:http").IncomingMessage} Request */
/** @typedef {import("node:http").ServerResponse} Response */
/** @typedef {(req: Request, res: Response, next: () => Promise<void> | void) => Promise<void> | void} Middleware */

class App {
	/** @type {Middleware[]} */
	#middlewares = [];

	/** @type {Middleware} */
	#middleware;

	use(/** @type {Middleware[]} */ ...m) {
		this.#middlewares.push(...m.filter((f) => typeof f === "function"));
		this.#middleware = compose(this.#middlewares);
	}

	handle() {
		return this.#middleware;
	}
}

export default App;

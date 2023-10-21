import composeMiddleware from "@sss/compose-middleware";

class App {
  #middlewares = [];
  #middleware;

  use(...m) {
    this.#middlewares.push(...m);
    this.#middleware = composeMiddleware(this.#middlewares);
  }

  handle() {
    return this.#middleware;
  }
}

export default App
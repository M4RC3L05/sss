// @ts-nocheck

import { createServer } from "node:http";
import { App, NodeRuntime, Router } from "../src/mod.js";

// Optionally pass the correct js runtime.
const app = new App<NodeRuntime>();
// You can pass `find-my-way` options to the first argument of setup.
const router = await new Router<NodeRuntime>().setup();

router.get("/foo", (request, response) => {
  response.statusCode = 200;

  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({
    ok: true,
    params: request.params,
    searchParams: request.searchParams
  }));
});

// If your middlewares are async and want to do something after the response them,
// you must await the next, otherwise just call next.
app.use((request, response, next) => {
  console.log("before");
  next();
  console.log("after");
});
app.use(router.middleware());
app.use((request, response) => {
  response.statusCode = 404;

  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({ message: "Not found" }));
})

const server = createServer(app.handle());

server.listen(4321);

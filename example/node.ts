// @ts-nocheck

import { createServer } from "node:http";
import { App, NodeRuntime, Router } from "../src/mod.js";

// Optionally pass the correct js runtime.
const app = new App<NodeRuntime>();
// You can pass `find-my-way` options to the first argument of setup.
// You can also pass the app instance as the constructiorargument to use the same error handler registered
// on the app.
const router = await new Router<NodeRuntime>().setup();

// Catch all errors.
app.onError((error, request, response) => {
  response.statusCode = 500;

  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({ error }));
});

// If you passed the app as the argument on the router the app error handler
// will be used when composing route handler hich means, compose will not throw an error
// and instead call the app's error handler, which yelds performance benefits, by not throwing.
// just make sure that the error handler is registered before any route handler.
router.get("/foo", (request, response) => {
  response.statusCode = 200;

  response.setHeader("content-type", "application/json");
  response.end(JSON.stringify({
    ok: true,
    params: request.params,
    searchParams: request.searchParams
  }));
});

// If your middlewares are async and want to do something related with the response after them,
// you must await the next to have proper flow:
// async 1 await ->
//    async 2 await ->
//    async 2 <-
// async 1 <-
// if you try to mix sycn and async, middlewares there is a probability that throw flow
// will not be correct:
// 1 ->
//    async 2 await -> (await some io operation)
// 1 <-
//    async 2 <-
// TLDR: if you want to mess with the response, after calling next just use an async middleware and await next.
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
});

const server = createServer(app.handle());

server.listen(4321);

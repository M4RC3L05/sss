// @ts-nocheck

import { App, BunRuntime, Router } from "../src/mod.js";

// Optionally pass the correct js runtime.
const app = new App<BunRuntime>();
// You can pass `find-my-way` options to the first argument of setup.
// You can also pass the app instance as the constructiorargument to use the same error handler registered
// on the app.
const router = await new Router<BunRuntime>().setup();

// Catch all errors.
app.onError((error, request) => Response.json({ error }, { status: 500 }));

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
router.get("/foo", (request) =>
  Response.json({
    ok: true,
    params: request.params,
    searchParams: request.searchParams
  })
);

// If your middlewares are async and want to do something after the response them,
// you must await the next and return its value, in order to make the middleware stack
// return the promise down the stack;
// This way, you can have for instance a global middlewares wrapping all middlewares that
// awaits next and calculates the response time correctly, indepenently of how many async middlewares you have on the stack
// like it is done on koa, otherwise just call next.
app.use((request, next) => {
  console.log("before");
  const response = next();
  console.log("after");

  return response;
});
app.use(router.middleware());
app.use((request) => Response.json({ message: "Not found" }, { status: 404 }));

Bun.serve({ port: 4321, fetch: app.handle() });

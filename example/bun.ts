// @ts-nocheck

import { App, BunRuntime, Router } from "../src/mod.js";

// Optionally pass the correct js runtime.
const app = new App<BunRuntime>();
// You can pass `find-my-way` options to the first argument of setup.
const router = await new Router<BunRuntime>().setup();

router.get("/foo", (request) =>
  Response.json({
    ok: true,
    params: request.params,
    searchParams: request.searchParams
  })
);

// If your middlewares are async and want to do something after the response them,
// you must await the next, otherwise just call next.
app.use((request, next) => {
  console.log("before");
  const response = next();
  console.log("after");

  return response;
});
app.use(router.middleware());
app.use((request) => Response.json({ message: "Not found" }, { status: 404 }));

Bun.serve({ port: 4321, fetch: app.handle() })

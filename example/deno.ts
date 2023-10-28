// @ts-nocheck

import { App, DenoRuntime, Router } from "../src/mod.js";

// Optionally pass the correct js runtime.
const app = new App<DenoRuntime>();
// You can pass `find-my-way` options to the first argument of setup.
const router = await new Router<DenoRuntime>().setup();

router.get("/foo", (request) =>
  Response.json({
    ok: true,
    params: request.params,
    searchParams: request.searchParams
  })
);

// Catch all errors.
app.onError((error, request) => Response.json({ error }, { status: 500 }));

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

Deno.serve({ port: 4321 }, app.handle());

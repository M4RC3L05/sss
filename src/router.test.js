import { describe, it, mock } from "node:test";
import * as assert from "node:assert/strict";
import Router from "./router.js";

describe("Router", () => {
  for (const method of [
    "get",
    "head",
    "post",
    "put",
    "delete",
    "connect",
    "options",
    "trace",
    "patch",
  ]) {
    describe(`${method}()`, () => {
      it("should register a composed handler", async () => {
        const router = await new Router().setup();
        const stack = [];
        const f1 = mock.fn((_, __, n) => {
          stack.push("f1-in");
          const result = n();
          stack.push("f1-out");

          return result;
        });
        const f2 = mock.fn((_, __, n) => {
          stack.push("f2-in");
          const result = n();
          stack.push("f2-out");

          return result;
        });
        const f3 = mock.fn((_, __, n) => {
          stack.push("f3-in");
          const result = n();
          stack.push("f3-out");

          return result;
        });

        router[method]("/foo", f1, f2, f3);

        router.middleware()({ method: method.toUpperCase(), url: "/foo" });

        assert.equal(f1.mock.callCount(), 1);
        assert.equal(f2.mock.callCount(), 1);
        assert.equal(f3.mock.callCount(), 1);
        assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
      });

      it("should register a composed async handler", async () => {
        const router = await new Router().setup();
        const stack = [];
        const f1 = mock.fn(async (_, __, n) => {
          stack.push("f1-in");
          const result = await n();
          stack.push("f1-out");

          return result;
        });
        const f2 = mock.fn(async (_, __, n) => {
          stack.push("f2-in");
          const result = await n();
          stack.push("f2-out");

          return result;
        });
        const f3 = mock.fn(async (_, __, n) => {
          stack.push("f3-in");
          const result = await n();
          stack.push("f3-out");

          return result;
        });

        router[method]("/foo", f1, f2, f3);

        await router.middleware()({ method: method.toUpperCase(), url: "/foo" });

        assert.equal(f1.mock.callCount(), 1);
        assert.equal(f2.mock.callCount(), 1);
        assert.equal(f3.mock.callCount(), 1);
        assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
      });

      it("should return whatever the functions return", async () => {
        const router = await new Router().setup();
        const f1 = mock.fn((_, __, n) => n());
        const f2 = mock.fn((_, __, n) => n());
        const f3 = mock.fn((_, __, ___) => {
          return 2;
        });

        router[method]("/foo", f1, f2, f3);

        const result = router.middleware()({ method: method.toUpperCase(), url: "/foo" });

        assert.equal(result, 2);
        assert.equal(f1.mock.callCount(), 1);
        assert.equal(f2.mock.callCount(), 1);
        assert.equal(f3.mock.callCount(), 1);
      });

      it("should pass error hander if error handler provided", async () => {
        const error = new Error("foo");
        const errorHandler = mock.fn(() => "fiz");
        const router = await new Router({ errorHandler }).setup();
        const f1 = mock.fn((_, __, n) => n());
        const f2 = mock.fn((_, __, n) => n(error));
        const f3 = mock.fn((_, __, ___) => {
          return 2;
        });

        router[method]("/foo", f1, f2, f3);

        const result = router.middleware()({ method: method.toUpperCase(), url: "/foo" });

        assert.equal(result, "fiz");
        assert.equal(f1.mock.callCount(), 1);
        assert.equal(f2.mock.callCount(), 1);
        assert.equal(f3.mock.callCount(), 0);
        assert.equal(errorHandler.mock.callCount(), 1);
        assert.equal(errorHandler.mock.calls[0].arguments.length, 1);
        assert.equal(errorHandler.mock.calls[0].arguments[0], error);
      });
    });
  }

  describe("middleware()", () => {
    it("should call next if not match was found", async () => {
      const router = await new Router().setup();
      const next = mock.fn();
      const handler = mock.fn();

      router.get("/foo", handler);

      router.middleware()({}, {}, next);

      assert.equal(next.mock.callCount(), 1);
      assert.equal(handler.mock.callCount(), 0);
    });

    it("should call the matching handler", async () => {
      const router = await new Router().setup();
      const next = mock.fn();
      const handler = mock.fn((_, __, n) => n());

      router.get("/foo", handler);

      router.middleware()({ method: "GET", url: "/foo" }, {}, next);

      assert.equal(handler.mock.callCount(), 1);
      assert.deepEqual(handler.mock.calls[0].arguments[0], {
        method: "GET",
        url: "/foo",
        params: {},
        searchParams: {},
      });
      assert.deepEqual(handler.mock.calls[0].arguments[1], {});
      assert.equal(next.mock.callCount(), 1);
    });

    it("should call the matching web handler (deno/bun)", async () => {
      const router = await new Router().setup();
      const next = mock.fn();
      const handler = mock.fn((_, n) => n());

      router.get("/foo", handler);

      router.middleware()({ method: "GET", url: "/foo" }, next);

      assert.equal(handler.mock.callCount(), 1);
      assert.deepEqual(handler.mock.calls[0].arguments[0], {
        method: "GET",
        url: "/foo",
        params: {},
        searchParams: {},
      });
      assert.equal(next.mock.callCount(), 1);
    });
  });
});

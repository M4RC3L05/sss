import { describe, it, mock } from "node:test";
import * as assert from "node:assert/strict";
import App from "./app.js";

describe("App", () => {
  describe("handle", () => {
    it("should register a composed handler", async () => {
      const app = new App();
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

      app.use(f1, f2, f3);

      await app.handle()(1, 2);

      assert.equal(f1.mock.callCount(), 1);
      assert.equal(f2.mock.callCount(), 1);
      assert.equal(f3.mock.callCount(), 1);
      assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
    });

    it("should register a composed async handler", async () => {
      const app = new App();
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

      app.use(f1, f2, f3);

      await app.handle()(1, 2);

      assert.equal(f1.mock.callCount(), 1);
      assert.equal(f2.mock.callCount(), 1);
      assert.equal(f3.mock.callCount(), 1);
      assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
    });

    it("should catch all errors on sync middlewares", (_, done) => {
      const app = new App();
      app.use(
        (_, __, n) => n(),
        () => {
          throw new Error("foo");
        },
      );

      app.onError((error) => {
        assert.equal(error.message, "foo");
        done();
      });

      app.handle()();
    });

    it("should catch all errors on async middlewares", (_, done) => {
      const app = new App();

      app.use(
        async (_, __, n) => n(),
        async () => {
          throw new Error("foo");
        },
      );

      app.onError((error) => {
        assert.equal(error.message, "foo");
        done();
      });

      app.handle()();
    });

    it("should handle bun env", () => {
      globalThis.Bun = {};

      const app = new App();

      assert.equal(app.handle().length, 1);

      delete globalThis.Bun;
    });

    it("should handle deno env", () => {
      globalThis.Deno = {};

      const app = new App();

      assert.equal(app.handle().length, 1);

      delete globalThis.Deno;
    });

    it("should handle/fllback to node env", () => {
      const app = new App();

      assert.equal(app.handle().length, 2);
    });
  });
});

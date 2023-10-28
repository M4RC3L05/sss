import { describe, it, mock } from "node:test";
import * as assert from "node:assert/strict";
import composeMiddleware from "./compose-middleware.js";

describe("composeMiddleware()", () => {
  it("should work without any functions provided", () => {
    assert.equal(composeMiddleware()(), undefined);
  });

  it("should handle node style http handler", (_, done) => {
    const fn = mock.fn((request, response, next) => {
      assert.equal(request, "request");
      assert.equal(response, "response");
      assert.equal(typeof next, "function");

      done();
    });

    composeMiddleware(undefined, fn)("request", "response");
  });

  it("should handle web style http handler (deno/node)", (_, done) => {
    const fn = mock.fn((request, next) => {
      assert.equal(request, "request");
      assert.equal(typeof next, "function");

      done();
    });

    composeMiddleware(undefined, fn)("request");
  });

  it("should compose each function", () => {
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

    const result = composeMiddleware(undefined, f1, f2, f3)();

    assert.equal(result, undefined);
    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 1);
    assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
  });

  it("should compose each async function", async () => {
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

    const result = composeMiddleware(undefined, f1, f2, f3)();

    assert.equal(result instanceof Promise, true);

    await result;

    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 1);
    assert.deepEqual(stack, ["f1-in", "f2-in", "f3-in", "f3-out", "f2-out", "f1-out"]);
  });

  it("should return whatever the functions return", () => {
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, n) => n());
    const f3 = mock.fn((_, __, ___) => {
      return 2;
    });

    const result = composeMiddleware(undefined, f1, f2, f3)();

    assert.equal(result, 2);
    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 1);
  });

  it("should not move to the next function if it does not call the next argument", () => {
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, ___) => 1);
    const f3 = mock.fn((_, __, n) => n());

    const result = composeMiddleware(undefined, f1, f2, f3)();

    assert.equal(result, 1);
    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 0);
  });

  it("should call next if no more functions to compose", () => {
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, n) => n());
    const f3 = mock.fn((_, __, n) => n());
    const n = mock.fn();

    composeMiddleware(undefined, f1, f2, f3)(1, 2, n);

    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 1);
    assert.equal(n.mock.callCount(), 1);
  });

  it("should call next if no more functions to compose on web style (deno/bun)", () => {
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, n) => n());
    const f3 = mock.fn((_, __, n) => n());
    const n = mock.fn();

    composeMiddleware(undefined, f1, f2, f3)(1, n);

    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 1);
    assert.equal(n.mock.callCount(), 1);
  });

  it("should throw if next called with error and no error handler registered", () => {
    const error = new Error("foo");
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, n) => n(error));
    const f3 = mock.fn((_, __, n) => n());
    const n = mock.fn();

    try {
      composeMiddleware(undefined, f1, f2, f3)(1, n);

      assert.fail();
    } catch (error_) {
      assert.deepEqual(error_, error);
      assert.equal(f1.mock.callCount(), 1);
      assert.equal(f2.mock.callCount(), 1);
      assert.equal(f3.mock.callCount(), 0);
      assert.equal(n.mock.callCount(), 0);
    }
  });

  it("should call error handler if next called with error", () => {
    const error = new Error("foo");
    const f1 = mock.fn((_, __, n) => n());
    const f2 = mock.fn((_, __, n) => n(error));
    const f3 = mock.fn((_, __, n) => n());
    const f4 = mock.fn(() => "fiz");
    const n = mock.fn();

    const response = composeMiddleware(f4, f1, f2, f3)(1, n);

    assert.equal(response, "fiz");
    assert.equal(f1.mock.callCount(), 1);
    assert.equal(f2.mock.callCount(), 1);
    assert.equal(f3.mock.callCount(), 0);
    assert.equal(n.mock.callCount(), 0);
    assert.equal(f4.mock.callCount(), 1);
    assert.deepEqual(f4.mock.calls[0].arguments.length, 3);
    assert.deepEqual(f4.mock.calls[0].arguments[0], error);
    assert.deepEqual(f4.mock.calls[0].arguments[1], 1);
    assert.deepEqual(f4.mock.calls[0].arguments[2], n);
  });
});

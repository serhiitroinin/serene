import { describe, expect, it } from "vitest";
import { VERSION } from "./index";

describe("VERSION", () => {
  it("is a stable string", () => {
    expect(VERSION).toBe("0.0.0");
  });
});

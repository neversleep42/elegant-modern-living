import { describe, it, expect } from "vitest";
import { extractVariables, fillTemplate } from "./store";

describe("templates", () => {
  it("extracts unique variables", () => {
    expect(extractVariables("{{a}} and {{ b }} and {{a}}")).toEqual(["a", "b"]);
  });
  it("replaces filled variables and keeps empty ones", () => {
    expect(fillTemplate("Hi {{name}} from {{city}}", { name: "Ana", city: "" })).toBe("Hi Ana from {{city}}");
  });
});

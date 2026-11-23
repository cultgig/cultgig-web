import { describe, expect, it } from "vitest";
import { matchPath, safeNextPath } from "./router";

describe("router helpers", () => {
  it("matches params and rejects mismatches", () => {
    expect(matchPath("/messages/:id", "/messages/abc")).toEqual({ id: "abc" });
    expect(matchPath("/messages/:id", "/messages/abc/")).toEqual({ id: "abc" });
    expect(matchPath("/messages/:id", "/messages")).toBeNull();
    expect(matchPath("/a/:b", "/a/%E0%A4")).toBeNull();
  });
  it("blocks open redirects in ?next=", () => {
    expect(safeNextPath("/client/dashboard", "/")).toBe("/client/dashboard");
    expect(safeNextPath("https://evil.example", "/")).toBe("/");
    expect(safeNextPath("//evil.example", "/")).toBe("/");
    expect(safeNextPath("/\\evil.example", "/")).toBe("/");
    expect(safeNextPath(null, "/x")).toBe("/x");
  });
});

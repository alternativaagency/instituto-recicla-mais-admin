import { describe, expect, it } from "vitest";
import { isPlaceholderEnvironment, validatePublicEnv } from "./env";

const valid = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};

describe("public environment", () => {
  it("accepts a valid Supabase URL and publishable key", () => {
    expect(validatePublicEnv(valid)).toEqual(valid);
  });

  it("rejects missing values", () => {
    expect(() => validatePublicEnv({})).toThrow();
  });

  it("rejects malformed URLs", () => {
    expect(() => validatePublicEnv({ ...valid, NEXT_PUBLIC_SUPABASE_URL: "invalid" })).toThrow();
  });

  it("recognizes the documented build placeholder", () => {
    expect(isPlaceholderEnvironment({
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_placeholder",
    })).toBe(true);
  });
});

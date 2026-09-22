import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  signInWithOtp: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { signInWithOtp: mocks.signInWithOtp },
  })),
}));

import { requestOtp } from "./actions";

describe("requestOtp", () => {
  beforeEach(() => {
    mocks.signInWithOtp.mockReset();
    mocks.signInWithOtp.mockResolvedValue({ error: null });
  });

  it("never creates an Auth user from an OTP request", async () => {
    const result = await requestOtp(" Authorized@Example.com ");

    expect(result.ok).toBe(true);
    expect(mocks.signInWithOtp).toHaveBeenCalledWith({
      email: "authorized@example.com",
      options: { shouldCreateUser: false },
    });
  });

  it("rejects malformed email without calling Supabase", async () => {
    const result = await requestOtp("not-an-email");

    expect(result.ok).toBe(false);
    expect(mocks.signInWithOtp).not.toHaveBeenCalled();
  });
});

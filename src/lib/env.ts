import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

export function validatePublicEnv(source: Record<string, string | undefined> = process.env): PublicEnv {
  return publicEnvSchema.parse({
    NEXT_PUBLIC_SUPABASE_URL: source.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: source.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function getPublicEnv(): PublicEnv {
  return validatePublicEnv();
}

export function isPlaceholderEnvironment(env = getPublicEnv()): boolean {
  return env.NEXT_PUBLIC_SUPABASE_URL.includes("example.supabase.co") ||
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.includes("placeholder");
}

import { NextResponse, type NextRequest } from "next/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const origin = url.origin;
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  const supabase = await createClient();

  let authError = null;

  if (code) {
    const result = await supabase.auth.exchangeCodeForSession(code);
    authError = result.error;
  } else if (tokenHash && type) {
    const result = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    authError = result.error;
  } else {
    return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`);
  }

  if (authError) {
    console.error("Auth confirmation failed:", authError);
    return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`);
  }

  const { data, error: claimError } = await supabase.rpc(
    "claim_authorized_user",
  );

  console.log("claim_authorized_user result:", {
    data,
    error: claimError,
  });

  if (!claimError && data) {
    return NextResponse.redirect(`${origin}/admin`);
  }

  await supabase.auth.signOut();

  return NextResponse.redirect(`${origin}/admin/login?error=unauthorized`);
}
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';
import { getAbsoluteOrigin } from '@/lib/proxy';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') ?? '/dashboard';
    const error_description = searchParams.get('error_description');

    const origin = getAbsoluteOrigin(request);

    if (error_description) {
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error_description)}`);
    }

    if (code) {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
      console.error("Code exchange error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err: any) {
    console.error("Callback route error:", err);
    return NextResponse.redirect(`${new URL(request.url).origin}/login?error=Internal server error`);
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/server';

export async function GET(request: Request) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 505 });
  }

  if (!user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  if (!user.email_confirmed_at) {
    return NextResponse.json({ message: 'Email address not verified' }, { status: 403 });
  }

  return NextResponse.json({ authUser: user }, { status: 200 });
}

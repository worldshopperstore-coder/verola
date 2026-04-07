import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/en/account";

  if (code) {
    const response = NextResponse.redirect(new URL(next, origin));

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Link auth user to customers table if not already linked
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const adminClient = (await import("@supabase/supabase-js")).createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Check if customer record exists with this email
        const { data: existing } = await adminClient
          .from("customers")
          .select("id, auth_user_id")
          .eq("email", user.email!)
          .single();

        if (existing && !existing.auth_user_id) {
          // Link existing customer to auth user
          await adminClient
            .from("customers")
            .update({ auth_user_id: user.id })
            .eq("id", existing.id);
        } else if (!existing) {
          // Create new customer from OAuth data
          const meta = user.user_metadata;
          await adminClient.from("customers").insert({
            email: user.email!,
            first_name: meta?.full_name?.split(" ")[0] ?? meta?.name ?? "",
            last_name: meta?.full_name?.split(" ").slice(1).join(" ") ?? "",
            phone: meta?.phone ?? "",
            auth_user_id: user.id,
          });
        }
      }

      return response;
    }
  }

  // Auth error — redirect to login
  return NextResponse.redirect(new URL("/en/account/login", origin));
}

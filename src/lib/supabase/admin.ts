import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Admin client — service role key ile RLS'i bypass eder
// Sadece server-side admin sayfalarında kullan
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

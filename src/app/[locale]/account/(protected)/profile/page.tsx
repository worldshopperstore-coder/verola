import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ProfileForm from "@/components/account/ProfileForm";

export default async function AccountProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: customer } = await admin
    .from("customers")
    .select("id, first_name, last_name, email, phone")
    .eq("auth_user_id", user!.id)
    .single();

  return (
    <ProfileForm
      locale={locale}
      customer={customer ?? { id: "", first_name: "", last_name: "", email: user!.email ?? "", phone: "" }}
    />
  );
}

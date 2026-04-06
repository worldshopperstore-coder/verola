import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AdminLoginForm />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F1F5F9", color: "#0F172A", colorScheme: "light" }}>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 ml-64 min-h-screen">
          <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { MobileNav } from "@/components/mobile-nav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="w-full">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}

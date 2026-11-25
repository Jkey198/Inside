import type { ReactNode } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { RequireProfile } from "@/components/RequireProfile";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <RequireProfile>
      <div className="flex min-h-screen flex-col md:flex-row">
        <AppSidebar />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">{children}</main>
      </div>
    </RequireProfile>
  );
}

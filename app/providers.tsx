"use client";

import { usePathname } from "next/navigation";
import SideBar from "./components/SideBar";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Exemple : Masquer la SideBar sur la page de connexion
  const showSideBar = pathname !== "/login";

  return (
      <div>
      <div className="flex min-h-screen bg-slate-900 text-slate-100">
        {showSideBar && <SideBar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
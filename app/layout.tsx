'use client';

import { usePathname } from "next/navigation";
import SideBar from "./components/SideBar";
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Vérifie si l'utilisateur est sur la page de connexion
  const isLoginPage = pathname === "/login";

  return (
    <html lang="fr">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex">
        
        {/* N'affiche la SideBar QUE si on n'est pas sur /login */}
        {!isLoginPage && <SideBar />}

        {/* Le contenu principal prend tout l'espace si pas de SideBar */}
        <main className={`flex-1 h-screen overflow-y-auto ${isLoginPage ? 'p-0' : 'p-8'}`}>
          {children}
        </main>

        <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
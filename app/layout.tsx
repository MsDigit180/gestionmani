import SideBar from "./components/SideBar"; // Ajustez le chemin selon votre projet
import "./globals.css";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-900 text-slate-100 min-h-screen flex">
        
        {/* 1. La Sidebar fixe à gauche */}
        <SideBar />

        {/* 2. Le contenu principal à droite */}
        <main className="flex-1 h-screen overflow-y-auto p-8">
          {children}
        </main>
      <Toaster position="top-right" richColors theme="dark" />
      </body>
    </html>
  );
}
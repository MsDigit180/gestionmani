
import { Providers } from "./providers";
import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import SyncManager from '@/app/components/SyncManager';

export const metadata: Metadata = {
  title: "Gestion App",
  description: "Système de gestion hors-ligne",
  manifest: "/manifest.json", // ◄-- Lien direct vers le fichier statique  
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <header className="p-4 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-lg font-bold text-white">Gestion Scolaire</h1>
          <SyncManager />
        </header>
      <Providers >{children}</Providers>
    </html>
  );
}
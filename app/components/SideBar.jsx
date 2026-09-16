'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Home, 
  LayoutDashboard, 
  LogOut, 
  ListChecks, 
  HandCoins, 
  UserPlus, 
  Users,
  Printer 
} from 'lucide-react';

export default function SideBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Déconnexion réussie');
        router.replace('/login');
        router.refresh();
      } else {
        toast.error('Erreur lors de la déconnexion');
      }
    } catch (error) {
      toast.error('Erreur réseau lors de la déconnexion');
    }
  };

  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-800 border-r border-slate-700 px-4 pt-3 pb-6 flex flex-col justify-between">
      
      {/* Haut de la SideBar */}
      <div className="flex flex-col gap-6">
        <div className="text-xl font-bold text-blue-500 px-2">
          MENU
        </div>

        <nav className="flex flex-col gap-1 text-slate-300 font-medium">
          {/* Accueil */}
          <Link 
            href="/" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 text-slate-400" />
            <span>Accueil</span>
          </Link>

          {/* Tableau de bord */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            <span>Tableau de bord</span>
          </Link>

          {/* Historique Paiements */}
          <Link 
            href="/paiement/historique" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ListChecks className="w-5 h-5 text-slate-400" />
            <span>Historique Paiements</span>
          </Link>

          {/* Enregistrer un paiement */}
          <Link 
            href="/paiement" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <HandCoins className="w-5 h-5 text-slate-400" />
            <span>Enregistrer un paiement</span>
          </Link>

          {/* Liste Elèves */}
          <Link 
            href="/eleve/liste" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
            <span>Liste Élèves</span>
          </Link>
           <Link href="/eleve/imprimer" className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-blue-400 font-semibold">
            <Printer className="w-5 h-5 text-blue-400" />
            <span>Impression & Listes</span>
          </Link>
          {/* Inscription */}
          <Link 
            href="/eleve/ajouter" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <UserPlus className="w-5 h-5 text-slate-400" />
            <span>Inscription</span>
          </Link>

          {/* Gérer les Utilisateurs */}
          <Link 
            href="/users" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Users className="w-5 h-5 text-slate-400" />
            <span>Gérer les Utilisateurs</span>
          </Link>
        </nav>
      </div>

      {/* Bas de la SideBar - Déconnexion */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 p-2.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors cursor-pointer w-full text-left font-medium"
      >
        <LogOut className="w-5 h-5" />
        <span>Déconnexion</span>
      </button>
    </aside>
  );
}
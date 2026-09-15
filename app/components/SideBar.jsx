
import Link from 'next/link';
// 1. Importer les icônes souhaitées
import { Home, LayoutDashboard, Settings, LogOut,ListChecks,HandCoins,UserPlus,Users } from 'lucide-react';

export default function SideBar() {
  return (
    <aside className="w-64 h-screen sticky top-0 bg-slate-800 border-r border-slate-700 px-4 pt-3 pb-6 flex flex-col justify-between">
      
      {/* Haut de la SideBar */}
      <div className="flex flex-col gap-6">
        <div className="text-xl font-bold text-blue-500 px-2">
          MENU
        </div>

        <nav className="flex flex-col gap-1 text-slate-300 font-medium">
          {/* Lien Accueil */}
          <Link 
            href="/" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span>Accueil</span>
          </Link>

          {/* Lien Tableau de bord */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span>Tableau de bord</span>
          </Link>

          <Link 
            href="/paiement/historique" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ListChecks className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span>Historique Paiements</span>
          </Link>

          <Link 
            href="/paiement" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <HandCoins className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span>Enregistrer un payement </span>
          </Link>

          <Link 
            href="/eleve/liste" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <ListChecks className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <Users size={20} />
            <span>Liste Eleve</span>
          </Link>

          <Link 
            href="/eleve/ajouter " 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span >Inscription</span>
          </Link>

          {/* Lien Paramètres */}
          <Link 
            href="/settings" 
            className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5 text-slate-400 group-hover:text-white" />
            <span>Paramètres</span>
          </Link>
        </nav>
      </div>

      {/* Bas de la SideBar */}
      <button className="flex items-center gap-3 p-2.5 rounded-lg text-slate-400 hover:bg-slate-700 hover:text-red-400 transition-colors cursor-pointer w-full text-left">
        <LogOut className="w-5 h-5" />
        <span>Déconnexion</span>
      </button>

    </aside>
  );
}
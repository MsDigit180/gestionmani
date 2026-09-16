import React from "react";
import FormulaireLogin from "./FormulaireLogin";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* En-tête / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600/10 border border-blue-500/20 rounded-xl text-blue-400 mb-2">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Espace Administration</h1>
          <p className="text-xs text-slate-400">
            Connectez-vous pour accéder à la gestion du centre scolaire.
          </p>
        </div>

        {/* Carte du Formulaire */}
        <div className="bg-slate-800 border border-slate-700/80 p-6 sm:p-8 rounded-2xl shadow-xl">
          <FormulaireLogin />
        </div>

        {/* Pied de page */}
        <p className="text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Centre d'Encadrement. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
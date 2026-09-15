"use client";

import { useState } from "react";

export type PaiementComplet = {
  id: string;
  montant: number;
  mois: string;
  annee: number;
  date_paiement: Date;
  statut: string;
  mode_paiement: string | null;
  eleve: {
    nom_prenom: string;
    niveau: string;
  };
};

export default function TablePaiements({ paiements }: { paiements: PaiementComplet[] }) {
  const [filtre, setFiltre] = useState("");

  // Filtrage par nom d'élève ou par mois
  const paiementsFiltres = paiements.filter((p) =>
    p.eleve.nom_prenom.toLowerCase().includes(filtre.toLowerCase()) ||
    p.mois.toLowerCase().includes(filtre.toLowerCase())
  );

  // Calcul du total global encaissé
  const totalEncaisse = paiementsFiltres.reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="space-y-4">
      {/* Barre d'outils : Recherche & Total */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <input
          type="text"
          placeholder="Rechercher par élève ou mois..."
          value={filtre}
          onChange={(e) => setFiltre(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm"
        />

        <div className="bg-blue-950/60 border border-blue-800/50 px-4 py-2 rounded-lg text-right w-full sm:w-auto">
          <span className="text-xs font-medium text-blue-300 block">Total Encaissé</span>
          <span className="text-xl font-extrabold text-blue-400">
            {totalEncaisse.toLocaleString()} FCFA
          </span>
        </div>
      </div>

      {/* Tableau DataTable */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase border-b border-slate-700">
            <tr>
              <th className="px-6 py-3">Élève</th>
              <th className="px-6 py-3">Niveau</th>
              <th className="px-6 py-3">Mois / Année</th>
              <th className="px-6 py-3">Date de paiement</th>
              <th className="px-6 py-3">Mode</th>
              <th className="px-6 py-3 text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {paiementsFiltres.length > 0 ? (
              paiementsFiltres.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 font-medium text-slate-100">
                    {p.eleve.nom_prenom}
                  </td>
                  <td className="px-6 py-4">{p.eleve.niveau}</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md font-medium">
                      {p.mois} {p.annee}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    {p.mode_paiement || "CASH"}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-emerald-400">
                    {p.montant.toLocaleString()} FCFA
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Aucun paiement trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
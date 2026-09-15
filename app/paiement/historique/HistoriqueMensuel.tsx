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
    id: string;
    nom_prenom: string;
    niveau: string;
    phone: string;
    quartier: string;
  };
};

const MOIS_LISTE = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function HistoriqueMensuel({ paiements }: { paiements: PaiementComplet[] }) {
  const [moisFiltre, setMoisFiltre] = useState(MOIS_LISTE[new Date().getMonth()]);
  const [anneeFiltre, setAnneeFiltre] = useState(new Date().getFullYear());
  const [rechercheEleve, setRechercheEleve] = useState("");

  const paiementsDuMois = paiements.filter((p) => {
    const correspondMoisAnnee = p.mois === moisFiltre && p.annee === Number(anneeFiltre);
    const correspondRecherche = p.eleve.nom_prenom.toLowerCase().includes(rechercheEleve.toLowerCase());
    return correspondMoisAnnee && correspondRecherche;
  });

  const totalMois = paiementsDuMois.reduce((sum, p) => sum + p.montant, 0);

  return (
    <div className="space-y-6">
      {/* Filtres & Statistiques du mois */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Mois
            </label>
            <select
              value={moisFiltre}
              onChange={(e) => setMoisFiltre(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {MOIS_LISTE.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Année
            </label>
            <input
              type="number"
              value={anneeFiltre}
              onChange={(e) => setAnneeFiltre(Number(e.target.value))}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Rechercher un élève
            </label>
            <input
              type="text"
              placeholder="Nom ou prénom..."
              value={rechercheEleve}
              onChange={(e) => setRechercheEleve(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-700/60">
          <div className="bg-slate-900/60 border border-slate-700 p-4 rounded-lg">
            <span className="text-xs text-slate-400 block font-medium">Nombre de règlements</span>
            <span className="text-2xl font-bold text-slate-100">
              {paiementsDuMois.length} élève(s)
            </span>
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/40 p-4 rounded-lg">
            <span className="text-xs text-emerald-400 block font-medium">
              Total Encaissé en {moisFiltre} {anneeFiltre}
            </span>
            <span className="text-2xl font-extrabold text-emerald-400">
              {totalMois.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      </div>

      {/* Tableau des paiements */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-xs text-slate-400 uppercase border-b border-slate-700">
            <tr>
              <th className="px-6 py-3">Élève</th>
              <th className="px-6 py-3">Niveau</th>
              <th className="px-6 py-3">Téléphone</th>
              <th className="px-6 py-3">Date de paiement</th>
              <th className="px-6 py-3">Mode</th>
              <th className="px-6 py-3 text-right">Montant</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {paiementsDuMois.length > 0 ? (
              paiementsDuMois.map((p) => (
                <tr key={p.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 font-semibold text-slate-100">
                    {p.eleve.nom_prenom}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-md font-medium">
                      {p.eleve.niveau}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {p.eleve.phone}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    {new Date(p.date_paiement).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="bg-blue-950 text-blue-300 border border-blue-800/50 px-2 py-0.5 rounded text-[11px]">
                      {p.mode_paiement || "CASH"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-400">
                    {p.montant.toLocaleString()} FCFA
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                  Aucun paiement trouvé pour <strong className="text-slate-200">{moisFiltre} {anneeFiltre}</strong>.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
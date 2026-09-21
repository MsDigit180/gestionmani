'use client';

import React, { useState } from 'react';
import { Printer, FileText } from 'lucide-react';
import { useQuery } from '@powersync/react';

type Paiement = {
  id: string;
  montant: number;
  mois: string;
  annee: number;
  statut: string;
  date_paiement: string;
  eleve_id: string;
};

type Eleve = {
  id: string;
  nom_prenom: string;
  niveau: string;
  matiere?: string;
  phone: string;
  quartier: string;
  ecole_frequenter: string;
  frais_encadrement: number;
  date_inscription?: string;
};

const MOIS_LISTE = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function PrintStudentsPage() {
  // 1. Récupération réactive et hors-ligne via PowerSync
  const { data: rawEleves = [], isLoading: loadingEleves } = useQuery<Eleve>(
    `SELECT * FROM eleves ORDER BY nom_prenom ASC`
  );

  const { data: rawPaiements = [], isLoading: loadingPaiements } = useQuery<Paiement>(
    `SELECT * FROM paiements`
  );

  const loading = loadingEleves || loadingPaiements;

  // Filtres
  const [selectedMois, setSelectedMois] = useState<string>('Septembre');
  const [selectedAnnee, setSelectedAnnee] = useState<number>(new Date().getFullYear());
  const [filterNiveau, setFilterNiveau] = useState<string>('');
  const [filterEcole, setFilterEcole] = useState<string>('');
  const [filterQuartier, setFilterQuartier] = useState<string>('');

  // 2. Association des paiements aux élèves correspondants
  const eleves: (Eleve & { paiements: Paiement[] })[] = rawEleves.map((eleve) => ({
    ...eleve,
    paiements: rawPaiements.filter((p) => p.eleve_id === eleve.id)
  }));

  // 3. Filtrage des élèves ayant réglé l'encadrement pour le mois et l'année sélectionnés
  const filteredEleves = eleves.filter((eleve) => {
    const aPayeCeMois = eleve.paiements?.some((p) => {
      const matchMois = p.mois?.toLowerCase().trim() === selectedMois.toLowerCase().trim();
      const matchAnnee = Number(p.annee) === Number(selectedAnnee);
      const matchStatut = p.statut === 'PAYE';
      return matchMois && matchAnnee && matchStatut;
    });

    const matchNiveau =
      filterNiveau === '' || eleve.niveau?.toLowerCase().includes(filterNiveau.toLowerCase());
    const matchEcole =
      filterEcole === '' || eleve.ecole_frequenter?.toLowerCase().includes(filterEcole.toLowerCase());
    const matchQuartier =
      filterQuartier === '' || eleve.quartier?.toLowerCase().includes(filterQuartier.toLowerCase());

    return aPayeCeMois && matchNiveau && matchEcole && matchQuartier;
  });

  // 4. Calcul du montant total perçu pour la sélection
  const totalEncaisse = filteredEleves.reduce((acc, eleve) => {
    const p = eleve.paiements.find(
      (pay) => pay.mois?.toLowerCase().trim() === selectedMois.toLowerCase().trim() && Number(pay.annee) === Number(selectedAnnee)
    );
    return acc + (p?.montant || eleve.frais_encadrement || 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* CSS pour isoler le tableau à l'impression */}
      <style jsx global>{`
        @media print {
          aside, header, nav, .print\\:hidden {
            display: none !important;
          }
          body, main {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
          .printable-content {
            width: 100% !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
          }
        }
      `}</style>

      {/* Barre d'actions (Masquée à l'impression) */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Impression des Élèves à Jour
            </h1>
            <p className="text-sm text-slate-400">
              Visualisez et imprimez la liste des élèves ayant réglé leur encadrement par mois (Mode hors-ligne)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              disabled={loading || filteredEleves.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <Printer className="w-4 h-4" />
              Imprimer le tableau
            </button>
          </div>
        </div>

        {/* Barre de filtres */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Mois
            </label>
            <select
              value={selectedMois}
              onChange={(e) => setSelectedMois(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-blue-400 font-bold focus:outline-none focus:border-blue-500"
            >
              {MOIS_LISTE.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Année
            </label>
            <input
              type="number"
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Niveau d'étude
            </label>
            <input
              type="text"
              placeholder="Ex: Terminale, 3ème..."
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              École fréquentée
            </label>
            <input
              type="text"
              placeholder="Ex: CEG 1..."
              value={filterEcole}
              onChange={(e) => setFilterEcole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Quartier
            </label>
            <input
              type="text"
              placeholder="Ex: Niamey 2000..."
              value={filterQuartier}
              onChange={(e) => setFilterQuartier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* ZONE D'IMPRESSION DU TABLEAU */}
      <div className="printable-content bg-slate-800 border border-slate-700 rounded-xl overflow-hidden print:bg-white print:text-black print:border-none p-0 print:p-2">
        
        {/* En-tête visible uniquement sur l'impression */}
        <div className="hidden print:block mb-6 border-b-2 border-black pb-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-xl font-bold uppercase tracking-wider">CABINET D'APPUI SCOLAIRE</h1>
              <p className="text-xs text-gray-700">Liste Officielle des Élèves à Jour de Paiement</p>
            </div>
            <div className="text-right text-xs text-gray-700">
              <p><strong>Période :</strong> {selectedMois} {selectedAnnee}</p>
              <p><strong>Date d'impression :</strong> {new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 print:text-black font-medium">
            Chargement de la liste hors-ligne depuis SQLite...
          </div>
        ) : filteredEleves.length === 0 ? (
          <div className="p-8 text-center text-slate-400 print:text-black font-medium">
            Aucun élève n'a réglé son encadrement pour le mois de <strong className="text-blue-400 print:text-black">{selectedMois} {selectedAnnee}</strong> avec les filtres actuels.
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700 print:bg-gray-200 print:text-black print:border-black">
              <tr>
                <th className="px-4 py-3 print:py-1.5 print:px-2 print:border print:border-black font-bold">N°</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold">Nom & Prénom</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold">Niveau</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold">Téléphone</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold">École</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold">Quartier</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold text-right">Frais</th>
                <th className="px-6 py-3.5 print:py-1.5 print:px-2 print:border print:border-black font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 print:divide-black">
              {filteredEleves.map((eleve, index) => (
                <tr key={eleve.id} className="hover:bg-slate-700/30 print:hover:bg-transparent">
                  <td className="px-4 py-3 print:py-1.5 print:px-2 text-slate-400 print:text-black print:border print:border-black text-xs font-mono">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 font-semibold text-slate-100 print:text-black print:border print:border-black">
                    {eleve.nom_prenom}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 text-slate-300 print:text-black print:border print:border-black">
                    {eleve.niveau}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 text-slate-300 print:text-black print:border print:border-black">
                    {eleve.phone}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 text-slate-300 print:text-black print:border print:border-black">
                    {eleve.ecole_frequenter}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 text-slate-300 print:text-black print:border print:border-black">
                    {eleve.quartier}
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 text-slate-100 print:text-black print:border print:border-black font-mono text-right">
                    {(eleve.frais_encadrement || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 print:py-1.5 print:px-2 print:border print:border-black text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 print:text-black print:p-0">
                      PAYÉ
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Bilan et Signature imprimés */}
        <div className="hidden print:flex justify-between items-end mt-8 pt-4 border-t-2 border-black text-xs">
          <div>
            <p><strong>Total élèves à jour :</strong> {filteredEleves.length}</p>
            <p><strong>Montant total perçu :</strong> {totalEncaisse.toLocaleString('fr-FR')} FCFA</p>
          </div>
          <div className="text-center w-56 border-t border-black pt-1">
            <p className="font-bold uppercase">Signature & Cachet</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// Fichier : src/app/dashboard/impression/page.tsx

'use client';

import React, { useState } from 'react';
import { Printer, FileText } from 'lucide-react';
import { useQuery } from '@powersync/react';

type Paiement = {
  id: string;
  montant: number;
  mois: string;
  annee: number;
  date_paiement: string;
  statut: string;
  mode_paiement?: string;
  eleveId: string;
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
  date_inscription: string;
};

const MOIS_LISTE = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function PrintStudentsPage() {
  // Requêtes SQL PowerSync avec guillemets pour respecter la casse des tables PostgreSQL/SQLite
  const { data: rawEleves = [], isLoading: loadingEleves } = useQuery<Eleve>(
    `SELECT * FROM "Eleve"`
  );

  const { data: rawPaiements = [], isLoading: loadingPaiements } = useQuery<Paiement>(
    `SELECT * FROM "Paiement"`
  );

  const loading = loadingEleves || loadingPaiements;

  const [selectedMois, setSelectedMois] = useState<string>('Septembre');
  const [selectedAnnee, setSelectedAnnee] = useState<number>(new Date().getFullYear());
  const [filterNiveau, setFilterNiveau] = useState<string>('');
  const [filterEcole, setFilterEcole] = useState<string>('');
  const [filterQuartier, setFilterQuartier] = useState<string>('');

  const normalize = (str: string | undefined | null) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();

  // Association des paiements aux élèves via eleveId
  const elevesWithPaiements = rawEleves.map((eleve) => {
    const paiementsEleve = rawPaiements.filter(
      (p) => String(p.eleveId).trim() === String(eleve.id).trim()
    );

    return {
      ...eleve,
      paiements: paiementsEleve,
    };
  });

  // Filtrage des élèves ayant réglé pour le mois et l'année choisis
  const filteredEleves = elevesWithPaiements.filter((eleve) => {
    const aPayeCeMois = eleve.paiements?.some((p) => {
      const matchMois = normalize(p.mois) === normalize(selectedMois);
      const matchAnnee = Number(p.annee) === Number(selectedAnnee);
      const pStatut = (p.statut || '').toUpperCase();
      const matchStatut = pStatut === 'PAYE' || pStatut === 'VALIDE';

      return matchMois && matchAnnee && matchStatut;
    });

    const matchNiveau =
      filterNiveau === '' || normalize(eleve.niveau).includes(normalize(filterNiveau));
    const matchEcole =
      filterEcole === '' || normalize(eleve.ecole_frequenter).includes(normalize(filterEcole));
    const matchQuartier =
      filterQuartier === '' || normalize(eleve.quartier).includes(normalize(filterQuartier));

    return aPayeCeMois && matchNiveau && matchEcole && matchQuartier;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
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

      {/* Interface de filtrage */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-500" />
              Impression des Élèves à Jour
            </h1>
          </div>
          <button
            onClick={handlePrint}
            disabled={loading || filteredEleves.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer la liste
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Mois</label>
            <select
              value={selectedMois}
              onChange={(e) => setSelectedMois(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-blue-400 font-bold"
            >
              {MOIS_LISTE.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Année</label>
            <input
              type="number"
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(parseInt(e.target.value) || new Date().getFullYear())}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Niveau</label>
            <input
              type="text"
              placeholder="Ex: Terminale..."
              value={filterNiveau}
              onChange={(e) => setFilterNiveau(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">École</label>
            <input
              type="text"
              placeholder="Ex: Lycée..."
              value={filterEcole}
              onChange={(e) => setFilterEcole(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Quartier</label>
            <input
              type="text"
              placeholder="Ex: Plateau..."
              value={filterQuartier}
              onChange={(e) => setFilterQuartier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
            />
          </div>
        </div>
      </div>

      {/* Tableau d'impression */}
      <div className="printable-content bg-slate-800 border border-slate-700 rounded-xl overflow-hidden print:bg-white print:text-black p-0 print:p-2">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Chargement des données...</div>
        ) : filteredEleves.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            Aucun élève à jour trouvé pour <strong className="text-blue-400">{selectedMois} {selectedAnnee}</strong>.
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700 print:bg-gray-200 print:text-black">
              <tr>
                <th className="px-4 py-3 print:border print:border-black font-bold">N°</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold">Nom & Prénom</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold">Niveau</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold">Téléphone</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold">École</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold">Quartier</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold text-right">Frais</th>
                <th className="px-6 py-3.5 print:border print:border-black font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 print:divide-black">
              {filteredEleves.map((eleve, index) => (
                <tr key={eleve.id}>
                  <td className="px-4 py-3 print:border print:border-black">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold print:border print:border-black">{eleve.nom_prenom}</td>
                  <td className="px-6 py-4 print:border print:border-black">{eleve.niveau}</td>
                  <td className="px-6 py-4 print:border print:border-black">{eleve.phone}</td>
                  <td className="px-6 py-4 print:border print:border-black">{eleve.ecole_frequenter}</td>
                  <td className="px-6 py-4 print:border print:border-black">{eleve.quartier}</td>
                  <td className="px-6 py-4 print:border print:border-black text-right font-mono">
                    {Number(eleve.frais_encadrement || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 print:border print:border-black text-center font-bold text-emerald-400 print:text-black">
                    PAYÉ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
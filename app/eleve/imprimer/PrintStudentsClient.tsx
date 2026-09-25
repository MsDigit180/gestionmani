'use client';

import React, { useState } from 'react';
import { Printer, FileText } from 'lucide-react';

type Paiement = {
  id: string;
  montant: number;
  mois: string;
  annee: number;
  date_paiement: Date;
  statut: string;
  mode_paiement?: string | null;
  eleveId?: string;
};

type EleveWithPaiements = {
  id: string;
  nom_prenom: string;
  niveau: string;
  phone: string;
  quartier: string;
  ecole_frequenter: string;
  frais_encadrement: number;
  paiements: Paiement[];
};

const MOIS_LISTE = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export default function PrintStudentsClient({
  initialEleves,
}: {
  initialEleves: EleveWithPaiements[];
}) {
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

  // Filtrage des élèves ayant réglé pour le mois et l'année sélectionnés
  const filteredEleves = initialEleves.filter((eleve) => {
    const aPayeCeMois = eleve.paiements?.some((p) => {
      const matchMois = normalize(p.mois) === normalize(selectedMois);
      const matchAnnee = Number(p.annee) === Number(selectedAnnee);
      
      const pStatut = normalize(p.statut);
      const matchStatut = !p.statut || pStatut.includes('paye') || pStatut.includes('valide');

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

  // Calcul du montant total des frais d'encadrement des élèves affichés
  const totalFrais = filteredEleves.reduce((sum, eleve) => {
    return sum + (Number(eleve.frais_encadrement) || 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          /* Masquer tout le reste du site et les éléments d'interface */
          body * {
            visibility: hidden !important;
          }

          /* Rendre uniquement la zone imprimable et ses enfants visibles */
          .printable-area,
          .printable-area * {
            visibility: visible !important;
          }

          /* Positionner la zone d'impression en haut de page */
          .printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }

          /* Masquer les filtres à l'impression */
          .print\\:hidden {
            display: none !important;
          }

          /* Afficher l'entête d'impression spécifique */
          .print-header {
            display: block !important;
          }

          /* Style des bordures de table pour l'impression papier */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #000 !important;
            padding: 8px !important;
            color: #000 !important;
          }
          tfoot td {
            border-top: 2px solid #000 !important;
            font-weight: bold !important;
          }
        }

        /* Masquer l'entête d'impression sur l'écran */
        .print-header {
          display: none;
        }
      `}</style>

      {/* Interface de filtrage (Écran uniquement) */}
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
            disabled={filteredEleves.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimer la liste ({filteredEleves.length})
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

      {/* ZONE IMPRIMABLE */}
      <div className="printable-area bg-slate-800 border border-slate-700 rounded-xl overflow-hidden print:bg-white print:text-black print:border-none p-0 print:p-0">
        
        {/* Entête d'impression */}
        <div className="print-header mb-6 text-center">
          <h1 className="text-xl font-bold uppercase tracking-wide text-black border-b-2 border-black pb-2 mb-1">
            Liste des élèves ayant réglé leur paiement pour le mois de {selectedMois} {selectedAnnee}
          </h1>
          <p className="text-xs text-gray-600 font-medium">
            Imprimé le {new Date().toLocaleDateString('fr-FR')} - Total : {filteredEleves.length} élève(s)
          </p>
        </div>

        {filteredEleves.length === 0 ? (
          <div className="p-8 text-center text-slate-400 print:text-black">
            Aucun élève à jour trouvé pour <strong className="text-blue-400 print:text-black">{selectedMois} {selectedAnnee}</strong>.
          </div>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700 print:bg-gray-200 print:text-black">
              <tr>
                <th className="px-4 py-3 font-bold">N°</th>
                <th className="px-6 py-3.5 font-bold">Nom & Prénom</th>
                <th className="px-6 py-3.5 font-bold">Niveau</th>
                <th className="px-6 py-3.5 font-bold">Téléphone</th>
                <th className="px-6 py-3.5 font-bold">École</th>
                <th className="px-6 py-3.5 font-bold">Quartier</th>
                <th className="px-6 py-3.5 font-bold text-right">Frais</th>
                <th className="px-6 py-3.5 font-bold text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50 print:divide-black">
              {filteredEleves.map((eleve, index) => (
                <tr key={eleve.id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-6 py-4 font-semibold">{eleve.nom_prenom}</td>
                  <td className="px-6 py-4">{eleve.niveau}</td>
                  <td className="px-6 py-4">{eleve.phone}</td>
                  <td className="px-6 py-4">{eleve.ecole_frequenter}</td>
                  <td className="px-6 py-4">{eleve.quartier}</td>
                  <td className="px-6 py-4 text-right font-mono">
                    {Number(eleve.frais_encadrement || 0).toLocaleString('fr-FR')} FCFA
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-400 print:text-black">
                    PAYÉ
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Ligne du Total en bas du tableau */}
            <tfoot className="bg-slate-900/80 border-t-2 border-slate-600 print:bg-gray-100 print:border-black font-bold">
              <tr>
                <td colSpan={6} className="px-6 py-3.5 text-right uppercase tracking-wider text-xs text-slate-300 print:text-black">
                  TOTAL GÉNÉRAL :
                </td>
                <td className="px-6 py-3.5 text-right font-mono text-emerald-400 print:text-black text-base">
                  {totalFrais.toLocaleString('fr-FR')} FCFA
                </td>
                <td className="px-6 py-3.5"></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
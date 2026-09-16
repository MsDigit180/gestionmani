"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Edit, Search, Printer } from "lucide-react";
import Link from "next/link";
import { deleteEleve } from "../actions";

export interface Eleve {
  id: string;
  nom_prenom: string;
  niveau: string;
  matiere: string;
  phone: string;
  quartier: string;
  ecole_frequenter: string;
  frais_encadrement: number;
  date_inscription?: Date | string;
}

export default function DataTableEleve({ initialEleves }: { initialEleves: Eleve[] }) {
  const [eleves, setEleves] = useState<Eleve[]>(initialEleves);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "paye" | "non_paye">("tous");

  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'élève ${nom} ?`)) {
      const res = await deleteEleve(id);
      if (res.success) {
        toast.success(res.message);
        setEleves(eleves.filter((e) => e.id !== id));
      } else {
        toast.error(res.message);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredEleves = eleves.filter((eleve) => {
    const matchesSearch =
      eleve.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eleve.quartier && eleve.quartier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesNiveau = selectedNiveau === "" || eleve.niveau === selectedNiveau;

    return matchesSearch && matchesNiveau;
  });

  const niveauxUniques = Array.from(new Set(eleves.map((e) => e.niveau))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* CSS d'impression pour masquer TOUT sauf le tableau */}
      <style jsx global>{`
        @media print {
          /* Masque tout le body */
          body * {
            visibility: hidden;
          }
          /* Affiche uniquement la zone d'impression du tableau */
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Barre de Recherche, Filtres et Bouton Imprimer (Masqués à l'impression) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un élève ou un quartier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>

        <select
          value={selectedNiveau}
          onChange={(e) => setSelectedNiveau(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="">Tous les niveaux</option>
          {niveauxUniques.map((niv) => (
            <option key={niv} value={niv}>{niv}</option>
          ))}
        </select>

        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value as any)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="tous">Tous les statuts d'inscriptions</option>
        </select>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Printer size={18} />
          <span>Imprimer le tableau</span>
        </button>
      </div>

      {/* Zone imprimable isolée via id="print-area" */}
      <div id="print-area" className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg p-2 print:border-none print:shadow-none">
        
        {/* Titre visible uniquement à l'impression */}
        <div className="hidden print:block mb-4">
          <h1 className="text-xl font-bold text-black">Liste des Élèves</h1>
          <p className="text-xs text-gray-600">
            Total : {filteredEleves.length} élève(s) {selectedNiveau && `- Niveau : ${selectedNiveau}`}
          </p>
        </div>

        <table className="w-full text-left text-sm text-slate-300 print:text-black print:border-collapse">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs border-b border-slate-700 print:bg-gray-100 print:text-black">
            <tr>
              <th className="p-4 print:p-2 print:border print:border-gray-300">Nom & Prénom</th>
              <th className="p-4 print:p-2 print:border print:border-gray-300">Niveau / Matière</th>
              <th className="p-4 print:p-2 print:border print:border-gray-300">Téléphone</th>
              <th className="p-4 print:p-2 print:border print:border-gray-300">École / Quartier</th>
              <th className="p-4 print:p-2 print:border print:border-gray-300">Frais</th>
              <th className="p-4 print:p-2 print:border print:border-gray-300">Statut</th>
              <th className="p-4 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700 print:divide-gray-300">
            {filteredEleves.length > 0 ? (
              filteredEleves.map((eleve) => (
                <tr key={eleve.id} className="hover:bg-slate-750 transition-colors">
                  <td className="p-4 font-semibold text-slate-100 print:text-black print:p-2 print:border print:border-gray-300">
                    {eleve.nom_prenom}
                  </td>
                  <td className="p-4 print:p-2 print:border print:border-gray-300">
                    <div className="flex flex-col gap-1 items-start">
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-blue-300 font-medium print:bg-transparent print:text-black print:p-0">
                        {eleve.niveau}
                      </span>
                      {eleve.matiere && (
                        <span className="text-xs text-slate-400 print:text-gray-600">{eleve.matiere}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 print:p-2 print:border print:border-gray-300">{eleve.phone}</td>
                  <td className="p-4 print:p-2 print:border print:border-gray-300">
                    <div>{eleve.ecole_frequenter}</div>
                    <div className="text-xs text-slate-400 print:text-gray-600">{eleve.quartier}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-200 print:text-black print:p-2 print:border print:border-gray-300">
                    {Number(eleve.frais_encadrement).toLocaleString()} FCFA
                  </td>
                  <td className="p-4 font-semibold text-slate-200 print:text-black print:p-2 print:border print:border-gray-300">
                    Inscrit(e)
                  </td>
                  <td className="p-4 text-center no-print">
                    <div className="flex justify-center items-center gap-2">
                      <Link
                        href={`/eleve/modifier/${eleve.id}`}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(eleve.id, eleve.nom_prenom)}
                        className="p-2 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500 print:text-black">
                  Aucun élève trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
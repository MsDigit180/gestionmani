"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Trash2, Edit, Search, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { deleteEleve } from "../actions";

// Type exact généré selon votre modèle Prisma Eleve
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

export function BoutonSupprimer({ eleveId }: { eleveId: string }) {
  async function handleDelete() {
    if (confirm("Voulez-vous vraiment supprimer cet élève ?")) {
      const result = await deleteEleve(eleveId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
      title="Supprimer"
    >
      <Trash2 size={16} />
    </button>
  );
}

export default function DataTableEleve({ initialEleves }: { initialEleves: Eleve[] }) {
  const [eleves, setEleves] = useState<Eleve[]>(initialEleves);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState("");
  const [filterStatut, setFilterStatut] = useState<"tous" | "paye" | "non_paye">("tous");

  // Fonction de suppression mise à jour avec Toast
  const handleDelete = async (id: string, nom: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'élève ${nom} ?`)) {
      const res = await deleteEleve(id);
      if (res.success) {
        toast.success(res.message); // 👈 Toast succès
        setEleves(eleves.filter((e) => e.id !== id));
      } else {
        toast.error(res.message);   // 👈 Toast erreur
      }
    }
  };

  // Filtrage combiné (nom, quartier, niveau et statut de paiement)
  const filteredEleves = eleves.filter((eleve) => {
    const matchesSearch =
      eleve.nom_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (eleve.quartier && eleve.quartier.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesNiveau = selectedNiveau === "" || eleve.niveau === selectedNiveau;
    
    
    return matchesSearch && matchesNiveau;
  });

  // Extraction unique des niveaux pour le filtre
  const niveauxUniques = Array.from(new Set(eleves.map((e) => e.niveau))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Barre de Recherche et Filtres */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-800 p-4 rounded-xl border border-slate-700">
        
        {/* Recherche par Nom ou Quartier */}
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

        {/* Filtre par Niveau */}
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

        {/* Filtre par Statut de Paiement */}
        <select
          value={filterStatut}
          onChange={(e) => setFilterStatut(e.target.value as any)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 text-sm"
        >
          <option value="tous">Toutes les statuts d'inscriptions</option>
      
        </select>
      </div>

      {/* Tableau des Élèves */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400 uppercase text-xs border-b border-slate-700">
            <tr>
              <th className="p-4">Nom & Prénom</th>
              <th className="p-4">Niveau / Matière</th>
              <th className="p-4">Téléphone</th>
              <th className="p-4">École / Quartier</th>
              <th className="p-4">Frais</th>
              <th className="p-4">Statut</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {filteredEleves.length > 0 ? (
              filteredEleves.map((eleve) => {
                return (
                  <tr key={eleve.id} className="hover:bg-slate-750 transition-colors">
                    <td className="p-4 font-semibold text-slate-100">{eleve.nom_prenom}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-blue-300 font-medium">
                          {eleve.niveau}
                        </span>
                        {eleve.matiere && (
                          <span className="text-xs text-slate-400">{eleve.matiere}</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{eleve.phone}</td>
                    <td className="p-4">
                      <div>{eleve.ecole_frequenter}</div>
                      <div className="text-xs text-slate-400">{eleve.quartier}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {Number(eleve.frais_encadrement).toLocaleString()} FCFA
                    </td>
                     <td className="p-4 font-semibold text-slate-200">
                      Inscrit(e)
                    </td>
                   
                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Bouton Modifier */}
                        <Link
                          href={`/eleve/modifier/${eleve.id}`}
                          className="p-2 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </Link>
                        {/* Bouton Supprimer */}
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
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
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
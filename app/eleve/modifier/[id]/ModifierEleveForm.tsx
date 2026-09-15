"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Ou votre bibliothèque de toast
import { updateEleve } from "@/app/eleve/actions";

// Type du modèle Élève (aligné avec votre schéma Prisma)
interface Eleve {
  id: string;
  nom_prenom: string;
  niveau: string;
  matiere: string;
  phone: string;
  frais_encadrement: number;
  quartier: string;
  ecole_frequenter: string;
}

export default function ModifierEleveForm({ eleve }: { eleve: Eleve }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await updateEleve(eleve.id, formData);

    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      router.push("/eleve/liste");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nom & Prénom */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Nom et Prénom *
        </label>
        <input
          type="text"
          name="nom_prenom"
          defaultValue={eleve.nom_prenom}
          required
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Niveau & Matière */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Niveau *
          </label>
          <input
            type="text"
            name="niveau"
            defaultValue={eleve.niveau}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Matière
          </label>
          <input
            type="text"
            name="matiere"
            defaultValue={eleve.matiere}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Téléphone & Frais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Téléphone *
          </label>
          <input
            type="text"
            name="phone"
            defaultValue={eleve.phone}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Frais d'encadrement (FCFA)
          </label>
          <input
            type="number"
            name="frais_encadrement"
            defaultValue={eleve.frais_encadrement}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Quartier & École */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Quartier *
          </label>
          <input
            type="text"
            name="quartier"
            defaultValue={eleve.quartier}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            École fréquentée *
          </label>
          <input
            type="text"
            name="ecole_frequenter"
            defaultValue={eleve.ecole_frequenter}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </div>
    </form>
  );
}
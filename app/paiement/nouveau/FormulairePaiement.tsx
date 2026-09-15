"use client";

import { useState } from "react";
import { toast } from "sonner";
import { enregistrerPaiement } from "../actions";

interface EleveSimple {
  id: string;
  nom_prenom: string;
  frais_encadrement: number;
}

const MOIS_LISTE = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function FormulairePaiement({ eleves }: { eleves: EleveSimple[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState("");
  const [montant, setMontant] = useState<number | "">("");

  // Ajuste automatiquement le montant selon les frais de l'élève sélectionné
  const handleEleveChange = (id: string) => {
    setSelectedEleveId(id);
    const eleve = eleves.find((e) => e.id === id);
    if (eleve) {
      setMontant(eleve.frais_encadrement);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await enregistrerPaiement(formData);

    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      (e.target as HTMLFormElement).reset();
      setSelectedEleveId("");
      setMontant("");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-slate-100 mb-4">Enregistrer un paiement mensuel</h2>

      {/* Sélection de l'élève */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Sélectionner l'élève *</label>
        <select
          name="eleveId"
          value={selectedEleveId}
          onChange={(e) => handleEleveChange(e.target.value)}
          required
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        >
          <option value="">-- Choisir un élève --</option>
          {eleves.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_prenom} ({e.frais_encadrement.toLocaleString()} FCFA)
            </option>
          ))}
        </select>
      </div>

      {/* Mois et Année */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Mois *</label>
          <select
            name="mois"
            defaultValue={MOIS_LISTE[new Date().getMonth()]}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          >
            {MOIS_LISTE.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Année *</label>
          <input
            type="number"
            name="annee"
            defaultValue={new Date().getFullYear()}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Montant et Mode de Paiement */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Montant (FCFA) *</label>
          <input
            type="number"
            name="montant"
            value={montant}
            onChange={(e) => setMontant(Number(e.target.value))}
            required
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Mode de paiement</label>
          <select
            name="mode_paiement"
            defaultValue="CASH"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          >
            <option value="CASH">Espèces (Cash)</option>
            <option value="MOBILE_MONEY">Mobile Money</option>
            <option value="VIREMENT">Virement / Chèque</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 mt-4"
      >
        {loading ? "Enregistrement..." : "Valider le paiement"}
      </button>
    </form>
  );
}
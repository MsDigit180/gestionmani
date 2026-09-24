"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { dbLocal } from "@/lib/dbLocal";
import { enregistrerPaiementOffline } from "@/lib/offlineServices";

export const dynamic = 'force-dynamic';

interface EleveSimple {
  id: string;
  nom_prenom: string;
  frais_encadrement: number;
}

const MOIS_LISTE = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];

export default function FormulairePaiement({ eleves = [] }: { eleves?: EleveSimple[] }) {
  const [loading, setLoading] = useState(false);
  const [selectedEleveId, setSelectedEleveId] = useState("");
  const [montant, setMontant] = useState<number | "">("");

  // 1. Charger la liste depuis IndexedDB pour accès permanent hors-ligne
  const elevesLocaux = useLiveQuery(() => dbLocal.eleves.toArray()) || [];

  // Fusionner les élèves serveur dans Dexie au chargement
  useEffect(() => {
    if (eleves && eleves.length > 0) {
      dbLocal.eleves.bulkPut(
        eleves.map((e) => ({
          id: e.id,
          nom_prenom: e.nom_prenom,
          frais_encadrement: e.frais_encadrement,
          niveau: "",
          phone: "",
          quartier: "",
          ecole_frequenter: "",
          synced: true,
        }))
      );
    }
  }, [eleves]);

  const listeAffichee = elevesLocaux.length > 0 ? elevesLocaux : eleves;

  const handleEleveChange = (id: string) => {
    setSelectedEleveId(id);
    const eleve = listeAffichee.find((e) => e.id === id);
    if (eleve) {
      setMontant(eleve.frais_encadrement);
    } else {
      setMontant("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const eleveId = formData.get("eleveId") as string;
    const mois = formData.get("mois") as string;
    const annee = Number(formData.get("annee"));
    const montantVal = Number(formData.get("montant"));
    const modePaiement = formData.get("mode_paiement") as string;

    try {
      // 🚀 Sauvegarde locale immédiate (Zero risque d'erreur réseau / fetch)
      const resOffline = await enregistrerPaiementOffline({
        eleveId,
        mois,
        annee,
        montant: montantVal,
        mode_paiement: modePaiement,
        statut: "PAYE",
      });

      if (resOffline.success) {
        toast.success(
          navigator.onLine
            ? "Paiement enregistré et prêt pour synchro !"
            : "Paiement enregistré en mode hors-ligne."
        );
        resetForm(form);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement:", error);
      toast.error("Erreur lors de la sauvegarde du paiement.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = (form: HTMLFormElement) => {
    form.reset();
    setSelectedEleveId("");
    setMontant("");
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
          {listeAffichee?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nom_prenom} ({e.frais_encadrement ? e.frais_encadrement.toLocaleString() : 0} FCFA)
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
            onChange={(e) => setMontant(e.target.value === "" ? "" : Number(e.target.value))}
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
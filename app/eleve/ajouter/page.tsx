'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ajouterEleveOffline } from '@/lib/offlineServices'; // 👈 Remplacement de la Server Action

export default function FormulaireEleve() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      // Extraction des données du formulaire
      const payload = {
        nom_prenom: formData.get('nom_prenom') as string,
        niveau: formData.get('niveau') as string,
        matiere: (formData.get('matiere') as string) || '',
        phone: formData.get('phone') as string,
        quartier: (formData.get('quartier') as string) || '',
        ecole_frequenter: (formData.get('ecole_frequenter') as string) || '',
        frais_encadrement: Number(formData.get('frais_encadrement')),
      };

      // Sauvegarde locale sécurisée dans IndexedDB
      const result = await ajouterEleveOffline(payload);

      if (result.success) {
        toast.success(
          navigator.onLine
            ? "Élève ajouté et synchronisé !"
            : "Élève enregistré localement (mode hors-ligne)"
        );
        form.reset();
      }
    } catch (error) {
      console.error("Erreur d'enregistrement :", error);
      toast.error("Erreur lors de l'enregistrement de l'élève.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-slate-800 p-6 rounded-xl border border-slate-700 max-w-xl mx-auto text-slate-100"
    >
      <h2 className="text-xl font-bold mb-4">Ajouter un élève</h2>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Nom & Prénom *
        </label>
        <input
          type="text"
          name="nom_prenom"
          required
          placeholder="Ex: Amadou Oumarou"
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Niveau d'étude *
          </label>
          <input
            type="text"
            name="niveau"
            required
            placeholder="Ex: Terminale A"
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
            placeholder="Ex: Mathématiques"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="Ex: 90000000"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Quartier
          </label>
          <input
            type="text"
            name="quartier"
            placeholder="Ex: Niamey 2000"
            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          École fréquentée
        </label>
        <input
          type="text"
          name="ecole_frequenter"
          placeholder="Ex: CEG 1"
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          Frais d'encadrement mensuels (FCFA) *
        </label>
        <input
          type="number"
          name="frais_encadrement"
          required
          placeholder="Ex: 15000"
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition disabled:opacity-50 mt-4"
      >
        {loading ? "Enregistrement..." : "Enregistrer l'élève"}
      </button>
    </form>
  );
}
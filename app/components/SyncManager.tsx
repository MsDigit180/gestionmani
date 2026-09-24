// components/SyncManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { toast } from 'sonner';
import { dbLocal } from '@/lib/dbLocal';
import { syncOfflineData } from '@/lib/offlineServices';

export default function SyncManager() {
  const [syncing, setSyncing] = useState(false);

  // Compter le nombre d'éléments locaux en attente de synchronisation
  const elevesEnAttente = useLiveQuery(() => dbLocal.eleves.filter(e => !e.synced).count()) || 0;
  const paiementsEnAttente = useLiveQuery(() => dbLocal.paiements.filter(p => !p.synced).count()) || 0;
  const totalEnAttente = elevesEnAttente + paiementsEnAttente;

  // Fonction pour déclencher la synchronisation
  const handleForceSync = async () => {
    if (!navigator.onLine) {
      toast.error("Impossible : Aucune connexion Internet détectée.");
      return;
    }

    if (totalEnAttente === 0) {
      toast.info("Toutes les données sont déjà synchronisées.");
      return;
    }

    setSyncing(true);
    const toastId = toast.loading("Synchronisation des données en cours...");

    try {
      const result = await syncOfflineData();
      toast.success(result.message || "Synchronisation terminée avec succès !", { id: toastId });
      
      // Rafraîchir la page pour mettre à jour l'affichage serveur
      window.location.reload();
    } catch (error: any) {
      console.error("Erreur de synchronisation:", error);
      toast.error(error.message || "Échec de la synchronisation.", { id: toastId });
    } finally {
      setSyncing(false);
    }
  };

  // Écouteur automatique du retour en ligne
  useEffect(() => {
    const handleOnline = () => {
      toast.info("Connexion rétablie. Tentative de synchronisation...");
      handleForceSync();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [totalEnAttente]);

  return (
    <div className="flex items-center gap-3">
      {totalEnAttente > 0 && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
          {totalEnAttente} élément(s) en attente
        </span>
      )}

      <button
        onClick={handleForceSync}
        disabled={syncing || totalEnAttente === 0}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg
          className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        {syncing ? "Synchronisation..." : "Forcer la synchronisation"}
      </button>
    </div>
  );
}
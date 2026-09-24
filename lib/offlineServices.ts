// lib/offlineServices.ts
import { dbLocal } from './dbLocal';

/**
 * Forcer la synchronisation de toutes les données locales vers le serveur
 */
export async function syncOfflineData() {
  if (!navigator.onLine) {
    throw new Error("Impossible de synchroniser : Vous êtes hors-ligne.");
  }

  // 1. Récupérer les élèves non synchronisés
  const elevesNonSynchro = await dbLocal.eleves.filter(e => !e.synced).toArray();

  // 2. Récupérer les paiements non synchronisés
  const paiementsNonSynchro = await dbLocal.paiements.filter(p => !p.synced).toArray();

  if (elevesNonSynchro.length === 0 && paiementsNonSynchro.length === 0) {
    return { success: true, count: 0, message: "Toutes les données sont déjà à jour." };
  }

  // 3. Envoyer les données au serveur via un API Route Handler
  const response = await fetch('/api/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eleves: elevesNonSynchro,
      paiements: paiementsNonSynchro,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur serveur lors de la synchronisation.");
  }

  const result = await response.json();

  // 4. Marquer les éléments comme synchronisés dans Dexie localement
  await dbLocal.transaction('rw', [dbLocal.eleves, dbLocal.paiements], async () => {
    for (const eleve of elevesNonSynchro) {
      await dbLocal.eleves.update(eleve.id, { synced: true });
    }
    for (const paiement of paiementsNonSynchro) {
      await dbLocal.paiements.update(paiement.id, { synced: true });
    }
  });

  return {
    success: true,
    count: elevesNonSynchro.length + paiementsNonSynchro.length,
    message: "Synchronisation réussie !",
  };
}

/**
 * Enregistrer un élève en mode hors-ligne
 */
export async function ajouterEleveOffline(data: any) {
  const newEleve = {
    id: crypto.randomUUID(), // ID temporaire
    ...data,
    synced: false,
    createdAt: new Date().toISOString(),
  };

  await dbLocal.eleves.add(newEleve);
  return { success: true, data: newEleve };
}

/**
 * Enregistrer un paiement en mode hors-ligne
 */
export async function enregistrerPaiementOffline(data: any) {
  const newPaiement = {
    id: crypto.randomUUID(),
    ...data,
    synced: false,
    createdAt: new Date().toISOString(),
  };

  await dbLocal.paiements.add(newPaiement);
  return { success: true, data: newPaiement };
}
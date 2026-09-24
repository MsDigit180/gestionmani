// lib/syncEngine.ts
import { dbLocal } from './dbLocal';

export async function synchroniserDonnees() {
  if (!navigator.onLine) return;

  const queue = await dbLocal.syncQueue.orderBy('createdAt').toArray();
  if (queue.length === 0) return;

  console.log(`[PWA Sync] Début de la synchronisation de ${queue.length} éléments...`);

  for (const item of queue) {
    try {
      let endpoint = '';
      if (item.type === 'CREATE_ELEVE') endpoint = '/api/eleves';
      if (item.type === 'CREATE_PAIEMENT') endpoint = '/api/paiements';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.payload),
      });

      if (res.ok) {
        // Mettre à jour le statut dans la DB locale et nettoyer la file d'attente
        if (item.type === 'CREATE_ELEVE') {
          await dbLocal.eleves.update(item.payload.id, { synced: true });
        } else if (item.type === 'CREATE_PAIEMENT') {
          await dbLocal.paiements.update(item.payload.id, { synced: true });
        }

        if (item.id) await dbLocal.syncQueue.delete(item.id);
      }
    } catch (error) {
      console.error("[PWA Sync] Erreur de synchro pour le composant", item, error);
      break; // Stopper en cas de coupure subite
    }
  }
}

// Écouteur global pour le retour de la connexion internet
if (typeof window !== 'undefined') {
  window.addEventListener('online', synchroniserDonnees);
}
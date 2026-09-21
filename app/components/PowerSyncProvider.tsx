'use client';

import { ReactNode, useEffect, useState } from 'react';
import { PowerSyncContext } from '@powersync/react';
import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from '@/lib/powersync/schema';

// Initialisation de la base SQLite locale intégrée au navigateur
export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'ecole-offline.db', // Nom du fichier SQLite local
  },
});

export function PowerSyncProvider({ children }: { children: ReactNode }) {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Initialisation du stockage local au démarrage du composant
    db.init().then(() => {
      setInitialized(true);
    }).catch((err) => {
      console.error("Erreur d'initialisation de PowerSync:", err);
    });
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 font-medium">Chargement du mode hors-ligne...</p>
      </div>
    );
  }

  return (
    <PowerSyncContext.Provider value={db}>
      {children}
    </PowerSyncContext.Provider>
  );
}
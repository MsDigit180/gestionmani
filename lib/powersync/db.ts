'use client';

import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema'; // Import de votre schéma exporté depuis schema.ts

// 1. Initialisation de la base SQLite locale (IndexedDB / WASM dans le navigateur)
export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'app-db.sqlite',
  },
});

// 2. Récupération de l'URL de votre instance PowerSync Cloud depuis le .env
export const powersyncUrl = process.env.NEXT_PUBLIC_POWERSYNC_URL;
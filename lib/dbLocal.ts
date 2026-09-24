// lib/dbLocal.ts
import Dexie, { Table } from 'dexie';

export interface LocalEleve {
  id: string; // UUID généré côté client
  nom_prenom: string;
  niveau: string;
  matiere?: string | null;
  phone: string;
  quartier: string;
  ecole_frequenter: string;
  frais_encadrement: number;
  date_inscription?: Date | string;
  synced?: boolean; // Indique si synchronisé avec PostgreSQL
}

export interface LocalPaiement {
  id: string; // UUID généré côté client
  montant: number;
  mois: string;
  annee: number;
  date_paiement?: Date | string;
  statut: string;
  mode_paiement?: string | null;
  eleveId: string;
  synced?: boolean;
}

// File d'attente des mutations hors-ligne
export interface SyncItem {
  id?: number;
  type: 'CREATE_ELEVE' | 'CREATE_PAIEMENT';
  payload: any;
  createdAt: number;
}

export class OfflineDB extends Dexie {
  eleves!: Table<LocalEleve>;
  paiements!: Table<LocalPaiement>;
  syncQueue!: Table<SyncItem>;

  constructor() {
    super('GestionEcoleOfflineDB');
    this.version(1).stores({
      eleves: 'id, nom_prenom, phone, synced',
      paiements: 'id, eleveId, mois, annee, synced',
      syncQueue: '++id, type, createdAt',
    });
  }
}

export const dbLocal = new OfflineDB();
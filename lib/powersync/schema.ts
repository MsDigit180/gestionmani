import { column, Schema, Table } from '@powersync/web';

const eleves = new Table({
  nom_prenom: column.text,
  niveau: column.text,
  matiere: column.text,
  phone: column.text,
  quartier: column.text,
  ecole_frequenter: column.text,
  frais_encadrement: column.real,
  date_inscription: column.text,
  createdAt: column.text,
  updatedAt: column.text,
});

const paiements = new Table({
  montant: column.real,
  mois: column.text,
  annee: column.integer,
  date_paiement: column.text,
  statut: column.text,
  mode_paiement: column.text,
  eleve_id: column.text,
  createdAt: column.text,
  updatedAt: column.text,
});

export const AppSchema = new Schema({
  eleves,
  paiements,
});
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const op = await req.json(); // L'opération de synchronisation transmise par le client

    const { table, op: operationType, data } = op;

    // 1. Synchronisation pour la table Eleve
    if (table === 'eleves') {
      if (operationType === 'PUT' || operationType === 'PATCH') {
        await prisma.eleve.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            nom_prenom: data.nom_prenom,
            niveau: data.niveau,
            matiere: data.matiere,
            phone: data.phone,
            quartier: data.quartier,
            ecole_frequenter: data.ecole_frequenter,
            frais_encadrement: Number(data.frais_encadrement),
            date_inscription: new Date(data.date_inscription),
          },
          update: {
            nom_prenom: data.nom_prenom,
            phone: data.phone,
            frais_encadrement: Number(data.frais_encadrement),
            updatedAt: new Date(),
          },
        });
      } else if (operationType === 'DELETE') {
        await prisma.eleve.delete({ where: { id: data.id } });
      }
    }

    // 2. Synchronisation pour la table Paiement
    if (table === 'paiements') {
      if (operationType === 'PUT' || operationType === 'PATCH') {
        await prisma.paiement.upsert({
          where: { id: data.id },
          create: {
            id: data.id,
            montant: Number(data.montant),
            mois: data.mois,
            annee: Number(data.annee),
            date_paiement: new Date(data.date_paiement),
            statut: data.statut,
            mode_paiement: data.mode_paiement,
            eleveId: data.eleve_id || data.eleveId,
          },
          update: {
            montant: Number(data.montant),
            statut: data.statut,
            mode_paiement: data.mode_paiement,
            updatedAt: new Date(),
          },
        });
      } else if (operationType === 'DELETE') {
        await prisma.paiement.delete({ where: { id: data.id } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur de synchronisation Postgres:', error);
    return NextResponse.json({ error: 'Échec de la synchronisation' }, { status: 500 });
  }
}
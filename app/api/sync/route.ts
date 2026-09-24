// app/api/sync/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { eleves, paiements } = await req.json();

    // 1. Traitement des élèves
    if (eleves && eleves.length > 0) {
      for (const eleve of eleves) {
        await prisma.eleve.upsert({
          where: { id: eleve.id },
          update: {
            nom_prenom: eleve.nom_prenom,
            niveau: eleve.niveau,
            matiere: eleve.matiere,
            phone: eleve.phone,
            quartier: eleve.quartier,
            ecole_frequenter: eleve.ecole_frequenter,
            frais_encadrement: eleve.frais_encadrement,
          },
          create: {
            id: eleve.id,
            nom_prenom: eleve.nom_prenom,
            niveau: eleve.niveau,
            matiere: eleve.matiere,
            phone: eleve.phone,
            quartier: eleve.quartier,
            ecole_frequenter: eleve.ecole_frequenter,
            frais_encadrement: eleve.frais_encadrement,
          },
        });
      }
    }

    // 2. Traitement des paiements (Remplacement de create par upsert pour éviter l'erreur d'unicité)
    if (paiements && paiements.length > 0) {
      for (const paiement of paiements) {
        await prisma.paiement.upsert({
          where: {
            // Clé composée unique générée par Prisma @@unique([eleveId, mois, annee])
            eleveId_mois_annee: {
              eleveId: paiement.eleveId,
              mois: paiement.mois,
              annee: paiement.annee,
            },
          },
          update: {
            montant: paiement.montant,
            mode_paiement: paiement.mode_paiement,
            statut: paiement.statut || "PAYE",
          },
          create: {
            eleveId: paiement.eleveId,
            mois: paiement.mois,
            annee: paiement.annee,
            montant: paiement.montant,
            mode_paiement: paiement.mode_paiement,
            statut: paiement.statut || "PAYE",
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Données synchronisées avec succès" });
  } catch (error: any) {
    console.error("Erreur serveur lors de la synchronisation:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Erreur interne lors de la synchronisation" },
      { status: 500 }
    );
  }
}
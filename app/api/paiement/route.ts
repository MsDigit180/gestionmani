// app/api/paiements/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paiement = await prisma.paiement.upsert({
      where: { id: body.id },
      update: {},
      create: {
        id: body.id, // UUID généré côté client/hors-ligne
        montant: Number(body.montant),
        mois: body.mois,
        annee: Number(body.annee),
        statut: body.statut || "PAYE",
        mode_paiement: body.mode_paiement,
        eleveId: body.eleveId,
      },
    });

    return NextResponse.json(paiement);
  } catch (error) {
    console.error("Erreur API Paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du paiement" },
      { status: 500 }
    );
  }
}
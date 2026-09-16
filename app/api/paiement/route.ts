import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Historique de tous les paiements
export async function GET() {
  try {
    const paiements = await prisma.paiement.findMany({
      include: {
        eleve: true,
      },
      orderBy: {
        date_paiement: 'desc',
      },
    });

    return NextResponse.json(paiements, { status: 200 });
  } catch (error: any) {
    console.error('Erreur GET /api/paiement:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors de la récupération des paiements' },
      { status: 500 }
    );
  }
}

// POST: Enregistrer un paiement d'encadrement
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eleveId, montant, mois, annee, mode_paiement } = body;

    if (!eleveId || !montant || !mois || !annee) {
      return NextResponse.json(
        { message: 'Élève, montant, mois et année sont requis' },
        { status: 400 }
      );
    }

    // Vérification unicité du paiement
    const existingPaiement = await prisma.paiement.findUnique({
      where: {
        eleveId_mois_annee: {
          eleveId,
          mois,
          annee: parseInt(annee, 10),
        },
      },
    });

    if (existingPaiement) {
      return NextResponse.json(
        { message: `Un paiement pour le mois de ${mois} ${annee} existe déjà pour cet élève.` },
        { status: 400 }
      );
    }

    const newPaiement = await prisma.paiement.create({
      data: {
        eleveId,
        montant: parseFloat(montant),
        mois,
        annee: parseInt(annee, 10),
        mode_paiement: mode_paiement || 'Espèces',
        statut: 'PAYE',
      },
      include: {
        eleve: true,
      },
    });

    return NextResponse.json(newPaiement, { status: 201 });
  } catch (error: any) {
    console.error('Erreur POST /api/paiement:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors de l\'enregistrement du paiement' },
      { status: 500 }
    );
  }
}
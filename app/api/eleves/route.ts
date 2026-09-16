import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Récupérer la liste des élèves avec leurs paiements
export async function GET() {
  try {
    const eleves = await prisma.eleve.findMany({
      include: {
        paiements: true, // Inclut tous les paiements liés à chaque élève
      },
      orderBy: {
        nom_prenom: 'asc',
      },
    });

    return NextResponse.json(eleves, { status: 200 });
  } catch (error: any) {
    console.error('Erreur GET /api/eleves:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors de la récupération des élèves' },
      { status: 500 }
    );
  }
}

// POST: Ajouter un nouvel élève
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nom_prenom,
      niveau,
      matiere,
      phone,
      quartier,
      ecole_frequenter,
      frais_encadrement,
    } = body;

    if (!nom_prenom || !niveau || !phone || !quartier || !ecole_frequenter || frais_encadrement === undefined) {
      return NextResponse.json(
        { message: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    const newEleve = await prisma.eleve.create({
      data: {
        nom_prenom,
        niveau,
        matiere: matiere || null,
        phone,
        quartier,
        ecole_frequenter,
        frais_encadrement: parseFloat(frais_encadrement),
      },
    });

    return NextResponse.json(newEleve, { status: 201 });
  } catch (error: any) {
    console.error('Erreur POST /api/eleves:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors de l\'enregistrement de l\'élève' },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un élève
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { message: 'L\'identifiant de l\'élève est requis' },
        { status: 400 }
      );
    }

    await prisma.eleve.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Élève et paiements supprimés avec succès' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur DELETE /api/eleves:', error);
    return NextResponse.json(
      { message: error?.message || 'Erreur lors de la suppression de l\'élève' },
      { status: 500 }
    );
  }
}
// app/api/eleves/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();

  const eleve = await prisma.eleve.upsert({
    where: { id: body.id },
    update: {},
    create: {
      id: body.id, // Reçoit l'UUID généré par le client hors-ligne
      nom_prenom: body.nom_prenom,
      niveau: body.niveau,
      matiere: body.matiere,
      phone: body.phone,
      quartier: body.quartier,
      ecole_frequenter: body.ecole_frequenter,
      frais_encadrement: Number(body.frais_encadrement),
    },
  });

  return NextResponse.json(eleve);
}
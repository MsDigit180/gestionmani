import { prisma } from "@/lib/prisma";
import PrintStudentsClient from "@/app/eleve/imprimer/PrintStudentsClient";

export const dynamic = 'force-dynamic';

export default async function PrintStudentsPage() {
  // Récupération des données directes via Prisma (comme sur l'Historique)
  const eleves = await prisma.eleve.findMany({
    include: {
      paiements: true,
    },
    orderBy: {
      nom_prenom: "asc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <PrintStudentsClient initialEleves={eleves} />
    </div>
  );
}
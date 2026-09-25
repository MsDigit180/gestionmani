import { prisma } from "@/lib/prisma";
import PrintUnpaidStudentsClient from "@/app/api/eleves/impayes/PrintUnpaidStudentsClient";

export const dynamic = 'force-dynamic';

export default async function PrintUnpaidStudentsPage() {
  // Récupération des données directes via Prisma
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
      <PrintUnpaidStudentsClient initialEleves={eleves} />
    </div>
  );
}
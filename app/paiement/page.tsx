import {prisma} from "@/lib/prisma";
import FormulairePaiement from "./nouveau/FormulairePaiement";
import TablePaiements from "./TablePaiements";
export const dynamic = 'force-dynamic';
export default async function PaiementPage() {
  // 1. Récupération des élèves pour le formulaire
  const eleves = await prisma.eleve.findMany({
    select: {
      id: true,
      nom_prenom: true,
      frais_encadrement: true,
    },
    orderBy: {
      nom_prenom: "asc",
    },
  });

  // 2. Récupération de l'historique des paiements avec les infos de l'élève
  const paiements = await prisma.paiement.findMany({
    include: {
      eleve: {
        select: {
          nom_prenom: true,
          niveau: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Gestion des Paiements</h1>
        <p className="text-sm text-slate-400">Enregistrez et suivez l'historique des frais mensuels.</p>
      </div>

      {/* Formulaire d'enregistrement */}
      <FormulairePaiement eleves={eleves} />

      {/* Tableau de suivi et total des paiements */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-200">Historique des versements</h2>
        <TablePaiements paiements={paiements} />
      </div>
    </div>
  );
}
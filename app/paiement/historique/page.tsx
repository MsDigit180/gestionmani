import {prisma} from "@/lib/prisma";
import { OnlineOnlyFeature } from '../../components/OnlineOnlyFeature';
import HistoriqueMensuel from "./HistoriqueMensuel";

export default async function HistoriquePaiementsPage() {
  const paiements = await prisma.paiement.findMany({
    include: {
      eleve: {
        select: {
          id: true,
          nom_prenom: true,
          niveau: true,
          phone: true,
          quartier: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">
          Historique Mensuel des Paiements
        </h1>
        <p className="text-sm text-slate-400">
          Consultez les encaissés et la liste des élèves ayant réglé leur cotisation par mois.
        </p>
      </div>
      <OnlineOnlyFeature>
      <HistoriqueMensuel paiements={paiements} />
      </OnlineOnlyFeature>
    </div>
  );
}
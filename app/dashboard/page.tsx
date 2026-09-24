import {prisma} from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

const MOIS_NOMS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const eleves = await prisma.eleve.findMany();
  const paiements = await prisma.paiement.findMany();

  // Agrégation par mois pour les 12 mois de l'année
  const statsParMois = MOIS_NOMS.map((nomMois, index) => {
    // 1. Comptage des élèves inscrits ce mois-ci
    const countInscriptions = eleves.filter((e) => {
      const date = new Date(e.date_inscription);
      return date.getMonth() === index;
    }).length;

    // 2. Cumul du chiffre d'affaires pour ce mois
    const totalCA = paiements
      .filter((p) => p.mois === nomMois)
      .reduce((sum, p) => sum + p.montant, 0);

    return {
      mois: nomMois,
      inscriptions: countInscriptions,
      ca: totalCA,
    };
  });

  // Calculs globaux
  const totalEleves = eleves.length;
  const totalCA = paiements.reduce((sum, p) => sum + p.montant, 0);

  // Recherche du mois avec le max d'inscriptions
  const maxInscritsObj = [...statsParMois].sort((a, b) => b.inscriptions - a.inscriptions)[0];
  const meilleurMoisInscriptions = maxInscritsObj && maxInscritsObj.inscriptions > 0
    ? `${maxInscritsObj.mois} (${maxInscritsObj.inscriptions} élèves)`
    : "Aucune inscription";

  // Recherche du mois avec le max de C.A.
  const maxCAObj = [...statsParMois].sort((a, b) => b.ca - a.ca)[0];
  const meilleurMoisCA = maxCAObj && maxCAObj.ca > 0
    ? `${maxCAObj.mois} (${maxCAObj.ca.toLocaleString()} FCFA)`
    : "Aucun versement";

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Tableau de Bord</h1>
        <p className="text-sm text-slate-400">
          Aperçu global de l'activité, des inscriptions et des revenus.
        </p>
      </div>
      <DashboardClient
        statsGroupes={statsParMois}
        totalEleves={totalEleves}
        totalCA={totalCA}
        meilleurMoisInscriptions={meilleurMoisInscriptions}
        meilleurMoisCA={meilleurMoisCA}
      />
    </div>
  );
}
import { prisma } from "@/lib/prisma";
import DataTableEleve from "./DataTableEleve";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { OnlineOnlyFeature } from '../../components/OnlineOnlyFeature';

export const revalidate = 0; // Récupère toujours les données en temps réel

export default async function ListeElevesPage() {
  // Récupération de tous les élèves depuis PostgreSQL
  const elevesRaw = await prisma.eleve.findMany({
    orderBy: {
      id: "desc",
    },
  });

  // Conversion / Normalisation pour garantir que matiere n'est pas null
  const eleves = elevesRaw.map((eleve) => ({
    ...eleve,
    matiere: eleve.matiere ?? "",
  }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Liste des Élèves</h1>
          <p className="text-slate-400 text-sm">Consultez, filtrez et gérez les inscriptions et le paiement des frais.</p>
        </div>
        <Link
          href="/eleve/ajouter"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <UserPlus size={18} />
          Inscrire un élève
        </Link>
      </div>

      {/* Affichage du composant Data Table */}
      <OnlineOnlyFeature>
      <DataTableEleve initialEleves={eleves} />
      </OnlineOnlyFeature>
    </div>
  );
}
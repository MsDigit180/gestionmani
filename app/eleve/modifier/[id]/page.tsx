import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import ModifierEleveForm from "./ModifierEleveForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierElevePage({ params }: PageProps) {
  // 1. Next.js 16 : Attente asynchrone des paramètres de route
  const { id } = await params;

  // 2. Récupération de l'élève en base de données
  const eleve = await prisma.eleve.findUnique({
    where: { id },
  });

  // 3. Si l'élève n'existe pas dans la BDD, afficher la page 404
  if (!eleve) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-xl">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">
        Modifier l'élève : {eleve.nom_prenom}
      </h1>
      <ModifierEleveForm eleve={eleve} />
    </div>
  );
}
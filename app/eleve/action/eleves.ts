'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';

export async function ajouterEleveAction(formData: FormData) {
  try {
    const nom_prenom = formData.get('nom_prenom') as string;
    const niveau = formData.get('niveau') as string;
    const matiere = formData.get('matiere') as string;
    const phone = formData.get('phone') as string;
    const quartier = formData.get('quartier') as string;
    const ecole_frequenter = formData.get('ecole_frequenter') as string;
    const frais_encadrement = Number(formData.get('frais_encadrement') || 0);

    // Insertion directe dans Supabase via Prisma
    const nouveau = await prisma.eleve.create({
      data: {
        nom_prenom,
        niveau,
        matiere,
        phone,
        quartier,
        ecole_frequenter,
        frais_encadrement,
      },
    });

    // Invalide le cache de la liste des élèves pour afficher le nouvel élève
    revalidatePath('@/app/paiement/FormulairePaiement');

    return { success: true, data: nouveau };
  } catch (error) {
    console.error("Erreur serveur lors de la création de l'élève :", error);
    return { success: false, error: "Impossible de créer l'élève" };
  }
}
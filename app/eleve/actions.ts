'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Type explicite pour le retour des actions
export type ActionResponse = {
  success: boolean;
  message: string;
};

// 1. Action de modification
export async function updateEleve(id: string, formData: FormData): Promise<ActionResponse> {
  try {
    const nom_prenom = formData.get("nom_prenom") as string;
    const niveau = formData.get("niveau") as string;
    const matiere = formData.get("matiere") as string;
    const phone = formData.get("phone") as string;
    const frais_encadrement = Number(formData.get("frais_encadrement")) || 0;
    const quartier = formData.get("quartier") as string;
    const ecole_frequenter = formData.get("ecole_frequenter") as string;

    await prisma.eleve.update({
      where: { id },
      data: {
        nom_prenom,
        niveau,
        matiere,
        phone,
        frais_encadrement,
        quartier,
        ecole_frequenter,
      },
    });

    revalidatePath("/eleve/liste");
    return { success: true, message: "L'élève a été modifié avec succès !" };
  } catch (error) {
    console.error("Erreur de modification :", error);
    return { success: false, message: "Impossible de modifier l'élève." };
  }
}

// 2. Action de suppression
export async function deleteEleve(id: string): Promise<ActionResponse> {
  try {
    await prisma.eleve.delete({
      where: { id },
    });

    revalidatePath("/eleve/liste");
    return { success: true, message: "L'élève a été supprimé avec succès !" };
  } catch (error) {
    console.error("Erreur de suppression :", error);
    return { success: false, message: "Impossible de supprimer cet élève." };
  }
}

// 3. Action de création
export async function createEleve(formData: FormData): Promise<ActionResponse> {
  try {
    const nom_prenom = formData.get('nom_prenom') as string;
    const niveau = formData.get('niveau') as string;
    const matiere = (formData.get('matiere') as string) || '';
    const phone = formData.get('phone') as string;
    const quartier = formData.get('quartier') as string;
    const ecole_frequenter = formData.get('ecole_frequenter') as string;
    const frais_encadrement = parseInt(formData.get('frais_encadrement') as string, 10) || 0;

    if (!nom_prenom || !niveau || !phone || !quartier || !ecole_frequenter) {
      return { success: false, message: 'Veuillez remplir tous les champs obligatoires.' };
    }

    await prisma.eleve.create({
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

    // Mettre à jour la route de la liste des élèves
    revalidatePath('/eleve/liste');
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    return { success: false, message: "Une erreur est survenue lors de l'enregistrement." };
  }

  // Effectuer la redirection vers la liste des élèves après la création
  redirect('/eleve/liste');
}
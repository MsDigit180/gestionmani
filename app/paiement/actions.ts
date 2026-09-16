"use server";

import {prisma} from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export async function enregistrerPaiement(formData: FormData): Promise<ActionResponse> {
  try {
    const eleveId = formData.get("eleveId") as string;
    const montant = Number(formData.get("montant"));
    const mois = formData.get("mois") as string;
    const annee = Number(formData.get("annee")) || new Date().getFullYear();
    const mode_paiement = formData.get("mode_paiement") as string;

    if (!eleveId || !montant || !mois) {
      return { success: false, message: "Veuillez remplir tous les champs obligatoires." };
    }

    // Vérification si un paiement existe déjà pour ce mois et cette année
    const paiementExistant = await prisma.paiement.findUnique({
      where: {
        eleveId_mois_annee: {
          eleveId,
          mois,
          annee,
        },
      },
    });

    if (paiementExistant) {
      return {
        success: false,
        message: `Le paiement du mois de ${mois} ${annee} a déjà été effectué pour cet élève.`,
      };
    }

    // Enregistrement du paiement
    await prisma.paiement.create({
      data: {
        eleveId,
        montant,
        mois,
        annee,
        mode_paiement,
        statut: "PAYE",
      },
    });

    revalidatePath("/eleve/liste");
    revalidatePath("/paiement/liste");

    return { success: true, message: "Paiement enregistré avec succès !" };
  } catch (error) {
    console.error("Erreur d'enregistrement du paiement :", error);
    return { success: false, message: "Impossible d'enregistrer le paiement." };
  }
}
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// Schema de validation Zod
const PaiementSchema = z.object({
  eleveId: z.string().min(1, "L'élève est obligatoire."),
  montant: z.coerce.number().positive("Le montant doit être supérieur à 0."),
  mois: z.string().min(1, "Le mois est obligatoire.").transform((val) => val.trim().toLowerCase()),
  annee: z.coerce
    .number()
    .int()
    .min(2000)
    .default(() => new Date().getFullYear()),
  mode_paiement: z.string().optional().default("ESPECES"),
});

export async function enregistrerPaiement(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // 1. Validation des champs
    const validatedFields = PaiementSchema.safeParse({
      eleveId: formData.get("eleveId"),
      montant: formData.get("montant"),
      mois: formData.get("mois"),
      annee: formData.get("annee"),
      mode_paiement: formData.get("mode_paiement"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Veuillez vérifier les informations saisies.",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { eleveId, montant, mois, annee, mode_paiement } = validatedFields.data;

    // 2. Vérification d'existence préalable
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
        message: `Le paiement pour ${mois} ${annee} a déjà été enregistré pour cet élève.`,
      };
    }

    // 3. Enregistrement du paiement dans la BDD
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

    // 4. Revalidation des requêtes/caches
    revalidatePath("/eleve/liste");
    revalidatePath("/paiement/liste");

    return { success: true, message: "Paiement enregistré avec succès !" };
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du paiement :", error);
    return {
      success: false,
      message: "Une erreur serveur est survenue lors de l'enregistrement.",
    };
  }
}
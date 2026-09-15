'use client';

import React from 'react';
import Link from 'next/link';
import Wrapper from './components/Wrapper';
import NavBar from './components/NavBar';
import { Users, CreditCard, Calendar, BarChart3, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <Wrapper>
      <NavBar />

      <div className="max-w-6xl mx-auto py-8 px-4 space-y-10">
        {/* Banner de bienvenue */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-800 to-slate-900 border border-slate-700/80 p-8 rounded-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-3">
            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs px-3 py-1 rounded-full font-medium inline-flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Système de Gestion Scolaire
            </span>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
              Bienvenue sur votre Plateforme d'Encadrement
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Gérez efficacement les inscriptions d'élèves, le suivi des paiements mensuels et analysez les performances financières.
            </p>
          </div>
        </div>

        {/* Cartes d'Accès Rapide */}
        <div>
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Accès Rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Gestion Élèves */}
            <Link
              href="/eleve/liste"
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 p-5 rounded-xl transition space-y-3 block hover:border-slate-600"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-blue-400 transition">
                  Gestion Élèves
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Inscrire, modifier et consulter la liste des élèves.
                </p>
              </div>
            </Link>

            {/* 2. Nouveau Paiement */}
            <Link
              href="/paiement"
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 p-5 rounded-xl transition space-y-3 block hover:border-slate-600"
            >
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-emerald-400 transition">
                  Nouveau Paiement
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Enregistrer un versement de mensualité.
                </p>
              </div>
            </Link>

            {/* 3. Historique Mensuel */}
            <Link
              href="/paiement/historique"
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 p-5 rounded-xl transition space-y-3 block hover:border-slate-600"
            >
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-purple-400 transition">
                  Historique Mensuel
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Consulter les paiements filtrés par mois.
                </p>
              </div>
            </Link>

            {/* 4. Tableau de Bord */}
            <Link
              href="/dashboard"
              className="group bg-slate-800 hover:bg-slate-750 border border-slate-700 p-5 rounded-xl transition space-y-3 block hover:border-slate-600"
            >
              <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-400">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-100 group-hover:text-amber-400 transition">
                  Tableau de Bord
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Graphiques, CA et statistiques d'inscriptions.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
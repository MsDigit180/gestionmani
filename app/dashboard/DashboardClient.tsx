"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

type StatsMois = {
  mois: string;
  inscriptions: number;
  ca: number;
};

type Props = {
  statsGroupes: StatsMois[];
  totalEleves: number;
  totalCA: number;
  meilleurMoisInscriptions: string;
  meilleurMoisCA: string;
};

export default function DashboardClient({
  statsGroupes,
  totalEleves,
  totalCA,
  meilleurMoisInscriptions,
  meilleurMoisCA,
}: Props) {
  return (
    <div className="space-y-8">
      {/* 1. Cartes de KPI / Statistiques Clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Total Élèves Inscrits
          </span>
          <span className="text-3xl font-bold text-slate-100">{totalEleves}</span>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-slate-400 block mb-1">
            Chiffre d'Affaires Total
          </span>
          <span className="text-3xl font-bold text-emerald-400">
            {totalCA.toLocaleString()} FCFA
          </span>
        </div>

        <div className="bg-slate-800 border border-blue-900/50 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-blue-400 block mb-1">
            Mois avec le + d'inscriptions
          </span>
          <span className="text-xl font-bold text-blue-200">
            {meilleurMoisInscriptions}
          </span>
        </div>

        <div className="bg-slate-800 border border-emerald-900/50 p-5 rounded-xl">
          <span className="text-xs font-semibold uppercase text-emerald-400 block mb-1">
            Mois avec le + de C.A.
          </span>
          <span className="text-xl font-bold text-emerald-300">
            {meilleurMoisCA}
          </span>
        </div>
      </div>

      {/* 2. Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique 1 : Évolution des Inscriptions */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Nombre d'inscriptions par mois
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsGroupes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                  labelStyle={{ color: "#f8fafc" }}
                />
                <Bar dataKey="inscriptions" name="Inscriptions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graphique 2 : Chiffre d'Affaires par Mois */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl space-y-4">
          <h2 className="text-lg font-semibold text-slate-200">
            Chiffre d'affaires par mois (FCFA)
          </h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statsGroupes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="mois" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155" }}
                  labelStyle={{ color: "#f8fafc" }}
                />
                <Line
                  type="monotone"
                  dataKey="ca"
                  name="Recettes (FCFA)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}


import { UserPlus, User, GraduationCap, BookOpen, Phone, MapPin, Building2, Wallet } from 'lucide-react';
import { createEleve } from '../actions';



export default function AjouterElevePage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-600/20 text-blue-500 rounded-xl">
          <UserPlus className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Inscrire un nouvel élève</h1>
          <p className="text-slate-400 text-sm">Remplissez les informations ci-dessous pour enregistrer l'élève.</p>
        </div>
      </div>

      {/* Formulaire */}
      <form action ={createEleve} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Nom & Prénom */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nom_prenom" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              Nom & Prénom <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="nom_prenom"
              name="nom_prenom"
              required
              placeholder="Ex: Jean Dupont"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Téléphone */}
          <div className="flex flex-col gap-2">
            <label htmlFor="phone" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400" />
              Téléphone du parent <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              required
              placeholder="Ex: 06 12 34 56 78"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Niveau */}
          <div className="flex flex-col gap-2">
            <label htmlFor="niveau" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-400" />
              Niveau <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="niveau"
              name="niveau"
              required
              placeholder="Ex: Terminale, 3ème, L1"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Matière */}
          <div className="flex flex-col gap-2">
            <label htmlFor="matiere" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              Matière(s)
            </label>
            <input
              type="text"
              id="matiere"
              name="matiere"
              placeholder="Ex: Mathématiques, Physique"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Quartier */}
          <div className="flex flex-col gap-2">
            <label htmlFor="quartier" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              Quartier <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="quartier"
              name="quartier"
              required
              placeholder="Ex: Centre-ville"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* École fréquentée */}
          <div className="flex flex-col gap-2">
            <label htmlFor="ecole_frequenter" className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              École fréquentée <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="ecole_frequenter"
              name="ecole_frequenter"
              required
              placeholder="Ex: Lycée Victor Hugo"
              className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

        </div>

        {/* Frais d'encadrement */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-700/60">
          <label htmlFor="frais_encadrement" className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            Frais d'encadrement (en FCFA / €) <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            id="frais_encadrement"
            name="frais_encadrement"
            required
            min="0"
            placeholder="0"
            className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-emerald-500 transition-colors md:w-1/2"
          />
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-end gap-4 pt-4 border-t border-slate-700">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-lg shadow-blue-600/20"
          >
            <UserPlus className="w-5 h-5" />
            <span>Enregistrer l'élève</span>
          </button>
        </div>

      </form>
    </div>
  );
}
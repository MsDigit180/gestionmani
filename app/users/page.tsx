'use client';

import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, User, Lock } from 'lucide-react';
import { toast } from 'sonner';

type UserType = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Charger la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Réponse serveur invalide (non-JSON)');
      }

      const data = await res.json();
      if (res.ok) {
        setUsers(data);
      } else {
        toast.error(data.message || 'Erreur de chargement');
      }
    } catch (error: any) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Soumission du formulaire d'ajout
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Erreur réseau ou route API introuvable.');
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success('Utilisateur créé avec succès !');
      setShowModal(false);
      fetchUsers(); // Rafraîchir la liste
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la création');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Gestion des Utilisateurs</h1>
          <p className="text-sm text-slate-400">Gérez les accès à la plateforme administration</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition"
        >
          <UserPlus className="w-4 h-4" />
          Nouvel Utilisateur
        </button>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="bg-slate-800 border border-slate-700/80 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Chargement...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Aucun utilisateur trouvé</div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs border-b border-slate-700">
              <tr>
                <th className="px-6 py-3.5">Nom</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Date de création</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-700/30 transition">
                  <td className="px-6 py-4 font-medium text-slate-100">{u.name || '-'}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de création */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-100">Ajouter un Utilisateur</h2>
            
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nom Complet</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Jean Dupont"
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Adresse Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="utilisateur@ecole.com"
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    name="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                >
                  {submitLoading ? 'Création...' : 'Créer l\'utilisateur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
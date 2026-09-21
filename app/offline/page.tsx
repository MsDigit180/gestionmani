import React from 'react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-2xl font-bold text-white mb-2">Vous êtes hors ligne</h1>
      <p className="text-slate-400 max-w-md">
        Cette page nécessite une connexion Internet active pour charger les dernières données depuis le serveur.
      </p>
    </div>
  );
}
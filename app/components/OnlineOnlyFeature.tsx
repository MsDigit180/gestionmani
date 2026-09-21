'use client';

import { useEffect, useState, ReactNode } from 'react';

export function OnlineOnlyFeature({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded my-4">
        <p className="font-bold">Mode hors-ligne actif</p>
        <p>Cette fonctionnalité nécessite une connexion Internet pour être utilisée.</p>
      </div>
    );
  }

  return <>{children}</>;
}
import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="w-full bg-slate-800 border-b border-slate-700 py-4 px-6 flex items-center justify-between">
      {/* Logo / Nom du site */}
      <div className="text-xl font-bold text-blue-500">
        <Link href="/">MS</Link>
      </div>

      {/* Liens de navigation */}
      <div className="flex gap-6 text-slate-300 font-medium">
        <Link href="/" className="hover:text-white transition-colors">
          Accueil
        </Link>
        <Link href="/about" className="hover:text-white transition-colors">
          À propos
        </Link>
        <Link href="/contact" className="hover:text-white transition-colors">
          Contact
        </Link>
      </div>
    </nav>
  );
}
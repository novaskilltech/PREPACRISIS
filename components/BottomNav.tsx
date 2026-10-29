'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Droplets, Users, AlertTriangle, PackageCheck } from 'lucide-react';

const navItems = [
  { href: '/', icon: Shield, label: 'Accueil' },
  { href: '/water-mission', icon: Droplets, label: 'Eau' },
  { href: '/sos', icon: AlertTriangle, label: 'SOS', isAlert: true },
  { href: '/checklist', icon: PackageCheck, label: 'Stocks' },
  { href: '/family-plan', icon: Users, label: 'Famille' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-50 mt-auto border-t border-slate-200/90 bg-white/95 backdrop-blur-md print:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around px-2 py-1.5 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isAlert) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label="Bouton d'urgence SOS"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-transform active:scale-95 ${
                    isActive
                      ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-red-300'
                      : 'bg-red-600 text-white hover:bg-red-500 shadow-red-200'
                  }`}
                >
                  <Icon size={22} strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-bold tracking-tight text-red-600 uppercase mt-1">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center py-1 transition-colors min-w-[50px] ${
                isActive ? 'text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-100'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

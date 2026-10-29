'use client';

import { useAppContext, ThemeMode } from '@/components/AppContext';
import { Palette, Shield, Compass, Sparkles } from 'lucide-react';

export default function ThemeSelector() {
  const { theme, setTheme } = useAppContext();

  const themes: { id: ThemeMode; label: string; icon: any; colorDot: string }[] = [
    {
      id: 'moderne',
      label: 'Moderne',
      icon: Sparkles,
      colorDot: 'bg-blue-500',
    },
    {
      id: 'tactique',
      label: 'Tactique',
      icon: Shield,
      colorDot: 'bg-emerald-700',
    },
    {
      id: 'survivaliste',
      label: 'Survival',
      icon: Compass,
      colorDot: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/90 shadow-2xs">
      {themes.map((t) => {
        const Icon = t.icon;
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              isActive
                ? 'bg-white text-slate-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title={`Basculer sur le thème ${t.label}`}
          >
            <span className={`w-2 h-2 rounded-full ${t.colorDot}`} />
            <Icon size={12} className={isActive ? 'text-blue-600' : 'opacity-70'} />
            <span className="text-[11px]">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

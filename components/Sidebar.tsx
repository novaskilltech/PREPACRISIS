'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Users, BookOpen, Bot, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', icon: Home, label: 'Tableau de bord' },
  { href: '/checklist', icon: CheckSquare, label: 'Checklist' },
  { href: '/family-plan', icon: Users, label: 'Plan Familial' },
  { href: '/guides', icon: BookOpen, label: 'Guides' },
  { href: '/ai', icon: Bot, label: 'Assistant IA' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 border-r border-slate-200 bg-white z-50">
      <div className="p-6 flex items-center space-x-3 text-indigo-600">
        <ShieldAlert size={28} strokeWidth={2.5} />
        <span className="text-xl font-bold tracking-tight text-slate-900">PrépaCrisis</span>
      </div>
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={clsx("flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors", isActive ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900")}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

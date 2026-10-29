'use client';

import { useAppContext, FamilyMemberStatus } from '@/components/AppContext';
import ThemeSelector from '@/components/ThemeSelector';
import Link from 'next/link';
import {
  Droplets,
  BatteryCharging,
  Users,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  Radio,
  PackageCheck,
  Sparkles,
  ShieldAlert,
  Printer,
  UserPlus,
  BookOpen,
} from 'lucide-react';

const STATUS_PILLS: Record<
  FamilyMemberStatus,
  { label: string; dot: string; badge: string }
> = {
  SECURISE: {
    label: 'Sécurisé',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  MISSION: {
    label: 'En Mission',
    dot: 'bg-blue-500 animate-pulse',
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  ASSISTANCE: {
    label: 'Assistance',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  URGENCE: {
    label: 'Urgence',
    dot: 'bg-rose-600 animate-ping',
    badge: 'bg-rose-50 text-rose-800 border-rose-200',
  },
};

export default function Dashboard() {
  const {
    mode,
    setMode,
    score,
    isLoaded,
    supplies,
    waterTank,
    battery,
    members,
    setMemberStatus,
  } = useAppContext();

  if (!isLoaded) return null;

  // Calculs hydriques dynamiques selon le nombre réel de personnes dans le foyer
  const memberCount = Math.max(1, members.length);
  const dailyWaterNominal = memberCount * 4; // 4 L/j par personne
  const dailyWaterRationed = memberCount * 2.5; // 2.5 L/j par personne
  const dailyWaterTarget = mode === '14D_NOMINAL' ? dailyWaterNominal : dailyWaterRationed;
  const daysWaterLeft = Math.floor(waterTank.currentLevelLiters / dailyWaterTarget);

  // Calculs énergétiques
  const batteryDaysLeft = Math.floor(
    (battery.capacityWh * (battery.currentPercent / 100)) / battery.dailyConsumptionWh
  );

  // Alertes critiques
  const criticalItems = supplies.filter((s) => s.critical);
  const pendingCritical = criticalItems.filter((s) => !s.checked).length;
  const acquiredCount = supplies.filter((s) => s.checked).length;

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* En-tête de l'application & Cockpit */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">PrépaCrisis</h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Cockpit de Crise •{' '}
                {members.length > 0
                  ? `${members.length} personne${members.length > 1 ? 's' : ''}`
                  : 'Foyer à configurer'}
              </p>
            </div>
          </div>

          {/* Sélecteur de mode 14j / 30j */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setMode('14D_NOMINAL')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                mode === '14D_NOMINAL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              14 Jours
            </button>
            <button
              onClick={() => setMode('30D_RATIONED')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                mode === '30D_RATIONED'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Sparkles size={11} />
              30 Jours
            </button>
          </div>
        </div>

        {/* Barre d'outils secondaire : Thème + Accès rapides */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <ThemeSelector />
          <div className="flex items-center gap-1.5">
            <Link
              href="/radio"
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-2xs transition-all"
              title="Radio & Fréquences"
            >
              <Radio size={13} className="text-indigo-600" />
              <span>Radio</span>
            </Link>
            <Link
              href="/guides"
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-2xs transition-all"
              title="Guides de crise"
            >
              <BookOpen size={13} className="text-emerald-600" />
              <span>Guides</span>
            </Link>
            <Link
              href="/print-sheet"
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-2xs transition-all"
              title="Fiche A4 Imprimable"
            >
              <Printer size={13} className="text-blue-600" />
              <span>Fiche A4</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-4">
        {/* 1. Cockpit 3 Jauges Vitales d'Autonomie */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* Jauge Eau */}
          <Link
            href="/water-mission"
            className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between text-blue-600 mb-1">
              <Droplets size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eau</span>
            </div>
            <div className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
              {daysWaterLeft} <span className="text-xs font-semibold text-slate-500">j</span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {waterTank.currentLevelLiters} L / {waterTank.capacityLiters} L
            </p>
          </Link>

          {/* Jauge Énergie */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs">
            <div className="flex items-center justify-between text-amber-600 mb-1">
              <BatteryCharging size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Énergie</span>
            </div>
            <div className="text-lg font-black text-slate-900">
              {batteryDaysLeft} <span className="text-xs font-semibold text-slate-500">j</span>
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {battery.currentPercent}% batterie
            </p>
          </div>

          {/* Jauge Préparation */}
          <Link
            href="/checklist"
            className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs hover:border-emerald-300 transition-all group"
          >
            <div className="flex items-center justify-between text-emerald-600 mb-1">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Score</span>
            </div>
            <div className="text-lg font-black text-emerald-600">
              {score}%
            </div>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">
              {acquiredCount}/{supplies.length} sécurisés
            </p>
          </Link>
        </div>

        {/* 2. Hub 4 Pôles Clairs (Touch Tiles Aérées 2x2) */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 px-1">
            Pôles Opérationnels
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Pôle 1 : Eau & Citernes */}
            <Link
              href="/water-mission"
              className="bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-3.5 shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Droplets size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  Eau & Citernes
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Cuves RDC, sortie 30L en 60 min, points d&apos;eau et traitement.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-blue-700">
                <span>{waterTank.currentLevelLiters} L en stock</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            {/* Pôle 2 : Stocks & Réserves */}
            <Link
              href="/checklist"
              className="bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl p-3.5 shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <PackageCheck size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  Stocks & Vivres
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Vivres 14j/30j, miel de troc, bidons 5L et liste d&apos;achats.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-amber-700">
                <span>
                  {pendingCritical > 0 ? `${pendingCritical} manquant(s)` : 'Stocks complets'}
                </span>
                <ArrowRight size={13} />
              </div>
            </Link>

            {/* Pôle 3 : Foyer & Famille */}
            <Link
              href="/family-plan"
              className="bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-3.5 shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <Users size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Foyer & Membres
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Composition familiale, rôles de crise et carnet de secours ICE.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-emerald-700">
                <span>{members.length} membre{members.length > 1 ? 's' : ''}</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            {/* Pôle 4 : Défense & Bâtiment */}
            <Link
              href="/siege"
              className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-2xl p-3.5 shadow-xs transition-all flex flex-col justify-between group active:scale-[0.99]"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                  Défense & Bâtiment
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  Sécurité R+3, accès quai, barricades et consignes de crise.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-rose-700">
                <span>Protocole R+3</span>
                <ArrowRight size={13} />
              </div>
            </Link>
          </div>
        </div>

        {/* 3. Statuts Opérationnels du Foyer (Vue compacte et directe) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Users size={16} className="text-blue-600" />
              <span>Statuts en Direct ({members.length})</span>
            </div>
            <Link
              href="/family-plan"
              className="text-xs text-blue-600 font-semibold flex items-center hover:underline"
            >
              Gérer la famille <ArrowRight size={13} className="ml-1" />
            </Link>
          </div>

          {members.length === 0 ? (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center space-y-2">
              <p className="text-xs text-slate-600 font-medium">
                Aucun membre enregistré dans votre foyer.
              </p>
              <Link
                href="/family-plan"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-2xs"
              >
                <UserPlus size={13} />
                <span>Ajouter les membres réels</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => {
                const currentStatus = member.status || 'SECURISE';

                return (
                  <div
                    key={member.id}
                    className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium shrink-0">
                          ({member.ageGroup})
                        </span>
                      </div>
                      <p className="text-[11px] text-blue-700 font-medium truncate mt-0.5">
                        {member.role}
                      </p>
                    </div>

                    {/* Menu rapide pour basculer le statut en 1 tap */}
                    <div className="flex items-center gap-1 shrink-0">
                      {(Object.keys(STATUS_PILLS) as FamilyMemberStatus[]).map((st) => {
                        const isCurrent = currentStatus === st;
                        const itemPill = STATUS_PILLS[st];

                        return (
                          <button
                            key={st}
                            onClick={() => setMemberStatus(member.id, st)}
                            title={`Passer ${member.name} en ${itemPill.label}`}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
                              isCurrent
                                ? `${itemPill.badge} ring-1 ring-blue-400 shadow-2xs`
                                : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${itemPill.dot}`} />
                            <span className="hidden sm:inline">{itemPill.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 4. Bouton d'Urgence SOS Direct */}
        <div className="pt-1">
          <Link
            href="/sos"
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <AlertTriangle size={18} />
            <span>Procédure d&apos;Urgence SOS & Partage GPS</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

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
  Heart,
  Baby,
  Clock,
  Printer,
  UserPlus,
  Check,
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

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* En-tête de l'application */}
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">PrépaCrisis</h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Sécurité Familiale •{' '}
                {members.length > 0
                  ? `${members.length} personne${members.length > 1 ? 's' : ''}`
                  : 'Foyer à configurer'}
              </p>
            </div>
          </div>

          {/* Sélecteur de mode 14j / 30j doux et clair */}
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

        {/* Barre d'outils : Thème & Fiche A4 / PDF */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <ThemeSelector />
          <Link
            href="/print-sheet"
            className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition-all"
          >
            <Printer size={13} className="text-blue-600" />
            <span>Fiche A4 / PDF</span>
          </Link>
        </div>
      </header>

      <main className="p-4 space-y-3.5">
        {/* Carte de Statut Global & Autonomie */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex justify-between items-start gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Autonomie prévue : {mode === '14D_NOMINAL' ? '14 Jours (Confort)' : '30 Jours (Économie)'}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Réserves réparties entre le rez-de-chaussée (quai) et le 3e étage. Prévu pour les 8 membres de la famille.
              </p>
            </div>
            <div className="text-right shrink-0 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl">
              <span className="text-2xl font-black text-blue-700">{score}%</span>
              <p className="text-[10px] text-blue-600 font-semibold uppercase">Préparé</p>
            </div>
          </div>
        </div>

        {/* 2 Piliers Vitaux : Eau & Énergie */}
        <div className="grid grid-cols-2 gap-3">
          {/* Carte Réserve d'Eau */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-blue-700 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Droplets size={16} className="text-blue-600" />
                  <span>Réserve d&apos;Eau</span>
                </div>
                <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200">
                  {waterTank.currentLevelLiters} L
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-2 border border-slate-200/50">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${(waterTank.currentLevelLiters / waterTank.capacityLiters) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                <strong className="text-slate-900 text-sm font-bold">{daysWaterLeft} jours</strong> d&apos;eau potable
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ration : {dailyWaterTarget} L/jour au total
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
              <Link
                href="/water-mission"
                className="text-[11px] text-blue-700 font-bold flex items-center justify-between hover:text-blue-800 transition-colors"
              >
                <span>Aller chercher 30L</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </div>

          {/* Carte Énergie & Batterie */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between text-amber-700 mb-1.5">
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <BatteryCharging size={16} className="text-amber-600" />
                  <span>Batterie 1200Wh</span>
                </div>
                <span className="text-[11px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-lg border border-amber-200">
                  {battery.currentPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden my-2 border border-slate-200/50">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${battery.currentPercent}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-700 font-medium">
                <strong className="text-slate-900 text-sm font-bold">{batteryDaysLeft} jours</strong> d&apos;électricité
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Pour téléphones & lampes LED
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Solaire :</span>
              <span className="text-rose-600 font-semibold">À acquérir</span>
            </div>
          </div>
        </div>

        {/* Rubrique Famille & Statuts Opérationnels en Direct */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Users size={16} className="text-blue-600" />
              <span>Statuts du Foyer ({members.length})</span>
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
                const pill = STATUS_PILLS[currentStatus] || STATUS_PILLS.SECURISE;

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

                    {/* Menu rapide 1-clic pour basculer le statut */}
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

        {/* Modules Essentiels de la Maison */}
        <div className="space-y-2.5">
          {/* Module 1 : Provisions & Achats */}
          <Link
            href="/checklist"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center justify-center shrink-0">
                <PackageCheck size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Provisions, Nourriture & Matériel</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Lentilles, farine, conserves, 400kg de miel, gaz et bois de chauffage.
                </p>
              </div>
            </div>
            {pendingCritical > 0 ? (
              <span className="text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200 shrink-0">
                {pendingCritical} manquants
              </span>
            ) : (
              <ArrowRight size={16} className="text-slate-400 shrink-0" />
            )}
          </Link>

          {/* Module 2 : Mission d'Eau Rapide (30L / 60 min) */}
          <Link
            href="/water-mission"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/70 flex items-center justify-center shrink-0">
                <Droplets size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Points d&apos;Eau & Sortie 30L (60 min)</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mosquées, fontaines et hammams proches • Sortie à 3 personnes.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 shrink-0" />
          </Link>

          {/* Module 3 : Protection & Sécurité de l'Immeuble R+3 */}
          <Link
            href="/siege"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-rose-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 border border-rose-200/70 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Sécurité du Bâtiment & Voisinage</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Barricades, alarmes de porte, réserve tampon au 3e étage.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 shrink-0" />
          </Link>

          {/* Module 4 : Radio & Fréquences d'Urgence */}
          <Link
            href="/radio"
            className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-400 hover:shadow-sm transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70 flex items-center justify-center shrink-0">
                <Radio size={20} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Radio & Informations d&apos;Urgence</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fréquences nationales SNRT & Médi 1 FM • Messagerie locale de secours.
                </p>
              </div>
            </div>
            <ArrowRight size={16} className="text-slate-400 shrink-0" />
          </Link>
        </div>

        {/* Bouton d'Urgence SOS */}
        <div className="pt-1">
          <Link
            href="/sos"
            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
          >
            <AlertTriangle size={18} />
            Procédure d&apos;Urgence SOS
          </Link>
        </div>
      </main>
    </div>
  );
}

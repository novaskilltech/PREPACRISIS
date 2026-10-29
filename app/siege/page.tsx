'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/components/AppContext';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  Home,
  Users,
  EyeOff,
  Flame,
  Droplets,
  ArrowLeft,
  CheckSquare,
  Square,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  VolumeX,
  Lock,
  Zap,
  Info,
} from 'lucide-react';

export default function SiegePage() {
  const { mode, isLoaded } = useAppContext();

  // Paramètres du simulateur de rupture du voisinage
  const [districtType, setDistrictType] = useState<'POPULAIRE' | 'MOYEN' | 'AISE'>('POPULAIRE');
  const [waterCut, setWaterCut] = useState<boolean>(true);
  const [electricityBlackout, setElectricityBlackout] = useState<boolean>(true);
  const [cookingSignature, setCookingSignature] = useState<'DISCRETE' | 'ODORANTE'>('DISCRETE');
  const [currentCrisisDay, setCurrentCrisisDay] = useState<number>(1);

  // Checklist de préparation au siège
  const [siegeChecklist, setSiegeChecklist] = useState<{ [key: string]: boolean }>({
    tampon_eau_r3: false,
    tampon_nourriture_r3: false,
    tampon_sante_r3: false,
    barricade_quai_rdc: false,
    cales_alarme_120db: false,
    detecteur_pir_escalier: false,
    gel_poivre_torches_r3: false,
    blackout_fenetres: false,
    discipline_fumee_poele: false,
    chambre_repli_vulnerables: false,
  });

  // Chargement localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prepa_siege_checklist');
      if (saved) setSiegeChecklist(JSON.parse(saved));
    } catch (e) {
      console.warn('Erreur chargement checklist siège:', e);
    }
  }, []);

  const toggleCheck = (id: string) => {
    setSiegeChecklist((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('prepa_siege_checklist', JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  };

  if (!isLoaded) return null;

  let baseDays = districtType === 'POPULAIRE' ? 3.5 : districtType === 'MOYEN' ? 5.5 : 7.5;
  if (waterCut) baseDays -= 1.5;
  if (electricityBlackout) baseDays -= 1.0;
  if (cookingSignature === 'ODORANTE') baseDays -= 1.0;

  const criticalDay = Math.max(2, Math.round(baseDays));
  const dangerRangeStart = criticalDay;
  const dangerRangeEnd = criticalDay + 3;

  const getThreatStatus = () => {
    if (currentCrisisDay < dangerRangeStart - 1) {
      return {
        level: 'Calme & Entraide de Départ',
        color: 'text-emerald-800 bg-emerald-50 border-emerald-200',
        title: 'Phase 1 : Stupeur & Réserves Domestiques',
        desc: 'Les voisins consomment ce qu\'ils ont dans leur réfrigérateur. Pas de risque immédiat d\'intrusion.',
      };
    } else if (currentCrisisDay <= dangerRangeStart) {
      return {
        level: 'Tension & Recherche Active',
        color: 'text-amber-900 bg-amber-50 border-amber-200',
        title: 'Phase 2 : Pénurie & Repérage du Voisinage',
        desc: 'Frigos vides, hanouts fermés. Les voisins s\'observent, sentent les odeurs de cuisine et surveillent qui sort de l\'eau. Premières demandes insistantes à la porte.',
      };
    } else if (currentCrisisDay <= dangerRangeEnd) {
      return {
        level: 'Risque Élevé de Convoitise & Pillage',
        color: 'text-rose-900 bg-rose-50 border-rose-200',
        title: 'Phase 3 : Seuil de Faim Sévère',
        desc: 'La "règle des 9 repas sans manger" est atteinte. La morale sociale s\'effondre. Risque de forçage du rez-de-chaussée pour voler le stock.',
      };
    } else {
      return {
        level: 'Isolement & Vigilance Renforcée',
        color: 'text-purple-900 bg-purple-50 border-purple-200',
        title: 'Phase 4 : Émeutes Désespérées de Quartier',
        desc: 'Maintien strict de la citadelle au 3e étage. Défense de l\'escalier à distance sans sortir.',
      };
    }
  };

  const threat = getThreatStatus();
  const checkedCount = Object.values(siegeChecklist).filter(Boolean).length;
  const totalChecks = Object.keys(siegeChecklist).length;
  const readinessPercent = Math.round((checkedCount / totalChecks) * 100);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* Header Sticky Clair */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                <ShieldAlert size={16} className="text-rose-600" />
                Sécurité du Bâtiment & Voisinage
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Prévision d&apos;épuisement • Défense R+3 • Réserve tampon haut
              </p>
            </div>
          </div>

          <div className="text-right bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
            <span className="text-xs font-bold text-blue-700">
              {readinessPercent}%
            </span>
            <p className="text-[9px] text-blue-600 font-semibold uppercase">Prêt</p>
          </div>
        </div>
      </header>

      <main className="p-4 space-y-3.5">
        {/* 1. CALCULATEUR D'ÉPUISEMENT DU VOISINAGE */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase flex items-center gap-1.5">
              <Clock size={15} className="text-rose-600" />
              Estimation du Jour Critique (J-Day)
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Modèle sociologique de crise
            </span>
          </div>

          {/* Verdict du simulateur */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <p className="text-[11px] text-slate-500 font-medium uppercase">
              Période où les voisins auront vidé leurs réserves
            </p>
            <div className="text-3xl font-black text-rose-600 my-1">
              Jour J+{dangerRangeStart} à J+{dangerRangeEnd}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              C&apos;est à partir du <strong className="text-slate-900">{dangerRangeStart}e jour</strong> que les provisions ordinaires du quartier seront à zéro et que le risque de convoitise sur nos stocks sera le plus fort.
            </p>
          </div>

          {/* Curseurs de paramétrage du quartier */}
          <div className="space-y-3 pt-1 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Profil du Quartier :
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 font-semibold">
                <button
                  onClick={() => setDistrictType('POPULAIRE')}
                  className={`py-1.5 rounded-lg transition-all ${
                    districtType === 'POPULAIRE'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Populaire (3j)
                </button>
                <button
                  onClick={() => setDistrictType('MOYEN')}
                  className={`py-1.5 rounded-lg transition-all ${
                    districtType === 'MOYEN'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Mixte (5j)
                </button>
                <button
                  onClick={() => setDistrictType('AISE')}
                  className={`py-1.5 rounded-lg transition-all ${
                    districtType === 'AISE'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Résidentiel (7j)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setWaterCut(!waterCut)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  waterCut
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Droplets size={15} className="text-blue-600" />
                  <span className="font-semibold">Eau coupée</span>
                </div>
                <span className="text-[11px] font-bold">
                  {waterCut ? 'Oui (-1.5j)' : 'Non'}
                </span>
              </button>

              <button
                onClick={() => setElectricityBlackout(!electricityBlackout)}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  electricityBlackout
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Zap size={15} className="text-amber-600" />
                  <span className="font-semibold">Blackout</span>
                </div>
                <span className="text-[11px] font-bold">
                  {electricityBlackout ? 'Oui (-1j)' : 'Non'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. CHRONOLOGIE DE LA CRISE */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Users size={15} className="text-blue-600" />
              Évolution du Comportement des Voisins
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Jour actuel : J+{currentCrisisDay}
            </span>
          </div>

          {/* Curseur interactif du jour */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <input
              type="range"
              min="1"
              max="20"
              value={currentCrisisDay}
              onChange={(e) => setCurrentCrisisDay(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-medium mt-1">
              <span>J+1 (Départ)</span>
              <span>J+{criticalDay} (Rupture)</span>
              <span>J+14 (Isolement)</span>
              <span>J+20</span>
            </div>
          </div>

          {/* Carte d'état de menace */}
          <div className={`p-4 rounded-2xl border ${threat.color}`}>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current">
              {threat.level}
            </span>
            <h4 className="text-xs font-bold uppercase mt-2">{threat.title}</h4>
            <p className="text-xs mt-1 leading-relaxed opacity-95">{threat.desc}</p>
          </div>
        </div>

        {/* 3. LA RÈGLE CRITIQUE DU "TAMPON HAUT" (3e ÉTAGE) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase">
            <Home size={16} />
            <span>Règle Essentielle : Monter la Réserve au 3e Étage</span>
          </div>

          <div className="text-xs text-slate-700 leading-relaxed space-y-2.5">
            <p>
              ⚠️ <strong>Point vulnérable de la maison :</strong> Votre grand stock (cuve 500L, miel, bois, farine) se trouve au <strong>rez-de-chaussée (quai)</strong>. Si le rez-de-chaussée est forcé ou bloqué, votre famille au 3e étage ne doit pas se retrouver sans eau ni nourriture !
            </p>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-800">
              <p className="text-blue-800 font-bold">
                📦 Réserve à monter au 3e étage dès les premiers jours :
              </p>
              <p>• <strong>80 Litres d&apos;eau</strong> (16 bidons de 5L répartis dans les pièces)</p>
              <p>• <strong>30 boîtes de conserves cuisinées</strong> (haricots, thon, sardines)</p>
              <p>• <strong>10 kg de dattes + 10 kg de miel + 2 pots de ghee</strong></p>
              <p>• <strong>1 petit réchaud à gaz 3kg</strong> de secours</p>
              <p>• <strong>Tous les médicaments</strong> (Ventoline pour l&apos;asthme, trousse de secours)</p>
            </div>
            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              ✅ Grâce à ce stock au 3e étage, la famille peut vivre <strong>10 jours en toute autonomie</strong> sans avoir besoin de descendre au rez-de-chaussée.
            </p>
          </div>
        </div>

        {/* 4. DISPOSITIF DE DÉFENSE EN PROFONDEUR */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Lock size={15} className="text-blue-600" />
            Sécurisation des Accès de la Maison (R+3)
          </h3>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-900 block">1. Rez-de-Chaussée / Quai :</strong>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                Portes verrouillées par l&apos;intérieur avec bastaings. Cales bloque-portes avec alarme sonore 120 dB sous chaque porte. Clochettes aux gonds.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-900 block">2. La Cage d&apos;Escalier :</strong>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                Détecteur de mouvement au bas des marches qui sonne au 3e étage. En cas d&apos;intrusion, l&apos;équipe de défense reste en haut : <strong>jet de gel poivre OC à 5 mètres</strong> et <strong>lampe stroboscopique 2000 lumens</strong> pour aveugler sans contact physique.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <strong className="text-slate-900 block">3. Le 3e Étage (Refuge Familial) :</strong>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                Porte palière verrouillée. Les enfants, personnes vulnérables et aînés restent dans la chambre arrière, la plus calme et éloignée de la rue.
              </p>
            </div>
          </div>
        </div>

        {/* 5. CHECKLIST DE SÉCURITÉ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <CheckSquare size={15} className="text-emerald-600" />
              Checklist de Préparation ({checkedCount}/{totalChecks})
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {readinessPercent}% Prêt
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {[
              {
                id: 'tampon_eau_r3',
                label: 'Monter 80L d\'eau (16 bidons de 5L) au 3e étage',
                sub: '10 jours d\'eau potable en autarcie sans descendre au quai',
              },
              {
                id: 'tampon_nourriture_r3',
                label: 'Monter 30 conserves + 10kg dattes + 10kg miel au 3e',
                sub: 'Nourriture prête sans cuisson et sans odeur',
              },
              {
                id: 'tampon_sante_r3',
                label: 'Garder Ventoline et médicaments au 3e étage',
                sub: 'Médicaments d\'urgence et soins vitaux toujours à portée de main',
              },
              {
                id: 'barricade_quai_rdc',
                label: 'Barricader les portes du quai/RDC par bastaings',
                sub: 'Protection solide contre le forçage des accès bas',
              },
              {
                id: 'cales_alarme_120db',
                label: 'Glisser les cales bloque-porte 120dB sous les portes',
                sub: 'Alarme sonore immédiate en cas de poussée de l\'extérieur',
              },
              {
                id: 'detecteur_pir_escalier',
                label: 'Placer le détecteur de mouvement au bas de l\'escalier',
                sub: 'Sonne au 3e étage dès que quelqu\'un monte les marches',
              },
              {
                id: 'gel_poivre_torches_r3',
                label: 'Placer le Gel Poivre et lampes torches en haut des marches',
                sub: 'Prêt pour l\'équipe de veille pour neutraliser à distance',
              },
              {
                id: 'blackout_fenetres',
                label: 'Occulter les fenêtres du 3e étage (rideaux ou cartons)',
                sub: 'Aucune lumière visible de l\'extérieur la nuit',
              },
              {
                id: 'discipline_fumee_poele',
                label: 'Allumer le poêle de préférence la nuit avec du bois bien sec',
                sub: 'Évite les colonnes de fumée visibles en plein jour',
              },
              {
                id: 'chambre_repli_vulnrables',
                label: 'Aménager la chambre arrière pour les membres vulnérables',
                sub: 'Espace le plus sécurisé et à l\'abri du bruit de la rue',
              },
            ].map((task) => (
              <button
                key={task.id}
                onClick={() => toggleCheck(task.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  siegeChecklist[task.id]
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200/90 text-slate-800 hover:border-blue-400 shadow-xs'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${
                    siegeChecklist[task.id]
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {siegeChecklist[task.id] && <CheckSquare size={13} strokeWidth={3} />}
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      siegeChecklist[task.id] ? 'line-through text-slate-400' : 'text-slate-900'
                    }`}
                  >
                    {task.label}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{task.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

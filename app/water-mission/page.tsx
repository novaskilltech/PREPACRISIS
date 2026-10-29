'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAppContext, WaterPoint } from '@/components/AppContext';
import {
  Droplets,
  Clock,
  Play,
  Pause,
  RotateCcw,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Plus,
  Trash2,
  Shield,
  ArrowRight,
  Flame,
  ArrowLeft,
  Sparkles,
  Users,
  Footprints,
  Info,
  Check,
} from 'lucide-react';

export default function WaterMissionPage() {
  const {
    waterTank,
    waterPoints,
    addWaterPoint,
    deleteWaterPoint,
    addFetchedWaterToTank,
    isLoaded,
  } = useAppContext();

  // Chronomètre de mission (60 minutes = 3600 secondes)
  const [secondsLeft, setSecondsLeft] = useState<number>(3600);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedPoint, setSelectedPoint] = useState<WaterPoint | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('TOUS');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);

  // Formulaire d'ajout
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<WaterPoint['type']>('MOSQUEE');
  const [newDistance, setNewDistance] = useState<number>(800);
  const [newQuality, setNewQuality] = useState<WaterPoint['quality']>('POTABLE_DIRECT');
  const [newNotes, setNewNotes] = useState('');
  const [newAddress, setNewAddress] = useState('');

  // GPS en direct
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Timer loop
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  if (!isLoaded) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const elapsedSeconds = 3600 - secondsLeft;
  const elapsedMinutes = Math.floor(elapsedSeconds / 60);

  // Détermination de la phase actuelle
  const getMissionPhase = () => {
    if (!isRunning && secondsLeft === 3600) return 'Prêt au départ de l\'équipe';
    if (elapsedMinutes < 20) return 'Phase 1 : Marche aller vers le point d\'eau';
    if (elapsedMinutes < 35) return 'Phase 2 : Remplissage des 6 bidons (30L)';
    if (elapsedMinutes < 60) return 'Phase 3 : Marche retour avec les 30L (10 kg / pers)';
    return 'Délai de sécurité dépassé (> 60 min)';
  };

  const handleAcquireGps = () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setGpsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
          });
          setGpsLoading(false);
        },
        (err) => {
          console.warn('GPS error:', err);
          setGpsLoading(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const walkMins = Math.round((newDistance / 1000) * 15);
    const totalMins = walkMins * 2 + 12;

    addWaterPoint({
      name: newName.trim(),
      type: newType,
      distanceMeters: Number(newDistance),
      walkMinutesOneWay: walkMins,
      fillTimeMinutes: 12,
      totalRoundTripMinutes: totalMins,
      capacityInfo: 'Point de quartier ajouté',
      quality: newQuality,
      notes: newNotes.trim() || 'Point d\'eau repéré pour mission pédestre 30L.',
      isVerified: true,
      addressOrLandmark: newAddress.trim() || undefined,
    });

    setNewName('');
    setNewNotes('');
    setNewAddress('');
    setShowAddModal(false);
  };

  const handleConfirmMissionDone = () => {
    addFetchedWaterToTank(30);
    setIsRunning(false);
    setSecondsLeft(3600);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const filteredPoints = activeFilter === 'TOUS'
    ? waterPoints
    : waterPoints.filter((wp) => wp.type === activeFilter);

  const sortedPoints = [...filteredPoints].sort((a, b) => a.distanceMeters - b.distanceMeters);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* Toast de succès */}
      {showSuccessToast && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-start gap-3 border border-emerald-500 animate-in slide-in-from-top-4">
          <CheckCircle2 size={24} className="shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Mission Validée avec Succès !</h4>
            <p className="text-xs text-emerald-100 mt-0.5">
              +30 Litres ajoutés à la réserve d&apos;eau du foyer.
            </p>
            <div className="mt-2 text-xs bg-emerald-700/80 p-2.5 rounded-xl font-medium">
              💡 <strong>Rappel Désinfection :</strong> Versez <strong>3 mL de Javel</strong> (1/2 cuillère à café) ou 3 pastilles Aquatabs dans les 30L avant de transvaser dans la cuve.
            </div>
          </div>
        </div>
      )}

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
                <Droplets size={16} className="text-blue-600" />
                Sortie Eau : 30L en 60 Minutes
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Rayon 1,5 km • 3 personnes • 2 bidons de 5L chacun
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>Ajouter</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-3.5">
        {/* 1. FICHE BRIEFING OPÉRATIONNEL */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-blue-700 uppercase">
              Organisation de la Sortie
            </span>
            <span className="text-xs font-bold text-slate-700">
              Réserve actuelle : <strong className="text-blue-700">{waterTank.currentLevelLiters} L</strong> / 500 L
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Users size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-slate-500 uppercase">Équipe</p>
              <p className="text-xs font-bold text-slate-900">3 Personnes</p>
              <p className="text-[10px] text-slate-500">Karim, Youssef, Salma</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Droplets size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="text-[10px] text-slate-500 uppercase">Quantité</p>
              <p className="text-xs font-bold text-blue-700">30 Litres</p>
              <p className="text-[10px] text-slate-500">2 bidons 5L / pers</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Clock size={16} className="text-rose-600 mx-auto mb-1" />
              <p className="text-[10px] text-slate-500 uppercase">Durée Totale</p>
              <p className="text-xs font-bold text-rose-700">60 Minutes</p>
              <p className="text-[10px] text-slate-500">Aller, remplissage & retour</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200/70 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2.5">
            <Info size={16} className="text-blue-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Calcul de sécurité :</strong> 15 minutes sont allouées au remplissage sur place, laissant <strong>45 minutes de marche totale (22 min aller, 22 min retour)</strong>. La distance maximale conseillée à pied est de <strong>1,5 km aller simple</strong>.
            </p>
          </div>
        </div>

        {/* 2. CHRONOMÈTRE DE MISSION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Clock size={15} className="text-blue-600" />
              Chronomètre de Mission (60 Minutes)
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isRunning
                  ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {isRunning ? 'EN COURS' : 'EN ATTENTE'}
            </span>
          </div>

          {/* Affichage Chiffres */}
          <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div
              className={`text-5xl font-black tracking-tight ${
                secondsLeft <= 600
                  ? 'text-rose-600'
                  : secondsLeft <= 1800
                  ? 'text-amber-600'
                  : 'text-blue-700'
              }`}
            >
              {formatTime(secondsLeft)}
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {getMissionPhase()}
            </p>
          </div>

          {/* Barre de Progression */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200/50">
            <div
              className={`h-full transition-all ${
                secondsLeft <= 600
                  ? 'bg-rose-600'
                  : secondsLeft <= 1800
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${(secondsLeft / 3600) * 100}%` }}
            ></div>
          </div>

          {/* Boutons de Contrôle */}
          <div className="flex gap-2">
            {!isRunning ? (
              <button
                onClick={() => setIsRunning(true)}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Play size={15} />
                <span>Démarrer le Chrono (Départ)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsRunning(false)}
                className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Pause size={15} />
                <span>Pause</span>
              </button>
            )}

            <button
              onClick={() => {
                setIsRunning(false);
                setSecondsLeft(3600);
              }}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-slate-200"
              title="Réinitialiser"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Bouton Validation Retour */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={handleConfirmMissionDone}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <CheckCircle2 size={16} />
              <span>Valider le Retour : +30 Litres Rapportés</span>
            </button>
          </div>
        </div>

        {/* 3. CALCULATEUR DU PÉRIMÈTRE & FAISABILITÉ */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Footprints size={15} className="text-blue-600" />
              Faisabilité à Pied selon la Distance
            </h3>
            <button
              onClick={handleAcquireGps}
              disabled={gpsLoading}
              className="text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
            >
              <Navigation size={12} className={gpsLoading ? 'animate-spin' : ''} />
              <span>{gpsCoords ? `${gpsCoords.lat}, ${gpsCoords.lng}` : 'Ma Position GPS'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-center">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                Moins de 1,2 km
              </span>
              <p className="font-bold text-slate-900 mt-0.5">30 à 45 min</p>
              <p className="text-[10px] text-emerald-700 mt-0.5">Idéal & sécurisé</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">
                1,2 à 1,5 km
              </span>
              <p className="font-bold text-slate-900 mt-0.5">48 à 58 min</p>
              <p className="text-[10px] text-amber-700 mt-0.5">Limite tolérée</p>
            </div>
            <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
              <span className="text-[10px] font-bold text-rose-800 uppercase block">
                Plus de 1,6 km
              </span>
              <p className="font-bold text-slate-900 mt-0.5">&gt; 65 min</p>
              <p className="text-[10px] text-rose-700 mt-0.5">Trop loin à pied</p>
            </div>
          </div>
        </div>

        {/* 4. POINTS D'EAU (< 3 KM) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin size={15} className="text-blue-600" />
              Points d&apos;Eau Proches ({sortedPoints.length})
            </h3>

            {/* Filtres par type */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {['TOUS', 'MOSQUEE', 'SAQAYA', 'HAMMAM', 'PUITS'].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === f
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5">
            {sortedPoints.map((wp) => {
              const isOvertime = wp.totalRoundTripMinutes > 60;
              const isNearLimit = wp.totalRoundTripMinutes > 45 && wp.totalRoundTripMinutes <= 60;

              return (
                <div
                  key={wp.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs hover:border-slate-300 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {wp.type}
                        </span>

                        {wp.quality === 'POTABLE_DIRECT' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                            Potable direct
                          </span>
                        )}
                        {wp.quality === 'JAVEL_OBLIGATOIRE' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            + Javel requise (3 mL / 30L)
                          </span>
                        )}
                        {wp.quality === 'FILTRATION_LOURDE' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Filtration 0.1µm + Javel
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 mt-1.5">
                        {wp.name}
                      </h4>
                      {wp.addressOrLandmark && (
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin size={12} className="text-blue-600 shrink-0" />
                          <span>{wp.addressOrLandmark}</span>
                        </p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-slate-900 block">
                        {wp.distanceMeters < 1000
                          ? `${wp.distanceMeters} m`
                          : `${(wp.distanceMeters / 1000).toFixed(2)} km`}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                          isOvertime
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isNearLimit
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        ~{wp.totalRoundTripMinutes} min A/R
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {wp.notes}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>
                      Capacité : <strong className="text-slate-800">{wp.capacityInfo}</strong>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedPoint(wp);
                          setSecondsLeft(3600);
                          setIsRunning(true);
                        }}
                        className="text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <span>Choisir ce point</span>
                        <ArrowRight size={13} />
                      </button>

                      {wp.id.startsWith('wp_') && (
                        <button
                          onClick={() => deleteWaterPoint(wp.id)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                          title="Supprimer"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. PROTOCOLE DÉCONTAMINATION */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <Flame size={16} className="text-blue-600" />
            <span>Comment Désinfecter les 30 Litres au Retour</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                Option 1 : Javel classique 2,6%
              </span>
              <p className="font-bold text-slate-900 mt-1">3 mL de Javel</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Soit 1/2 cuillère à café dans les 30L. Attendre 30 min.
              </p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[11px] font-bold text-blue-800 uppercase block">
                Option 2 : Ébullition Poêle
              </span>
              <p className="font-bold text-slate-900 mt-1">1 minute à gros bouillons</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sur le poêle à bois pour Kenza (enceinte) et Aïcha.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Ajout Point d'Eau */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-4 space-y-3 shadow-xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase text-slate-900 flex items-center gap-1.5">
                <Plus size={15} className="text-blue-600" />
                Ajouter un Point d&apos;Eau du Quartier
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-800 text-xs font-medium"
              >
                Fermer
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Nom du point d&apos;eau *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Mosquée Al Qods, Hammam An-Nour, Puits de la résidence"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Type de source
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  >
                    <option value="MOSQUEE">Mosquée (Ablutions)</option>
                    <option value="SAQAYA">Saqaya (Fontaine)</option>
                    <option value="HAMMAM">Hammam (Chaudière)</option>
                    <option value="PUITS">Puits / Forage</option>
                    <option value="PUBLIC">Bâtiment Public</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 font-medium block mb-1">
                    Distance à pied (mètres)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="3000"
                    step="50"
                    value={newDistance}
                    onChange={(e) => setNewDistance(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Qualité de l&apos;eau
                </label>
                <select
                  value={newQuality}
                  onChange={(e) => setNewQuality(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value="POTABLE_DIRECT">Potable direct (Réseau d&apos;eau saine)</option>
                  <option value="JAVEL_OBLIGATOIRE">Traitement Javel obligatoire (Hammam / Bâche)</option>
                  <option value="FILTRATION_LOURDE">Filtration 0.1µm requise (Puits)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Adresse ou repère
                </label>
                <input
                  type="text"
                  placeholder="Ex : Derrière la pharmacie, en face du boucher"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 font-medium block mb-1">
                  Notes & consignes
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex : Robinet extérieur accessible 24/7"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

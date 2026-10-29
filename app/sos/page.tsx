'use client';

import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '@/components/AppContext';
import { AlertTriangle, Volume2, VolumeX, Navigation, Copy, MessageSquare, ShieldAlert, Check, PhoneCall, Share2 } from 'lucide-react';

export default function SOSPage() {
  const { addLocalMessage, emergencyPlan } = useAppContext();
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number; time: string } | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour démarrer la sirène sonore Web Audio
  const startSiren = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, ctx.currentTime);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;

      // Modulation bitonale alarme sécurité civile (800 Hz / 1200 Hz)
      let high = false;
      intervalRef.current = setInterval(() => {
        if (oscillatorRef.current && ctx) {
          high = !high;
          oscillatorRef.current.frequency.setValueAtTime(high ? 1200 : 800, ctx.currentTime);
        }
      }, 500);
    } catch (e) {
      console.warn('Web Audio not allowed or error:', e);
    }
  };

  const stopSiren = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      } catch (e) {}
      oscillatorRef.current = null;
    }
  };

  // Récupération de la position GPS satellite
  const fetchLocation = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('La géolocalisation satellite n\'est pas disponible sur cet appareil.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
          time: new Date().toLocaleTimeString(),
        });
        setGpsLoading(false);
      },
      (err) => {
        setGpsLoading(false);
        setGpsError(`Erreur GPS: ${err.message}. Assurez-vous d'être proche d'une fenêtre.`);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    fetchLocation();
    return () => {
      stopSiren();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Déclenchement de l'alerte
  const triggerSOS = () => {
    const nextState = !isAlertActive;
    setIsAlertActive(nextState);

    if (nextState) {
      fetchLocation();
      if (soundEnabled) {
        startSiren();
      }
      // Diffusion sur le réseau local Wi-Fi
      const gpsTxt = coords ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}` : 'Position en cours d\'acquisition';
      addLocalMessage(`🚨 ALERTE SOS ACTIVÉE - Besoin de secours immédiat ! ${gpsTxt}`, true);
    } else {
      stopSiren();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (!next) {
      stopSiren();
    } else if (isAlertActive) {
      startSiren();
    }
  };

  const [shared, setShared] = useState(false);

  const mapsLink = coords
    ? `https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}`
    : '';

  const smsText = `URGENCE SOS - Famille PrépaCrisis (Maroc) - Besoin d'aide immédiate. Position GPS : ${
    coords ? `${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)} (Précision: ${coords.accuracy}m)` : 'Non fixée'
  }${mapsLink ? ` - Carte : ${mapsLink}` : ''}${emergencyPlan.outOfZoneContactPhone ? ` - Contact ICE: ${emergencyPlan.outOfZoneContactPhone}` : ''}`;

  const shareText = coords
    ? `🚨 ALERTE SOS PRÉPACRISIS (MAROC)\nBesoin d'aide immédiate.\n📍 Coordonnées GPS : ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)} (Précision : ${coords.accuracy}m)\n🗺️ Lien Carte : https://maps.google.com/?q=${coords.lat.toFixed(6)},${coords.lng.toFixed(6)}\nFix relevé le : ${coords.time}`
    : `🚨 ALERTE SOS PRÉPACRISIS (MAROC)\nBesoin d'aide immédiate.`;

  const handleShareGPS = async () => {
    if (!coords) {
      fetchLocation();
      return;
    }

    const shareData = {
      title: '🚨 URGENCE SOS - Position GPS PrépaCrisis',
      text: shareText,
      url: mapsLink || undefined,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setShared(true);
        setTimeout(() => setShared(false), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-y-auto pb-24 transition-colors duration-500 ${
      isAlertActive ? 'bg-rose-50/70' : 'bg-slate-50'
    }`}>
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-2xs">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                Bouton SOS & Alerte
              </h1>
              <p className="text-xs text-slate-500">Diffusion Locale & Balise Satellite</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs ${
              soundEnabled
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                : 'bg-rose-50 border-rose-200 text-rose-600'
            }`}
            aria-label="Activer/Couper la sirène"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{soundEnabled ? 'Son actif' : 'Muet'}</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* Gros Bouton SOS Déclencheur Ergonomique pour tous les âges */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col items-center justify-center text-center">
          <button
            onClick={triggerSOS}
            style={{ backgroundColor: isAlertActive ? '#b91c1c' : '#dc2626' }}
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center font-bold text-white transition-all shadow-xl active:scale-95 cursor-pointer ${
              isAlertActive
                ? 'ring-8 ring-red-300 animate-pulse'
                : 'hover:brightness-110 ring-8 ring-red-100 shadow-red-200'
            }`}
          >
            <AlertTriangle size={48} className="mb-2 text-white" />
            <span className="text-xl font-extrabold tracking-wide text-white">
              {isAlertActive ? 'ARRÊTER' : 'SOS ALERTE'}
            </span>
            <span className="text-[11px] font-semibold text-red-100 mt-1 px-2">
              {isAlertActive ? 'Alarme en cours' : 'Appuyer pour lancer'}
            </span>
          </button>

          {isAlertActive ? (
            <div className="mt-4 p-3 bg-rose-100 border border-rose-300 rounded-xl text-rose-900 text-xs font-bold animate-pulse">
              🚨 Signal d&apos;urgence diffusé sur le réseau local et sirène activée !
            </div>
          ) : (
            <p className="text-xs text-slate-600 mt-4 max-w-sm font-medium">
              En cas de danger immédiat, appuyez sur ce bouton. Une alarme sonore retentit et un signal est transmis à toute la famille.
            </p>
          )}
        </div>

        {/* Coordonnées GPS Satellites Autonomes */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
              <Navigation size={16} className="text-blue-600" />
              <span>Position GPS Satellite (Hors Réseau 4G)</span>
            </div>
            <button
              onClick={fetchLocation}
              disabled={gpsLoading}
              className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
            >
              {gpsLoading ? 'Acquisition...' : 'Actualiser'}
            </button>
          </div>

          {gpsError && (
            <p className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
              {gpsError}
            </p>
          )}

          {coords ? (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Latitude</span>
                <span className="text-slate-900 font-bold text-sm font-mono">{coords.lat.toFixed(6)}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-semibold uppercase block">Longitude</span>
                <span className="text-slate-900 font-bold text-sm font-mono">{coords.lng.toFixed(6)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                Précision : <strong className="text-emerald-700 font-semibold">{coords.accuracy} m</strong>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                Fix relevé : <strong className="text-slate-800 font-semibold">{coords.time}</strong>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-500 border border-slate-200">
              Recherche des satellites GPS en cours...
            </div>
          )}

          {/* Actions d'Envoi & Partage de Position */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleShareGPS}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
            >
              {shared ? <Check size={16} className="text-white" /> : <Share2 size={16} />}
              <span>{shared ? 'Position partagée !' : 'Partager la Position GPS (WhatsApp / SMS / Mesh)'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer shadow-2xs"
              >
                {copied ? <Check size={14} className="text-emerald-700" /> : <Copy size={14} />}
                <span>{copied ? 'Copié !' : 'Copier Coordonnées'}</span>
              </button>

              <a
                href={`sms:${emergencyPlan.outOfZoneContactPhone || ''}?body=${encodeURIComponent(smsText)}`}
                style={{ backgroundColor: '#dc2626' }}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all text-center shadow-xs cursor-pointer"
              >
                <MessageSquare size={14} />
                <span>Préparer SMS ICE</span>
              </a>
            </div>
          </div>
        </div>

        {/* Rappel des Numéros d'Urgence Officiels Maroc */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <PhoneCall size={16} className="text-slate-700" />
            <h3 className="text-xs font-bold text-slate-900 uppercase">Numéros d&apos;Urgence Maroc</h3>
          </div>
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <a
              href="tel:15"
              className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-rose-800 transition-colors"
            >
              <span className="text-base font-extrabold block">15</span>
              <span className="text-[10px] text-rose-700 font-medium">Pompiers / SAMU</span>
            </a>
            <a
              href="tel:19"
              className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-800 transition-colors"
            >
              <span className="text-base font-extrabold block">19</span>
              <span className="text-[10px] text-blue-700 font-medium">Police Urbaine</span>
            </a>
            <a
              href="tel:177"
              className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-emerald-800 transition-colors"
            >
              <span className="text-base font-extrabold block">177</span>
              <span className="text-[10px] text-emerald-700 font-medium">Gendarmerie Royale</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

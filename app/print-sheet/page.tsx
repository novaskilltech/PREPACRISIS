'use client';

import { useAppContext } from '@/components/AppContext';
import Link from 'next/link';
import { Printer, ArrowLeft, ShieldAlert, Radio, Droplets, Shield, Flame, Heart, AlertTriangle, PhoneCall } from 'lucide-react';

export default function PrintSheetPage() {
  const { emergencyPlan, waterTank, mode } = useAppContext();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100 p-2 sm:p-6 text-slate-900 font-sans">
      {/* Barre d'action supérieure - Masquée lors de l'impression papier/PDF */}
      <div className="print:hidden max-w-4xl mx-auto mb-6 flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Retour au Tableau de Bord</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <Printer size={16} />
            <span>Imprimer la Fiche ou Enregistrer en PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* FEUILLE A4 RÉFLEXE DE SÉCURITÉ CIVILE */}
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl border border-slate-300 shadow-md print:shadow-none print:border-none print:p-0 print:m-0 print:max-w-none">
        
        {/* EN-TÊTE OFFICIEL DE SECOURS */}
        <header className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-slate-900 text-white text-xs font-black px-2 py-0.5 uppercase tracking-wider rounded">
                  DOCUMENT DE SECOURS CIVILE
                </span>
                <span className="text-xs text-slate-500 font-bold">Royaume du Maroc • Plan Familial</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1 uppercase font-mono">
                PRÉPACRISIS — Fiche Réflexe d&apos;Urgence & Survie
              </h1>
              <p className="text-xs text-slate-600 font-medium">
                Foyer 8 personnes (2 seniors, 4 adultes dont Kenza enceinte 6e mois, 2 ados) • Bâtiment R+3 (Logement 3e étage + Quai RDC)
              </p>
            </div>
            <div className="text-right text-xs font-mono">
              <span className="font-bold block">Édition du {currentDate}</span>
              <span className="text-[10px] text-slate-500 block">Autonomie visée : {mode === '14D_NOMINAL' ? '14 Jours' : '30 Jours'}</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300 font-bold mt-1 inline-block">
                À afficher au SAS d&apos;entrée
              </span>
            </div>
          </div>
        </header>

        {/* GRILLE 2 COLONNES DE PROTOCOLES CRITIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* BLOC 1 : NUMÉROS D'URGENCE & ICE */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <PhoneCall size={14} className="text-rose-600" />
              <span>1. Numéros d&apos;Urgence Maroc & Contact ICE</span>
            </h2>
            <div className="grid grid-cols-3 gap-2 text-center mb-2 font-mono">
              <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
                <span className="text-base font-black text-rose-700 block">15</span>
                <span className="text-[9px] text-slate-600">Pompiers/SAMU</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
                <span className="text-base font-black text-blue-700 block">19</span>
                <span className="text-[9px] text-slate-600">Police Urbaine</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
                <span className="text-base font-black text-emerald-700 block">177</span>
                <span className="text-[9px] text-slate-600">Gendarmerie</span>
              </div>
            </div>
            <div className="space-y-1 text-[11px] leading-tight">
              <p><strong>Contact Hors-Zone (ICE) :</strong> {emergencyPlan.outOfZoneContactName} ({emergencyPlan.outOfZoneContactPhone})</p>
              <p><strong>Ralliement Primaire :</strong> {emergencyPlan.meetingPointPrimary}</p>
              <p><strong>Repli Secondaire :</strong> {emergencyPlan.meetingPointSecondaryRural}</p>
            </div>
          </div>

          {/* BLOC 2 : FRÉQUENCES RADIO SÉCURITÉ CIVILE */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <Radio size={14} className="text-blue-600" />
              <span>2. Fréquences Radio d&apos;Urgence (Poste à piles/manivelle)</span>
            </h2>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>SNRT Al Idaa Al Watania (Rabat / Casa) :</span>
                <strong className="font-mono text-slate-900">99.0 / 100.8 FM</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Médi 1 Radio (Info Continue) :</span>
                <strong className="font-mono text-slate-900">105.7 / 93.9 FM</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span>Fès (91.0 FM) • Marrakech (89.3 FM) • Tanger :</span>
                <strong className="font-mono text-slate-900">97.5 FM</strong>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-1.5 rounded text-[10px] text-blue-900 font-bold">
                📡 ONDES MOYENNES (AM) NATIONALES : <strong>594 kHz & 612 kHz AM</strong> (Portée {'>'} 500 km même en blackout total).
              </div>
            </div>
          </div>

          {/* BLOC 3 : DOSAGE JAVEL & STÉRILISATION D'EAU */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <Droplets size={14} className="text-blue-600" />
              <span>3. Stérilisation de l&apos;Eau à la Javel (2,6% Chlore Actif)</span>
            </h2>
            <p className="text-[10px] text-slate-600 mb-1.5">
              Utiliser exclusivement de l&apos;eau de Javel pure standard (sans parfum ni additif).
            </p>
            <table className="w-full text-[11px] text-left border-collapse mb-1.5">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold text-[10px]">
                  <th className="py-1">Contenant</th>
                  <th className="py-1">Dose Javel</th>
                  <th className="py-1">Temps de Repos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-1">Bouteille 5 Litres</td>
                  <td className="py-1 font-bold text-slate-900 font-mono">0,5 mL (~10 gouttes)</td>
                  <td className="py-1">30 minutes minimum</td>
                </tr>
                <tr>
                  <td className="py-1">Mission 30 Litres (6x 5L)</td>
                  <td className="py-1 font-bold text-slate-900 font-mono">3 mL (~1/2 c. à café)</td>
                  <td className="py-1">30 minutes minimum</td>
                </tr>
                <tr>
                  <td className="py-1">Cuve Fût 500 Litres (RDC)</td>
                  <td className="py-1 font-bold text-slate-900 font-mono">50 mL (~1 verre à thé)</td>
                  <td className="py-1">Aérer 24h avant boisson</td>
                </tr>
              </tbody>
            </table>
            <div className="text-[10px] bg-slate-100 p-1.5 rounded text-slate-700">
              ⚠️ Si eau de pluie ou trouble : filtrer d&apos;abord sur tissu ou filtre céramique avant d&apos;ajouter la Javel.
            </div>
          </div>

          {/* BLOC 4 : MISSION COMMANDO EAU 30L / 60 MIN */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <Shield size={14} className="text-emerald-600" />
              <span>4. Mission Commando Eau (30 Litres / 60 Min Total)</span>
            </h2>
            <div className="space-y-1.5 text-[11px]">
              <p><strong>Équipe :</strong> 3 personnes valides (Karim, Youssef, Salma).</p>
              <p><strong>Charge :</strong> 2 bouteilles de 5L par personne = 6 bouteilles = 30 Litres au total.</p>
              <p><strong>Objectif Temps :</strong> 15 min marche aller, 15 min remplissage, 25 min retour chargé = &lt; 55 minutes.</p>
              <p><strong>Points d&apos;eau prioritaires :</strong></p>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-slate-700">
                <li>Grande Mosquée de Quartier (550m, robinets ablutions & citerne).</li>
                <li>Saqaya / Fontaine Publique Bab (900m, source continue).</li>
                <li>Hammam traditionnel (1,2 km, immense citerne - Javel obligatoire).</li>
              </ul>
              <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded text-[10px] text-emerald-900 font-bold">
                ✓ Sortir impérativement à l&apos;aube (06h00). Rester groupés. Aucun signe d&apos;opulence.
              </div>
            </div>
          </div>

          {/* BLOC 5 : DÉFENSE & RÈGLES DE SIÈGE (R+3) */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <ShieldAlert size={14} className="text-amber-600" />
              <span>5. Procédure de Siège & Défense de l&apos;Immeuble R+3</span>
            </h2>
            <div className="space-y-1 text-[11px] leading-tight">
              <p><strong>Point de rupture du voisinage :</strong> Prévu à partir de J+4 / J+5 de rupture logistique.</p>
              <p><strong>Discrétion lumineuse :</strong> Rideaux occultants hermétiques dès 19h00. Zéro lumière visible de la rue.</p>
              <p><strong>Discrétion olfactive :</strong> Zéro barbecue ni cuisson odorante le soir. Utiliser le poêle à bois ou réchaud gaz tôt le matin.</p>
              <p><strong>Sas d&apos;alerte :</strong> Carillons et cales bloque-portes 120 dB installés au quai RDC et bas d&apos;escalier.</p>
              <p><strong>Choke-Point escalier :</strong> Défense prioritaire au 3e étage (hauteur, bombe gel poivre 300ml à portée de main).</p>
            </div>
          </div>

          {/* BLOC 6 : TOILETTES SÈCHES & HYGIÈNE DE CRISE */}
          <div className="border border-slate-300 rounded-xl p-3 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <Heart size={14} className="text-purple-600" />
              <span>6. Toilettes Sèches (Coupure Eau & Assainissement)</span>
            </h2>
            <div className="space-y-1 text-[11px] leading-tight">
              <p className="font-bold text-rose-700">🚫 INTERDICTION DE TIRER LA CHASSE : Gaspille 9 à 12L d&apos;eau et obstrue les canalisations.</p>
              <p><strong>Seau 1 (Liquides) :</strong> Uriner dans le 1er seau dédié sans papier (évacuation extérieure nocturne facile).</p>
              <p><strong>Seau 2 (Solides) :</strong> Défécation dans seau avec sac plastique étanche épais (100µm).</p>
              <p><strong>Neutralisation :</strong> Recouvrir immédiatement d&apos;une poignée de sciure sèche ou de cendres tamisées du poêle à bois (zéro odeur, neutralise les bactéries).</p>
            </div>
          </div>

          {/* BLOC 7 : VIVRES, CUISSON & POÊLE À BOIS */}
          <div className="border border-slate-300 rounded-xl p-3 md:col-span-2 print-avoid-break">
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1.5 mb-2">
              <Flame size={14} className="text-orange-600" />
              <span>7. Stratégie Vivres, Cuisson Sans Eau & Poêle à Bois</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
              <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">Poêle à Bois & Chauffage</span>
                <p className="text-[10px] text-slate-600">
                  1 Tonne de bois sec stockée au garage sur palettes. Permet de chauffer tout l&apos;appartement R+3 et cuire/stériliser les marmites d&apos;eau sans gaz. Détecteur CO vérifié.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">Conserves Hydratées</span>
                <p className="text-[10px] text-slate-600">
                  Sardines, thon, haricots, pois chiches en boîte. Ne jamais jeter le liquide : il remplace l&apos;eau de cuisson et hydrate le foyer directement.
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 p-2 rounded">
                <span className="font-bold text-slate-900 block mb-0.5">Ghee, Graisse & Troc Miel</span>
                <p className="text-[10px] text-slate-600">
                  Ghee purifié (beurre sans caséine) en bocaux verre scellés + suif fondu. Réserve de miel : usage médical/antiseptique et monnaie de troc de haute valeur auprès des voisins.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* PIED DE PAGE IMPRIMABLE */}
        <footer className="mt-4 pt-3 border-t border-slate-200 text-center text-[10px] text-slate-500 flex justify-between items-center font-mono">
          <span>PrépaCrisis PWA • Système Décentralisé 100% Autonome</span>
          <span>Conserver ce document physique dans une pochette étanche avec la boîte à outils de crise</span>
        </footer>

      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useAppContext } from '@/components/AppContext';
import { Radio, MessageSquare, Send, Wifi, AlertTriangle, ShieldCheck, Globe, Signal, Info } from 'lucide-react';

const radioFrequenciesMaroc = [
  {
    city: 'Rabat & Région',
    stations: [
      { name: 'SNRT Al Idaa Al Watania (Nationale)', freq: '99.0 FM', type: 'Officiel Sécurité Civile' },
      { name: 'Médi 1 Radio', freq: '105.7 FM', type: 'Information Continue' },
      { name: 'Radio 2M', freq: '98.0 FM', type: 'Actualités' },
      { name: 'RFI (Français)', freq: '94.4 FM', type: 'International' },
    ],
  },
  {
    city: 'Casablanca & Littoral',
    stations: [
      { name: 'SNRT Al Idaa Al Watania', freq: '100.8 FM', type: 'Officiel Sécurité Civile' },
      { name: 'Médi 1 Radio', freq: '93.9 FM', type: 'Information Continue' },
      { name: 'Radio 2M', freq: '93.1 FM', type: 'Actualités' },
    ],
  },
  {
    city: 'Fès & Meknès',
    stations: [
      { name: 'SNRT Al Idaa Al Watania', freq: '91.0 FM', type: 'Officiel Sécurité Civile' },
      { name: 'Médi 1 Radio', freq: '101.4 FM', type: 'Information Continue' },
    ],
  },
  {
    city: 'Marrakech & Sud',
    stations: [
      { name: 'SNRT Al Idaa Al Watania', freq: '89.3 FM', type: 'Officiel Sécurité Civile' },
      { name: 'Médi 1 Radio', freq: '105.3 FM', type: 'Information Continue' },
    ],
  },
  {
    city: 'Tanger & Détroit',
    stations: [
      { name: 'Médi 1 Radio (Émetteur Principal)', freq: '97.5 FM', type: 'Information Continue' },
      { name: 'SNRT Al Idaa Al Watania', freq: '104.5 FM', type: 'Officiel' },
    ],
  },
  {
    city: 'Royaume Entier (Ondes Moyennes AM Secours)',
    stations: [
      { name: 'SNRT AM (Couverture Nationale Totale)', freq: '594 kHz / 612 kHz AM', type: 'Ondes Moyennes Portée > 500 km' },
    ],
  },
];

export default function RadioCommsPage() {
  const { localMessages, addLocalMessage, isLoaded } = useAppContext();
  const [activeTab, setActiveTab] = useState<'RADIO' | 'CHAT'>('RADIO');
  const [chatInput, setChatInput] = useState('');

  if (!isLoaded) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    addLocalMessage(chatInput.trim(), false);
    setChatInput('');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 bg-slate-50">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
              <Radio size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-900">
                Radio & Communications
              </h1>
              <p className="text-xs text-slate-500">Réseau Local Immeuble & Ondes d&apos;Urgence Maroc</p>
            </div>
          </div>
        </div>

        {/* Onglets Comms */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80 max-w-2xl mx-auto w-full">
          <button
            onClick={() => setActiveTab('RADIO')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'RADIO'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Signal size={15} />
            <span>Fréquences FM / AM</span>
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'CHAT'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wifi size={15} />
            <span>Chat Wi-Fi Local ({localMessages.length})</span>
          </button>
        </div>
      </header>

      <main className="p-4 space-y-4 max-w-2xl mx-auto w-full">
        {/* ONGLET 1 : FRÉQUENCES RADIO MAROC (HORS LIGNE TOTAL) */}
        {activeTab === 'RADIO' && (
          <div className="space-y-4">
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase mb-1.5">
                <AlertTriangle size={16} className="text-amber-600" />
                <span>Règle d&apos;or en cas de coupure Internet & 4G</span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Si les télécoms sont coupés, le transistor à piles ou à manivelle devient le canal vital de sécurité civile. Réglez la radio sur ces fréquences officielles selon votre zone :
              </p>
            </div>

            {/* Liste des Fréquences par Région */}
            <div className="space-y-3">
              {radioFrequenciesMaroc.map((region, idx) => (
                <div key={idx} className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight flex items-center gap-1.5">
                    <Globe size={15} className="text-blue-600" />
                    <span>{region.city}</span>
                  </h3>
                  <div className="space-y-2">
                    {region.stations.map((st, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80 hover:bg-slate-100/70 transition-colors"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{st.name}</p>
                          <p className="text-[11px] text-slate-500">{st.type}</p>
                        </div>
                        <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
                          {st.freq}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 2 : CHAT LOCAL WI-FI (HORS INTERNET) */}
        {activeTab === 'CHAT' && (
          <div className="space-y-3">
            <div className="bg-emerald-50/80 border border-emerald-200 p-3.5 rounded-2xl text-xs text-emerald-900 flex items-center gap-2.5 shadow-xs">
              <Wifi size={18} className="text-emerald-600 shrink-0" />
              <span>
                Messagerie locale sécurisée : fonctionne sur le routeur Wi-Fi de l&apos;immeuble même si l&apos;accès à Internet extérieur est coupé.
              </span>
            </div>

            {/* Formulaire d'Envoi */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Message interne pour la famille..."
                className="flex-1 bg-white border border-slate-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center transition-all shadow-xs"
              >
                <Send size={15} />
              </button>
            </form>

            {/* Fil des Messages */}
            <div className="space-y-2 mt-3">
              {localMessages.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-white border border-slate-200 rounded-2xl p-6">
                  Aucun message pour le moment. Envoyez un mot pour tester la liaison locale.
                </div>
              ) : (
                localMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border text-xs leading-relaxed shadow-xs ${
                      msg.isUrgent
                        ? 'bg-rose-50 border-rose-200 text-rose-900'
                        : 'bg-white border-slate-200/90 text-slate-800'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[11px] text-slate-500 font-medium mb-1">
                      <span className={`font-bold ${msg.isUrgent ? 'text-rose-700' : 'text-blue-700'}`}>
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

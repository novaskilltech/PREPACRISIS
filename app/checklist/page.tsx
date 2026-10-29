'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/components/AppContext';
import {
  Check,
  Plus,
  Minus,
  AlertCircle,
  Droplets,
  Utensils,
  HeartPulse,
  Zap,
  Shield,
  Sparkles,
  ShoppingCart,
  CheckSquare,
  Package,
  Wrench,
  Coins,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  HelpCircle,
} from 'lucide-react';

// Guide d'achats local au Maroc (Magasins conseillés, conditionnements et marques)
const shoppingGuideMaroc: {
  [key: string]: {
    store: string;
    packagingTip: string;
    brandTip: string;
    amazonUrl?: string;
  };
} = {
  w1: {
    store: 'Droguerie industrielle / Quincaillerie de gros (Comptoir Métallurgique, Bricoma ou zone industrielle)',
    packagingTip: 'Cuve PEHD alimentaire traitée anti-UV avec vanne 1/4 tour. À placer impérativement au RDC sur palette.',
    brandTip: 'Citernes Roto Maroc ou Sotici (qualité alimentaire certifiée).',
  },
  w2: {
    store: 'Épicerie de quartier (Hanout) ou Supermarché (Marjane, Carrefour, Atacadão)',
    packagingTip: 'Packs de 5L ou bonbonnes de 15L serties non ouvertes.',
    brandTip: 'Sidi Ali, Ain Saiss, Bahia (eau minérale naturelle scellée).',
  },
  w3: {
    store: 'Amazon France ou magasin outdoor/survie spécialisé',
    packagingTip: 'Filtre à gravité inox avec cartouches charbon/céramique.',
    brandTip: 'British Berkefeld 8,5L ou Sawyer Squeeze avec poches renforcées.',
    amazonUrl: 'https://www.amazon.fr/s?k=filtre+eau+gravite+british+berkefeld',
  },
  w4: {
    store: 'Pharmacie / Parapharmacie au Maroc ou Amazon France',
    packagingTip: 'Boîtes étanches scellées sous blister alu.',
    brandTip: 'Micropur Forte MF 1T (DCCNa) ou Aquatabs 8,5 mg.',
    amazonUrl: 'https://www.amazon.fr/s?k=micropur+forte+aquatabs',
  },
  f1: {
    store: 'Moulins locaux (Minoterie) ou grossistes Farine/Semoule (Rahba / Souk de gros)',
    packagingTip: 'Sacs tissés doublés polyéthylène de 25 kg. Conserver sur palette à 15 cm du sol.',
    brandTip: 'Farine Trefle, MayMouna, Fandy ou Semoule Dari / Kanz.',
  },
  f2: {
    store: 'Atacadão ou Hanout de gros',
    packagingTip: 'Sacs étanches de 5 kg ou 10 kg.',
    brandTip: 'Riz rond / long Cigala ou Dari ; Vermicelles Tria.',
  },
  f3: {
    store: 'Souk aux grains (Rahba) ou Atacadão',
    packagingTip: 'Acheter en sacs 5kg/10kg, puis transvaser dans bidons 5L d\'eau vides !',
    brandTip: 'Légumineuses marocaines locales (Lentilles, Pois chiches, Loubia).',
  },
  f4: {
    store: 'Grossiste conserves / Atacadão / Hanout',
    packagingTip: 'Cartons d\'origine de 50 ou 100 boîtes de 125g.',
    brandTip: 'Sardines Tam, Anny, Delys à l\'huile d\'olive ou végétale.',
  },
  f5: {
    store: 'Coopérative agricole / Huilerie (Maasra) ou Atacadão',
    packagingTip: 'Bidons alimentaires métalliques ou PEHD de 5L.',
    brandTip: 'Huile d\'olive marocaine vierge (Meknès, Ouazzane, Beni Mellal) ou Oumnia/Al Horra.',
  },
  f6: {
    store: 'Marché de gros dattes / Souk',
    packagingTip: 'Cartons de 5kg fermés sous plastique.',
    brandTip: 'Dattes Mejhoul d\'Errachidia ou Boufeggous / Majhoul.',
  },
  f7: {
    store: 'Hanout quartier / Marjane',
    packagingTip: 'Paquets de 500g de thé vert + Pains de sucre marocains 2kg.',
    brandTip: 'Thé Bellakhdar, Souiri, 4011 + Sucre Cosumar.',
  },
  f8: {
    store: 'Stock maison sécurisé',
    packagingTip: 'Fûts ou seaux alimentaires hermétiques fermés à l\'abri de la lumière.',
    brandTip: 'Miel pur naturel marocain (400 kg en stock - trésor calorique et antiseptique).',
  },
  f9: {
    store: 'Beurre doux fermier / Souk ou Atacadão + Bocaux verre type Le Parfait',
    packagingTip: 'Bocaux en verre hermétiques à joint caoutchouc ou couvercle à visser, stérilisés à l\'eau bouillante.',
    brandTip: 'Beurre doux pasteurisé ou fermier (cuisson douce pour clarifier, ôter la mousse blanche et le dépôt de caséine).',
    amazonUrl: 'https://www.amazon.fr/s?k=bocaux+en+verre+le+parfait+1l',
  },
  f10: {
    store: 'Boucherie traditionnelle (Gouzzar) souk / abattoir pour le suif ou graisse de rognon',
    packagingTip: 'Bocaux en verre lavés et ébouillantés, coulés à chaud avec fermeture hermétique immédiate.',
    brandTip: 'Graisse de rognons de bœuf (suif premier choix) ou graisse de queue/dos de mouton fondue lentement au poêle.',
  },
  f11: {
    store: 'Grossiste épicerie / Atacadão / Marjane / BIM',
    packagingTip: 'Cartons d\'emballage d\'origine de boîtes 400g ou 800g (Haricots blancs/rouges sauce, pois chiches cuits, lentilles).',
    brandTip: 'Dounia, Bella, Bonduelle ou conserves locales. Zéro eau de cuisson requise : consommer l\'eau/jus de la boîte directement.',
  },
  f12: {
    store: 'Marjane / Carrefour / Atacadão ou Amazon France (stocks longue conservation)',
    packagingTip: 'Boîtes métal empilables de 800g (Cassoulet, Tajines, Ravioli, Macédoines).',
    brandTip: 'William Saurin, Raynal et Roquelaure ou marques distributeurs. Se réchauffe au bain-marie ou sur le poêle.',
    amazonUrl: 'https://www.amazon.fr/s?k=plats+cuisines+en+boite+conserves+800g',
  },
  s1: {
    store: 'Pharmacie (sur ordonnance d\'avance)',
    packagingTip: 'Aérosols doseurs neufs non périmés + chambres d\'inhalation.',
    brandTip: 'Ventoline 100 µg (GSK) ou générique Salbutamol.',
  },
  s2: {
    store: 'Pharmacie ou Amazon France',
    packagingTip: 'Boîtes de masques FFP3 sous emballage individuel étanche.',
    brandTip: 'Masques 3M Aura FFP3 (9332+ ou 9330+).',
    amazonUrl: 'https://www.amazon.fr/s?k=3m+aura+ffp3+masque',
  },
  s3: {
    store: 'Pharmacie / Grossiste médical',
    packagingTip: 'Boîte hermétique de 100 flacons unidoses 5ml.',
    brandTip: 'Sérum physiologique stérile 0.9% NaCl (Gilbert ou Cooper).',
  },
  s4: {
    store: 'Pharmacie de quartier (sur ordonnance de sécurité)',
    packagingTip: 'Boîtes étanches de 1g avec date de péremption vérifiée.',
    brandTip: 'Paracétamol (Doliprane, Dafalgan) 1g comprimés.',
  },
  s5: {
    store: 'Pharmacie ou Amazon France (Kit tactique IFAK)',
    packagingTip: 'Trousse étanche cordura rouge avec compartiments visibles.',
    brandTip: 'Garrot tourniquet CAT Gen 7 + Pansement compressif israélien 4" + bande cohésive.',
    amazonUrl: 'https://www.amazon.fr/s?k=trousse+premiers+secours+ifak+garrot+cat',
  },
  e1: {
    store: 'Amazon France ou magasin équipement solaire/camping-car',
    packagingTip: 'Carton d\'origine avec protection antichoc.',
    brandTip: 'EcoFlow Delta 2 (1024Wh LiFePO4) ou Bluetti EB70/AC180.',
    amazonUrl: 'https://www.amazon.fr/s?k=ecoflow+delta+2+generateur+solaire',
  },
  e2: {
    store: 'Amazon France ou revendeur solaire spécialisé',
    packagingTip: 'Panneau pliable sous housse de transport étanche.',
    brandTip: 'EcoFlow 220W Bifacial ou Bluetti PV200.',
    amazonUrl: 'https://www.amazon.fr/s?k=panneau+solaire+portable+200w+ecoflow+bluetti',
  },
  e3: {
    store: 'Bricoma / Quincaillerie ou Amazon France',
    packagingTip: 'Boîtes avec câbles USB-C de recharge dédiés.',
    brandTip: 'Petzl Tikka Core rechargeable ou Sofirn / Olight.',
    amazonUrl: 'https://www.amazon.fr/s?k=lampe+frontale+rechargeable+petzl+core',
  },
  l1: {
    store: 'Dépôt Afriquia Gaz, Total ou Hanout revendeur officiel',
    packagingTip: 'Bouteilles acier 12 kg scellées avec opercule de garantie bleu/jaune non brisé.',
    brandTip: 'Afriquia Gaz, Tissir Gaz, Butagaz.',
  },
  l2: {
    store: 'Bricoma, Mr Bricolage ou magasin d\'équipement gaz/camping',
    packagingTip: 'Réchaud fonte ou acier émaillé robuste + tuyau inox à durée de vie illimitée.',
    brandTip: 'Réchaud tripode fonte 2 ou 3 robinets + détendeur 28 mbar certifié norme marocaine.',
  },
  l3: {
    store: 'Marchand de bois de chauffage / Souk de gros (Bois de chêne ou d\'eucalyptus)',
    packagingTip: 'Fagots ou stères stockés au sec sur palettes, protégés par des bâches étanches.',
    brandTip: 'Bois sec fendu (chêne vert ou eucalyptus) prêt pour le poêle du 3e étage.',
  },
};

export default function ChecklistPage() {
  const { mode, setMode, supplies, toggleSupplyCheck, updateSupplyQuantity, members, isLoaded } =
    useAppContext();

  const [activeView, setActiveView] = useState<'INVENTAIRE' | 'COURSES' | 'OUTILS'>('INVENTAIRE');
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');
  const [outilsSubTab, setOutilsSubTab] = useState<'TROC' | 'BIDONS' | 'OUTILS'>('TROC');
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Simulateur de Troc de miel
  const [tradeHoney, setTradeHoney] = useState<number>(0.5);
  const [tradeItem, setTradeItem] = useState<string>('');
  const [tradePartner, setTradePartner] = useState<string>('');
  const [tradeLog, setTradeLog] = useState<
    Array<{ id: string; givenHoneyKg: number; receivedItem: string; partner: string; date: string }>
  >([
    {
      id: '1',
      givenHoneyKg: 0.5,
      receivedItem: '2 sacs de sel + 1 boîte d\'allumettes',
      partner: 'Épicerie voisine',
      date: 'Hier',
    },
  ]);

  if (!isLoaded) return null;

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const memberCount = Math.max(1, members.length);
  const categories = ['TOUS', 'EAU', 'NOURRITURE', 'SANTÉ', 'ÉNERGIE', 'LOGISTIQUE'];

  const filteredSupplies =
    activeCategory === 'TOUS'
      ? supplies
      : supplies.filter((s) => s.category.toUpperCase() === activeCategory);

  const completedCount = supplies.filter((s) => s.checked).length;

  // Articles manquants pour la liste de courses
  const shoppingList = supplies
    .map((item) => {
      const needed = Math.max(0, item.targetQuantity - item.quantityAcquired);
      return {
        ...item,
        needed,
        guide: shoppingGuideMaroc[item.id] || {
          store: 'Commerce local spécialisé',
          packagingTip: 'Emballage hermétique d\'origine.',
          brandTip: 'Produit normé et de qualité.',
        },
      };
    })
    .filter((item) => item.needed > 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* Header Sticky Épuré */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Stocks & Réserves
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Foyer ({memberCount} pers.) • {completedCount}/{supplies.length} sécurisés ({shoppingList.length} à acquérir)
            </p>
          </div>

          {/* Curseur de Mode 14j / 30j */}
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

        {/* 3 Onglets principaux aérés */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveView('INVENTAIRE')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'INVENTAIRE'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare size={13} />
            <span>Stocks ({supplies.length})</span>
          </button>
          <button
            onClick={() => setActiveView('COURSES')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'COURSES'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart size={13} />
            <span>Achats ({shoppingList.length})</span>
          </button>
          <button
            onClick={() => setActiveView('OUTILS')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeView === 'OUTILS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wrench size={13} />
            <span>Outils & Troc</span>
          </button>
        </div>

        {/* Filtres par Catégorie (visible si Vue Stocks) */}
        {activeView === 'INVENTAIRE' && (
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 mt-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="p-4 space-y-3">
        {/* VUE 1 : STOCKS & INVENTAIRE PROGRESSIF */}
        {activeView === 'INVENTAIRE' && (
          <div className="space-y-2.5">
            {/* Astuce Conserves & Économie d'Eau */}
            {(activeCategory === 'NOURRITURE' || activeCategory === 'TOUS') && (
              <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5 shadow-2xs">
                <Droplets size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Économie d&apos;eau :</strong> Les conserves apportent leur sauce stérile hydratante. 1 kg de légumineuses sèches nécessite 2,5L à 3L d&apos;eau de cuisson.
                </p>
              </div>
            )}

            {filteredSupplies.map((item) => {
              const targetText = mode === '14D_NOMINAL' ? item.nominal14d : item.rationed30d;
              const isExpanded = expandedDetails[item.id] || false;
              const guide = shoppingGuideMaroc[item.id];

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-3.5 transition-all shadow-xs ${
                    item.checked
                      ? 'bg-slate-50/80 border-emerald-500/30 ring-1 ring-emerald-500/15'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox Directe */}
                    <button
                      onClick={() => toggleSupplyCheck(item.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        item.checked
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border-2 border-slate-300 bg-white hover:border-blue-500'
                      }`}
                      aria-label={`Valider ${item.name}`}
                    >
                      {item.checked && <Check size={16} strokeWidth={3} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* En-tête ligne : Badges & Nom */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                          {item.category}
                        </span>
                        {item.critical && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Priorité
                          </span>
                        )}
                        {item.checked && (
                          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-0.5">
                            <Check size={10} strokeWidth={2.5} />
                            En réserve
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold mt-1 text-slate-900 leading-snug">
                        {item.name}
                      </h3>

                      <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
                        Objectif ({mode === '14D_NOMINAL' ? '14j' : '30j'}) : {targetText}
                      </p>

                      {/* Ligne Quantité & Stepper Compact */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-700 font-medium">
                          En stock : <strong className="text-slate-900">{item.quantityAcquired}</strong> / {item.targetQuantity} {item.unit}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateSupplyQuantity(item.id, item.quantityAcquired - 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold active:scale-95 transition-all"
                            aria-label="Diminuer"
                          >
                            <Minus size={13} />
                          </button>
                          <button
                            onClick={() => updateSupplyQuantity(item.id, item.quantityAcquired + 1)}
                            className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold active:scale-95 transition-all"
                            aria-label="Augmenter"
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>

                      {/* Bouton Accordéon Détails & Conseils */}
                      <div className="mt-2 pt-1 border-t border-slate-100/80 flex items-center justify-between">
                        <button
                          onClick={() => toggleDetails(item.id)}
                          className="text-[10px] text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Masquer détails' : 'Détails & conseils'}</span>
                          {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>

                        {item.id === 'w1' && (
                          <Link
                            href="/water-mission"
                            className="text-[10px] text-blue-700 hover:text-blue-800 font-bold flex items-center gap-1"
                          >
                            <Droplets size={11} />
                            <span>Mission 30L →</span>
                          </Link>
                        )}
                      </div>

                      {/* Contenu Dépliable (Progressive Disclosure) */}
                      {isExpanded && (
                        <div className="mt-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-[11px] text-slate-600">
                          {item.notes && (
                            <p className="leading-relaxed">
                              <strong>Note :</strong> {item.notes}
                            </p>
                          )}
                          {guide && (
                            <div className="space-y-1 pt-1 border-t border-slate-200/60">
                              <p>
                                <strong>Magasin conseillé :</strong> {guide.store}
                              </p>
                              <p>
                                <strong>Conditionnement :</strong> {guide.packagingTip}
                              </p>
                              {guide.amazonUrl && (
                                <a
                                  href={guide.amazonUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 font-semibold inline-flex items-center gap-1 hover:underline pt-0.5"
                                >
                                  <span>Voir référence en ligne</span>
                                  <ExternalLink size={11} />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VUE 2 : LISTE DE COURSES & ACHATS */}
        {activeView === 'COURSES' && (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase mb-1">
                <ShoppingCart size={16} />
                <span>Articles Manquants à Se Procurer</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Liste exacte de tout ce qu&apos;il vous reste à acheter pour sécuriser votre foyer de {memberCount} personne{memberCount > 1 ? 's' : ''} ({mode === '14D_NOMINAL' ? '14 jours' : '30 jours'}), avec magasins conseillés et marques.
              </p>
            </div>

            {shoppingList.length === 0 ? (
              <div className="text-center py-12 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                <Check size={36} className="text-emerald-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-900">Réserves 100% Complètes !</h3>
                <p className="text-xs text-slate-500 mt-1">Tous les articles cibles sont déjà acquis et sécurisés.</p>
              </div>
            ) : (
              shoppingList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                        {item.critical && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Urgent
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1.5">{item.name}</h4>
                    </div>

                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                      Reste : {item.needed} {item.unit}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Magasin :</strong> {item.guide.store}
                    </p>
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Conditionnement :</strong> {item.guide.packagingTip}
                    </p>
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Marque recommandée :</strong> {item.guide.brandTip}
                    </p>
                    {item.guide.amazonUrl && (
                      <div className="pt-1">
                        <a
                          href={item.guide.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-700 font-semibold inline-flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink size={12} />
                          <span>Voir sur Amazon France</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* VUE 3 : OUTILS, CONDITIONNEMENT & TROC */}
        {activeView === 'OUTILS' && (
          <div className="space-y-3.5">
            {/* Sélecteur de sous-onglets */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setOutilsSubTab('TROC')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  outilsSubTab === 'TROC'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Coins size={12} />
                <span>Troc de Miel</span>
              </button>
              <button
                onClick={() => setOutilsSubTab('BIDONS')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  outilsSubTab === 'BIDONS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Package size={12} />
                <span>Bidons 5L</span>
              </button>
              <button
                onClick={() => setOutilsSubTab('OUTILS')}
                className={`flex-1 py-1 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  outilsSubTab === 'OUTILS'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wrench size={12} />
                <span>Boîte Outils</span>
              </button>
            </div>

            {/* SOUS-ONGLET 1 : TROC & MIEL */}
            {outilsSubTab === 'TROC' && (
              <div className="space-y-3">
                {/* Bannière Réserve de Miel */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                      <Coins size={18} className="text-amber-700" />
                      <span>Réserve de Miel (Monnaie de secours)</span>
                    </div>
                    <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-lg font-bold border border-amber-200">
                      400 kg en Stock
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Le miel pur naturel est une monnaie d&apos;échange idéale : très recherché, valeur nutritive immense et conservation éternelle sans frigo.
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
                      <span className="text-[10px] text-slate-500 uppercase block font-medium">Réserve Famille :</span>
                      <strong className="text-slate-900">30 kg (1 mois foyer)</strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100 shadow-xs">
                      <span className="text-[10px] text-amber-800 uppercase block font-bold">Disponible Troc :</span>
                      <strong className="text-emerald-700 font-bold">370 kg (~740 pots 500g)</strong>
                    </div>
                  </div>
                </div>

                {/* Règles de Sécurité */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Shield size={16} className="text-rose-600" />
                    <span>Règles de Discrétion pour le Troc</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                    <li>
                      <strong className="text-slate-900">Ne jamais mentionner vos 400 kg :</strong> Présentez l&apos;échange comme <em>« un ou deux pots qu&apos;il nous reste d&apos;un parent apiculteur »</em>.
                    </li>
                    <li>
                      <strong className="text-slate-900">Préparez de petits pots :</strong> Fractionnez en pots de 250g et 500g.
                    </li>
                    <li>
                      <strong className="text-slate-900">Échange au rez-de-chaussée :</strong> Ne faites jamais monter d&apos;inconnus dans vos pièces privées.
                    </li>
                  </ul>
                </div>

                {/* Grille des Équivalences */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <ArrowLeftRight size={14} className="text-blue-600" />
                    <span>Équivalences Estimées de Troc</span>
                  </h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-amber-800">1 Pot de 250 g</span>
                      <span className="text-slate-700">↔ 5 à 8 kg de pommes de terre/oignons</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-amber-800">1 Pot de 500 g</span>
                      <span className="text-slate-700">↔ 1 poulet fermier ou 1 jeu de piles</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-amber-800">1 Pot de 1 kg</span>
                      <span className="text-slate-700">↔ 1 petite bouteille de gaz (3 kg)</span>
                    </div>
                  </div>
                </div>

                {/* Enregistrer un échange */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
                  <h3 className="text-xs font-bold text-slate-900">Enregistrer un Échange Réalisé</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Miel (kg)"
                      value={tradeHoney}
                      onChange={(e) => setTradeHoney(parseFloat(e.target.value) || 0)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Reçu en échange *"
                      value={tradeItem}
                      onChange={(e) => setTradeItem(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Partenaire"
                      value={tradePartner}
                      onChange={(e) => setTradePartner(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!tradeItem.trim()) return;
                      setTradeLog((prev) => [
                        {
                          id: Date.now().toString(),
                          givenHoneyKg: tradeHoney,
                          receivedItem: tradeItem.trim(),
                          partner: tradePartner.trim() || 'Voisin',
                          date: new Date().toLocaleDateString(),
                        },
                        ...prev,
                      ]);
                      setTradeItem('');
                      setTradePartner('');
                    }}
                    disabled={!tradeItem.trim()}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all shadow-xs"
                  >
                    + Enregistrer la Transaction
                  </button>

                  {/* Historique */}
                  <div className="space-y-1.5 pt-1">
                    {tradeLog.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs"
                      >
                        <div>
                          <span className="text-slate-900 font-bold">{log.receivedItem}</span>
                          <span className="text-[10px] text-slate-500 block">
                            Partenaire : {log.partner} • {log.date}
                          </span>
                        </div>
                        <span className="text-amber-700 font-bold">
                          -{log.givenHoneyKg} kg Miel
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 2 : CALCULATEUR BIDONS 5L */}
            {outilsSubTab === 'BIDONS' && (
              <div className="space-y-3">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                    <Package size={16} />
                    <span>Technique de Conditionnement en Bidons 5L</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Au lieu de sacs perméables aux insectes et à l&apos;humidité, recyclez vos <strong>bidons d&apos;eau minérale de 5L</strong> vides et secs :
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Lentilles</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">~4,2 kg</span>
                    <span className="text-[10px] text-blue-600 font-semibold block">par bidon 5L</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Pois chiches</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">~3,9 kg</span>
                    <span className="text-[10px] text-blue-600 font-semibold block">par bidon 5L</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Haricots blancs</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">~3,9 kg</span>
                    <span className="text-[10px] text-blue-600 font-semibold block">par bidon 5L</span>
                  </div>
                  <div className="bg-white border border-slate-200/90 p-3 rounded-2xl shadow-xs">
                    <span className="text-[11px] text-slate-500 font-medium block">Riz / Semoule</span>
                    <span className="text-lg font-bold text-slate-900 mt-0.5 block">~4,5 kg</span>
                    <span className="text-[10px] text-blue-600 font-semibold block">par bidon 5L</span>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2 shadow-2xs">
                  <HelpCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Conseil anti-charançons :</strong> Bien sécher le bidon au soleil. Ajoutez <strong>2 feuilles de laurier et 3 clous de girofle</strong> dans chaque bidon pour éloigner naturellement les insectes, puis scellez le bouchon avec du ruban adhésif.
                  </p>
                </div>
              </div>
            )}

            {/* SOUS-ONGLET 3 : BOÎTE À OUTILS */}
            {outilsSubTab === 'OUTILS' && (
              <div className="space-y-2.5">
                <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                    <Wrench size={16} />
                    <span>Boîte à Outils de Secours (Caisse Unique)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Rassemblez tous les outils dans une <strong>caisse étanche unique</strong> stockée au rez-de-chaussée, prête à l&apos;emploi :
                  </p>
                </div>

                {[
                  {
                    name: 'Pied-de-biche 60 cm',
                    desc: 'Pour ouvrir une porte déformée ou dégager des accès bloqués.',
                    amazon: 'https://www.amazon.fr/s?k=pied+de+biche+60cm',
                  },
                  {
                    name: 'Clé à molette 250 mm + Clé à gaz',
                    desc: 'Pour raccorder les bouteilles de gaz 12kg et couper l\'arrivée d\'eau.',
                    amazon: 'https://www.amazon.fr/s?k=cle+a+molette+250mm',
                  },
                  {
                    name: 'Pince multiprise & pince coupante',
                    desc: 'Pour couper câbles, grillages et serrer les vannes.',
                  },
                  {
                    name: 'Ruban adhésif renforcé (Gorilla Tape)',
                    desc: 'Colmater fuites, fixer bâches, sceller vitres.',
                    amazon: 'https://www.amazon.fr/s?k=gorilla+tape+toile+arme',
                  },
                  {
                    name: 'Gants de manutention épais anti-coupure',
                    desc: 'Protection des mains contre les éclats et gravats.',
                    amazon: 'https://www.amazon.fr/s?k=gants+manutention+anti+coupure+niveau+5',
                  },
                ].map((tool, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1 shadow-xs"
                  >
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Wrench size={13} className="text-amber-600" />
                      {tool.name}
                    </h4>
                    <p className="text-xs text-slate-600">{tool.desc}</p>
                    {tool.amazon && (
                      <div className="pt-1">
                        <a
                          href={tool.amazon}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <ExternalLink size={11} />
                          <span>Voir sur Amazon France</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

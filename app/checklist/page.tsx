'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext, SupplyItem } from '@/components/AppContext';
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
  Store,
  HelpCircle,
  ExternalLink,
  Wrench,
  Coins,
  ArrowLeftRight,
} from 'lucide-react';

const categoryIcons = {
  EAU: Droplets,
  NOURRITURE: Utensils,
  SANTÉ: HeartPulse,
  ÉNERGIE: Zap,
  LOGISTIQUE: Shield,
};

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
    brandTip: 'Aïcha, Dounia, Bella, Bonduelle. Zéro eau de cuisson requise : consommer l\'eau/jus de la boîte directement.',
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
    store: 'Supermarché / Hanout',
    packagingTip: 'Cartons de paquets maxi-nuit avec ailettes.',
    brandTip: 'Always, Nana, Mia.',
  },
  s4: {
    store: 'Pharmacie',
    packagingTip: 'Trousse obstétrique stérile fermée hermétiquement.',
    brandTip: 'Kit accouchement urgence d\'officine.',
  },
  s5: {
    store: 'Pharmacie (ordonnance de renouvellement sécurisée)',
    packagingTip: 'Boîtes scellées avec notice.',
    brandTip: 'Traitement habituel de Nadia.',
  },
  s6: {
    store: 'Pharmacie',
    packagingTip: 'Boîtes de Paracétamol 1g (Doliprane) + Voltarène/Ibuprofène.',
    brandTip: 'Doliprane 1000mg, Gel Diclofénac.',
  },
  s7: {
    store: 'Pharmacie',
    packagingTip: 'Boîtes de sachets de poudre pour solution buvable.',
    brandTip: 'Adiaril ou SRO générique OMS.',
  },
  s8: {
    store: 'Pharmacie (ordonnance médicale de réserve)',
    packagingTip: 'Plaquettes thermoformées aluminium protégées de l\'humidité.',
    brandTip: 'Amoxicilline/Acide clavulanique 1g (Augmentin) + Azithromycine 250mg.',
  },
  s9: {
    store: 'Pharmacie',
    packagingTip: 'Boîtes de 20 ou 30 comprimés.',
    brandTip: 'Ibuprofène 400 mg (Advil, Spedifen, générique).',
  },
  s10: {
    store: 'Herboristerie marocaine / Parapharmacie ou Amazon',
    packagingTip: 'Flacons verre teinté fermés + sprays buccaux.',
    brandTip: 'Huile de Nigelle pure d\'Égypte/Maroc (première pression à froid) + Spray Propolis.',
    amazonUrl: 'https://www.amazon.fr/s?k=huile+de+nigelle+bio+pression+froid',
  },
  s11: {
    store: 'Pharmacie / Parapharmacie',
    packagingTip: 'Tubes de comprimés à croquer ou effervescents 1000mg.',
    brandTip: 'Acérola 1000 ou Vitamine C Laroscorbine.',
    amazonUrl: 'https://www.amazon.fr/s?k=vitamine+c+1000mg+acerola',
  },
  s12: {
    store: 'Pharmacie / Parapharmacie',
    packagingTip: 'Flacons 125ml Bétadine jaune dermique + Bétadine rouge savon chirurgical + compresses 10x10.',
    brandTip: 'Bétadine dermique 10%, Alcool à 70° modifié, Compresses stériles tissées 10x10, Bandes Velpeau.',
  },
  s13: {
    store: 'Amazon France ou pharmacie militaire / secours',
    packagingTip: 'Pochette molle tactique étanche avec Garrot tourniquet officiel CAT.',
    brandTip: 'North American Rescue CAT Tourniquet Gen 7 + Pansement compressif d\'urgence israélien 6 pouces.',
    amazonUrl: 'https://www.amazon.fr/s?k=garrot+tourniquet+cat+gen+7+pansement+israelien',
  },
  e1: {
    store: 'Magasin high-tech (Virgin Megastore, Fnac Maroc) ou Amazon France',
    packagingTip: 'Carton d\'origine avec câbles 220V et allume-cigare.',
    brandTip: 'EcoFlow Delta 2 (1024Wh) ou Jackery Explorer 1000.',
    amazonUrl: 'https://www.amazon.fr/s?k=ecoflow+delta+2+generateur+electrique+portable',
  },
  e2: {
    store: 'Magasin énergie solaire (Casablanca, Derb Ghallef) ou Amazon France',
    packagingTip: 'Housse textile étanche repliable avec adaptateurs MC4.',
    brandTip: 'Panneau solaire pliable EcoFlow 220W Bifacial ou Dokio 200W.',
    amazonUrl: 'https://www.amazon.fr/s?k=panneau+solaire+portable+pliable+200w',
  },
  e3: {
    store: 'Dépôt de gaz du quartier / Épicier',
    packagingTip: 'Bouteilles métalliques scellées avec capsule plastique intacte.',
    brandTip: 'Afriquia Gaz, TotalGaz, Butagaz (Bouteilles bleues 12 kg).',
  },
  e4: {
    store: 'Amazon France',
    packagingTip: 'Emballage d\'origine avec câble de charge USB et notice.',
    brandTip: 'Radio d\'urgence solaire et à manivelle (Mesqool, FosPower ou Midland ER300).',
    amazonUrl: 'https://www.amazon.fr/s?k=radio+survie+manivelle+solaire+dynamo',
  },
  e5: {
    store: 'Magasin bricolage / Décathlon ou Amazon France',
    packagingTip: 'Boîtes sous blister étanche.',
    brandTip: 'Lampe torche à manivelle dynamo Decathlon Forclaz ou lampe torche tactique rechargeable.',
    amazonUrl: 'https://www.amazon.fr/s?k=lampe+torche+dynamo+manivelle',
  },
  e6: {
    store: 'Exploitant forestier local / Vendeur de bois de chauffage périurbain',
    packagingTip: 'Stères de chêne vert ou eucalyptus coupés en 30-40cm, stockés au sec sur palettes dans le garage.',
    brandTip: 'Bois dur fendu séché depuis au moins 2 ans (chêne vert ou olivier).',
  },
  e7: {
    store: 'Magasin bricolage (Bricoma) ou Amazon France',
    packagingTip: 'Boîte avec pile lithium 10 ans et certificat norme EN 50291.',
    brandTip: 'Détecteur de monoxyde de carbone Kidde ou X-Sense avec affichage digital.',
    amazonUrl: 'https://www.amazon.fr/s?k=detecteur+monoxyde+de+carbone+kidde',
  },
  l1: {
    store: 'Épicerie / Hanout / Bricoma',
    packagingTip: 'Paquets fermés sous plastique étanche.',
    brandTip: 'Bougies blanches stéarine + Boîtes de 10 boîtes d\'allumettes.',
  },
  l2: {
    store: 'Droguerie locale / Marjane',
    packagingTip: 'Bouteilles 1L javel non parfumée (sans arômes, sans tensioactifs).',
    brandTip: 'Eau de Javel La Croix ou Marjane classique 2,6%.',
  },
  l3: {
    store: 'Matériel médical / Magasin orthopédie',
    packagingTip: 'Sangle de portage d\'évacuation deux personnes.',
    brandTip: 'Harnais portage blessé / chaise évacuation.',
  },
  l4: {
    store: 'Magasin bricolage / Quincaillerie / Amazon France',
    packagingTip: 'Caisse à outils métallique ou boîte de chantier étanche fermée avec cadenas.',
    brandTip: 'Pied-de-biche 60cm, Clé à molette 250mm, Pince multiprise, Scies, Duct tape armé Gorilla.',
    amazonUrl: 'https://www.amazon.fr/s?k=pied+de+biche+60cm+gorilla+tape',
  },
  l5: {
    store: 'Droguerie / Magasin Bricolage / Amazon France',
    packagingTip: 'Seau de 20L avec anse métallique + lunette de toilette clipsable spéciale seau + rouleau de sacs poubelle ultra-résistants 100 microns.',
    brandTip: 'Lunette de toilette camping pour seau 20L + sacs poubelle renforcés gravats.',
    amazonUrl: 'https://www.amazon.fr/s?k=lunette+toilette+seau+camping+sacs+poubelle+100l+resistants',
  },
  l6: {
    store: 'Menuiserie de quartier (Najar) ou poêle à bois',
    packagingTip: 'Grands sacs de sciure de bois sèche récupérée chez le menuisier + cendres tamisées du poêle à bois.',
    brandTip: 'Sciure de rabotage non traitée + Cendres froides du poêle.',
  },
  d1: {
    store: 'Amazon France',
    packagingTip: 'Lot de cales bloque-porte avec sirène 120dB à pile + carillons/clochettes de porte.',
    brandTip: 'Bloque-porte d\'alarme 120 dB (EMAXELERS / OUVIS) + clochettes laiton d\'entrée.',
    amazonUrl: 'https://www.amazon.fr/s?k=bloque+porte+alarme+120db',
  },
  d2: {
    store: 'Amazon France',
    packagingTip: 'Kit carillon sans fil avec détecteur de mouvement PIR étanche à piles (portée 100m).',
    brandTip: 'Carillon d\'alerte de passage sans fil PIR (Kerui / Daytech).',
    amazonUrl: 'https://www.amazon.fr/s?k=carillon+sans+fil+detecteur+de+mouvement+pir+passage',
  },
  d3: {
    store: 'Armurerie France ou Amazon France',
    packagingTip: 'Bombes gel poivre OC format extincteur 300ml à 500ml avec poignée pistolet.',
    brandTip: 'Gel Poivre OC Sabre Red / Fox Labs / Concorde Defender 300ml (portée 5-6 mètres).',
    amazonUrl: 'https://www.amazon.fr/s?k=bombe+lacrymogene+gel+poivre+300ml',
  },
  d4: {
    store: 'Amazon France',
    packagingTip: 'Lampes torches tactiques rechargeables avec mode stroboscope puissant > 2000 lumens.',
    brandTip: 'Shadowhawk 20000 lumens ou Sofirn / Olight lampe tactique stroboscopique.',
    amazonUrl: 'https://www.amazon.fr/s?k=lampe+tactique+stroboscope+puissante+rechargeable',
  },
  d5: {
    store: 'Amazon France ou magasin sport',
    packagingTip: 'Lot de 8 sifflets d\'urgence en aluminium anodisé 120dB avec cordons.',
    brandTip: 'Sifflets de survie double tube 120dB sans bille.',
    amazonUrl: 'https://www.amazon.fr/s?k=sifflet+de+survie+120db+aluminium',
  },
};

export default function ChecklistPage() {
  const { mode, setMode, supplies, toggleSupplyCheck, updateSupplyQuantity, isLoaded } = useAppContext();
  const [activeView, setActiveView] = useState<'INVENTAIRE' | 'COURSES' | 'CALCULATEUR_BIDONS' | 'BOITE_OUTILS' | 'TROC'>('INVENTAIRE');
  const [activeCategory, setActiveCategory] = useState<string>('TOUS');

  // Journal de troc local
  const [tradeLog, setTradeLog] = useState<{ id: string; givenHoneyKg: number; receivedItem: string; partner: string; date: string }[]>([
    {
      id: '1',
      givenHoneyKg: 0.5,
      receivedItem: '10 kg de pommes de terre & oignons',
      partner: 'Voisin RDC (M. Tazi)',
      date: 'Exemple',
    },
  ]);
  const [tradeHoney, setTradeHoney] = useState(0.5);
  const [tradeItem, setTradeItem] = useState('');
  const [tradePartner, setTradePartner] = useState('');

  if (!isLoaded) return null;

  const categories = ['TOUS', 'EAU', 'NOURRITURE', 'SANTÉ', 'ÉNERGIE', 'LOGISTIQUE'];

  // Articles pour l'inventaire filtré
  const filteredSupplies =
    activeCategory === 'TOUS' ? supplies : supplies.filter((s) => s.category === activeCategory);

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
      {/* Header Sticky Clair & Aéré */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Provisions & Matériel
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              8 personnes • {completedCount} / {supplies.length} sécurisés ({shoppingList.length} à trouver)
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

        {/* 5 Onglets simples et clairs */}
        <div className="grid grid-cols-5 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'INVENTAIRE', icon: CheckSquare, label: 'Stocks' },
            { id: 'COURSES', icon: ShoppingCart, label: 'Achats' },
            { id: 'CALCULATEUR_BIDONS', icon: Package, label: 'Bidons 5L' },
            { id: 'BOITE_OUTILS', icon: Wrench, label: 'Outils' },
            { id: 'TROC', icon: Coins, label: 'Troc' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon size={12} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Barre de Catégories Défilante (visible si Inventaire) */}
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
        {/* VUE 1 : INVENTAIRE */}
        {activeView === 'INVENTAIRE' && (
          <div className="space-y-3">
            {/* Bannière d'Économie d'Eau par les Conserves */}
            {(activeCategory === 'NOURRITURE' || activeCategory === 'TOUS') && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Droplets size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                        Conseil Préservation d&apos;Eau
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        Épargne 120L d&apos;eau
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">
                      Les conserves cuisinées n&apos;utilisent aucune eau de la cuve
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      1 kg de lentilles sèches demande <strong>2,5 à 3 Litres d&apos;eau</strong> pour cuire. Les conserves de haricots, pois chiches et plats préparés apportent leur propre sauce stérile : buvez le jus, il réhydrate et apporte les sels minéraux essentiels !
                    </p>
                  </div>
                </div>
              </div>
            )}

            {filteredSupplies.map((item) => {
              const targetText = mode === '14D_NOMINAL' ? item.nominal14d : item.rationed30d;

              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl p-4 transition-all shadow-xs ${
                    item.checked
                      ? 'bg-slate-50/70 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200/90'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox Tactile Agréable */}
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                          {item.category}
                        </span>
                        {item.critical && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Priorité Haute
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-xs font-bold mt-1.5 leading-snug ${
                          item.checked ? 'text-slate-400 line-through' : 'text-slate-900'
                        }`}
                      >
                        {item.name}
                      </h3>

                      <div className="text-xs text-blue-700 font-semibold mt-1">
                        Objectif ({mode === '14D_NOMINAL' ? '14j' : '30j'}) : {targetText}
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          {item.notes}
                        </p>
                      )}

                      {item.id === 'w1' && (
                        <Link
                          href="/water-mission"
                          className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 font-semibold mt-2 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200"
                        >
                          <Droplets size={13} />
                          <span>Ravitaillement : Mission Sortie 30L (60 min) →</span>
                        </Link>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                        <span className="text-xs text-slate-600 font-medium">
                          En stock : <strong className="text-slate-900 font-bold">{item.quantityAcquired}</strong> / {item.targetQuantity} {item.unit}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateSupplyQuantity(item.id, item.quantityAcquired - 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold active:scale-95 transition-all"
                            aria-label="Diminuer"
                          >
                            <Minus size={14} />
                          </button>
                          <button
                            onClick={() => updateSupplyQuantity(item.id, item.quantityAcquired + 1)}
                            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center justify-center font-bold active:scale-95 transition-all"
                            aria-label="Augmenter"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
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
                Liste exacte de tout ce qu&apos;il vous reste à acheter pour sécuriser la famille de 8 personnes ({mode === '14D_NOMINAL' ? '14 jours' : '30 jours'}), avec les magasins conseillés et marques.
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
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                        {item.critical && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                            Priorité Haute
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{item.name}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-bold text-blue-700">
                        +{item.needed} {item.unit}
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase">À acheter</p>
                    </div>
                  </div>

                  {/* Conseils d'Achat */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-start gap-1.5">
                      <Store size={14} className="text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Où trouver :</strong> {item.guide.store}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <Package size={14} className="text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900">Conditionnement :</strong> {item.guide.packagingTip}
                      </span>
                    </div>
                    {item.guide.brandTip && (
                      <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60">
                        Marques recommandées : <span className="text-slate-900 font-semibold">{item.guide.brandTip}</span>
                      </div>
                    )}
                  </div>

                  {/* Bouton Amazon France si disponible */}
                  {item.guide.amazonUrl && (
                    <a
                      href={item.guide.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <ExternalLink size={14} />
                      <span>Commander sur Amazon France</span>
                    </a>
                  )}

                  {/* Bouton marquer acheté */}
                  <button
                    onClick={() => updateSupplyQuantity(item.id, item.quantityAcquired + item.needed)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Check size={14} className="text-emerald-600" />
                    <span>Marquer comme acheté (+{item.needed} {item.unit})</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* VUE 3 : CALCULATEUR BIDONS 5L */}
        {activeView === 'CALCULATEUR_BIDONS' && (
          <div className="space-y-3.5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                <Package size={16} />
                <span>Stockage Hermétique en Bidons de 5L</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Réutiliser des bidons d&apos;eau minérale de 5 Litres (Sidi Ali, Bahia, Ain Saiss) propres et secs offre une protection parfaite contre l&apos;humidité, les insectes et les rongeurs.
              </p>
            </div>

            {/* Fiches de Conversion */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Lentilles</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">~4,2 kg</span>
                <span className="text-[10px] text-blue-600 font-semibold block">par bidon de 5L</span>
              </div>
              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Pois chiches (Hommos)</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">~3,9 kg</span>
                <span className="text-[10px] text-blue-600 font-semibold block">par bidon de 5L</span>
              </div>
              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Haricots blancs (Loubia)</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">~3,9 kg</span>
                <span className="text-[10px] text-blue-600 font-semibold block">par bidon de 5L</span>
              </div>
              <div className="bg-white border border-slate-200/90 p-3.5 rounded-2xl shadow-xs">
                <span className="text-[11px] text-slate-500 font-medium block">Haricots rouges</span>
                <span className="text-xl font-bold text-slate-900 mt-0.5 block">~3,9 kg</span>
                <span className="text-[10px] text-blue-600 font-semibold block">par bidon de 5L</span>
              </div>
            </div>

            {/* Dimensionnement pour 8 Personnes */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Besoin pour 8 Personnes ({mode === '14D_NOMINAL' ? '14 Jours' : '30 Jours'}) :</span>
                <span className="text-blue-700 font-bold">
                  {mode === '14D_NOMINAL' ? '8 kg (2 Bidons)' : '20 kg (5 Bidons)'}
                </span>
              </h3>

              <div className="space-y-2 text-xs">
                {mode === '14D_NOMINAL' ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <strong className="text-slate-900 block">1 Bidon de Lentilles</strong>
                        <span className="text-[11px] text-slate-500">Cuisson facile & nutritive</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">4,2 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div>
                        <strong className="text-slate-900 block">1 Bidon de Pois Chiches / Haricots</strong>
                        <span className="text-[11px] text-slate-500">Complément de protéines</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">3,9 kg</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900">2 Bidons de Lentilles</strong>
                      <span className="text-xs font-bold text-emerald-700">8,4 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900">1 Bidon de Pois Chiches</strong>
                      <span className="text-xs font-bold text-emerald-700">3,9 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900">1 Bidon de Haricots Blancs</strong>
                      <span className="text-xs font-bold text-emerald-700">3,9 kg</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <strong className="text-slate-900">1 Bidon de Haricots Rouges</strong>
                      <span className="text-xs font-bold text-emerald-700">3,9 kg</span>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <HelpCircle size={16} className="text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Conseil de conservation :</strong> Bien sécher le bidon au soleil. Ajoutez <strong>2 feuilles de laurier et 3 clous de girofle</strong> dans chaque bidon pour éloigner naturellement les insectes, puis scellez le bouchon.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VUE 4 : BOÎTE À OUTILS */}
        {activeView === 'BOITE_OUTILS' && (
          <div className="space-y-3.5">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-xs uppercase">
                <Wrench size={16} />
                <span>Boîte à Outils de Secours (Caisse Unique)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rassemblez tous les outils de la maison dans une <strong>caisse étanche unique</strong> stockée au rez-de-chaussée (quai), prête à l&apos;emploi en cas de débris ou de blocage de porte :
              </p>
            </div>

            <div className="space-y-2.5">
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
                  name: 'Scie égoïne à bois & scie à métaux',
                  desc: 'Découper planches de protection ou tuyaux.',
                },
                {
                  name: 'Marteau de coffreur ou massette (1 kg)',
                  desc: 'Enfoncer clous et sécuriser les panneaux de bois.',
                },
                {
                  name: 'Ruban adhésif renforcé (Gorilla Tape)',
                  desc: 'Colmater fuite, fixer bâches, sceller vitres.',
                  amazon: 'https://www.amazon.fr/s?k=gorilla+tape+toile+arme',
                },
                {
                  name: '3 paires de gants de manutention épais',
                  desc: 'Protection des mains contre les éclats et gravats.',
                  amazon: 'https://www.amazon.fr/s?k=gants+manutention+anti+coupure+niveau+5',
                },
                {
                  name: 'Bâche plastique lourde (4m x 5m)',
                  desc: 'Protéger de la pluie ou occulter une fenêtre brisée.',
                  amazon: 'https://www.amazon.fr/s?k=bache+protection+lourde+etanche+4x5',
                },
              ].map((tool, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200/90 rounded-2xl p-3.5 space-y-1.5 shadow-xs"
                >
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Wrench size={13} className="text-amber-600" />
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{tool.desc}</p>
                  {tool.amazon && (
                    <div className="pt-1">
                      <a
                        href={tool.amazon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition-all"
                      >
                        <ExternalLink size={12} />
                        <span>Voir sur Amazon France</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VUE 5 : TROC & MIEL */}
        {activeView === 'TROC' && (
          <div className="space-y-3.5">
            {/* Bannière Réserve de Miel */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase">
                  <Coins size={18} className="text-amber-700" />
                  <span>Réserve de Miel & Troc (Monnaie de secours)</span>
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
                  <strong className="text-slate-900">Préparez de petits pots :</strong> Fractionnez en pots de 250g et 500g. Ne sortez jamais avec un gros seau.
                </li>
                <li>
                  <strong className="text-slate-900">Échange au rez-de-chaussée :</strong> Ne faites jamais monter d&apos;inconnus au 3e étage.
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
      </main>
    </div>
  );
}

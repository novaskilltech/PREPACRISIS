'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FamilyMemberStatus = 'SECURISE' | 'MISSION' | 'ASSISTANCE' | 'URGENCE';

export type FamilyMember = {
  id: string;
  name: string;
  gender: 'F' | 'M';
  ageGroup: 'senior' | 'adulte' | 'ado' | 'enfant' | 'bebe' | 'enceinte';
  medicalNeeds: string[];
  role: string;
  status: FamilyMemberStatus;
  phone: string;
  isMobilityReduced: boolean;
};

export type SupplyItem = {
  id: string;
  category: 'EAU' | 'NOURRITURE' | 'SANTÉ' | 'ÉNERGIE' | 'LOGISTIQUE';
  name: string;
  nominal14d: string;
  rationed30d: string;
  quantityAcquired: number;
  targetQuantity: number;
  unit: string;
  critical: boolean;
  notes?: string;
  checked: boolean;
};

export type WaterTank = {
  capacityLiters: number;
  currentLevelLiters: number;
  lastTreatmentDate: string; // YYYY-MM-DD
  treatmentType: string;
  treatmentStatus: 'VALIDE' | 'RENOUVELER_BIENTOT' | 'PERIME';
};

export type BatteryStatus = {
  capacityWh: number;
  currentPercent: number;
  hasSolarPanel: boolean;
  dailyConsumptionWh: number;
};

export type LocalMessage = {
  id: string;
  sender: string;
  timestamp: string;
  text: string;
  isUrgent?: boolean;
};

export type EmergencyContact = {
  id: string;
  name: string;
  roleOrRelation: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  city?: string;
};

export type EmergencyPlan = {
  buildingFloors: string;
  meetingPointPrimary: string;
  meetingPointSecondaryRural: string;
  outOfZoneContactName: string;
  outOfZoneContactPhone: string;
  cashReserveDirhams: number;
  gasBottlesCount: number;
  evacuationNotes: string;
};

export type WaterPoint = {
  id: string;
  name: string;
  type: 'MOSQUEE' | 'SAQAYA' | 'HAMMAM' | 'PUITS' | 'PUBLIC';
  distanceMeters: number;
  walkMinutesOneWay: number;
  fillTimeMinutes: number;
  totalRoundTripMinutes: number;
  capacityInfo: string;
  quality: 'POTABLE_DIRECT' | 'JAVEL_OBLIGATOIRE' | 'FILTRATION_LOURDE';
  notes: string;
  isVerified: boolean;
  addressOrLandmark?: string;
};

export type ThemeMode = 'moderne' | 'tactique' | 'survivaliste';

type AppContextType = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  mode: '14D_NOMINAL' | '30D_RATIONED';
  setMode: (mode: '14D_NOMINAL' | '30D_RATIONED') => void;
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  setMemberStatus: (id: string, status: FamilyMemberStatus) => void;
  clearAllMembers: () => void;
  supplies: SupplyItem[];
  toggleSupplyCheck: (id: string) => void;
  updateSupplyQuantity: (id: string, quantity: number) => void;
  waterTank: WaterTank;
  updateWaterTank: (updates: Partial<WaterTank>) => void;
  waterPoints: WaterPoint[];
  addWaterPoint: (point: Omit<WaterPoint, 'id'>) => void;
  deleteWaterPoint: (id: string) => void;
  updateWaterPoint: (id: string, updates: Partial<WaterPoint>) => void;
  addFetchedWaterToTank: (liters: number) => void;
  battery: BatteryStatus;
  updateBattery: (updates: Partial<BatteryStatus>) => void;
  emergencyPlan: EmergencyPlan;
  updateEmergencyPlan: (updates: Partial<EmergencyPlan>) => void;
  contacts: EmergencyContact[];
  addContact: (contact: Omit<EmergencyContact, 'id'>) => void;
  deleteContact: (id: string) => void;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  localMessages: LocalMessage[];
  addLocalMessage: (text: string, isUrgent?: boolean) => void;
  readGuides: number[];
  markGuideAsRead: (id: number) => void;
  isLoaded: boolean;
  score: number;
};

const defaultMembers: FamilyMember[] = [];

const defaultSupplies: SupplyItem[] = [
  // EAU
  {
    id: 'w1',
    category: 'EAU',
    name: 'Cuve Tank 500L (RDC / Quai)',
    nominal14d: '500 L (32 L/j foyer)',
    rationed30d: '500 L (Rationnement 16.5 L/j)',
    quantityAcquired: 500,
    targetQuantity: 500,
    unit: 'Litres',
    critical: true,
    notes: 'Ne pas placer au 3e étage (500 kg). Traiter dès remplissage.',
    checked: true,
  },
  {
    id: 'w2',
    category: 'EAU',
    name: 'Bonbonnes d\'eau scellées (5L / 15L)',
    nominal14d: '5 bonbonnes (50L secours)',
    rationed30d: '10 bonbonnes (100L secours)',
    quantityAcquired: 4,
    targetQuantity: 10,
    unit: 'Bonbonnes',
    critical: true,
    notes: 'Réserve tampon buvable direct pour femme enceinte et senior.',
    checked: false,
  },
  {
    id: 'w3',
    category: 'EAU',
    name: 'Filtre à gravité (Berkey / Céramique) ou filtres portables',
    nominal14d: '1 filtre gravité + 2 filtres paille',
    rationed30d: '1 filtre gravité + cartouches de rechange',
    quantityAcquired: 1,
    targetQuantity: 2,
    unit: 'Unités',
    critical: true,
    notes: 'Vital pour assainir l\'eau du tank avant consommation.',
    checked: false,
  },
  {
    id: 'w4',
    category: 'EAU',
    name: 'Pastilles de purification d\'eau (Micropur Forte / Aquatabs)',
    nominal14d: '1 boîte (100 comprimés)',
    rationed30d: '2 boîtes (200 comprimés)',
    quantityAcquired: 1,
    targetQuantity: 2,
    unit: 'Boîtes',
    critical: true,
    notes: '1 pastille par litre. Indispensable pour la cuve.',
    checked: true,
  },

  // NOURRITURE MAROC
  {
    id: 'f1',
    category: 'NOURRITURE',
    name: 'Semoule & Farine de blé (Sacs 25 kg)',
    nominal14d: '2 sacs de 25 kg (50 kg)',
    rationed30d: '4 sacs de 25 kg (100 kg)',
    quantityAcquired: 2,
    targetQuantity: 4,
    unit: 'Sacs 25kg',
    critical: true,
    notes: 'Stockage quai / zone sèche sur palette.',
    checked: false,
  },
  {
    id: 'f2',
    category: 'NOURRITURE',
    name: 'Riz & Vermicelles / Pâtes',
    nominal14d: '20 kg',
    rationed30d: '40 kg',
    quantityAcquired: 15,
    targetQuantity: 40,
    unit: 'kg',
    critical: true,
    notes: 'Cuisson rapide économe en gaz.',
    checked: false,
  },
  {
    id: 'f3',
    category: 'NOURRITURE',
    name: 'Légumineuses sèches (Lentilles, Pois chiches, Fèves)',
    nominal14d: '15 kg',
    rationed30d: '30 kg',
    quantityAcquired: 10,
    targetQuantity: 30,
    unit: 'kg',
    critical: true,
    notes: 'Haute valeur protéique, conservation pluriannuelle.',
    checked: false,
  },
  {
    id: 'f4',
    category: 'NOURRITURE',
    name: 'Conserves de Poissons à l\'huile (Sardines, Thon, Maquereaux)',
    nominal14d: '60 boîtes (4-5 boîtes/jour)',
    rationed30d: '120 boîtes (4 boîtes/jour)',
    quantityAcquired: 40,
    targetQuantity: 120,
    unit: 'Boîtes',
    critical: true,
    notes: 'ZÉRO EAU DE CUISSON REQUISE. Prêt à consommer direct froid. Huile calorique précieuse (omégas, lipides) à boire ou incorporer.',
    checked: false,
  },
  {
    id: 'f11',
    category: 'NOURRITURE',
    name: 'Conserves de Légumineuses Cuisinées (Haricots blancs/rouges sauce, Pois chiches cuits, Lentilles cuisinées)',
    nominal14d: '40 boîtes de 400g/800g',
    rationed30d: '90 boîtes (3 boîtes/j pour 8 pers)',
    quantityAcquired: 15,
    targetQuantity: 90,
    unit: 'Boîtes',
    critical: true,
    notes: 'ÉCONOMIE D\'EAU CRITIQUE : Baignent dans leur propre jus/sauce. Zéro prélèvement sur le tank de 500L d\'eau potable ! Mangeable froid ou tiédi direct.',
    checked: false,
  },
  {
    id: 'f12',
    category: 'NOURRITURE',
    name: 'Plats Cuisinés Complets en Boîtes (Cassoulet, Tajines en conserve, Ravioli, Macédoines)',
    nominal14d: '30 boîtes de 800g',
    rationed30d: '60 boîtes (2 grosses boîtes/j pour 8 pers)',
    quantityAcquired: 10,
    targetQuantity: 60,
    unit: 'Boîtes',
    critical: true,
    notes: 'Hydratation + sels minéraux + calories denses sans aucune cuisson lourde. Se réchauffe en quelques minutes sur le plateau du poêle à bois.',
    checked: false,
  },
  {
    id: 'f5',
    category: 'NOURRITURE',
    name: 'Huile d\'olive marocaine (Bidons 5L)',
    nominal14d: '2 bidons (10 L)',
    rationed30d: '4 bidons (20 L)',
    quantityAcquired: 2,
    targetQuantity: 4,
    unit: 'Bidons 5L',
    critical: true,
    notes: '9000 kcal par litre. Carburant métabolique essentiel.',
    checked: true,
  },
  {
    id: 'f6',
    category: 'NOURRITURE',
    name: 'Dattes marocaines (Mejhoul / Boufeggous)',
    nominal14d: '10 kg',
    rationed30d: '20 kg',
    quantityAcquired: 8,
    targetQuantity: 20,
    unit: 'kg',
    critical: true,
    notes: 'Énergie immédiate, minéraux, ne nécessite aucune cuisson.',
    checked: true,
  },
  {
    id: 'f7',
    category: 'NOURRITURE',
    name: 'Thé vert en feuilles, Sucre & Tisanes',
    nominal14d: '3 kg thé, 10 kg sucre',
    rationed30d: '5 kg thé, 20 kg sucre',
    quantityAcquired: 1,
    targetQuantity: 2,
    unit: 'Lots',
    critical: false,
    notes: 'Maintien du moral et de l\'apport hydrique chaud.',
    checked: false,
  },
  {
    id: 'f8',
    category: 'NOURRITURE',
    name: 'Réserve Stratégique de Miel Naturel (400 kg)',
    nominal14d: '400 kg en réserve sécurisée',
    rationed30d: '400 kg (1,2 million de kcal)',
    quantityAcquired: 400,
    targetQuantity: 400,
    unit: 'kg',
    critical: true,
    notes: 'Trésor de résilience du foyer : énergie pure, conservation éternelle, antiseptique et cicatrisant puissant.',
    checked: true,
  },
  {
    id: 'f9',
    category: 'NOURRITURE',
    name: 'Ghee (Beurre clarifié sans caséine) en bocaux verre',
    nominal14d: '5 kg en bocaux stérilisés',
    rationed30d: '10 kg en bocaux stérilisés (~90 000 kcal)',
    quantityAcquired: 3,
    targetQuantity: 10,
    unit: 'kg (bocaux)',
    critical: true,
    notes: 'Purifié de son eau et de sa caséine par cuisson douce. Conservation pluriannuelle sans réfrigérateur. Haute valeur calorique.',
    checked: false,
  },
  {
    id: 'f10',
    category: 'NOURRITURE',
    name: 'Graisse Animale Fondue en bocaux verre (Suif / Graisse de mouton)',
    nominal14d: '5 kg en bocaux verre scellés',
    rationed30d: '10 kg en bocaux verre scellés (~90 000 kcal)',
    quantityAcquired: 2,
    targetQuantity: 10,
    unit: 'kg (bocaux)',
    critical: false,
    notes: 'Graisse de boeuf ou mouton fondue et filtrée. Scellage étanche, résiste à l\'oxydation, idéale pour cuisson des légumineuses.',
    checked: false,
  },

  // SANTÉ & VULNÉRABILITÉS
  {
    id: 's1',
    category: 'SANTÉ',
    name: 'Ventoline (Salbutamol) aérosol doseur',
    nominal14d: '6 sprays neufs (2 par asthmatique)',
    rationed30d: '9 sprays neufs (3 par asthmatique)',
    quantityAcquired: 4,
    targetQuantity: 9,
    unit: 'Sprays',
    critical: true,
    notes: 'Pour Salma, Amina et Leila. + 2 chambres d\'inhalation.',
    checked: false,
  },
  {
    id: 's2',
    category: 'SANTÉ',
    name: 'Masques FFP3 haute filtration (poussières de décombres/gaz)',
    nominal14d: '24 masques (3 par personne)',
    rationed30d: '48 masques (6 par personne)',
    quantityAcquired: 15,
    targetQuantity: 48,
    unit: 'Masques',
    critical: true,
    notes: 'Vital pour les 3 asthmatiques en cas de conflit/frappe urbaine.',
    checked: false,
  },
  {
    id: 's3',
    category: 'SANTÉ',
    name: 'Protections périodiques (6 femmes du foyer)',
    nominal14d: '8 paquets (serviettes hygiéniques)',
    rationed30d: '16 paquets (1 mois complet pour 6 femmes)',
    quantityAcquired: 6,
    targetQuantity: 16,
    unit: 'Paquets',
    critical: true,
    notes: 'Hygiène intime indispensable pour éviter infections sans eau.',
    checked: false,
  },
  {
    id: 's4',
    category: 'SANTÉ',
    name: 'Kit Maternité & Accouchement d\'Urgence (Kenza - 6e mois)',
    nominal14d: '1 trousse obstétrique de base',
    rationed30d: '1 trousse obstétrique complète + compresses stériles',
    quantityAcquired: 1,
    targetQuantity: 1,
    unit: 'Kit',
    critical: true,
    notes: 'Gants stériles, antiseptique sans iode, ciseaux stériles, clamps.',
    checked: true,
  },
  {
    id: 's5',
    category: 'SANTÉ',
    name: 'Traitement Dépression (Nadia) - Stock de sécurité',
    nominal14d: '1 boîte d\'avance',
    rationed30d: '2 boîtes d\'avance (1 mois)',
    quantityAcquired: 1,
    targetQuantity: 2,
    unit: 'Boîtes',
    critical: true,
    notes: 'Ne jamais interrompre brutalement en période de crise.',
    checked: false,
  },
  {
    id: 's6',
    category: 'SANTÉ',
    name: 'Antalgiques & Articulations (Paracétamol, AINS, gels)',
    nominal14d: '6 boîtes Paracétamol 1g + 2 tubes gel',
    rationed30d: '12 boîtes Paracétamol 1g + 4 tubes gel',
    quantityAcquired: 5,
    targetQuantity: 12,
    unit: 'Boîtes',
    critical: true,
    notes: 'Pour douleurs articulaires (Youssef & Nadia) et fièvre.',
    checked: false,
  },
  {
    id: 's7',
    category: 'SANTÉ',
    name: 'Sels de Réhydratation Orale (SRO) pédiatriques/adultes',
    nominal14d: '10 sachets',
    rationed30d: '25 sachets',
    quantityAcquired: 8,
    targetQuantity: 25,
    unit: 'Sachets',
    critical: true,
    notes: 'Prévention déshydratation aiguë en cas d\'eau contaminée.',
    checked: false,
  },
  {
    id: 's8',
    category: 'SANTÉ',
    name: 'Antibiotiques large spectre (Amoxicilline 1g / Augmentin / Azithromycine)',
    nominal14d: '2 boîtes traitement',
    rationed30d: '4 boîtes traitement d\'avance',
    quantityAcquired: 1,
    targetQuantity: 4,
    unit: 'Boîtes',
    critical: true,
    notes: 'Sur ordonnance d\'avance. Pour surinfections respiratoires, dentaires ou plaies infectées.',
    checked: false,
  },
  {
    id: 's9',
    category: 'SANTÉ',
    name: 'Anti-inflammatoires (Ibuprofène 400 mg)',
    nominal14d: '3 boîtes',
    rationed30d: '6 boîtes',
    quantityAcquired: 2,
    targetQuantity: 6,
    unit: 'Boîtes',
    critical: true,
    notes: 'Pour poussées articulaires aiguës (Youssef & Nadia) et inflammations.',
    checked: false,
  },
  {
    id: 's10',
    category: 'SANTÉ',
    name: 'Immunité Naturelle (Huile de Nigelle pure Habba Sawda + Propolis)',
    nominal14d: '2 flacons Nigelle + 2 sprays Propolis',
    rationed30d: '4 flacons Nigelle + 4 sprays Propolis',
    quantityAcquired: 1,
    targetQuantity: 4,
    unit: 'Flacons',
    critical: false,
    notes: 'Renforcement immunitaire naturel majeur, adjuvant asthme et infections ORL.',
    checked: false,
  },
  {
    id: 's11',
    category: 'SANTÉ',
    name: 'Vitamine C 1000 mg (Acérola / Acide ascorbique)',
    nominal14d: '2 boîtes (60 comprimés)',
    rationed30d: '4 boîtes (120 comprimés)',
    quantityAcquired: 1,
    targetQuantity: 4,
    unit: 'Boîtes',
    critical: false,
    notes: 'Maintien de l\'énergie et prévention des carences en rationnement prolongé.',
    checked: false,
  },
  {
    id: 's12',
    category: 'SANTÉ',
    name: 'Trousse Plaies Légères (Alcool 70°, Bétadine jaune/rouge, Compresses 10x10, Pansements, Bandes)',
    nominal14d: '1 kit complet',
    rationed30d: '2 flacons Bétadine 125ml + 100 compresses stériles + 3 bandes Velpeau',
    quantityAcquired: 1,
    targetQuantity: 2,
    unit: 'Kits',
    critical: true,
    notes: 'Désinfection et pansement des coupures, écorchures, ampoules et brûlures.',
    checked: false,
  },
  {
    id: 's13',
    category: 'SANTÉ',
    name: 'Kit Trauma Hémorragie Grave (Garrot CAT Gen 7 + Pansement Israélien 6" + Gaze hémostatique)',
    nominal14d: '1 kit hémostatique d\'urgence',
    rationed30d: '2 Garrots tourniquets CAT + 2 Pansements compressifs + Ciseaux trauma',
    quantityAcquired: 0,
    targetQuantity: 2,
    unit: 'Kits',
    critical: true,
    notes: 'PRIORITÉ ABSOLUE en contexte de conflit/bombardement : arrêt immédiat d\'hémorragie massive.',
    checked: false,
  },

  // ÉNERGIE & CUISSON
  {
    id: 'e1',
    category: 'ÉNERGIE',
    name: 'Station d\'énergie 1200Wh (usage strict éco)',
    nominal14d: '1 station 1200Wh chargée à 100%',
    rationed30d: '1 station 1200Wh + gestion rigoureuse',
    quantityAcquired: 1,
    targetQuantity: 1,
    unit: 'Unité',
    critical: true,
    notes: 'Interdiction cuisson/chauffe. Téléphones, lampes LED, radio.',
    checked: true,
  },
  {
    id: 'e2',
    category: 'ÉNERGIE',
    name: 'Panneau Solaire Pliable (100W ou 200W)',
    nominal14d: '1 panneau pliable 100W/200W',
    rationed30d: '1 panneau pliable 200W',
    quantityAcquired: 0,
    targetQuantity: 1,
    unit: 'Unité',
    critical: true,
    notes: 'URGENT : Manquant actuellement ! Rendrait la batterie 1200W infinie.',
    checked: false,
  },
  {
    id: 'e3',
    category: 'ÉNERGIE',
    name: 'Bouteilles de Gaz Butane (5 bouteilles : 3 grosses 12kg + 2 petites 3kg)',
    nominal14d: '3 grosses bouteilles de 12 kg',
    rationed30d: '5 bouteilles au total (3x 12kg + 2x 3kg)',
    quantityAcquired: 2,
    targetQuantity: 5,
    unit: 'Bouteilles',
    critical: true,
    notes: 'À stocker impérativement au rez-de-chaussée bien ventilé/quai (jamais au 3e étage). Détendeur et tuyaux neufs.',
    checked: false,
  },
  {
    id: 'e4',
    category: 'ÉNERGIE',
    name: 'Radio d\'urgence solaire + manivelle dynamo + batterie rechargeable + piles',
    nominal14d: '1 radio d\'urgence dynamo (Type Midland ER300)',
    rationed30d: '1 radio multifonction + 1 radio de secours + piles',
    quantityAcquired: 0,
    targetQuantity: 1,
    unit: 'Radio',
    critical: true,
    notes: 'Rechargeable par manivelle moulinet, panneau solaire, USB ou piles AA. Fait aussi office de powerbank.',
    checked: false,
  },
  {
    id: 'e5',
    category: 'ÉNERGIE',
    name: 'Lampes torches à manivelle (dynamo) & Lampes frontales LED',
    nominal14d: '4 lampes dynamo (moulinet) + 2 frontales',
    rationed30d: '8 lampes dynamo (1 par membre) + piles réserve',
    quantityAcquired: 2,
    targetQuantity: 8,
    unit: 'Lampes',
    critical: true,
    notes: 'Tu tournes le moulinet et ça s\'allume sans jamais avoir besoin d\'électricité ni de piles.',
    checked: false,
  },
  {
    id: 'e6',
    category: 'ÉNERGIE',
    name: '1 Tonne de Bois de Chauffage (Stockage Garage sur palettes)',
    nominal14d: '1 tonne de bois sec (chêne vert / olivier / eucalyptus)',
    rationed30d: '1 tonne (65 à 100 jours de chauffage & cuisson continue)',
    quantityAcquired: 0,
    targetQuantity: 1000,
    unit: 'kg',
    critical: true,
    notes: 'Pour le poêle à bois : autonomie thermique totale et cuisson/stérilisation d\'eau sans gaz ni électricité. Stocker sur palettes.',
    checked: false,
  },
  {
    id: 'e7',
    category: 'ÉNERGIE',
    name: 'Détecteur de Monoxyde de Carbone (CO) à piles',
    nominal14d: '1 détecteur avec écran digital',
    rationed30d: '1 détecteur CO + piles de réserve',
    quantityAcquired: 0,
    targetQuantity: 1,
    unit: 'Unité',
    critical: true,
    notes: 'SÉCURITÉ VITALE avec le poêle à bois : prévient les intoxications au monoxyde de carbone inodore.',
    checked: false,
  },
  {
    id: 'l4',
    category: 'LOGISTIQUE',
    name: 'Boîte à Outils d\'Urgence Réunie (Pied-de-biche, clés à gaz, pinces, scies, duct tape)',
    nominal14d: '1 boîte à outils de crise centralisée',
    rationed30d: '1 boîte étanche complète avec consommables de fixation',
    quantityAcquired: 0,
    targetQuantity: 1,
    unit: 'Boîte',
    critical: true,
    notes: 'Rassembler tous les outils éparpillés dans une caisse unique étanche au quai/RDC.',
    checked: false,
  },
  {
    id: 'l5',
    category: 'LOGISTIQUE',
    name: 'Toilettes Sèches d\'Urgence (2 Seaux 20L étanches + Lunette clipsable + 50 Sacs épais 100µm)',
    nominal14d: '1 seau 20L + 1 rouleau 30 sacs poubelle renforcés',
    rationed30d: '2 seaux 20L + lunette camping + 60 sacs étanches',
    quantityAcquired: 0,
    targetQuantity: 2,
    unit: 'Kits',
    critical: true,
    notes: 'VITAL : En blackout/coupure d\'eau, interdiction de tirer la chasse (gaspille 10L d\'eau et bouche les égouts). Méthode des toilettes sèches.',
    checked: false,
  },
  {
    id: 'l6',
    category: 'LOGISTIQUE',
    name: 'Litière Carbonée Anti-Odeurs (Sciure de bois menuisier + Cendres du poêle)',
    nominal14d: '1 grand sac de sciure sèche + cendres tamisées',
    rationed30d: '2 grands sacs de sciure sèche (ou copeaux)',
    quantityAcquired: 0,
    targetQuantity: 2,
    unit: 'Sacs',
    critical: true,
    notes: 'À récupérer chez le menuisier (Najar) ou utiliser les cendres refroidies du poêle à bois. Recouvrir chaque passage d\'une poignée.',
    checked: false,
  },
  {
    id: 'd1',
    category: 'LOGISTIQUE',
    name: 'Carillons Mécaniques & Coins Bloque-Portes avec Alarme 120 dB',
    nominal14d: '3 carillons/clochettes de porte + 2 cales bloque-porte 120dB',
    rationed30d: '5 carillons (quai, RDC, portes 3e étage) + 3 cales alarme',
    quantityAcquired: 0,
    targetQuantity: 5,
    unit: 'Unités',
    critical: true,
    notes: 'Alerte mécanique immédiate sans internet. La cale bloque physiquement la porte et hurle à 120 dB en cas de poussée.',
    checked: false,
  },
  {
    id: 'd2',
    category: 'LOGISTIQUE',
    name: 'Détecteur de Mouvement PIR Autonome pour Escalier (RDC ➔ 3e Étage)',
    nominal14d: '1 détecteur PIR RDC + 1 carillon récepteur 3e étage',
    rationed30d: '2 détecteurs (quai + bas escalier) + carillons',
    quantityAcquired: 0,
    targetQuantity: 2,
    unit: 'Kits',
    critical: true,
    notes: 'Alerte d\'intrusion sans fil à piles : sonne dans la chambre du 3e étage dès que quelqu\'un monte les marches de l\'immeuble.',
    checked: false,
  },
  {
    id: 'd3',
    category: 'LOGISTIQUE',
    name: 'Bombes de Défense Gel Poivre OC (300 ml / Extincteur de défense)',
    nominal14d: '2 bombes gel poivre 300ml (RDC et 3e étage)',
    rationed30d: '4 bombes gel poivre 300ml (portée 5 mètres)',
    quantityAcquired: 0,
    targetQuantity: 4,
    unit: 'Unités',
    critical: true,
    notes: 'LE GEL EST OBLIGATOIRE (pas de gaz). Jet précis à 5m sans retour de nuage dans la cage d\'escalier. Neutralise tout intrus immédiatement.',
    checked: false,
  },
  {
    id: 'd4',
    category: 'LOGISTIQUE',
    name: 'Lampes Tactiques Stroboscopiques Aveuglantes (2000 Lumens)',
    nominal14d: '2 lampes tactiques stroboscopiques',
    rationed30d: '4 lampes tactiques rechargeables',
    quantityAcquired: 0,
    targetQuantity: 4,
    unit: 'Lampes',
    critical: true,
    notes: 'Flash stroboscopique puissant : désoriente et aveugle un agresseur dans l\'obscurité de l\'escalier à distance sans contact physique.',
    checked: false,
  },
  {
    id: 'd5',
    category: 'LOGISTIQUE',
    name: 'Sifflets de Détresse Haute Puissance 120 dB (8 unités - Métal)',
    nominal14d: '8 sifflets (1 par membre du foyer)',
    rationed30d: '8 sifflets avec cordon tour de cou',
    quantityAcquired: 0,
    targetQuantity: 8,
    unit: 'Sifflets',
    critical: true,
    notes: 'Chaque femme, ado et personne âgée porte un sifflet pour donner l\'alerte instantanément dans tout l\'immeuble.',
    checked: false,
  },

  // LOGISTIQUE & SURVIE
  {
    id: 'l1',
    category: 'LOGISTIQUE',
    name: 'Réserve de Cash en Dirhams (Petites coupures)',
    nominal14d: '5 000 DH (billets 20, 50, 100 DH)',
    rationed30d: '10 000 DH (petites coupures et pièces)',
    quantityAcquired: 3500,
    targetQuantity: 10000,
    unit: 'Dirhams',
    critical: true,
    notes: 'Les distributeurs GAB et paiements par carte coupent immédiatement.',
    checked: false,
  },
  {
    id: 'l2',
    category: 'LOGISTIQUE',
    name: 'Radio portable FM/AM/Ondes Courtes (Piles / Manivelle)',
    nominal14d: '1 radio de secours',
    rationed30d: '1 radio + 8 piles rechargeables',
    quantityAcquired: 1,
    targetQuantity: 1,
    unit: 'Radio',
    critical: true,
    notes: 'Pour écouter SNRT Al Idaa Al Watania et Médi 1 lors du blackout.',
    checked: true,
  },
  {
    id: 'l3',
    category: 'LOGISTIQUE',
    name: 'Sangle de portage / Chaise d\'évacuation pour Aïcha (R+3)',
    nominal14d: '1 sangle d\'évacuation pompiers',
    rationed30d: '1 sangle robuste pour descente rapide',
    quantityAcquired: 0,
    targetQuantity: 1,
    unit: 'Unité',
    critical: true,
    notes: 'Pour permettre à Karim et Youssef de descendre Aïcha rapidement.',
    checked: false,
  },
];

const defaultEmergencyPlan: EmergencyPlan = {
  buildingFloors: 'Immeuble R+3 (Appartement au 3e étage + Quai de stockage au RDC)',
  meetingPointPrimary: 'Quai de déchargement RDC / Porte cochère arrière',
  meetingPointSecondaryRural: 'Maison familiale en zone rurale / Périurbaine',
  outOfZoneContactName: 'Oncle Rachid (Région Nord)',
  outOfZoneContactPhone: '+212 611-223344',
  cashReserveDirhams: 5000,
  gasBottlesCount: 2,
  evacuationNotes: 'Ordre de descente escalier R+3 : 1) Karim avec Aïcha (sangle portage), 2) Salma avec Kenza (enceinte), 3) Youssef avec sac d\'urgence et Nadia, 4) Amina et Leila avec radios et trousses de soins.',
};

const defaultContacts: EmergencyContact[] = [
  {
    id: 'c1',
    name: 'Dr. Bennani (Médecin Généraliste)',
    roleOrRelation: 'Suivi Asthme & Hypertension',
    phone: '+212661001122',
    whatsapp: '+212661001122',
    email: 'dr.bennani.sante@gmail.com',
    city: 'Rabat / Salé',
  },
  {
    id: 'c2',
    name: 'Rachid El Amrani (Oncle / Contact ICE)',
    roleOrRelation: 'Contact Hors-Zone (Zone Nord)',
    phone: '+212611223344',
    whatsapp: '+212611223344',
    email: 'rachid.amrani@hotmail.com',
    city: 'Tanger',
  },
  {
    id: 'c3',
    name: 'M. Tazi (Voisin Rez-de-Chaussée)',
    roleOrRelation: 'Surveillance Quai & Cuve 500L',
    phone: '+212670334455',
    whatsapp: '+212670334455',
    city: 'Immeuble RDC',
  },
  {
    id: 'c4',
    name: 'Pharmacie de Garde Centrale',
    roleOrRelation: 'Urgences Médicaments & SRO',
    phone: '+212537001122',
    whatsapp: '+212660998877',
    city: 'Quartier',
  },
];

const defaultWaterPoints: WaterPoint[] = [
  {
    id: 'wp1',
    name: 'Grande Mosquée de Quartier (Salle d\'ablutions & Réserve)',
    type: 'MOSQUEE',
    distanceMeters: 550,
    walkMinutesOneWay: 7,
    fillTimeMinutes: 12,
    totalRoundTripMinutes: 26,
    capacityInfo: 'Batterie de robinets + Citerne tampon',
    quality: 'POTABLE_DIRECT',
    notes: 'Priorité 1 : Idéal pour 3 personnes avec 6 bidons de 5L. Remplissage rapide en 10-12 min. Demander au gardien/Moqaddem.',
    isVerified: true,
    addressOrLandmark: 'À 550m du domicile - Rue principale',
  },
  {
    id: 'wp2',
    name: 'Fontaine Publique Traditionnelle (Saqaya Bab / Médina)',
    type: 'SAQAYA',
    distanceMeters: 900,
    walkMinutesOneWay: 11,
    fillTimeMinutes: 14,
    totalRoundTripMinutes: 36,
    capacityInfo: 'Débit continu ONEE / Source municipale',
    quality: 'POTABLE_DIRECT',
    notes: 'Gratuit et accessible en permanence. Risque d\'affluence en crise : y aller à l\'aube (06h00).',
    isVerified: true,
    addressOrLandmark: 'Angle place publique - 900m',
  },
  {
    id: 'wp3',
    name: 'Hammam Traditionnel de Quartier (Chaudière & Forage)',
    type: 'HAMMAM',
    distanceMeters: 1250,
    walkMinutesOneWay: 16,
    fillTimeMinutes: 15,
    totalRoundTripMinutes: 47,
    capacityInfo: 'Citerne géante 8 000L + Puits interne',
    quality: 'JAVEL_OBLIGATOIRE',
    notes: 'Le hammam dispose d\'une immense réserve autonome même lors d\'un blackout. Traitement Javel obligatoire (3 mL / 30L).',
    isVerified: true,
    addressOrLandmark: 'Quartier commerçant - 1,25 km',
  },
  {
    id: 'wp4',
    name: 'Puits / Forage Privé de Voisinage (Résidence avec Surpresseur)',
    type: 'PUITS',
    distanceMeters: 1450,
    walkMinutesOneWay: 19,
    fillTimeMinutes: 15,
    totalRoundTripMinutes: 53,
    capacityInfo: 'Nappe phréatique / Pompe manuelle ou groupe',
    quality: 'FILTRATION_LOURDE',
    notes: 'Seuil critique (< 60 min). Eau de nappe : filtration céramique 0.1µm + Javel impérative pour femme enceinte et senior.',
    isVerified: false,
    addressOrLandmark: 'Résidence voisine clôturée - 1,45 km',
  },
  {
    id: 'wp5',
    name: 'Réservoir Municipal / Château d\'Eau de District',
    type: 'PUBLIC',
    distanceMeters: 2800,
    walkMinutesOneWay: 38,
    fillTimeMinutes: 15,
    totalRoundTripMinutes: 91,
    capacityInfo: 'Grand réservoir sécurisé',
    quality: 'POTABLE_DIRECT',
    notes: '🔴 HORS DÉLAI PÉDESTRE (> 60 MIN). Aller-retour = 5,6 km à pied chargé. Réservé à un transport en vélo, charrette ou véhicule.',
    isVerified: false,
    addressOrLandmark: 'Hauts de la commune - 2,8 km',
  },
];

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>('moderne');
  const [mode, setMode] = useState<'14D_NOMINAL' | '30D_RATIONED'>('14D_NOMINAL');
  const [members, setMembers] = useState<FamilyMember[]>(defaultMembers);
  const [supplies, setSupplies] = useState<SupplyItem[]>(defaultSupplies);
  const [waterTank, setWaterTank] = useState<WaterTank>({
    capacityLiters: 500,
    currentLevelLiters: 500,
    lastTreatmentDate: '2026-10-15',
    treatmentType: 'Micropur Classic & Filtration',
    treatmentStatus: 'VALIDE',
  });
  const [waterPoints, setWaterPoints] = useState<WaterPoint[]>(defaultWaterPoints);
  const [battery, setBattery] = useState<BatteryStatus>({
    capacityWh: 1200,
    currentPercent: 95,
    hasSolarPanel: false,
    dailyConsumptionWh: 120, // 8 téléphones x 10Wh + 2x lampes LED 20Wh
  });
  const [emergencyPlan, setEmergencyPlan] = useState<EmergencyPlan>(defaultEmergencyPlan);
  const [contacts, setContacts] = useState<EmergencyContact[]>(defaultContacts);
  const [localMessages, setLocalMessages] = useState<LocalMessage[]>([
    {
      id: '1',
      sender: 'Système PrépaCrisis',
      timestamp: 'Initialisation',
      text: 'Réseau local opérationnel. Prêt pour diffusion d\'urgence.',
      isUrgent: false,
    },
  ]);
  const [readGuides, setReadGuides] = useState<number[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('prepa_theme');
      if (savedTheme && ['moderne', 'tactique', 'survivaliste'].includes(savedTheme)) {
        setTheme(savedTheme as ThemeMode);
      }

      const savedMode = localStorage.getItem('prepa_mode');
      if (savedMode) setMode(savedMode as any);

      const savedMembers = localStorage.getItem('prepa_members');
      if (savedMembers) {
        try {
          const parsed: any[] = JSON.parse(savedMembers);
          // Purge systématique des anciens personnages fictifs si détectés
          const hasFictitious = parsed.some(
            (m) =>
              (m.id === 'm1' && m.name?.includes('Aïcha')) ||
              m.name === 'Youssef' ||
              m.name === 'Karim' ||
              m.name === 'Salma' ||
              m.name === 'Kenza'
          );
          if (hasFictitious) {
            localStorage.removeItem('prepa_members');
            setMembers([]);
          } else {
            const sanitized: FamilyMember[] = parsed.map((m, idx) => ({
              id: m.id || `m_${idx}_${Date.now()}`,
              name: m.name || 'Membre du foyer',
              gender: m.gender === 'F' ? 'F' : 'M',
              ageGroup: m.ageGroup || 'adulte',
              medicalNeeds: Array.isArray(m.medicalNeeds) ? m.medicalNeeds : [],
              role: m.role || 'Membre de l\'unité',
              status: m.status || 'SECURISE',
              phone: m.phone || '',
              isMobilityReduced: !!m.isMobilityReduced,
            }));
            setMembers(sanitized);
          }
        } catch {
          setMembers([]);
        }
      } else {
        setMembers([]);
      }

      const savedSupplies = localStorage.getItem('prepa_supplies');
      if (savedSupplies) {
        const parsed: SupplyItem[] = JSON.parse(savedSupplies);
        const existingIds = new Set(parsed.map(item => item.id));
        const missingDefaults = defaultSupplies.filter(item => !existingIds.has(item.id));
        setSupplies([...parsed, ...missingDefaults]);
      }

      const savedWater = localStorage.getItem('prepa_water');
      if (savedWater) setWaterTank(JSON.parse(savedWater));

      const savedWaterPoints = localStorage.getItem('prepa_water_points');
      if (savedWaterPoints) {
        const parsed: WaterPoint[] = JSON.parse(savedWaterPoints);
        const existingIds = new Set(parsed.map(item => item.id));
        const missingDefaults = defaultWaterPoints.filter(item => !existingIds.has(item.id));
        setWaterPoints([...parsed, ...missingDefaults]);
      }

      const savedBattery = localStorage.getItem('prepa_battery');
      if (savedBattery) setBattery(JSON.parse(savedBattery));

      const savedPlan = localStorage.getItem('prepa_plan');
      if (savedPlan) setEmergencyPlan(JSON.parse(savedPlan));

      const savedContacts = localStorage.getItem('prepa_contacts');
      if (savedContacts) setContacts(JSON.parse(savedContacts));

      const savedMsgs = localStorage.getItem('prepa_msgs');
      if (savedMsgs) setLocalMessages(JSON.parse(savedMsgs));

      const savedGuides = localStorage.getItem('prepa_guides');
      if (savedGuides) setReadGuides(JSON.parse(savedGuides));
    } catch (e) {
      console.warn('Could not load from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  // Sync theme attribute to document root & local storage
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme);
    }
    if (isLoaded) {
      try {
        localStorage.setItem('prepa_theme', theme);
      } catch (e) {
        console.warn('Could not save theme to localStorage:', e);
      }
    }
  }, [theme, isLoaded]);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('prepa_mode', mode);
      localStorage.setItem('prepa_members', JSON.stringify(members));
      localStorage.setItem('prepa_supplies', JSON.stringify(supplies));
      localStorage.setItem('prepa_water', JSON.stringify(waterTank));
      localStorage.setItem('prepa_water_points', JSON.stringify(waterPoints));
      localStorage.setItem('prepa_battery', JSON.stringify(battery));
      localStorage.setItem('prepa_plan', JSON.stringify(emergencyPlan));
      localStorage.setItem('prepa_contacts', JSON.stringify(contacts));
      localStorage.setItem('prepa_msgs', JSON.stringify(localMessages));
      localStorage.setItem('prepa_guides', JSON.stringify(readGuides));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [mode, members, supplies, waterTank, battery, emergencyPlan, contacts, localMessages, readGuides, isLoaded]);

  const markGuideAsRead = (id: number) => {
    setReadGuides((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Synchronisation broadcast local entre onglets / appareils Wi-Fi si même origine
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('prepacrisis_local_mesh');
    channel.onmessage = (event) => {
      if (event.data?.type === 'NEW_MESSAGE') {
        setLocalMessages((prev) => [event.data.message, ...prev.slice(0, 49)]);
      }
    };
    return () => {
      channel.close();
    };
  }, []);

  const addMember = (member: Omit<FamilyMember, 'id'>) => {
    const newMember: FamilyMember = {
      ...member,
      id: `m_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: member.status || 'SECURISE',
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const updateMember = (id: string, updates: Partial<FamilyMember>) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const setMemberStatus = (id: string, status: FamilyMemberStatus) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const clearAllMembers = () => {
    setMembers([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('prepa_members');
    }
  };

  const toggleSupplyCheck = (id: string) => {
    setSupplies((prev) => prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)));
  };

  const updateSupplyQuantity = (id: string, quantity: number) => {
    setSupplies((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, quantityAcquired: Math.max(0, quantity), checked: quantity >= s.targetQuantity } : s
      )
    );
  };

  const updateWaterTank = (updates: Partial<WaterTank>) => {
    setWaterTank((prev) => ({ ...prev, ...updates }));
  };

  const addWaterPoint = (point: Omit<WaterPoint, 'id'>) => {
    const newPoint: WaterPoint = {
      ...point,
      id: 'wp_' + Date.now().toString(),
    };
    setWaterPoints((prev) => [...prev, newPoint]);
  };

  const deleteWaterPoint = (id: string) => {
    setWaterPoints((prev) => prev.filter((wp) => wp.id !== id));
  };

  const updateWaterPoint = (id: string, updates: Partial<WaterPoint>) => {
    setWaterPoints((prev) => prev.map((wp) => (wp.id === id ? { ...wp, ...updates } : wp)));
  };

  const addFetchedWaterToTank = (liters: number) => {
    setWaterTank((prev) => ({
      ...prev,
      currentLevelLiters: Math.min(prev.capacityLiters, prev.currentLevelLiters + liters),
    }));
  };

  const updateBattery = (updates: Partial<BatteryStatus>) => {
    setBattery((prev) => ({ ...prev, ...updates }));
  };

  const updateEmergencyPlan = (updates: Partial<EmergencyPlan>) => {
    setEmergencyPlan((prev) => ({ ...prev, ...updates }));
  };

  const addContact = (contact: Omit<EmergencyContact, 'id'>) => {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const updateContact = (id: string, updates: Partial<EmergencyContact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addLocalMessage = (text: string, isUrgent = false) => {
    const newMsg: LocalMessage = {
      id: Date.now().toString(),
      sender: isUrgent ? 'ALERTE SOS FOYER' : 'Membre Foyer',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      isUrgent,
    };
    setLocalMessages((prev) => [newMsg, ...prev.slice(0, 49)]);

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('prepacrisis_local_mesh');
        channel.postMessage({ type: 'NEW_MESSAGE', message: newMsg });
      } catch (err) {
        // Broadcast error ignored
      }
    }
  };

  // Score de préparation global (0 à 100%)
  const checkedCount = supplies.filter((s) => s.checked).length;
  const criticalItems = supplies.filter((s) => s.critical);
  const criticalChecked = criticalItems.filter((s) => s.checked).length;
  const score = Math.round(
    ((criticalChecked / criticalItems.length) * 0.7 + (checkedCount / supplies.length) * 0.3) * 100
  ) || 0;

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        mode,
        setMode,
        members,
        addMember,
        updateMember,
        deleteMember,
        setMemberStatus,
        clearAllMembers,
        supplies,
        toggleSupplyCheck,
        updateSupplyQuantity,
        waterTank,
        updateWaterTank,
        waterPoints,
        addWaterPoint,
        deleteWaterPoint,
        updateWaterPoint,
        addFetchedWaterToTank,
        battery,
        updateBattery,
        emergencyPlan,
        updateEmergencyPlan,
        contacts,
        addContact,
        deleteContact,
        updateContact,
        localMessages,
        addLocalMessage,
        readGuides,
        markGuideAsRead,
        isLoaded,
        score,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

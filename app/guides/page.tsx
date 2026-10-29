'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { useAppContext } from '@/components/AppContext';
import { Printer } from 'lucide-react';

const guidesData = [
  { 
    id: 1, 
    title: "Purification & Fût 500L d'Eau (Javel, Filtration, Pluie)", 
    category: "EAU",
    icon: "water_drop", 
    lvl: "VITAL P0", 
    status: 100, 
    desc: "Dosages exacts de Javel pour cuve de 500L, récupération d'eau de pluie et stérilisation sur poêle.",
    content: `
# Guide Opérationnel : Rendre l'Eau Potable en Crise (Fût 500L & Eau de Pluie)

L'eau non traitée est le premier vecteur d'épidémies mortelles en période de crise (choléra, typhoïde, dysenterie). Ce guide vous donne les dosages certifiés par l'OMS et la Sécurité Civile.

---

## 1. Stérilisation à l'Eau de Javel (Fût 500L & Petits Volumes)

### ⚠️ Règle Absolue sur la Javel :
- Utilisez **UNIQUEMENT de l'eau de Javel classique à 2,6 % de chlore actif** (ou 9,6° chlorométrique).
- Elle doit être **STRICTEMENT NON PARFUMÉE**, sans additifs, sans agents moussants, sans tensioactifs ni blanchissants.
- Ne jamais utiliser de pastilles pour piscine ni de javel parfumée à l'eucalyptus/citron.

### 🧪 Tableau des Dosages Officiels (Eau Claire) :

| Volume d'eau | Dose de Javel (2,6%) | Équivalence Pratique |
| :--- | :---: | :--- |
| **1 Litre** | 2 gouttes | Avec un compte-gouttes ou pointe de couteau |
| **5 Litres (Bidon)** | 10 gouttes | ~0,5 mL |
| **10 Litres** | 20 gouttes | ~1 mL (1/4 de cuillère à café) |
| **50 Litres** | 5 mL | 1 cuillère à café rase |
| **100 Litres** | 10 mL | 2 cuillères à café |
| **500 Litres (Fût / Tank)** | **50 mL** | **1/2 petit verre à thé marocain** (ou 3,5 cuillères à soupe) |

> **⚠️ Si l'eau est trouble ou d'origine pluviale douteuse :** Filtrez-la d'abord à travers un tissu fin, puis **doublez la dose de Javel (100 mL pour 500 L)**.

### ⏱️ Temps d'Action Obligatoire :
- **Attendre 30 minutes minimum** (cuve ou bidon fermé hermétiquement) avant de consommer.
- Si l'eau est très froide (< 15°C) : attendre **60 minutes**.
- **Test d'efficacité :** Après 30 minutes, l'eau doit dégager une très légère odeur de chlore. C'est la preuve que les germes ont été détruits et qu'il reste un résidu désinfectant protecteur.

---

## 2. Protocole pour Récupérer et Rendre Potable l'Eau de Pluie

L'eau de pluie qui coule sur un toit est **systématiquement contaminée** par les poussières, les déjections d'oiseaux et les moisissures. Suivez ce protocole en 3 étapes :

### Étape 1 : Le "First Flush" (Dérivation des premières eaux)
- **Ne jamais collecter les 15 premières minutes de pluie.** Elles lavent les tuiles et la toiture de toutes les saletés.
- Déconnectez la descente de gouttière pendant le premier quart d'heure, puis reconnectez vers le récipient de stockage.

### Étape 2 : Pré-filtration & Décantation
1. Laissez reposer l'eau 2 à 4 heures dans un premier seau : la terre et les particules lourdes tombent au fond (décantation).
2. Transvasez l'eau claire du dessus à travers un **tissu propre en coton fin, un filtre à café ou une mousseline** pour retenir les débris flottants.

### Étape 3 : Filtration fine (0,1 micron) & Stérilisation
- Passez l'eau dans votre filtre à gravité (Berkey / British Berkefeld) ou filtre paille (Sawyer Squeeze) pour éliminer 99,9999% des bactéries et parasites.
- **Stérilisation finale :** Soit avec la dose de Javel (2 gouttes par litre), soit par **ébullition sur votre poêle à bois**.

---

## 3. Stérilisation Thermique sur le Poêle à Bois (Zéro Chimie)

Le poêle à bois est votre arme absolue pour l'eau :
- Mettez une grande marmite d'eau sur le plateau du poêle.
- Portez à **ébullition franche à gros bouillons pendant 1 minute complète** (3 minutes si en haute altitude).
- L'ébullition détruit 100 % des micro-organismes vivants (virus, bactéries, kystes, spores).
- Laissez refroidir avec un couvercle propre. Pour enlever le goût plat de l'eau bouillie, transvasez-la plusieurs fois d'un récipient à un autre pour la ré-oxygéner.

---

## 4. Économie d'Eau Critique par les Conserves Cuisinées

L'erreur la plus courante en état de siège ou de pénurie hydrique est de ne stocker que des aliments secs (riz, lentilles crues, pois chiches secs).
- **Le piège des aliments secs :** 1 kg de légumineuses sèches nécessite **2,5 à 3 Litres d'eau potable** pour gonfler et cuire, plus la perte en vapeur. Pour 8 personnes sur 30 jours, cuisiner exclusivement des aliments secs puiserait **120 à 150 Litres** dans votre cuve de 500L (soit près de 30% de votre réserve vitale !).

### 🥫 L'Avantage Stratégique des Conserves Cuisinées :
1. **Zéro prélèvement d'eau :** Les boîtes de haricots cuisinés (blancs/rouges), pois chiches au naturel, lentilles préparées, tajines en boîte, cassoulet, thon et sardines baignent dans leur propre liquide stérile.
2. **Ne jetez jamais le jus ou la sauce :** Ce liquide n'est pas un déchet ! C'est de l'eau stérile chargée en sels minéraux (sodium, potassium, micronutriments). Buvez-le ou trempez-y du pain : il participe directement à la ration hydrique quotidienne du foyer.
3. **L'huile des poissons :** L'huile des boîtes de sardines et de thon fournit 900 kcal pour 100g. En période de rationnement, incorporez cette huile dans toutes vos portions.
4. **Zéro énergie requise :** Les conserves sont précuites. Elles se consomment froides instantanément ou simplement tiédies quelques minutes sur le plateau du poêle à bois sans consommer de gaz de cuisson.
    `
  },
  { 
    id: 2, 
    title: "Atténuation Réseau Électrique", 
    category: "ÉNERGIE",
    icon: "electric_bolt", 
    lvl: "NIV 02", 
    status: 42, 
    desc: "Maintien de l'alimentation opérationnelle lors d'une défaillance totale de l'infrastructure.",
    content: `
# Atténuation Réseau Électrique (Blackout)

Une panne de courant prolongée affecte les communications, la conservation des aliments et le chauffage.

## 1. Énergie de Secours
- **Batteries externes (Powerbanks) :** Maintenez-les chargées. Privilégiez les modèles > 20000 mAh.
- **Générateurs solaires :** Stations d'énergie portables (Ecoflow, Jackery) couplées à des panneaux solaires pliables.
- **Générateurs thermiques :** Nécessitent du carburant (stockage dangereux) et font du bruit (attire l'attention).

## 2. Éclairage
- **Lampes frontales :** Libèrent les mains. Prévoyez des piles de rechange.
- **Lampes tactiques :** Puissantes, peuvent servir à l'éblouissement.
- **Bougies et lampes à huile :** Attention au risque d'incendie.

## 3. Conservation des Aliments
- Ne pas ouvrir le réfrigérateur/congélateur inutilement.
- Un congélateur plein garde le froid pendant environ 48h si non ouvert.
    `
  },
  { 
    id: 3, 
    title: "Premiers Secours Tactiques", 
    category: "SANTÉ",
    icon: "medical_services", 
    lvl: "CRITIQUE", 
    status: 100, 
    desc: "Réponse avancée aux traumatismes pour les opérations sur le terrain et les zones de crise.",
    content: `
# Premiers Secours Tactiques (TCCC)

En situation de crise, les services d'urgence peuvent être indisponibles. Vous êtes le premier répondant.

## 1. Protocole MARCH
- **M (Massive Hemorrhage) :** Contrôle des hémorragies massives (Garrot tourniquet type CAT, pansements compressifs).
- **A (Airway) :** Libération des voies aériennes.
- **R (Respiration) :** Gestion des plaies thoraciques (pansements occlusifs).
- **C (Circulation) :** Prévention du choc.
- **H (Hypothermia) :** Prévention de l'hypothermie (couverture de survie).

## 2. Kit IFAK (Individual First Aid Kit)
- Garrot CAT (vrai, pas de contrefaçon)
- Pansement compressif (Israeli bandage)
- Gaze hémostatique (QuikClot, Celox)
- Gants en nitrile
- Ciseaux gésic (trauma shears)

## 3. Formation
- Suivez une formation PSC1 (minimum) ou TCCC/TECC (idéal). Le matériel est inutile sans les connaissances.
    `
  },
  { 
    id: 4, 
    title: "Extraction Urbaine", 
    category: "SÉCURITÉ",
    icon: "map", 
    lvl: "NIV 01", 
    status: 12, 
    desc: "Navigation sécurisée et évacuation des zones métropolitaines à haute densité.",
    content: `
# Extraction Urbaine (Bug Out)

L'évacuation d'une zone urbaine dense lors d'une crise majeure nécessite une planification minutieuse.

## 1. Le Sac d'Évacuation (Bug Out Bag - BOB)
- Prêt à partir en 5 minutes.
- Contient de quoi survivre 72h de manière autonome.
- Poids max : 15-20% de votre poids corporel.

## 2. Itinéraires
- **Itinéraire Primaire :** Le chemin le plus rapide vers votre point de chute (Bug Out Location - BOL).
- **Itinéraires Secondaires :** Au moins 2 alternatives évitant les axes principaux (qui seront congestionnés).
- **Cartographie :** Cartes papier de la région et boussole. Ne comptez pas sur le GPS/Smartphones.

## 3. Règle de l'Homme Gris (Grey Man)
- Ne pas attirer l'attention.
- Évitez les vêtements tactiques ou de camouflage.
- Portez des couleurs neutres (gris, marron, bleu marine).
- Ayez l'air de savoir où vous allez.
    `
  },
  {
    id: 5,
    title: "Communications d'Urgence",
    category: "COMMS",
    icon: "satellite_alt",
    lvl: "NIV 03",
    status: 60,
    desc: "Établissement de liaisons radio sécurisées sans infrastructure cellulaire.",
    content: `
# Communications d'Urgence

Quand les réseaux cellulaires tombent, la radio devient le seul moyen de communication.

## 1. Récepteurs (Écoute)
- **Radio à manivelle/solaire :** Pour écouter les bulletins d'information d'urgence (FM/AM).
- **Scanner radio :** Pour écouter les fréquences des services d'urgence.

## 2. Émetteurs-Récepteurs
- **PMR446 (Talkie-walkie) :** Sans licence, portée courte (1-3 km en urbain), idéal pour les communications de groupe rapproché.
- **Radio Amateur (VHF/UHF) :** Type Baofeng UV-5R. Nécessite une licence pour émettre. Portée moyenne à longue (avec relais).
- **CB (Citizen Band) :** Sans licence, idéal pour les communications en véhicule.

## 3. Protocoles
- Définissez des fréquences primaires et secondaires avec votre groupe.
- Établissez des heures de vacation (ex: écoute 5 min toutes les heures à l'heure pile) pour économiser les batteries.
    `
  },
  {
    id: 6,
    title: "Toilettes Sèches & Assainissement (Coupure Eau/Égout)",
    category: "SÉCURITÉ",
    icon: "sanitizer",
    lvl: "VITAL P0",
    status: 100,
    desc: "Méthode des 2 seaux, sciure et cendres du poêle pour éviter les épidémies et le refoulement des égouts.",
    content: `
# Toilettes Sèches d'Urgence : Prévenir les Épidémies en Coupure d'Assainissement

En situation de crise majeure ou de conflit, **les réseaux d'égouts et les stations d'épuration s'arrêtent dès la coupure d'électricité**.

---

## 1. L'Erreur Mortelle : Continuer à Tirer la Chasse d'Eau

- **Gaspillage insensé d'eau potable :** Une chasse d'eau consomme **6 à 10 litres d'eau**. Pour 8 personnes à 3 passages par jour, c'est **150 à 250 Litres d'eau jetés chaque jour** ! Votre tank de 500 L serait vidé en 48 heures.
- **Bouchage & Refoulement fétide :** Sans pression d'eau municipale pour pousser les matières, les canalisations de l'immeuble se bouchent. Les excréments remontent par les siphons du rez-de-chaussée et du 1er étage, propageant le choléra, l'hépatite et la dysenterie.
- **Première action réflexe :** Condamnez la cuvette normale (ruban adhésif sur l'abattant) et passez immédiatement au protocole des toilettes sèches.

---

## 2. La Méthode des Deux Seaux (*Twin-Bucket System*)

La décomposition et les odeurs immondes proviennent du mélange entre l'urine (liquide) et les fèces (solide).

### Seau N° 1 : L'Urine (Facile à gérer)
- L'urine est stérile à 95 % et ne dégage pas d'odeurs fortes si elle reste pure.
- Utilisez un bidon ou seau dédié aux mictions liquides.
- Se vide facilement à l'extérieur (dans la terre, caniveau ou au pied d'un arbre) sans risque sanitaire.

### Seau N° 2 : Les Matières Fécales (Gestion Anti-Odeurs)
- Prenez un **seau de 20 L hermétique** (type seau de peinture ou de maçon propre).
- Fixez-y un sac poubelle ultra-résistant et épais (100 microns).
- Clipsez une lunette de toilette pour seau.

---

## 3. La Matière Carbonée Absorbante (Sciure & Cendres)

À chaque selle :
1. Versez **deux grosses poignées de matière carbonée sèche** pour recouvrir intégralement les matières.
2. **Ce que vous avez sous la main :**
   - **Cendres froides de votre poêle à bois :** La cendre a un pH très alcalin. Elle assèche instantanément, détruit les bactéries et neutralise les odeurs.
   - **Sciure ou copeaux de bois secs :** Récupérés chez le menuisier du quartier (*Najar*).
   - **Terre sèche de jardin ou sable fin.**
3. Rabattez le couvercle hermétique du seau entre chaque utilisation.

---

## 4. Évacuation & Hygiène des Mains
- Quand le sac est rempli aux 2/3 (environ tous les 3-4 jours pour le foyer) :
  - Saupoudrez une cuillère de Javel en poudre ou pastille écrasée.
  - Nouez le sac hermétiquement avec du ruban adhésif armé (*Duct tape*).
  - Stockez-le dans une zone isolée et ventilée du quai/garage en attendant la reprise des ramassages.
- **Hygiène absolue :** Placez un flacon de **gel hydroalcoolique** à l'entrée des toilettes. Désinfectez-vous les mains au gel pour **économiser l'eau potable**.
    `
  },
  {
    id: 7,
    title: "Défense Domicile R+3 & Alerte Intrusion (Carillons, Cales 120dB, Gels)",
    category: "SÉCURITÉ",
    icon: "shield",
    lvl: "VITAL P0",
    status: 100,
    desc: "Alerte mécanique précoce dans les escaliers et neutralisation à distance de sécurité sans armes à feu.",
    content: `
# Défense Passive & Sécurisation de l'Immeuble R+3 en Période de Crise

En période de rupture de l'ordre public ou de conflit, les intrusions nocturnes ciblent les réserves de vivres, l'eau et le carburant. La règle tactique absolue : **ne jamais aller au corps-à-corps** et **neutraliser à distance**.

---

## 1. Détection Précoce & Carillons (Gagner les 30 secondes vitales)

L'effet de surprise est la principale arme d'un intrus. Vous devez être avertis dès qu'un intrus franchit le seuil du rez-de-chaussée :

### A. Les Carillons & Clochettes Mécaniques
- Accrochez des clochettes en laiton ou grelots métalliques à l'intérieur des portes du quai/RDC et de la porte palière du 3e étage.
- Même sans électricité, toute tentative d'ouverture fait tinter le carillon.

### B. Les Cales Bloque-Portes avec Sirène 120 dB
- Glissez une cale en caoutchouc sous la porte d'entrée et sous la porte du 3e étage.
- En cas de poussée de l'extérieur, la cale **bloque physiquement la porte** et la lame métallique déclenche une sirène assourdissante de **120 dB** (alimentée par une simple pile 9V). Cela réveille tout l'immeuble et met en fuite les rôdeurs.

### C. Détecteur de Mouvement PIR sans Fil pour l'Escalier
- Placez un détecteur de mouvement PIR autonome à piles au bas des escaliers (RDC).
- Le carillon récepteur sans fil (qui a 100 m de portée) est branché dans votre chambre au 3e étage.
- **Résultat :** Dès qu'une personne pose le pied sur les premières marches de l'escalier, le carillon sonne immédiatement au 3e étage. Vous avez 45 secondes pour vous préparer.

---

## 2. Matériel de Neutralisation à Distance de Sécurité

Compte tenu du foyer (femmes, adolescentes, femme enceinte, personne âgée), il ne faut jamais tenter un affrontement physique rapproché :

### A. Les Bombes de Défense au Gel Poivre OC (300 ml à 500 ml)
- **Pourquoi le GEL est obligatoire :** En intérieur ou dans une cage d'escalier, le gaz lacrymogène traditionnel forme un nuage qui revient vers vous et intoxique votre famille (extrêmement dangereux pour vos 3 asthmatiques !).
- **Le Gel Poivre OC projette un jet lourd directionnel à 5-6 mètres :**
  - Visez le visage de l'intrus.
  - Au contact, le gel colle à la peau et aux yeux : fermeture involontaire des paupières, brûlure cutanée intolérable et quinte de toux réflexe pendant 30 à 45 minutes.
  - L'agresseur est instantanément neutralisé et incapable d'avancer.

### B. Les Lampes Torches Tactiques Stroboscopiques (2000 Lumens)
- Dans le noir total de l'escalier, déclenchez le mode stroboscope (flash ultra-rapide) directement dans les yeux de l'intrus.
- La puissance lumineuse aveugle la rétine et désoriente le cerveau pendant 15 à 30 secondes sans causer de blessure mortelle, vous permettant de verrouiller l'accès.

### C. Sifflets Métalliques 120 dB (1 pour chaque membre)
- Chaque femme et enfant porte un sifflet de survie en métal autour du cou.
- En cas de danger ou de détresse dans n'importe quelle pièce, 3 coups de sifflet stridents alertent les adultes de veille instantanément.

---

## 3. Scénario de Siège : Le "J-Day" et la Règle du Stock Tampon Haut

En cas de rupture d'approvisionnement des voisins :
- **Le J-Day (J+4 à J+7) :** Lorsque les réserves du quartier tombent à zéro ("la règle des 9 repas"), la morale sociale cède et les voisins ciblent les foyers suspectés d'avoir du stock.
- **La Règle du Tampon Haut :** Votre stock principal est au rez-de-chaussée (Quai). Si l'accès bas est forcé ou surveillé, vous risquez d'être coupés de vos vivres. Dès J+2, montez impérativement au 3e étage :
  - **80 Litres d'eau (16 bidons de 5L)**
  - **30 conserves cuisinées + 10 kg de dattes + 10 kg de miel + 2 pots de ghee**
  - **Tous les médicaments vitaux (Ventoline) et un réchaud gaz 3kg d'appoint**
- **Discipline "Zéro Signature" :** Aucun faisceau lumineux la nuit (blackout total), zéro friture le jour (odeur traçable), poêle à bois allumé de nuit avec du bois sec sans fumée blanche.
    `
  },
  { 
    id: 8, 
    title: "Fabrication du Ghee & Graisses sans Électricité", 
    category: "ALIMENTATION",
    icon: "lunch_dining", 
    lvl: "NIV 01", 
    status: 100, 
    desc: "Méthode de clarification du beurre (Ghee) et fonte de graisse animale sur poêle à bois pour conservation pluriannuelle en bocaux.",
    content: `
# Guide Opérationnel : Préparation & Conservation du Ghee et Graisses Animales sans Réfrigérateur

En situation de rupture logistique et de blackout prolongé, les lipides (matières grasses) sont la source d'énergie la plus dense et indispensable de votre organisme (**9 000 calories par kilo**, contre 4 000 kcal pour les féculents). Sans matières grasses, le corps s'épuise et ne peut pas assimiler les vitamines liposolubles (A, D, E, K).

---

## 1. Pourquoi le Beurre Standard Tourne et Pourquoi le Ghee est Éternel ?

Le beurre cru ou plaquette du commerce contient :
- **~82 % de lipides**
- **~16 % d'eau**
- **~2 % de protéines laitières (caséine, petit-lait, lactose)**

C'est précisément cette eau et ces protéines qui nourrissent les bactéries, font moisir et rancir le beurre en quelques jours à température ambiante.

### 🛡️ Le Principe du Ghee (Beurre Clarifié / Smen doux) :
En chauffant doucement le beurre :
1. **L'eau s'évapore à 100%**.
2. **La caséine et le petit-lait coagulent** : une partie flotte en écume blanche, le reste tombe au fond sous forme de sédiments dorés.
3. On ne garde que l'or liquide : **99,8 % de lipides purs**.
4. **Résultat :** Ne rancit pas, ne moisit pas, se conserve **plusieurs années à température ambiante (même à 35°C au Maroc)** dans des bocaux en verre fermés, sans réfrigérateur.
5. **Bonus santé :** Totalement dépourvu de lactose et de caséine, toléré par tous les membres du foyer.

---

## 2. Protocole de Préparation du Ghee sur Poêle à Bois ou Gaz

### 📦 Matériel Requis :
- Faitout ou casserole à fond épais en inox (évite de brûler le fond).
- Cuillère en bois ou grande cuillère en métal / écumoire.
- Bocaux en verre propres ébouillantés (type Le Parfait avec joint ou pots de confiture à couvercle métallique propre).
- Tissu de filtration fin : compresse stérile 10x10 dépliée, étamine à fromage ou filtre à café non blanchi.

### 📋 Les 5 Étapes de Clarification :
1. **Mise en chauffe douce :** Déposez 2 à 5 kg de beurre doux dans votre faitout sur le poêle à bois (ou petit feu gaz). Laissez fondre lentement sans couvrir.
2. **Ébullition & Évaporation de l'eau :** Le beurre commence à frémir et à crépiter. Ce crépitement correspond aux bulles d'eau qui s'évaporent. Une mousse blanche dense (caséine) monte en surface.
3. **Écumage :** À l'aide d'une cuillère, retirez délicatement la mousse blanche flottante au fur et à mesure et jetez-la (ou donnez-la aux animaux).
4. **Le Signal d'Arrêt Précis :** 
   - Au bout de 20 à 35 minutes de mijotage doux, les crépitements cessent brutalement (signe qu'il n'y a plus aucune trace d'eau liquide).
   - Le liquide devient parfaitement transparent et limpide, d'une magnifique couleur jaune doré.
   - Au fond de la marmite, les solides du lait ont bruni très légèrement (couleur noisette) et dégagent une douce odeur de caramel/noisette.
   - **Éteignez immédiatement le feu :** ne laissez pas brûler le fond sous peine de donner un goût amer au ghee.
5. **Filtration & Scellage à Chaud :**
   - Placez votre tissu filtrant / compresse stérile sur l'ouverture de votre bocal en verre préchauffé.
   - Versez doucement le liquide chaud à travers le filtre en veillant à laisser le dépôt marron au fond de la casserole.
   - Vissez le couvercle immédiatement pendant que le ghee est encore très chaud pour créer un vide d'air stérile.
   - En refroidissant, le ghee va se figer en une pâte jaune onctueuse et granuleuse de très longue garde.

---

## 3. Fonte & Stockage des Graisses Animales (Suif de Bœuf, Graisse de Rognons ou Graisse de Mouton)

La graisse animale fondue (Tallow / Suif / Graisse de mouton épurée) est une tradition ancestrale de conservation (Khliaa au Maroc).

### 📋 Méthode de Fonte :
1. **Découpe :** Coupez la graisse animale fraîche (idéalement graisse de rognon de bœuf ou de queue de mouton récupérée chez le boucher) en tout petits dés de 1 cm.
2. **Fonte lente au poêle :** Versez les dés dans la marmite avec un tout petit fond d'eau (1/2 verre pour éviter que ça n'accroche avant que la graisse ne commence à suinter).
3. **Cuisson à feu doux :** La graisse liquide se libère progressivement. Les petits morceaux de tissu conjonctif dorent et forment des "grattons" croustillants.
4. **Filtration :** Dès que les grattons sont bien dorés et cessent de fondre, filtrez la graisse liquide à travers un tamis ou compresse métallique directement dans les bocaux en verre.
5. **Scellage :** Fermez les bocaux hermétiquement à chaud. En figeant à température ambiante, elle devient un bloc blanc solide totalement hermétique à l'oxygène.

---

## 4. Règles d'Or d'Utilisation en Crise

- **Zéro Goutte d'Eau :** Lorsque vous entamez un bocal de ghee ou de graisse, utilisez **toujours une cuillère sèche et propre**. Une seule goutte d'eau introduite par une cuillère humide peut moisir la surface.
- **Stockage Obscur :** Rangez vos bocaux de verre au rez-de-chaussée / quai, dans un carton ou un placard à l'abri de la lumière du soleil (les rayons UV oxydent les lipides).
- **Synergie Culinaire :** Une seule cuillère à soupe de ghee ou de suif ajoutée à une gamelle de lentilles ou de pois chiches bouillis double sa valeur énergétique et assure la satiété des 8 personnes du foyer pour des heures.
- **Usage Thérapeutique d'Urgence :** Le ghee ou la graisse animale pure non salée constitue un excellent cicatrisant naturel et baume pour les lèvres gercées, peaux brûlées ou mains crevassées par le froid.
    `
  }
];

const categories = ["TOUTES_UNITÉS", "EAU", "ÉNERGIE", "SANTÉ", "ALIMENTATION", "SÉCURITÉ", "COMMS"];

export default function GuidesPage() {
  const { readGuides, markGuideAsRead } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState("TOUTES_UNITÉS");
  const [selectedGuide, setSelectedGuide] = useState<typeof guidesData[0] | null>(null);

  const filteredGuides = useMemo(() => {
    return guidesData.filter(guide => {
      const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            guide.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "TOUTES_UNITÉS" || guide.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 shadow-xs">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-sm font-bold tracking-tight text-slate-900">
              Guides Pratiques & Survie
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">Fiches réflexes familiales • Procédures d&apos;urgence</p>
          </div>
          <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-xl border border-blue-200">
            {readGuides.length} / {guidesData.length} Lus
          </span>
        </div>
      </header>

      <main className="flex-1 p-4 space-y-3.5">
        {/* Bannière Fiche A4 Réflexe / PDF */}
        <Link
          href="/print-sheet"
          className="flex items-center justify-between p-3.5 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200 rounded-2xl transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Printer size={18} />
            </div>
            <div>
              <h2 className="text-xs font-bold text-blue-900 group-hover:text-blue-700">Fiche Réflexe Imprimable A4 & PDF</h2>
              <p className="text-[11px] text-blue-800">Condensé de survie prêt pour affichage mural en cas de blackout</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-white px-2.5 py-1 rounded-lg border border-blue-200 shadow-2xs">
            Ouvrir A4 ➔
          </span>
        </Link>

        <div className="relative">
          <input 
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-4 pr-4 text-xs placeholder:text-slate-400 focus:outline-none focus:border-blue-500 text-slate-900 shadow-xs" 
            placeholder="Rechercher un guide (eau, javel, poêle, sécurité...)..." 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white font-bold shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-2 space-y-3">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Fiches Conseils Disponibles ({filteredGuides.length})
          </h2>
          <div className="space-y-2.5">
            {filteredGuides.map(guide => {
              const isRead = readGuides.includes(guide.id);
              return (
              <div 
                key={guide.id} 
                onClick={() => setSelectedGuide(guide)}
                className={`bg-white border rounded-2xl p-4 cursor-pointer hover:border-blue-400 hover:shadow-xs transition-all ${
                  isRead ? 'border-slate-300 opacity-90' : 'border-slate-200/90'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {guide.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 mt-1.5">{guide.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{guide.desc}</p>
                  </div>
                  {isRead && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                      Déjà lu
                    </span>
                  )}
                </div>
              </div>
            )})}
            
            {filteredGuides.length === 0 && (
              <div className="text-center py-12 bg-white border border-dashed border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500">Aucun guide ne correspond à cette recherche.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Lecture du Guide */}
      <AnimatePresence>
        {selectedGuide && (() => {
          const isRead = readGuides.includes(selectedGuide.id);
          return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setSelectedGuide(null)}
          >
            <motion.div 
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-slate-800"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{selectedGuide.title}</h2>
                  <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedGuide.category}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedGuide(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors text-xs font-bold"
                >
                  Fermer
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <div className="prose prose-slate prose-sm max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-strong:text-slate-900 prose-table:text-xs">
                  <Markdown>{selectedGuide.content}</Markdown>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                <span className="text-xs text-slate-500">
                  {isRead ? '✅ Guide consulté et validé' : 'Lecture recommandée pour la famille'}
                </span>
                <button 
                  onClick={() => markGuideAsRead(selectedGuide.id)}
                  disabled={isRead}
                  className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors ${
                    isRead 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
                  }`}
                >
                  {isRead ? 'Déjà Lu' : 'Marquer comme Lu'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )})()}
      </AnimatePresence>
    </div>
  );
}


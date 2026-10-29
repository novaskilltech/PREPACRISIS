'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext, FamilyMember, FamilyMemberStatus } from '@/components/AppContext';
import {
  Users,
  Printer,
  Phone,
  AlertTriangle,
  HeartPulse,
  Accessibility,
  Baby,
  MessageCircle,
  Mail,
  UserPlus,
  Trash2,
  BookUser,
  Shield,
  Droplets,
  ArrowRight,
  ShieldAlert,
  Edit2,
  CheckCircle2,
  Compass,
  AlertOctagon,
  X,
  Plus,
  Check,
} from 'lucide-react';

const SUGGESTED_ROLES = [
  '🛡️ Chef de Foyer',
  '💧 Équipe Eau & Sortie',
  '🩺 Secouriste / Santé',
  '🍳 Logistique & Vivres',
  '🚪 Sécurité & Vigie R+3',
  '👶 Enfant / Protection',
  '👵 Aîné / Soins continus',
  '📻 Veille Radio & Comms',
];

const SUGGESTED_MEDICAL_NEEDS = [
  '👓 Lunettes de vue',
  '🫁 Asthme (Ventoline)',
  '💉 Diabète (Insuline)',
  '❤️ Hypertension',
  '💊 Traitement quotidien',
  '⚠️ Allergie sévère',
];

const STATUS_CONFIG: Record<
  FamilyMemberStatus,
  { label: string; badgeClass: string; dotClass: string; description: string }
> = {
  SECURISE: {
    label: 'Sécurisé (Au foyer)',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100',
    dotClass: 'bg-emerald-500',
    description: 'Présent au domicile, en sécurité',
  },
  MISSION: {
    label: 'En Mission Extérieure',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100',
    dotClass: 'bg-blue-500 animate-pulse',
    description: 'Sortie ravitaillement eau ou vivres',
  },
  ASSISTANCE: {
    label: 'Besoin d\'Assistance',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100',
    dotClass: 'bg-amber-500',
    description: 'Mobilité réduite ou soin ponctuel',
  },
  URGENCE: {
    label: 'Urgence / Blessé',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100',
    dotClass: 'bg-rose-600 animate-ping',
    description: 'Intervention immédiate requise',
  },
};

export default function FamilyPlanPage() {
  const {
    members,
    addMember,
    updateMember,
    deleteMember,
    setMemberStatus,
    emergencyPlan,
    contacts,
    addContact,
    deleteContact,
    isLoaded,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'FOYER' | 'CONTACTS'>('FOYER');

  // Modal / Formulaire Membre
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [memberName, setMemberName] = useState('');
  const [memberGender, setMemberGender] = useState<'F' | 'M'>('M');
  const [memberAgeGroup, setMemberAgeGroup] = useState<
    'adulte' | 'enfant' | 'senior' | 'bebe' | 'ado' | 'enceinte'
  >('adulte');
  const [memberRole, setMemberRole] = useState('');
  const [memberStatus, setMemberStatusForm] = useState<FamilyMemberStatus>('SECURISE');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberIsMobilityReduced, setMemberIsMobilityReduced] = useState(false);
  const [memberNeeds, setMemberNeeds] = useState<string[]>([]);
  const [customNeedInput, setCustomNeedInput] = useState('');

  // Modal / Formulaire Contact d'Urgence
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [roleOrRelation, setRoleOrRelation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  if (!isLoaded) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const openAddMemberModal = () => {
    setEditingMemberId(null);
    setMemberName('');
    setMemberGender('M');
    setMemberAgeGroup('adulte');
    setMemberRole('🛡️ Chef de Foyer');
    setMemberStatusForm('SECURISE');
    setMemberPhone('');
    setMemberIsMobilityReduced(false);
    setMemberNeeds([]);
    setCustomNeedInput('');
    setShowMemberModal(true);
  };

  const openEditMemberModal = (m: FamilyMember) => {
    setEditingMemberId(m.id);
    setMemberName(m.name);
    setMemberGender(m.gender);
    setMemberAgeGroup(m.ageGroup);
    setMemberRole(m.role);
    setMemberStatusForm(m.status || 'SECURISE');
    setMemberPhone(m.phone || '');
    setMemberIsMobilityReduced(!!m.isMobilityReduced);
    setMemberNeeds(m.medicalNeeds || []);
    setCustomNeedInput('');
    setShowMemberModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    if (editingMemberId) {
      updateMember(editingMemberId, {
        name: memberName.trim(),
        gender: memberGender,
        ageGroup: memberAgeGroup,
        role: memberRole.trim() || 'Membre de l\'unité',
        status: memberStatus,
        phone: memberPhone.trim(),
        isMobilityReduced: memberIsMobilityReduced,
        medicalNeeds: memberNeeds,
      });
    } else {
      addMember({
        name: memberName.trim(),
        gender: memberGender,
        ageGroup: memberAgeGroup,
        role: memberRole.trim() || 'Membre de l\'unité',
        status: memberStatus,
        phone: memberPhone.trim(),
        isMobilityReduced: memberIsMobilityReduced,
        medicalNeeds: memberNeeds,
      });
    }

    setShowMemberModal(false);
  };

  const toggleNeed = (need: string) => {
    setMemberNeeds((prev) =>
      prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]
    );
  };

  const addCustomNeed = () => {
    if (customNeedInput.trim() && !memberNeeds.includes(customNeedInput.trim())) {
      setMemberNeeds((prev) => [...prev, customNeedInput.trim()]);
      setCustomNeedInput('');
    }
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    addContact({
      name: contactName.trim(),
      roleOrRelation: roleOrRelation.trim() || 'Contact d\'Urgence',
      phone: contactPhone.trim(),
      whatsapp: whatsapp.trim() || contactPhone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || undefined,
    });

    setContactName('');
    setRoleOrRelation('');
    setContactPhone('');
    setWhatsapp('');
    setEmail('');
    setCity('');
    setShowAddContact(false);
  };

  const cleanPhoneForWhatsApp = (num: string) => {
    return num.replace(/[^0-9]/g, '');
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 print:hidden shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <Users size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Rubrique Famille & Urgence
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {members.length > 0
                  ? `${members.length} personne${members.length > 1 ? 's' : ''} enregistrée${members.length > 1 ? 's' : ''} • Statuts en direct`
                  : 'Foyer personnalisable • Aucun membre fictif'}
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all shadow-xs"
          >
            <Printer size={14} className="text-slate-600" />
            <span>Fiche A4</span>
          </button>
        </div>

        {/* Sélecteur d'Onglets */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('FOYER')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'FOYER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users size={14} />
            <span>Membres du Foyer ({members.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('CONTACTS')}
            className={`py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'CONTACTS'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookUser size={14} />
            <span>Contacts & Secours ({contacts.length})</span>
          </button>
        </div>
      </header>

      {/* VUE IMPRIMABLE (A4) */}
      <div className="hidden print:block p-6 font-mono text-black bg-white">
        <div className="border-b-2 border-black pb-3 mb-4">
          <h1 className="text-lg font-black uppercase tracking-wider">
            Plan Familial de Sécurité Civile & Urgence R+3
          </h1>
          <p className="text-xs">
            Composition réelle du Foyer ({members.length} Personnes) • Contact d&apos;Urgence Hors-Zone :{' '}
            <strong>{emergencyPlan.outOfZoneContactName}</strong> ({emergencyPlan.outOfZoneContactPhone})
          </p>
        </div>

        {/* Tableau des Membres Réels */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-1">Composition du Foyer & Soins Vitaux :</h2>
          {members.length === 0 ? (
            <p className="text-xs italic p-2 border border-black">Aucun membre enregistré.</p>
          ) : (
            <table className="w-full text-[10px] border-collapse border border-black mb-4">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-black p-1 text-left">Nom</th>
                  <th className="border border-black p-1 text-left">Profil / Âge</th>
                  <th className="border border-black p-1 text-left">Rôle en Crise</th>
                  <th className="border border-black p-1 text-left">Statut Actuel</th>
                  <th className="border border-black p-1 text-left">Besoins Spécifiques & Médicaments</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td className="border border-black p-1 font-bold">{m.name}</td>
                    <td className="border border-black p-1">
                      {m.gender === 'F' ? 'Femme' : 'Homme'} ({m.ageGroup})
                    </td>
                    <td className="border border-black p-1">{m.role}</td>
                    <td className="border border-black p-1 font-semibold">
                      {STATUS_CONFIG[m.status]?.label || m.status}
                    </td>
                    <td className="border border-black p-1">
                      {[
                        ...m.medicalNeeds,
                        m.isMobilityReduced ? 'Mobilité réduite' : null,
                      ]
                        .filter(Boolean)
                        .join(', ') || 'Aucun'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Contacts d'Urgence */}
        <div>
          <h2 className="text-xs font-bold uppercase mb-1">Carnet de Contacts d&apos;Urgence & Médecins :</h2>
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black p-1 text-left">Nom</th>
                <th className="border border-black p-1 text-left">Rôle / Relation</th>
                <th className="border border-black p-1 text-left">Téléphone</th>
                <th className="border border-black p-1 text-left">Ville</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td className="border border-black p-1 font-bold">{c.name}</td>
                  <td className="border border-black p-1">{c.roleOrRelation}</td>
                  <td className="border border-black p-1">{c.phone}</td>
                  <td className="border border-black p-1">{c.city || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VUE APPLICATION ECRAN */}
      <main className="p-4 space-y-3.5 print:hidden">
        {/* ONGLET 1 : MEMBRES DU FOYER */}
        {activeTab === 'FOYER' && (
          <div className="space-y-3.5">
            {/* Barre d'action Ajouter Membre */}
            <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Users size={15} className="text-blue-600" />
                  <span>Votre Foyer ({members.length})</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Attribuez un rôle et un statut en 1 clic à chaque membre.
                </p>
              </div>

              <button
                onClick={openAddMemberModal}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <UserPlus size={14} />
                <span>Ajouter</span>
              </button>
            </div>

            {/* ÉTAT VIDE SI 0 MEMBRE */}
            {members.length === 0 && (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-200 shadow-xs">
                  <Users size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-900">Aucun membre fictif pré-rempli</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Votre application est prête pour votre vraie famille. Enregistrez les membres de votre foyer pour adapter les calculs d&apos;eau, de vivres et organiser les rôles en crise.
                  </p>
                </div>
                <button
                  onClick={openAddMemberModal}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-all shadow-xs"
                >
                  <UserPlus size={15} />
                  <span>Ajouter le premier membre</span>
                </button>
              </div>
            )}

            {/* LISTE DES MEMBRES REELS */}
            {members.map((member) => {
              const currentStatus = member.status || 'SECURISE';
              const cfg = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.SECURISE;

              return (
                <div
                  key={member.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all"
                >
                  {/* Ligne Haute : Nom, Rôle, Actions Edit/Delete */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-slate-700 shadow-2xs">
                        {member.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-slate-900">{member.name}</h3>
                          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold border border-slate-200">
                            {member.gender === 'F' ? 'Femme' : 'Homme'} • {member.ageGroup}
                          </span>
                        </div>
                        <p className="text-xs text-blue-700 font-semibold mt-0.5">{member.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditMemberModal(member)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer ${member.name} du foyer ?`)) {
                            deleteMember(member.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* SÉLECTEUR DE STATUT EN 1 CLIC */}
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-500 uppercase tracking-wide">
                        Statut opérationnel :
                      </span>
                      <span className="text-[10px] text-slate-500 italic">
                        Cliquez pour basculer
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {(Object.keys(STATUS_CONFIG) as FamilyMemberStatus[]).map((st) => {
                        const isCurrent = currentStatus === st;
                        const itemCfg = STATUS_CONFIG[st];

                        return (
                          <button
                            key={st}
                            onClick={() => setMemberStatus(member.id, st)}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border flex items-center gap-1.5 transition-all text-left ${
                              isCurrent
                                ? `${itemCfg.badgeClass} ring-1 ring-offset-1 ring-blue-500 font-extrabold shadow-2xs`
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100/70'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${itemCfg.dotClass}`} />
                            <span className="truncate">{itemCfg.label.split(' ')[0]}</span>
                            {isCurrent && <Check size={12} className="ml-auto text-current" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Besoins médicaux & vulnérabilités */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {member.isMobilityReduced && (
                      <span className="text-[11px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1">
                        <Accessibility size={12} />
                        Mobilité réduite
                      </span>
                    )}

                    {member.medicalNeeds.map((need, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1 font-medium"
                      >
                        <HeartPulse size={11} className="text-rose-500" />
                        {need}
                      </span>
                    ))}

                    {member.phone && (
                      <a
                        href={`tel:${member.phone}`}
                        className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 ml-auto hover:bg-blue-100"
                      >
                        <Phone size={11} />
                        {member.phone}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Raccourci Mission Eau & Défense R+3 */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link
                href="/water-mission"
                className="bg-blue-50 border border-blue-200 hover:border-blue-300 rounded-2xl p-3 shadow-xs block transition-all"
              >
                <div className="flex items-center gap-1.5 text-blue-800 font-bold text-xs uppercase mb-1">
                  <Droplets size={14} />
                  <span>Mission Eau</span>
                </div>
                <p className="text-[11px] text-slate-600">30L en 60 min avec 3 membres valides.</p>
              </Link>

              <Link
                href="/siege"
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl p-3 shadow-xs block transition-all"
              >
                <div className="flex items-center gap-1.5 text-slate-800 font-bold text-xs uppercase mb-1">
                  <ShieldAlert size={14} className="text-rose-600" />
                  <span>Défense R+3</span>
                </div>
                <p className="text-[11px] text-slate-600">Plan anti-intrusion et repli au 3e étage.</p>
              </Link>
            </div>
          </div>
        )}

        {/* ONGLET 2 : CONTACTS D'URGENCE */}
        {activeTab === 'CONTACTS' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookUser size={15} className="text-blue-600" />
                  <span>Carnet de Secours ({contacts.length})</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Médecins, proches hors-zone, relais d&apos;urgence.
                </p>
              </div>

              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
              >
                <UserPlus size={14} />
                <span>{showAddContact ? 'Fermer' : 'Ajouter'}</span>
              </button>
            </div>

            {/* FORMULAIRE AJOUT CONTACT */}
            {showAddContact && (
              <form
                onSubmit={handleAddContactSubmit}
                className="bg-white border border-blue-200 rounded-2xl p-4 space-y-3 shadow-md"
              >
                <h3 className="text-xs font-bold text-blue-900 uppercase">Nouveau Contact d&apos;Urgence</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Nom *</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Dr. Alami ou Oncle Omar"
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Rôle / Relation</label>
                    <input
                      type="text"
                      value={roleOrRelation}
                      onChange={(e) => setRoleOrRelation(e.target.value)}
                      placeholder="Médecin de famille / Relais Rabat"
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Téléphone *</label>
                    <input
                      type="tel"
                      required
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+212 6..."
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block uppercase">Ville</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Casablanca / Rabat"
                      className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                >
                  Enregistrer le contact
                </button>
              </form>
            )}

            {/* LISTE DES CONTACTS */}
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2.5 shadow-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{contact.name}</h3>
                    <p className="text-[11px] text-blue-700 font-semibold">{contact.roleOrRelation}</p>
                    {contact.city && (
                      <span className="text-[10px] text-slate-400 font-medium">Ville : {contact.city}</span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <a
                    href={`tel:${contact.phone}`}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone size={13} className="text-blue-600" />
                    <span>Appeler</span>
                  </a>
                  {contact.phone && (
                    <a
                      href={`https://wa.me/${cleanPhoneForWhatsApp(contact.whatsapp || contact.phone)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                    >
                      <MessageCircle size={13} className="text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* MODAL AJOUT / ÉDITION MEMBRE */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  {editingMemberId ? 'Modifier le Membre' : 'Ajouter un Membre de la Famille'}
                </h3>
              </div>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3.5">
              {/* Nom & Genre */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Prénom / Nom *</label>
                  <input
                    type="text"
                    required
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    placeholder="Ex: Mohamed, Sara..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">Genre</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mt-0.5">
                    <button
                      type="button"
                      onClick={() => setMemberGender('M')}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg ${
                        memberGender === 'M' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      H
                    </button>
                    <button
                      type="button"
                      onClick={() => setMemberGender('F')}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg ${
                        memberGender === 'F' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'
                      }`}
                    >
                      F
                    </button>
                  </div>
                </div>
              </div>

              {/* Tranche d'Âge */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                  Tranche d&apos;Âge
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(
                    [
                      { id: 'adulte', label: 'Adulte' },
                      { id: 'senior', label: 'Senior' },
                      { id: 'enfant', label: 'Enfant' },
                      { id: 'ado', label: 'Adolescent' },
                      { id: 'bebe', label: 'Nourrisson' },
                      { id: 'enceinte', label: 'Enceinte' },
                    ] as const
                  ).map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setMemberAgeGroup(cat.id)}
                      className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                        memberAgeGroup === cat.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rôles Suggérés en 1 Clic */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                  Rôle en Crise (Cliquez pour choisir ou personnalisez)
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMemberRole(r)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border transition-all ${
                        memberRole === r
                          ? 'bg-blue-50 text-blue-700 border-blue-300 ring-1 ring-blue-400'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  placeholder="Ou saisissez un rôle personnalisé..."
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                />
              </div>

              {/* Statut Initial */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                  Statut Opérationnel Initial
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(Object.keys(STATUS_CONFIG) as FamilyMemberStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setMemberStatusForm(st)}
                      className={`p-2 rounded-xl text-xs font-bold border text-left flex items-center gap-1.5 transition-all ${
                        memberStatus === st
                          ? `${STATUS_CONFIG[st].badgeClass} ring-1 ring-blue-500`
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG[st].dotClass}`} />
                      <span>{STATUS_CONFIG[st].label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Besoins Médicaux & Spécificités */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 block uppercase mb-1">
                  Besoins Spécifiques & Médicaux
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_MEDICAL_NEEDS.map((need) => {
                    const isChecked = memberNeeds.includes(need);
                    return (
                      <button
                        key={need}
                        type="button"
                        onClick={() => toggleNeed(need)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border flex items-center gap-1 transition-all ${
                          isChecked
                            ? 'bg-rose-50 text-rose-800 border-rose-300 ring-1 ring-rose-400'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {isChecked && <Check size={11} />}
                        <span>{need}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={customNeedInput}
                    onChange={(e) => setCustomNeedInput(e.target.value)}
                    placeholder="Autre besoin (ex: Allergie pénicilline)..."
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addCustomNeed}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Téléphone & Mobilité Réduite */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block uppercase">
                    Numéro de Téléphone (Optionnel)
                  </label>
                  <input
                    type="tel"
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    placeholder="+212 6..."
                    className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-blue-500"
                  />
                </div>

                <label className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberIsMobilityReduced}
                    onChange={(e) => setMemberIsMobilityReduced(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Accessibility size={14} className="text-amber-600" />
                    Mobilité Réduite (Priorité évacuation R+3)
                  </span>
                </label>
              </div>

              {/* Bouton de Validation */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs"
                >
                  {editingMemberId ? 'Enregistrer Modifications' : 'Ajouter au Foyer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/components/AppContext';
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
  Send,
  Droplets,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function FamilyPlanPage() {
  const {
    members,
    emergencyPlan,
    contacts,
    addContact,
    deleteContact,
    isLoaded,
  } = useAppContext();

  const [activeTab, setActiveTab] = useState<'FOYER' | 'CONTACTS'>('FOYER');
  const [showAddContact, setShowAddContact] = useState(false);

  // Formulaire nouveau contact
  const [name, setName] = useState('');
  const [roleOrRelation, setRoleOrRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');

  if (!isLoaded) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAddContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addContact({
      name: name.trim(),
      roleOrRelation: roleOrRelation.trim() || 'Contact d\'Urgence',
      phone: phone.trim(),
      whatsapp: whatsapp.trim() || phone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || undefined,
    });

    setName('');
    setRoleOrRelation('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setCity('');
    setShowAddContact(false);
  };

  const cleanPhoneForWhatsApp = (num: string) => {
    return num.replace(/[^0-9]/g, '');
  };

  const urgentWaMessage = encodeURIComponent(
    'URGENCE PrépaCrisis Maroc : Merci de me contacter dès que possible. Nous sommes en situation de crise / besoin de liaison.'
  );

  const urgentEmailSubject = encodeURIComponent('URGENCE SÉCURITÉ CIVILE - Famille PrépaCrisis');
  const urgentEmailBody = encodeURIComponent(
    'Bonjour,\n\nCeci est un message d\'urgence envoyé depuis l\'application PrépaCrisis Maroc.\nMerci de nous contacter ou de vérifier notre situation dès réception de ce message.\n\nPoint de ralliement : ' +
      emergencyPlan.meetingPointPrimary
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24 text-slate-800">
      {/* Header Sticky Clair */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 p-4 print:hidden shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <Users size={18} />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-slate-900">
                Famille & Contacts d&apos;Urgence
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">8 personnes du foyer • Liaisons directes</p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all shadow-xs"
          >
            <Printer size={14} className="text-slate-600" />
            <span>Imprimer Fiche A4</span>
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
            <span>Membres du Foyer (8)</span>
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
            <span>Contacts & Médecins ({contacts.length})</span>
          </button>
        </div>
      </header>

      {/* VUE IMPRESSION A4 (Affichée uniquement lors de l'impression) */}
      <div className="hidden print:block p-6 text-black bg-white print-page">
        <div className="border-b-2 border-black pb-3 mb-4 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-black uppercase">Plan d&apos;Urgence & Résilience Familiale (PFMS)</h1>
            <p className="text-sm font-semibold">Foyer de 8 personnes • Immeuble R+3 • Maroc</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold">DOCUMENT DE SURVIE CONFIDENTIEL</p>
            <p>À conserver dans le sac d&apos;évacuation</p>
          </div>
        </div>

        {/* Coordonnées & Points de Ralliement */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs border border-black p-3">
          <div>
            <p className="font-bold uppercase">📍 Point de Ralliement 1 (Immédiat) :</p>
            <p className="mb-2">{emergencyPlan.meetingPointPrimary}</p>
            <p className="font-bold uppercase">📍 Point de Ralliement 2 (Zone Rurale) :</p>
            <p>{emergencyPlan.meetingPointSecondaryRural}</p>
          </div>
          <div>
            <p className="font-bold uppercase">📞 Contact Hors-Zone (ICE) :</p>
            <p className="text-sm font-bold">
              {emergencyPlan.outOfZoneContactName} : {emergencyPlan.outOfZoneContactPhone}
            </p>
            <p className="font-bold uppercase mt-2">💧 Stock Eau & Énergie :</p>
            <p>Tank 500L Quai RDC • Batterie 1200Wh • {emergencyPlan.gasBottlesCount} Bouteilles Butane 12kg</p>
          </div>
        </div>

        {/* Ordre d'Évacuation R+3 */}
        <div className="mb-4 text-xs border border-black p-3 bg-slate-50">
          <p className="font-bold uppercase mb-1">🚨 Consignes d&apos;Évacuation Immédiate (R+3) :</p>
          <p className="leading-snug">{emergencyPlan.evacuationNotes}</p>
        </div>

        {/* Tableau des 8 Membres */}
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase mb-1">Composition du Foyer & Soins Vitaux :</h2>
          <table className="w-full text-[10px] border-collapse border border-black mb-4">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black p-1 text-left">Nom</th>
                <th className="border border-black p-1 text-left">Profil</th>
                <th className="border border-black p-1 text-left">Besoins Spécifiques & Médicaments</th>
                <th className="border border-black p-1 text-left">Rôle en Crise</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="border border-black p-1 font-bold">{m.name}</td>
                  <td className="border border-black p-1">
                    {m.gender === 'F' ? 'Femme' : 'Homme'} ({m.ageGroup})
                  </td>
                  <td className="border border-black p-1">{m.medicalNeeds.join(', ')}</td>
                  <td className="border border-black p-1">{m.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tableau du Carnet de Contacts d'Urgence */}
        <div>
          <h2 className="text-xs font-bold uppercase mb-1">Carnet de Contacts d&apos;Urgence & Médecins :</h2>
          <table className="w-full text-[10px] border-collapse border border-black">
            <thead>
              <tr className="bg-slate-200">
                <th className="border border-black p-1 text-left">Nom</th>
                <th className="border border-black p-1 text-left">Rôle / Relation</th>
                <th className="border border-black p-1 text-left">Téléphone / WhatsApp</th>
                <th className="border border-black p-1 text-left">Email</th>
                <th className="border border-black p-1 text-left">Ville</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td className="border border-black p-1 font-bold">{c.name}</td>
                  <td className="border border-black p-1">{c.roleOrRelation}</td>
                  <td className="border border-black p-1">{c.whatsapp || c.phone}</td>
                  <td className="border border-black p-1">{c.email || '-'}</td>
                  <td className="border border-black p-1">{c.city || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VUE MOBILE ÉCRAN */}
      <main className="p-4 space-y-3.5 print:hidden">
        {/* ONGLET 1 : MEMBRES DU FOYER & PLAN R+3 */}
        {activeTab === 'FOYER' && (
          <div className="space-y-3.5">
            {/* Procédure d'Évacuation R+3 */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-xs uppercase">
                <AlertTriangle size={16} />
                <span>Consignes de Descente & Évacuation (R+3)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {emergencyPlan.evacuationNotes}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Point RDC :</span>
                  <span className="text-slate-900 font-semibold">{emergencyPlan.meetingPointPrimary}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">Repli Rural :</span>
                  <span className="text-slate-900 font-semibold">{emergencyPlan.meetingPointSecondaryRural}</span>
                </div>
              </div>
            </div>

            {/* Raccourci Mission Eau */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase">
                  <Droplets size={16} />
                  <span>Mission Sortie Eau : 30L en 60 Min</span>
                </div>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Rayon 1,5 km
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sortie à <strong>3 personnes</strong> (Karim, Youssef + 1 adulte). 2 bidons de 5L chacun (10 kg au retour).
              </p>
              <div className="mt-3 pt-2.5 border-t border-blue-100 flex items-center justify-between">
                <span className="text-xs text-slate-600">Points d&apos;eau répertoriés</span>
                <Link
                  href="/water-mission"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all shadow-xs"
                >
                  <span>Ouvrir Mission</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Raccourci Simulateur de Siège */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center border border-rose-200">
                  <ShieldAlert size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Défense Anti-Siège R+3</h4>
                  <p className="text-[11px] text-slate-500">Calcul du J-Day d&apos;épuisement & stock tampon 3e étage.</p>
                </div>
              </div>
              <Link
                href="/siege"
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
              >
                <span>Voir Plan</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Fiches des 8 Membres */}
            <div className="space-y-2.5">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 px-1">
                <Users size={14} />
                Membres de la Famille (8 Personnes)
              </h2>

              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-2 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{member.name}</h3>
                      <p className="text-[11px] text-blue-700 font-semibold mt-0.5">{member.role}</p>
                    </div>
                    <div className="flex gap-1 text-[10px]">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-semibold border border-slate-200">
                        {member.gender === 'F' ? 'Femme' : 'Homme'}
                      </span>
                      {member.isMobilityReduced && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-md font-bold flex items-center gap-0.5">
                          <Accessibility size={11} />
                          Mobilité
                        </span>
                      )}
                      {member.ageGroup === 'enceinte' && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-md font-bold flex items-center gap-0.5">
                          <Baby size={11} />
                          Enceinte
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Besoins médicaux */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {member.medicalNeeds.map((need, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-lg border border-slate-200/70 flex items-center gap-1 font-medium"
                      >
                        <HeartPulse size={11} className="text-rose-500" />
                        {need}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 2 : CARNET DE CONTACTS */}
        {activeTab === 'CONTACTS' && (
          <div className="space-y-3.5">
            {/* Bouton Ajouter un Contact */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase">
                  Contacts d&apos;Urgence
                </h2>
                <p className="text-[11px] text-slate-500">
                  WhatsApp, Email ou Appel en 1 clic direct.
                </p>
              </div>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <UserPlus size={14} />
                <span>{showAddContact ? 'Fermer' : 'Ajouter'}</span>
              </button>
            </div>

            {/* Formulaire d'Ajout */}
            {showAddContact && (
              <form
                onSubmit={handleAddContactSubmit}
                className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <h3 className="text-xs font-bold text-slate-900 uppercase">Nouveau Contact d&apos;Urgence</h3>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Nom complet *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Rôle / Lien (ex: Médecin, Oncle)"
                    value={roleOrRelation}
                    onChange={(e) => setRoleOrRelation(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="tel"
                    placeholder="Téléphone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Numéro WhatsApp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="email"
                    placeholder="Adresse Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Ville"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition-all shadow-xs"
                >
                  Enregistrer le Contact
                </button>
              </form>
            )}

            {/* Cartes de Contacts */}
            <div className="space-y-3">
              {contacts.map((contact) => {
                const cleanPhone = cleanPhoneForWhatsApp(contact.whatsapp || contact.phone);
                const waUrl = `https://wa.me/${cleanPhone}?text=${urgentWaMessage}`;
                const mailUrl = contact.email
                  ? `mailto:${contact.email}?subject=${urgentEmailSubject}&body=${urgentEmailBody}`
                  : null;

                return (
                  <div
                    key={contact.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{contact.name}</h3>
                        <p className="text-[11px] text-blue-700 font-medium mt-0.5">
                          {contact.roleOrRelation} {contact.city && `• ${contact.city}`}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                        aria-label={`Supprimer ${contact.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="text-xs text-slate-700 space-y-0.5 bg-slate-50 p-3 rounded-xl border border-slate-100 font-mono">
                      <div>Tél / WhatsApp : <strong className="text-slate-900">{contact.phone}</strong></div>
                      {contact.email && (
                        <div>Email : <span className="text-blue-700">{contact.email}</span></div>
                      )}
                    </div>

                    {/* Actions d'Envoi Direct */}
                    <div className="flex items-center gap-2 pt-1">
                      {/* Bouton WhatsApp */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <MessageCircle size={15} />
                        <span>WhatsApp</span>
                      </a>

                      {/* Bouton Email */}
                      {mailUrl ? (
                        <a
                          href={mailUrl}
                          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                        >
                          <Mail size={15} />
                          <span>Email</span>
                        </a>
                      ) : (
                        <div className="flex-1 py-2 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5">
                          <Mail size={15} />
                          <span>Pas d&apos;email</span>
                        </div>
                      )}

                      {/* Bouton Appel */}
                      <a
                        href={`tel:${contact.phone}`}
                        className="py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center transition-all border border-slate-200"
                        aria-label={`Appeler ${contact.name}`}
                      >
                        <Phone size={14} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState } from 'react';
import { 
  Heart, 
  Phone, 
  Pill, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sun, 
  Volume2, 
  UserCheck, 
  Clock, 
  X, 
  ChevronRight,
  ShieldCheck,
  Thermometer,
  Sparkles
} from 'lucide-react';
import { SeniorContact, MedicationItem, ScheduleEvent, IndoorClimate } from '../types';

interface SeniorModeViewProps {
  contacts: SeniorContact[];
  medications: MedicationItem[];
  schedule: ScheduleEvent[];
  climate: IndoorClimate;
  onConfirmImOk: () => void;
  onTakeMedication: (id: string) => void;
  onTriggerAlarm: () => void;
  lastCheckedIn: string;
  hasCheckedInToday: boolean;
}

export const SeniorModeView: React.FC<SeniorModeViewProps> = ({
  contacts,
  medications,
  schedule,
  climate,
  onConfirmImOk,
  onTakeMedication,
  onTriggerAlarm,
  lastCheckedIn,
  hasCheckedInToday
}) => {
  const [activeModal, setActiveModal] = useState<'contacts' | 'meds' | 'schedule' | 'alarm' | null>(null);
  const [callingContact, setCallingContact] = useState<SeniorContact | null>(null);
  const [callInProgress, setCallInProgress] = useState<boolean>(false);
  const [alarmCountdown, setAlarmCountdown] = useState<number>(5);
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);
  const [speechActive, setSpeechActive] = useState<boolean>(false);

  // Time & date display
  const todayStr = new Intl.DateTimeFormat('no-NO', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Accessible Text-To-Speech helper for seniors
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'no-NO';
      utterance.rate = 0.9; // Slower, clearer speech for seniors
      utterance.onstart = () => setSpeechActive(true);
      utterance.onend = () => setSpeechActive(false);
      utterance.onerror = () => setSpeechActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleReadStatusAloud = () => {
    const unTakenCount = medications.filter(m => !m.taken).length;
    const speechMsg = `God dag! I dag er det ${todayStr}. Romtemperaturen er ${climate.temp} grader. ${
      hasCheckedInToday 
        ? 'Du har allerede bekreftet at du har det bra i dag.' 
        : 'Husk å trykke på den grønne knappen hvis du har det fint.'
    } ${
      unTakenCount > 0 
        ? `Du har ${unTakenCount} medisin som skal tas.` 
        : 'Alle dagens medisiner er registrert som tatt.'
    }`;
    speakText(speechMsg);
  };

  const handleStartCall = (contact: SeniorContact) => {
    setCallingContact(contact);
    setCallInProgress(true);
    speakText(`Ringer opp ${contact.name}`);
  };

  const handleStartAlarmCountdown = () => {
    setActiveModal('alarm');
    setAlarmTriggered(false);
    setAlarmCountdown(5);
    speakText('Nødalarm aktiveres om 5 sekunder. Trykk avbryt for å stoppe.');

    let count = 5;
    const interval = window.setInterval(() => {
      count -= 1;
      setAlarmCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setAlarmTriggered(true);
        onTriggerAlarm();
        speakText('Nødalarm er sendt til vakttelefon og pårørende.');
      }
    }, 1000);

    // Save timer ref to clear on cancel
    (window as any).__alarmTimer = interval;
  };

  const handleCancelAlarm = () => {
    if ((window as any).__alarmTimer) {
      clearInterval((window as any).__alarmTimer);
    }
    setActiveModal(null);
    setAlarmTriggered(false);
    speakText('Nødalarm ble avbrutt.');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 font-sans select-none">
      {/* Top Senior Header: Day, Date, Time & Quick Audio Assistance */}
      <header className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-6 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-lg sm:text-xl tracking-wide">
              <Sun className="w-6 h-6 text-amber-400 animate-pulse" />
              <span>{capitalize(todayStr)}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-1 tracking-tight">
              God dag, Kari!
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl mt-2 flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-emerald-400" />
              Stuetemperatur: <strong className="text-white font-bold">{climate.temp}°C</strong> 
              <span className="text-slate-400 text-base">({climate.airQualityText} luftkvalitet)</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-senior-speak"
              onClick={handleReadStatusAloud}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-md ${
                speechActive 
                  ? 'bg-amber-400 text-slate-950 scale-105 ring-4 ring-amber-300/40' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title="Les opp dagens informasjon høyt"
            >
              <Volume2 className="w-7 h-7 text-amber-300" />
              <span>{speechActive ? 'Leser opp...' : 'Les høyt'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Primary "Jeg har det bra" Status Card */}
      <section className="mb-6">
        <div 
          className={`rounded-3xl p-6 sm:p-8 transition-all border-2 shadow-lg ${
            hasCheckedInToday 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5 text-center sm:text-left">
              <div 
                className={`w-20 h-20 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  hasCheckedInToday ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
                }`}
              >
                {hasCheckedInToday ? (
                  <CheckCircle2 className="w-12 h-12" />
                ) : (
                  <UserCheck className="w-12 h-12 animate-bounce" />
                )}
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold">
                  {hasCheckedInToday 
                    ? 'Takk! Du er registrert trygg i dag' 
                    : 'Hvordan føler du deg i dag?'}
                </h2>
                <p className="text-lg sm:text-xl text-slate-700 mt-1">
                  {hasCheckedInToday 
                    ? `Siste trygghetsmelding sendt til familien kl. ${lastCheckedIn}.` 
                    : 'Trykk på knappen nedenfor for å gi beskjed til Ingrid og Henrik.'}
                </p>
              </div>
            </div>

            <button
              id="btn-senior-im-ok"
              onClick={() => {
                onConfirmImOk();
                speakText('Kjempefint! Beskjed om at du har det bra er nå sendt til familien din.');
              }}
              className={`w-full sm:w-auto px-8 py-5 rounded-2xl font-extrabold text-xl sm:text-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 shrink-0 ${
                hasCheckedInToday
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-4 ring-emerald-300/60'
              }`}
            >
              <Heart className="w-8 h-8 fill-current text-emerald-200" />
              <span>{hasCheckedInToday ? 'Jeg har det fortsatt bra!' : 'Jeg har det bra!'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Large Action Cards for Senior Usability */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        
        {/* Card 1: Ring familie & hjelp */}
        <button
          id="btn-senior-open-contacts"
          onClick={() => {
            setActiveModal('contacts');
            speakText('Her er kontaktene dine. Hvem vil du snakke med?');
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between text-left shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Phone className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ring noen
              </h3>
              <p className="text-lg text-slate-600 mt-1">
                Snakk med Ingrid, Henrik eller hjemmetjenesten
              </p>
            </div>
          </div>
          <ChevronRight className="w-9 h-9 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* Card 2: Medisiner */}
        <button
          id="btn-senior-open-meds"
          onClick={() => {
            setActiveModal('meds');
            speakText('Her er dagens medisiner.');
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between text-left shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Pill className="w-10 h-10" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Dagens medisiner
                </h3>
                {medications.some(m => !m.taken) && (
                  <span className="bg-amber-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                    1 gjenstår
                  </span>
                )}
              </div>
              <p className="text-lg text-slate-600 mt-1">
                Se dosett og bekreft at du har tatt tablettene
              </p>
            </div>
          </div>
          <ChevronRight className="w-9 h-9 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* Card 3: Dagsplan og besøk */}
        <button
          id="btn-senior-open-schedule"
          onClick={() => {
            setActiveModal('schedule');
            speakText('Her er avtalene dine for i dag.');
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex items-center justify-between text-left shadow-sm hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Hva skjer i dag?
              </h3>
              <p className="text-lg text-slate-600 mt-1">
                Besøk av hjemmetjenesten og familietreff
              </p>
            </div>
          </div>
          <ChevronRight className="w-9 h-9 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all shrink-0" />
        </button>

        {/* Card 4: Nødalarm / Hjelp-knapp (Høy kontrast rød/oransje med sikkerhetsnedtelling) */}
        <button
          id="btn-senior-trigger-alarm"
          onClick={handleStartAlarmCountdown}
          className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 rounded-3xl p-6 sm:p-8 flex items-center justify-between text-left shadow-md hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
              <AlertTriangle className="w-11 h-11" />
            </div>
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-950">
                Trenger du hjelp?
              </h3>
              <p className="text-lg text-rose-800 mt-1">
                Trykk her for akutt kontakt med vaktsentral
              </p>
            </div>
          </div>
          <span className="bg-rose-600 text-white font-extrabold px-5 py-3 rounded-xl text-lg group-hover:bg-rose-700 transition-colors shrink-0">
            Nødalarm
          </span>
        </button>
      </div>

      {/* Subtle safety footer reminder */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm sm:text-base border border-slate-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            Sensorene i leiligheten passer på automatisk. Skjermen fungerer også ved lokalt nettverksbortfall.
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
          Seniormodus aktiv
        </span>
      </div>

      {/* MODAL: Ring kontakter */}
      {activeModal === 'contacts' && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <Phone className="w-8 h-8 text-blue-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Hvem vil du ringe?
                </h2>
              </div>
              <button
                id="btn-close-contacts"
                onClick={() => setActiveModal(null)}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {callInProgress && callingContact ? (
              <div className="text-center py-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <div className={`w-24 h-24 ${callingContact.avatarBg} text-white rounded-full flex items-center justify-center text-3xl font-extrabold mx-auto mb-4 animate-pulse shadow-lg`}>
                  {callingContact.initials}
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">
                  Ringer {callingContact.name}...
                </h3>
                <p className="text-xl text-slate-600 mb-6">{callingContact.phone}</p>
                <div className="flex justify-center gap-4">
                  <button
                    id="btn-end-call"
                    onClick={() => {
                      setCallInProgress(false);
                      setCallingContact(null);
                      speakText('Samtalen er avsluttet.');
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow-lg flex items-center gap-3"
                  >
                    <X className="w-6 h-6" />
                    <span>Avslutt samtale</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border-2 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 ${contact.avatarBg} text-white rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 shadow`}>
                        {contact.initials}
                      </div>
                      <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-900">
                          {contact.name}
                        </h4>
                        <p className="text-base text-slate-600">{contact.relation}</p>
                      </div>
                    </div>
                    <button
                      id={`btn-call-${contact.id}`}
                      onClick={() => handleStartCall(contact)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xl px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2"
                    >
                      <Phone className="w-6 h-6" />
                      <span>Ring nå</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: Dagens medisiner */}
      {activeModal === 'meds' && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <Pill className="w-8 h-8 text-purple-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Dagens medisiner
                </h2>
              </div>
              <button
                id="btn-close-meds"
                onClick={() => setActiveModal(null)}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-4">
              {medications.map((med) => (
                <div
                  key={med.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    med.taken 
                      ? 'bg-emerald-50/70 border-emerald-300' 
                      : 'bg-amber-50 border-amber-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-extrabold text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200">
                          Kl. {med.time}
                        </span>
                        <h4 className="text-xl font-bold text-slate-900">
                          {med.name}
                        </h4>
                      </div>
                      <p className="text-lg text-slate-700 mt-2 font-medium">
                        {med.dosage}
                      </p>
                      {med.importantNote && (
                        <p className="text-sm font-semibold text-amber-900 mt-1 flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          Merk: {med.importantNote}
                        </p>
                      )}
                    </div>

                    <div>
                      {med.taken ? (
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-lg bg-emerald-100 px-5 py-3 rounded-xl">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          <span>Tatt og kvittert</span>
                        </div>
                      ) : (
                        <button
                          id={`btn-take-${med.id}`}
                          onClick={() => {
                            onTakeMedication(med.id);
                            speakText(`Takk! ${med.name} er markert som tatt.`);
                          }}
                          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg px-6 py-4 rounded-xl shadow flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 className="w-6 h-6" />
                          <span>Jeg har tatt den</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Dagsplan */}
      {activeModal === 'schedule' && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-8 h-8 text-teal-600" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Plan for i dag
                </h2>
              </div>
              <button
                id="btn-close-schedule"
                onClick={() => setActiveModal(null)}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="space-y-4">
              {schedule.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 flex items-start gap-4"
                >
                  <div className="bg-teal-700 text-white font-extrabold text-lg px-3 py-2 rounded-xl shrink-0">
                    {item.time}
                  </div>
                  <div>
                    <h4 className="text-xl font-extrabold text-slate-900">
                      {item.title}
                    </h4>
                    <p className="text-lg text-slate-700 mt-1">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Nødalarm med sikkerhets-nedtelling for å hindre feilaktig utløsing */}
      {activeModal === 'alarm' && (
        <div className="fixed inset-0 bg-rose-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-8 shadow-2xl border-4 border-rose-500 text-center">
            {alarmTriggered ? (
              <div>
                <div className="w-24 h-24 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <AlertTriangle className="w-14 h-14" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-rose-950 mb-2">
                  Alarm er sendt!
                </h2>
                <p className="text-xl text-slate-800 mb-6 leading-relaxed">
                  Vaktsentralen og dine pårørende er varslet med høyeste prioritet. Du blir oppringt om et øyeblikk.
                </p>
                <button
                  id="btn-alarm-ok-close"
                  onClick={() => setActiveModal(null)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl px-8 py-4 rounded-2xl shadow"
                >
                  Lukk vindu
                </button>
              </div>
            ) : (
              <div>
                <div className="w-24 h-24 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-4 font-black text-4xl border-4 border-amber-400">
                  {alarmCountdown}
                </div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
                  Varsler vaktsentral om {alarmCountdown} sekunder
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Hvis du trykket ved et uhell, trykk på den grønne knappen under for å avbryte.
                </p>
                <button
                  id="btn-cancel-alarm"
                  onClick={handleCancelAlarm}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-2xl py-6 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-8 h-8" />
                  <span>Avbryt (Det var et uhell)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

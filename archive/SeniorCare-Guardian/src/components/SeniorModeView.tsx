import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Phone, 
  PhoneCall,
  PhoneOff,
  Pill, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Sun, 
  Volume2, 
  VolumeX,
  UserCheck, 
  Clock, 
  X, 
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Thermometer,
  Sparkles,
  Send,
  MessageSquare,
  Radio,
  Check,
  CheckCheck,
  Users,
  Mic,
  MicOff,
  BellRing,
  AlertCircle,
  AlertOctagon
} from 'lucide-react';
import { SeniorContact, MedicationItem, ScheduleEvent, IndoorClimate, EmergencyMessageEvent, VisualAlert } from '../types';
import { INITIAL_EMERGENCY_MESSAGES } from '../data/mockData';

interface SeniorModeViewProps {
  contacts: SeniorContact[];
  medications: MedicationItem[];
  schedule: ScheduleEvent[];
  climate: IndoorClimate;
  onConfirmImOk: () => void;
  onTakeMedication: (id: string) => void;
  onTriggerAlarm: () => void;
  onSendMessage?: (contactName: string, message: string, isEmergency: boolean) => void;
  onStartCall?: (contact: SeniorContact) => void;
  lastCheckedIn: string;
  hasCheckedInToday: boolean;
  activeAlerts?: VisualAlert[];
  onDismissAlert?: (id: string) => void;
}

interface PresetOption {
  id: string;
  emoji: string;
  title: string;
  text: string;
  isEmergency: boolean;
  tag: string;
  bgColor: string;
  borderColor: string;
}

const EMERGENCY_PRESETS: PresetOption[] = [
  {
    id: 'p1',
    emoji: '🚨',
    title: 'Akutt: Trenger hjelp nå',
    text: 'Jeg trenger hjelp hjemme nå. Kan du ringe meg eller komme innom så snart du kan?',
    isEmergency: true,
    tag: 'Høy prioritet',
    bgColor: 'bg-rose-50 hover:bg-rose-100',
    borderColor: 'border-rose-300'
  },
  {
    id: 'p2',
    emoji: '📞',
    title: 'Ring meg gjerne',
    text: 'Har du anledning til å ringe meg en liten tur når du får tid?',
    isEmergency: false,
    tag: 'Telefonprat',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-300'
  },
  {
    id: 'p3',
    emoji: '💊',
    title: 'Hjelp med medisiner',
    text: 'Jeg lurer på noe angående medisinene mine i dag. Kan vi sjekke sammen?',
    isEmergency: true,
    tag: 'Medisin',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-300'
  },
  {
    id: 'p4',
    emoji: '🛒',
    title: 'Hjelp med handling',
    text: 'Det er tomt for litt mat/melk. Kan du hjelpe meg med litt handling neste gang?',
    isEmergency: false,
    tag: 'Praktisk',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-300'
  },
  {
    id: 'p5',
    emoji: '☕',
    title: 'Koselig med besøk',
    text: 'Hadde vært så koselig om du hadde tid til en liten prat eller en kaffekopp i dag!',
    isEmergency: false,
    tag: 'Besøk',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-300'
  }
];

export const SeniorModeView: React.FC<SeniorModeViewProps> = ({
  contacts,
  medications,
  schedule,
  climate,
  onConfirmImOk,
  onTakeMedication,
  onTriggerAlarm,
  onSendMessage,
  onStartCall,
  lastCheckedIn,
  hasCheckedInToday,
  activeAlerts = [],
  onDismissAlert
}) => {
  // Navigation / Modal States
  const [activeModal, setActiveModal] = useState<'contacts' | 'meds' | 'schedule' | 'alarm' | null>(null);
  const [alarmCountdown, setAlarmCountdown] = useState<number>(5);
  const [alarmTriggered, setAlarmTriggered] = useState<boolean>(false);
  const [speechActive, setSpeechActive] = useState<boolean>(false);

  // Dedicated Contact & Emergency Actions State
  const [messageModalContact, setMessageModalContact] = useState<SeniorContact | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetOption>(EMERGENCY_PRESETS[0]);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<EmergencyMessageEvent[]>(INITIAL_EMERGENCY_MESSAGES);
  const [recentReceipt, setRecentReceipt] = useState<{ recipientName: string; time: string; text: string; isEmergency: boolean } | null>(null);
  const [showBroadcastConfirm, setShowBroadcastConfirm] = useState<boolean>(false);
  const [isBroadcastSending, setIsBroadcastSending] = useState<boolean>(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState<boolean>(false);

  // Active Call Simulator State
  const [activeCallContact, setActiveCallContact] = useState<SeniorContact | null>(null);
  const [callConnected, setCallConnected] = useState<boolean>(false);
  const [callSeconds, setCallSeconds] = useState<number>(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Time & date display
  const todayStr = new Intl.DateTimeFormat('no-NO', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  // Call timer simulation
  useEffect(() => {
    let intervalId: any = null;
    let connectionTimeout: any = null;

    if (activeCallContact) {
      connectionTimeout = setTimeout(() => {
        setCallConnected(true);
        speakText(`Samtale tilkoblet med ${activeCallContact.name}.`);
      }, 1600);

      intervalId = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setCallConnected(false);
      setCallSeconds(0);
    }

    return () => {
      if (connectionTimeout) clearTimeout(connectionTimeout);
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeCallContact]);

  // Accessible Text-To-Speech helper for seniors
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'no-NO';
      utterance.rate = 0.88; // Slower, clearer cadence for older ears
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

  // Direct Call Initiator
  const handleStartCall = (contact: SeniorContact) => {
    setActiveCallContact(contact);
    setCallConnected(false);
    setCallSeconds(0);
    speakText(`Ringer opp ${contact.name}...`);
    if (onStartCall) {
      onStartCall(contact);
    }
  };

  const handleEndCall = () => {
    if (activeCallContact) {
      speakText(`Samtalen med ${activeCallContact.name} er avsluttet.`);
    }
    setActiveCallContact(null);
    setCallConnected(false);
    setCallSeconds(0);
  };

  const formatCallTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Direct Emergency Message Sender
  const handleSendMessage = () => {
    if (!messageModalContact) return;

    const messageText = isCustomMode 
      ? (customMessage.trim() || selectedPreset.text)
      : selectedPreset.text;

    const isEmergency = isCustomMode ? true : selectedPreset.isEmergency;
    const targetContact = messageModalContact;

    setIsSendingMessage(true);
    speakText(`Sender nødmelding til ${targetContact.name}...`);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `I dag kl. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const newMsg: EmergencyMessageEvent = {
        id: `msg-${Date.now()}`,
        recipientId: targetContact.id,
        recipientName: targetContact.name,
        message: messageText,
        timestamp: timeStr,
        status: 'delivered',
        isEmergency
      };

      setMessageHistory(prev => [newMsg, ...prev]);
      setIsSendingMessage(false);
      setMessageModalContact(null);
      setCustomMessage('');
      setIsCustomMode(false);

      setRecentReceipt({
        recipientName: targetContact.name,
        time: timeStr,
        text: messageText,
        isEmergency
      });

      if (onSendMessage) {
        onSendMessage(targetContact.name, messageText, isEmergency);
      }

      speakText(`Meldingen er levert til ${targetContact.name} via mobilnettet.`);

      setTimeout(() => {
        setRecentReceipt(null);
      }, 7000);
    }, 900);
  };

  // Broadcast Emergency Alert to all contacts simultaneously
  const handleSendBroadcastToAll = () => {
    setIsBroadcastSending(true);
    speakText('Sender felles nødvarsel til alle tre kontakter...');

    setTimeout(() => {
      const now = new Date();
      const timeStr = `I dag kl. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const broadcastText = '🚨 FELLES NØDVARSEL: Kari trenger assistanse i leiligheten. Vennligst sjekk inn snarest!';

      const newMsgs: EmergencyMessageEvent[] = contacts.map(c => ({
        id: `broadcast-${c.id}-${Date.now()}`,
        recipientId: c.id,
        recipientName: c.name,
        message: broadcastText,
        timestamp: timeStr,
        status: 'delivered',
        isEmergency: true
      }));

      setMessageHistory(prev => [...newMsgs, ...prev]);
      setIsBroadcastSending(false);
      setShowBroadcastConfirm(false);

      contacts.forEach(c => {
        if (onSendMessage) {
          onSendMessage(c.name, broadcastText, true);
        }
      });

      setRecentReceipt({
        recipientName: 'Alle pårørende og vaktrom',
        time: timeStr,
        text: broadcastText,
        isEmergency: true
      });

      speakText('Felles nødvarsel er nå sendt til Ingrid, Henrik og hjemmesykepleien.');

      setTimeout(() => {
        setRecentReceipt(null);
      }, 7000);
    }, 1100);
  };

  // Alarm countdown timer
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

      {/* Visuelle varsler for senior & omsorgspersonell */}
      {activeAlerts && activeAlerts.filter(a => !a.dismissed).map(alert => {
        const isCritical = alert.severity === 'critical';
        const isWarning = alert.severity === 'warning';
        return (
          <div 
            key={alert.id}
            id={`senior-visual-alert-${alert.id}`}
            className={`mb-6 rounded-3xl p-6 sm:p-7 shadow-2xl border-4 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all ${
              isCritical
                ? 'bg-rose-600 text-white border-rose-300 ring-4 ring-rose-400/40 animate-pulse'
                : isWarning
                ? 'bg-amber-500 text-slate-950 border-amber-300 ring-4 ring-amber-300/30'
                : 'bg-indigo-600 text-white border-indigo-300'
            }`}
          >
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                isCritical ? 'bg-white text-rose-600' : isWarning ? 'bg-slate-950 text-amber-400' : 'bg-white text-indigo-600'
              }`}>
                {isCritical ? <AlertOctagon className="w-10 h-10 animate-bounce" /> : <AlertTriangle className="w-10 h-10" />}
              </div>
              <div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                    isCritical ? 'bg-white/20 text-white' : 'bg-slate-950 text-white'
                  }`}>
                    {isCritical ? 'Akutt visuelt varsel' : 'Systemvarsel'}
                  </span>
                  <span className={`text-xs font-semibold ${isCritical ? 'text-rose-100' : 'text-slate-800'}`}>
                    {alert.timestamp}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black mt-1">
                  {alert.title}
                </h2>
                <p className={`text-base sm:text-lg mt-1 ${isCritical ? 'text-rose-100' : 'text-slate-900'}`}>
                  {alert.description}
                </p>
              </div>
            </div>
            {onDismissAlert && (
              <button
                onClick={() => onDismissAlert(alert.id)}
                className={`font-black text-base sm:text-lg px-6 py-3.5 rounded-2xl shadow-md transition-all shrink-0 ${
                  isCritical 
                    ? 'bg-white hover:bg-rose-50 text-rose-950' 
                    : 'bg-slate-950 hover:bg-slate-800 text-white'
                }`}
              >
                Kvitter ut varsel
              </button>
            )}
          </div>
        );
      })}

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

      {/* DEDICATED DIRECT CONTACT & EMERGENCY MESSAGING SECTION */}
      <section 
        id="senior-direct-contacts-section" 
        className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-slate-300 shadow-xl mb-8"
      >
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 shadow-inner">
              <PhoneCall className="w-9 h-9" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Trygghetskontakt & Nødmeldinger
                </h2>
                <span className="bg-blue-100 text-blue-900 text-xs sm:text-sm font-bold px-3 py-1 rounded-full border border-blue-200">
                  Direkte hurtighandling
                </span>
              </div>
              <p className="text-base sm:text-lg text-slate-600 mt-1">
                Ring direkte med ett trykk eller send en forhåndsskrevet nødmelding til utvalgte personer.
              </p>
            </div>
          </div>

          {/* Broadcast alert to all contacts */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-broadcast-all"
              onClick={() => {
                setShowBroadcastConfirm(true);
                speakText('Vil du sende nødvarsel til alle tre kontakter samtidig?');
              }}
              className="bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-base sm:text-lg px-5 py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5 w-full sm:w-auto"
              title="Varsle alle tre kontakter på en gang"
            >
              <AlertTriangle className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Nødvarsel til alle (3)</span>
            </button>
          </div>
        </div>

        {/* Temporary delivery receipt banner */}
        {recentReceipt && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-950 flex items-center justify-between gap-4 animate-fade-in shadow-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-lg">
                  Melding levert til {recentReceipt.recipientName} ({recentReceipt.time})
                </p>
                <p className="text-sm text-emerald-800 line-clamp-1 italic">
                  "{recentReceipt.text}"
                </p>
              </div>
            </div>
            <button
              onClick={() => setRecentReceipt(null)}
              className="p-1 rounded-lg text-emerald-700 hover:bg-emerald-100 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Grid of Selected Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {contacts.map((contact) => {
            const lastMsg = messageHistory.find(m => m.recipientId === contact.id);

            return (
              <div
                key={contact.id}
                id={`contact-card-${contact.id}`}
                className="bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-blue-300 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Contact Information */}
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-16 h-16 ${contact.avatarBg} text-white rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 shadow`}>
                      {contact.initials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
                        {contact.name}
                      </h3>
                      <p className="text-sm font-semibold text-slate-600 truncate">
                        {contact.relation}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-emerald-800">
                          {contact.statusBadge || 'Tilgjengelig nå'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl px-3.5 py-2 border border-slate-200 mb-4 flex items-center justify-between text-slate-700 text-sm">
                    <span className="font-semibold text-slate-500">Telefon:</span>
                    <span className="font-mono font-bold text-slate-900">{contact.phone}</span>
                  </div>
                </div>

                {/* Direct Action Buttons for Calling & Messaging */}
                <div className="space-y-3">
                  <button
                    id={`btn-call-direct-${contact.id}`}
                    onClick={() => handleStartCall(contact)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-lg sm:text-xl py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5"
                  >
                    <Phone className="w-6 h-6 shrink-0" />
                    <span>Ring {contact.name.split(' ')[0]}</span>
                  </button>

                  <button
                    id={`btn-msg-direct-${contact.id}`}
                    onClick={() => {
                      setMessageModalContact(contact);
                      setSelectedPreset(EMERGENCY_PRESETS[0]);
                      setIsCustomMode(false);
                      setCustomMessage('');
                      speakText(`Velg en nødmelding du vil sende til ${contact.name}`);
                    }}
                    className="w-full bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-extrabold text-lg sm:text-xl py-3.5 px-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2.5"
                  >
                    <MessageSquare className="w-6 h-6 shrink-0 text-slate-950" />
                    <span>Send nødmelding</span>
                  </button>

                  {/* Last transmission note if any */}
                  {lastMsg && (
                    <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-200/80">
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
                        <CheckCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                        Sist sendt {lastMsg.timestamp.toLowerCase()}
                      </span>
                      <span className="font-medium bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        Levert SMS
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* History Drawer Toggle & Summary Strip */}
        <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-slate-700">
            <Radio className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">
              Mobilforbindelse (4G/LTE) og SMS-gateway er <strong>aktiv og overvåket</strong>.
            </span>
          </div>

          <button
            id="btn-toggle-message-history"
            onClick={() => setShowHistoryDrawer(prev => !prev)}
            className="text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white transition-colors"
          >
            <Clock className="w-4 h-4" />
            <span>{showHistoryDrawer ? 'Skjul meldingslogg' : 'Vis sendte meldinger'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showHistoryDrawer ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible History Drawer */}
        {showHistoryDrawer && (
          <div className="mt-4 p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-fade-in">
            <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-600" />
              Siste sendte beskjeder og nødvarsler
            </h4>

            {messageHistory.length === 0 ? (
              <p className="text-slate-500 text-sm">Ingen meldinger er sendt ennå.</p>
            ) : (
              <div className="divide-y divide-slate-200">
                {messageHistory.map((item) => (
                  <div key={item.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-900 font-bold">{item.recipientName}</strong>
                        <span className="text-xs text-slate-500">{item.timestamp}</span>
                        {item.isEmergency && (
                          <span className="bg-rose-100 text-rose-800 text-[11px] font-extrabold px-2 py-0.5 rounded">
                            NØDVARSEL
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 mt-0.5">{item.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-100/60 px-2.5 py-1 rounded-lg shrink-0 w-fit">
                      <CheckCheck className="w-4 h-4 text-emerald-600" />
                      <span>Bekreftet levert</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3 Large Action Cards for Senior Usability (Medisiner, Dagsplan, Nødalarm) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8">
        
        {/* Card 1: Dagens medisiner */}
        <button
          id="btn-senior-open-meds"
          onClick={() => {
            setActiveModal('meds');
            speakText('Her er dagens medisiner.');
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all group min-h-[190px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Medisiner
                </h3>
                {medications.some(m => !m.taken) && (
                  <span className="bg-amber-500 text-white text-xs font-extrabold px-2.5 py-1 rounded-full">
                    1 gjenstår
                  </span>
                )}
              </div>
              <p className="text-base text-slate-600 mt-1">
                Se dosett og bekreft tatt tablett
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-purple-700 font-bold text-base border-t border-slate-100 pt-3">
            <span>Åpne dosettoversikt</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 2: Dagsplan og besøk */}
        <button
          id="btn-senior-open-schedule"
          onClick={() => {
            setActiveModal('schedule');
            speakText('Her er avtalene dine for i dag.');
          }}
          className="bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 flex flex-col justify-between text-left shadow-sm hover:shadow-md transition-all group min-h-[190px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Hva skjer i dag?
              </h3>
              <p className="text-base text-slate-600 mt-1">
                Besøk av pleie og familietreff
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-teal-700 font-bold text-base border-t border-slate-100 pt-3">
            <span>Se dagsplan</span>
            <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Card 3: Akutt Nødalarm (Høy kontrast med sikkerhetsnedtelling) */}
        <button
          id="btn-senior-trigger-alarm"
          onClick={handleStartAlarmCountdown}
          className="bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 rounded-3xl p-6 flex flex-col justify-between text-left shadow-md hover:shadow-lg transition-all group min-h-[190px]"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-rose-950">
                Trenger du hjelp?
              </h3>
              <p className="text-base text-rose-800 mt-1">
                Akutt kontakt med vaktsentral
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-rose-900 font-black text-base border-t border-rose-200 pt-3">
            <span>Utløs alarm (5 sek)</span>
            <span className="bg-rose-600 text-white text-xs px-3 py-1 rounded-lg font-bold">
              SOS
            </span>
          </div>
        </button>
      </div>

      {/* Subtle safety footer reminder */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm sm:text-base border border-slate-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>
            Sensorene i leiligheten passer på automatisk. Skjermen fungerer også ved lokalt nettverksbortfall (lagret lokalt).
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-slate-200 text-slate-700 rounded-full">
          Seniormodus aktiv
        </span>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SEND NØDMELDING ELLER HURTIGMELDING (DEDIKERT DIALOG) */}
      {/* ========================================================================= */}
      {messageModalContact && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-slate-300 my-8">
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 ${messageModalContact.avatarBg} text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow shrink-0`}>
                  {messageModalContact.initials}
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Send melding til {messageModalContact.name}
                  </h3>
                  <p className="text-base text-slate-600">
                    {messageModalContact.relation} • {messageModalContact.phone}
                  </p>
                </div>
              </div>

              <button
                id="btn-close-message-modal"
                onClick={() => {
                  setMessageModalContact(null);
                  setIsCustomMode(false);
                }}
                className="w-12 h-12 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center shrink-0"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Mode selection: Ferdigskrevne vs Egen tekst */}
            <div className="flex items-center gap-3 mb-6">
              <button
                id="btn-mode-presets"
                onClick={() => setIsCustomMode(false)}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-base sm:text-lg transition-all border-2 ${
                  !isCustomMode 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Ferdigskrevne beskjeder (Ett trykk)
              </button>
              <button
                id="btn-mode-custom"
                onClick={() => setIsCustomMode(true)}
                className={`flex-1 py-3.5 px-4 rounded-2xl font-extrabold text-base sm:text-lg transition-all border-2 ${
                  isCustomMode 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Skriv egen beskjed
              </button>
            </div>

            {/* Content: Preset List */}
            {!isCustomMode ? (
              <div className="space-y-3 mb-6">
                <p className="text-base font-bold text-slate-800 mb-2">
                  Velg hva du vil gi beskjed om:
                </p>

                {EMERGENCY_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => {
                        setSelectedPreset(preset);
                        speakText(preset.text);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-4 ${
                        isSelected 
                          ? `${preset.bgColor} ${preset.borderColor} ring-4 ring-blue-500/20 shadow-md` 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-3xl shrink-0 select-none">
                        {preset.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xl font-black text-slate-900">
                            {preset.title}
                          </h4>
                          <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white/80 text-slate-700 border border-slate-200">
                            {preset.tag}
                          </span>
                        </div>
                        <p className="text-base sm:text-lg text-slate-700 mt-1 leading-relaxed">
                          "{preset.text}"
                        </p>
                      </div>
                      <div className="shrink-0 pt-1">
                        <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mb-6">
                <label className="block text-lg font-bold text-slate-900 mb-2">
                  Skriv beskjeden din her:
                </label>
                <textarea
                  id="input-custom-message"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="F.eks: Hei, jeg lurer på om du kan ringe meg når du er ferdig på jobb?"
                  rows={4}
                  className="w-full p-4 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:outline-none text-xl text-slate-900"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="text-sm text-slate-500">Hurtigord:</span>
                  {['Ring meg', 'Kom innom', 'Matvarer', 'Alt er bra', 'Legetime'].map((word) => (
                    <button
                      key={word}
                      type="button"
                      onClick={() => setCustomMessage(prev => prev ? `${prev} ${word}` : word)}
                      className="text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl transition-colors"
                    >
                      +{word}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <button
                id="btn-cancel-message"
                onClick={() => setMessageModalContact(null)}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-lg text-slate-700 hover:bg-slate-100"
              >
                Avbryt
              </button>

              <button
                id="btn-confirm-send-message"
                disabled={isSendingMessage}
                onClick={handleSendMessage}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold text-xl sm:text-2xl px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                <Send className="w-7 h-7" />
                <span>
                  {isSendingMessage ? 'Sender melding via SMS...' : `Send melding til ${messageModalContact.name.split(' ')[0]}`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: INTERAKTIV OPPRINGNING & SAMTALE-SKJERM */}
      {/* ========================================================================= */}
      {activeCallContact && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl border-4 border-emerald-500 text-center animate-fade-in">
            {/* Animated avatar */}
            <div className="relative w-28 h-28 mx-auto mb-6">
              <div className={`w-28 h-28 ${activeCallContact.avatarBg} text-white rounded-full flex items-center justify-center text-4xl font-black shadow-xl`}>
                {activeCallContact.initials}
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-75" />
            </div>

            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
              {activeCallContact.name}
            </h3>
            <p className="text-xl text-slate-600 font-medium mb-4">
              {activeCallContact.phone}
            </p>

            {/* Status indicator */}
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 px-5 py-2.5 rounded-full text-lg font-extrabold mb-8 border border-emerald-300">
              <span className="w-3 h-3 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                {callConnected 
                  ? `Samtale pågår (${formatCallTime(callSeconds)})` 
                  : 'Ringer opp... Vennligst vent'}
              </span>
            </div>

            {/* Quick in-call controls */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button
                id="btn-call-speaker"
                onClick={() => {
                  setIsSpeakerOn(!isSpeakerOn);
                  speakText(isSpeakerOn ? 'Høyttaler av' : 'Høyttaler på');
                }}
                className={`py-4 px-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 border-2 transition-all ${
                  isSpeakerOn 
                    ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-sm' 
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                {isSpeakerOn ? <Volume2 className="w-6 h-6 text-blue-600" /> : <VolumeX className="w-6 h-6" />}
                <span>{isSpeakerOn ? 'Høyttaler PÅ' : 'Høyttaler AV'}</span>
              </button>

              <button
                id="btn-call-mute"
                onClick={() => {
                  setIsMuted(!isMuted);
                  speakText(isMuted ? 'Mikrofon på' : 'Mikrofon dempet');
                }}
                className={`py-4 px-4 rounded-2xl font-extrabold text-lg flex items-center justify-center gap-2 border-2 transition-all ${
                  isMuted 
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm' 
                    : 'bg-slate-100 border-slate-300 text-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-6 h-6 text-amber-600" /> : <Mic className="w-6 h-6" />}
                <span>{isMuted ? 'Mikrofon AV' : 'Mikrofon PÅ'}</span>
              </button>
            </div>

            {/* Big Red Hang Up Button */}
            <button
              id="btn-end-active-call"
              onClick={handleEndCall}
              className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-2xl py-5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all"
            >
              <PhoneOff className="w-8 h-8" />
              <span>Avslutt samtale</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: BEKREFT FELLES NØDVARSEL TIL ALLE KONTAKTER */}
      {/* ========================================================================= */}
      {showBroadcastConfirm && (
        <div className="fixed inset-0 bg-rose-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-500 text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-rose-300">
              <AlertTriangle className="w-12 h-12 text-rose-600" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-rose-950 mb-2">
              Vil du sende nødvarsel til alle tre?
            </h3>
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Dette sender en akutt SMS-tekstmelding til <strong>Ingrid</strong>, <strong>Henrik</strong> og <strong>Hjemmesykepleien</strong> samtidig:
            </p>

            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 text-rose-900 font-bold text-lg mb-6 text-left">
              "🚨 FELLES NØDVARSEL: Kari trenger assistanse i leiligheten. Vennligst sjekk inn snarest!"
            </div>

            <div className="space-y-3">
              <button
                id="btn-confirm-broadcast-send"
                disabled={isBroadcastSending}
                onClick={handleSendBroadcastToAll}
                className="w-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                <Send className="w-7 h-7" />
                <span>{isBroadcastSending ? 'Sender varsel til alle...' : 'Ja, send nødvarsel til alle nå'}</span>
              </button>

              <button
                id="btn-cancel-broadcast"
                onClick={() => setShowBroadcastConfirm(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-lg py-4 rounded-2xl transition-colors"
              >
                Avbryt (Det var ikke meningen)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: DAGENS MEDISINER */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* MODAL 5: DAGSPLAN */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* MODAL 6: NØDALARM MED SIKKERHETSNEDTELLING */}
      {/* ========================================================================= */}
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

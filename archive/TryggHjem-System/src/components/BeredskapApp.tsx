import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Radio, 
  FileText, 
  Wrench, 
  PlusCircle, 
  Filter, 
  ChevronRight, 
  Sparkles, 
  Activity, 
  HeartHandshake, 
  AlertCircle,
  ExternalLink,
  PhoneCall,
  Check,
  Building,
  Key,
  Flame
} from 'lucide-react';
import { 
  TechnicalFailure, 
  FallbackRoutine, 
  OperationalLogItem, 
  Patient, 
  UrgencyLevel 
} from '../types';

interface BeredskapAppProps {
  failures: TechnicalFailure[];
  routines: Record<string, FallbackRoutine>;
  patients: Patient[];
  operationalLog: OperationalLogItem[];
  onOpenFallback: (failureId: string) => void;
  onOpenNewIncidentModal: () => void;
  onAcknowledgeLogItem: (logId: string) => void;
  onAcknowledgeFailure: (failureId: string) => void;
  onQuickReportDoorIssue: () => void;
}

export const BeredskapApp: React.FC<BeredskapAppProps> = ({
  failures,
  routines,
  patients,
  operationalLog,
  onOpenFallback,
  onOpenNewIncidentModal,
  onAcknowledgeLogItem,
  onAcknowledgeFailure,
  onQuickReportDoorIssue,
}) => {
  const [activeTab, setActiveTab] = useState<'konsekvens' | 'logg' | 'fallback_oversikt'>('konsekvens');
  const [logFilter, setLogFilter] = useState<'alle' | 'aktive' | 'teknisk'>('alle');
  const [urgencyFilter, setUrgencyFilter] = useState<'alle' | 'kritisk' | 'høy'>('alle');

  // Simulated live countdown tick for urgency deadlines
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingMinutes = (deadlineMinutes: number) => {
    // subtract elapsed simulated minutes
    const remaining = Math.max(1, deadlineMinutes - Math.floor(elapsedSeconds / 60));
    return remaining;
  };

  const filteredFailures = failures.filter((f) => {
    if (urgencyFilter === 'kritisk') return f.urgency === 'kritisk';
    if (urgencyFilter === 'høy') return f.urgency === 'høy';
    return true;
  });

  const filteredLog = operationalLog.filter((item) => {
    if (logFilter === 'aktive') return item.status === 'aktiv';
    if (logFilter === 'teknisk') return item.category === 'teknisk_meldt';
    return true;
  });

  const activeFailuresCount = failures.filter((f) => f.status === 'aktiv' || f.status === 'tiltak_pågår').length;

  return (
    <div className="space-y-6">
      {/* Sub-header banner: Purpose & Status */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              App 2: Beredskap & Rutine
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs text-slate-500 font-medium">Helsepersonell på vakt</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1 tracking-tight">
            Klinisk Konsekvensanalyse & Fallback-beredskap
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Oversetter teknisk sensorsvikt direkte til pasientsikkerhet og kliniske tiltak i pleieplanen.
            Sikrer at vaktlagene handler raskt og unngår dobbeltarbeid gjennom felles hendelseslogg.
          </p>
        </div>

        {/* Quick actions for staff */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="quick-report-door-btn"
            type="button"
            onClick={onQuickReportDoorIssue}
            className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl border border-amber-300 transition-colors flex items-center gap-1.5"
            title="1-klikks innmelding for å unngå telefonkø"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-700" />
            <span>Meld dørstyringsfeil (1 klikk)</span>
          </button>
          
          <button
            id="open-new-incident-btn"
            type="button"
            onClick={onOpenNewIncidentModal}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Meld inn tiltak / hendelse</span>
          </button>
        </div>
      </div>

      {/* Navigation tabs within App 2 */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          id="tab-konsekvens-btn"
          type="button"
          onClick={() => setActiveTab('konsekvens')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'konsekvens'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4 text-red-500" />
          <span>1. Konsekvensanalyse & Pleieplan</span>
          {activeFailuresCount > 0 && (
            <span className="bg-red-500 text-white text-[11px] px-1.5 py-0.2 rounded-full font-bold">
              {activeFailuresCount}
            </span>
          )}
        </button>

        <button
          id="tab-fallback-btn"
          type="button"
          onClick={() => setActiveTab('fallback_oversikt')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'fallback_oversikt'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>2. Digital brannslukningsmeny (Fallback)</span>
        </button>

        <button
          id="tab-logg-btn"
          type="button"
          onClick={() => setActiveTab('logg')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'logg'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-teal-600" />
          <span>3. Felles hendelseslogg for drift</span>
          <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
            {operationalLog.length}
          </span>
        </button>
      </div>

      {/* TAB 1: KONSEKVENSANALYSE KOBLET MOT PLEIEPLAN */}
      {activeTab === 'konsekvens' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Filtrer alvorlighet:</span>
              {(['alle', 'kritisk', 'høy'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setUrgencyFilter(lvl)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                    urgencyFilter === lvl
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-500">
              Automatisk klinisk triagering via EPJ/VKP-kobling
            </p>
          </div>

          <div className="space-y-4">
            {filteredFailures.map((failure) => {
              const patient = patients.find((p) => p.id === failure.patientId);
              const routine = routines[failure.fallbackId];
              const remainingMin = getRemainingMinutes(failure.deadlineMinutes);
              const isResolved = failure.status === 'løst' || failure.status === 'kvittert';

              return (
                <div
                  key={failure.id}
                  className={`rounded-2xl border transition-all ${
                    isResolved
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : failure.urgency === 'kritisk'
                      ? 'bg-white border-red-300 shadow-md ring-1 ring-red-500/10'
                      : 'bg-white border-amber-300 shadow-xs'
                  }`}
                >
                  {/* Card Header with Urgency Timer */}
                  <div className={`p-4 sm:p-5 border-b rounded-t-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isResolved
                      ? 'bg-slate-100/70 border-slate-200'
                      : failure.urgency === 'kritisk'
                      ? 'bg-red-50/70 border-red-200'
                      : 'bg-amber-50/70 border-amber-200'
                  }`}>
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isResolved
                          ? 'bg-slate-200 text-slate-600'
                          : failure.urgency === 'kritisk'
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-amber-500 text-white'
                      }`}>
                        {isResolved ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <AlertOctagon className="w-6 h-6 animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-slate-900">
                            {failure.patientName} ({failure.patientAge} år)
                          </h3>
                          <span className="text-xs text-slate-500 font-medium">
                            • {patient?.room || 'Leil. 204'} • {patient?.address || 'Furuveien 14B'}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            isResolved
                              ? 'bg-emerald-100 text-emerald-800'
                              : failure.urgency === 'kritisk'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {isResolved ? 'Tiltak kvittert' : `${failure.urgency} prioritet`}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Teknisk sensor: <span className="font-semibold text-slate-800">{failure.sensorType}</span> – Falt ut {failure.timestamp}
                        </p>
                      </div>
                    </div>

                    {/* Deadline Countdown & Status */}
                    {!isResolved && (
                      <div className="flex items-center gap-2 self-start sm:self-auto bg-white/90 px-3 py-1.5 rounded-xl border border-red-200 shadow-xs">
                        <Clock className={`w-4 h-4 ${remainingMin < 15 ? 'text-red-600 animate-spin' : 'text-amber-600'}`} />
                        <div className="text-right">
                          <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                            Pasientsikkerhetsfrist
                          </div>
                          <div className="text-xs font-bold text-red-700">
                            {remainingMin} minutter gjenstår
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Body: Translation of Technical to Clinical Reality */}
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* The Crucial Contrast: Tech vs Clinical Consequence */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Technical Layer */}
                      <div className="md:col-span-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                          <Radio className="w-3.5 h-3.5 text-slate-500" />
                          <span>Teknisk feilmelding (Sensor):</span>
                        </div>
                        <p className="text-slate-800 font-semibold">{failure.failureCause}</p>
                        <p className="text-[11px] font-mono text-slate-500 bg-white p-1.5 rounded border border-slate-200 break-all">
                          {failure.rawTechError}
                        </p>
                      </div>

                      {/* Clinical Reality Arrow / Translation */}
                      <div className="md:col-span-8 bg-gradient-to-r from-red-50/60 to-amber-50/60 p-3.5 rounded-xl border border-red-200/80 text-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-950 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-red-600" />
                            Klinisk virkelighet (Pleieplan & EPJ):
                          </span>
                          <span className="text-[11px] font-mono bg-red-100 text-red-900 px-2 py-0.2 rounded font-semibold">
                            Fysisk tilsyn innen {failure.deadlineMinutes} min
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          «{failure.clinicalConsequence}»
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                          <span className="bg-white/80 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                            Diagnose: {patient?.primaryDiagnosis}
                          </span>
                          <span className="bg-white/80 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                            Kognisjon: {patient?.cognitiveStatus}
                          </span>
                          <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold">
                            {patient?.fallRiskScore}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Patient Context & Required Action */}
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="font-semibold text-slate-700">Påkrevd akuttiltak:</span>{' '}
                        <span className="text-slate-900">{failure.requiredAction}</span>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span>Nøkkelboks-kode: <strong className="font-mono text-slate-800">{patient?.keyBoxCode || '4821'}</strong></span>
                          <span>•</span>
                          <span>Ansvarlig: <strong>{patient?.assignedNurse}</strong></span>
                        </div>
                      </div>

                      {/* Interactive Triggers */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!isResolved ? (
                          <>
                            <button
                              id={`open-fallback-btn-${failure.id}`}
                              type="button"
                              onClick={() => onOpenFallback(failure.id)}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span>Start Digital Brannslukningsmeny</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`quick-ack-btn-${failure.id}`}
                              type="button"
                              onClick={() => onAcknowledgeFailure(failure.id)}
                              className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-xl border border-slate-300 transition-colors"
                              title="Kvitter ut dersom tilsyn allerede er tatt"
                            >
                              Kvitter ut
                            </button>
                          </>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-semibold bg-emerald-100 px-3 py-1.5 rounded-xl">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Fallback gjennomført & sikret</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: DIGITAL BRANNSLUKNINGSMENY (FALLBACK-OVERSIKT) */}
      {activeTab === 'fallback_oversikt' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-200 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Digital brannslukningsmeny (Interaktive Fallback-rutiner)
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Trinnvis digital sjekkliste som sikrer pasienten når sensorteknologien svikter. Veileder pleieren gjennom:
                  1) Manuell fysisk sjekkrunde, 2) Tildeling av midlertidig 4G-nødknapp, 3) Journalføring i EPJ, og 4) Direkte kontakt med teknisk vakt.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {failures.map((f) => {
              const routine = routines[f.fallbackId];
              const completedCount = routine?.steps.filter((s) => s.completed).length || 0;
              const totalCount = routine?.steps.length || 4;
              const isAllDone = completedCount === totalCount;

              return (
                <div 
                  key={f.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isAllDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isAllDone ? 'Fullført' : `${completedCount} av ${totalCount} trinn`}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {f.fallbackId}</span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{f.patientName} ({f.patientAge} år)</h4>
                      <p className="text-xs text-slate-600 mt-0.5">Sensor: {f.sensorType}</p>
                    </div>

                    {/* Step pills */}
                    <div className="space-y-1.5 text-xs">
                      {routine?.steps.map((step, idx) => (
                        <div 
                          key={step.id} 
                          className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                            step.completed ? 'bg-emerald-50 text-emerald-900 font-medium' : 'bg-slate-50 text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {step.completed ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            ) : (
                              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 text-[10px] flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                            )}
                            <span className="truncate">{step.title.replace(/^Trinn \d+: /, '')}</span>
                          </div>
                          {step.completed && <span className="text-[10px] text-emerald-700 font-mono">OK</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    id={`open-fallback-card-btn-${f.id}`}
                    type="button"
                    onClick={() => onOpenFallback(f.id)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Åpne sjekkliste</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FELLES HENDELSESLOGG FOR DRIFT */}
      {activeTab === 'logg' && (
        <div className="space-y-4">
          {/* Header controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Filter logg:</span>
              {(['alle', 'aktive', 'teknisk'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setLogFilter(filter)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium capitalize transition-colors ${
                    logFilter === filter
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {filter === 'alle' ? 'Alle hendelser' : filter === 'aktive' ? 'Aktive tiltak' : 'Teknisk meldt'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Realtidssynkronisering mellom vaktlag (hindrer dobbeltarbeid)</span>
            </div>
          </div>

          {/* Incident Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
            {filteredLog.map((item) => {
              const isAcknowledged = item.status === 'kvittert' || item.status === 'løst';

              return (
                <div 
                  key={item.id}
                  className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isAcknowledged ? 'bg-slate-50/60' : 'bg-white hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      item.category === 'teknisk_meldt'
                        ? 'bg-amber-100 text-amber-700'
                        : item.category === 'tiltak_utført'
                        ? 'bg-emerald-100 text-emerald-700'
                        : item.category === 'system'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.category === 'teknisk_meldt' && <Wrench className="w-4 h-4" />}
                      {item.category === 'tiltak_utført' && <UserCheck className="w-4 h-4" />}
                      {item.category === 'system' && <Radio className="w-4 h-4" />}
                      {item.category === 'kvittering' && <CheckCircle2 className="w-4 h-4" />}
                      {item.category === 'pasienttilsyn' && <FileText className="w-4 h-4" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-slate-400 font-semibold">
                          Kl. {item.timestamp}
                        </span>
                        {item.patientName && (
                          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                            {item.patientName}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.urgent ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.category.replace('_', ' ')}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm ${isAcknowledged ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                        {item.message}
                      </p>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>Loggført av: <strong>{item.actor}</strong> ({item.role})</span>
                        {item.assignedTo && (
                          <>
                            <span>•</span>
                            <span>Tildelt: <strong>{item.assignedTo}</strong></span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* One-click Acknowledge / Kvitter ut action */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    {isAcknowledged ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Kvittert ut
                      </span>
                    ) : (
                      <button
                        id={`ack-log-item-${item.id}-btn`}
                        type="button"
                        onClick={() => onAcknowledgeLogItem(item.id)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Kvitter ut (1 klikk)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

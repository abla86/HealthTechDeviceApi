import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Circle, 
  Radio, 
  FileText, 
  Wrench, 
  MapPin, 
  Key, 
  UserCheck, 
  AlertTriangle, 
  Copy, 
  Check, 
  Send, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { FallbackRoutine, FallbackStep, TechnicalFailure, Patient } from '../types';

interface FallbackDrawerProps {
  routine: FallbackRoutine | null;
  failure: TechnicalFailure | null;
  patient: Patient | null;
  onClose: () => void;
  onUpdateRoutine: (updated: FallbackRoutine) => void;
  onCompleteRoutine: (routineId: string, finalLogMessage: string) => void;
}

export const FallbackDrawer: React.FC<FallbackDrawerProps> = ({
  routine,
  failure,
  patient,
  onClose,
  onUpdateRoutine,
  onCompleteRoutine,
}) => {
  if (!routine || !failure) return null;

  const [copiedNote, setCopiedNote] = useState(false);
  const [editedNote, setEditedNote] = useState(routine.journalNoteDraft);
  const [selectedDevice, setSelectedDevice] = useState(routine.temporaryDeviceId || '4G-NØDKNAPP #14-B');
  const [ticketSent, setTicketSent] = useState(routine.techTicketCreated);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completedCount = routine.steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / routine.steps.length) * 100);

  const handleToggleStep = (stepId: number) => {
    const updatedSteps = routine.steps.map((step) => {
      if (step.id === stepId) {
        const nextState = !step.completed;
        return {
          ...step,
          completed: nextState,
          completedBy: nextState ? 'Sykepleier Maria Lund' : undefined,
          completedAt: nextState ? `Kl. ${new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}` : undefined,
        };
      }
      return step;
    });

    const isAllDone = updatedSteps.every((s) => s.completed);
    onUpdateRoutine({
      ...routine,
      steps: updatedSteps,
      status: isAllDone ? 'fullført' : 'påbegynt',
    });
  };

  const handleCopyJournalNote = () => {
    navigator.clipboard.writeText(editedNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);

    // Also auto-complete step 3 if not completed
    const step3 = routine.steps.find((s) => s.actionType === 'journal');
    if (step3 && !step3.completed) {
      handleToggleStep(3);
    }
  };

  const handleSendTechTicket = () => {
    setTicketSent(true);
    // Mark step 4 as complete
    const step4 = routine.steps.find((s) => s.actionType === 'tech_contact');
    if (step4 && !step4.completed) {
      handleToggleStep(4);
    }
  };

  const handleFinalize = () => {
    setIsSubmitting(true);
    const logMsg = `${patient?.name || failure.patientName}: Digital brannslukningsmeny fullført av Maria Lund. Fysisk tilsyn OK, reserveløsning (${selectedDevice}) aktivert, journalført og teknisk sak opprettet.`;
    
    setTimeout(() => {
      onCompleteRoutine(routine.id, logMsg);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Digital brannslukningsmeny (Fallback)</h2>
                <span className="text-[10px] bg-red-950 text-red-300 font-semibold px-2 py-0.5 rounded border border-red-800">
                  Akuttiltak
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pasientsikkerhetsrutine for {failure.patientName} ({failure.patientAge} år)
              </p>
            </div>
          </div>
          <button
            id="close-fallback-drawer-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Lukk meny"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Context Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-semibold">Klinisk bakgrunn:</span> {failure.clinicalConsequence}
              <div className="mt-1 flex flex-wrap gap-2 text-[11px] text-amber-800">
                <span>• Lokasjon: <strong>{patient?.address || 'Furuveien 14B'}</strong></span>
                <span>• Nøkkelboks: <strong className="font-mono bg-amber-100 px-1 py-0.5 rounded">{patient?.keyBoxCode || '4821'}</strong></span>
                <span>• Primærdiagnose: <em>{patient?.primaryDiagnosis || 'Hofteoperert'}</em></span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Framdrift akuttiltak:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              {completedCount} av {routine.steps.length} trinn fullført ({progressPercent}%)
            </span>
          </div>
          <div className="w-36 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scrollable Checklist Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {routine.steps.map((step, idx) => {
            const isDone = step.completed;

            return (
              <div 
                key={step.id} 
                className={`rounded-xl border transition-all ${
                  isDone 
                    ? 'border-emerald-200 bg-emerald-50/40' 
                    : 'border-slate-200 bg-white shadow-xs'
                }`}
              >
                {/* Step Header */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      id={`toggle-step-${step.id}-btn`}
                      type="button"
                      onClick={() => handleToggleStep(step.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          isDone ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          Trinn {idx + 1}
                        </span>
                        <h3 className={`text-sm font-bold ${isDone ? 'text-emerald-900 line-through-none' : 'text-slate-900'}`}>
                          {step.title.replace(/^Trinn \d+: /, '')}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {isDone && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded shrink-0">
                      Fullført {step.completedAt}
                    </span>
                  )}
                </div>

                {/* Step Specific Interactive Workflows */}
                <div className="px-4 pb-4 pt-1 ml-9 border-t border-slate-100/80 space-y-3">
                  {/* Trinn 1: Fysisk sjekk details */}
                  {step.actionType === 'check' && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between text-slate-700 font-medium">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          {patient?.address || 'Furuveien 14B'}
                        </span>
                        <span className="flex items-center gap-1.5 font-mono text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          <Key className="w-3 h-3 text-amber-600" />
                          Kode: {patient?.keyBoxCode || '4821'}
                        </span>
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        Husk å sjekke: Allmenntilstand, gangfunksjon, smerter i operert hofte og at pasienten har drikkevann tilgjengelig.
                      </div>
                      <button
                        id="mark-check-done-btn"
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        {isDone ? '✓ Fysisk tilsyn bekreftet' : 'Bekreft utført fysisk tilsyn'}
                      </button>
                    </div>
                  )}

                  {/* Trinn 2: Tildeling av midlertidig 4G-nødknapp */}
                  {step.actionType === 'assign_device' && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-200">
                      <label className="block text-slate-700 font-medium">
                        Velg reservenødknapp fra bilens beredskapskoffert:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['4G-NØDKNAPP #14-B', '4G-SMYKKE #09-A', 'ALARM-KLOKKE #22-C'].map((dev) => (
                          <button
                            key={dev}
                            type="button"
                            onClick={() => setSelectedDevice(dev)}
                            className={`px-2.5 py-1 text-xs rounded-md border font-medium transition-all ${
                              selectedDevice === dev 
                                ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {dev}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Aktiv enhet: <strong>{selectedDevice}</strong> (Tilkoblet Telenor 4G mot Kommunalt Responssenter).
                      </p>
                      <button
                        id="confirm-device-btn"
                        type="button"
                        onClick={() => handleToggleStep(step.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                            : 'bg-teal-700 text-white hover:bg-teal-800'
                        }`}
                      >
                        <Radio className="w-3.5 h-3.5" />
                        {isDone ? `✓ Enhet ${selectedDevice} aktivert` : `Aktiver og kvitter for ${selectedDevice}`}
                      </button>
                    </div>
                  )}

                  {/* Trinn 3: Journalføring i EPJ (Gerica / Profil) */}
                  {step.actionType === 'journal' && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-700 font-medium flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          Generert strukturert journalnotat (EPJ / Profil / Gerica):
                        </label>
                        <button
                          id="copy-journal-btn"
                          type="button"
                          onClick={handleCopyJournalNote}
                          className="flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded transition-colors"
                        >
                          {copiedNote ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-semibold">Kopiert til utklipp!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Kopier notat</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={editedNote}
                        onChange={(e) => setEditedNote(e.target.value)}
                        className="w-full bg-white p-2.5 rounded-md border border-slate-300 text-slate-800 font-mono text-[11px] leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Signeres med vakt-ID: Maria Lund (HPR: 829104)</span>
                        <button
                          id="confirm-journal-step-btn"
                          type="button"
                          onClick={() => handleToggleStep(step.id)}
                          className={`px-2.5 py-1 rounded font-medium ${
                            isDone ? 'text-emerald-700 bg-emerald-100' : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                          }`}
                        >
                          {isDone ? '✓ Notat arkivert' : 'Sett som journalført'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Trinn 4: Direkte kontakt med teknisk vakt */}
                  {step.actionType === 'tech_contact' && (
                    <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-2 border border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 font-medium flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                          Melding til kommunal IKT & Sensorleverandør:
                        </span>
                        {ticketSent && (
                          <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                            Arbeidsordre #IKT-9941
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        Automatisk feilmelding for <strong>{failure.sensorType}</strong> ({failure.rawTechError}). Utstyrsleverandør varsles for utskifting eller re-konfigurering.
                      </p>
                      <button
                        id="send-tech-ticket-btn"
                        type="button"
                        disabled={ticketSent}
                        onClick={handleSendTechTicket}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                          ticketSent 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default' 
                            : 'bg-amber-600 text-white hover:bg-amber-700 shadow-xs'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        {ticketSent ? '✓ Feilmelding meldt til teknisk vakt & leverandør' : 'Send feilmelding til Teknisk Vakt nå'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Drawer Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            {completedCount === routine.steps.length ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Alle akuttiltak er gjennomført og sikret.
              </span>
            ) : (
              <span>Gjennomfør alle 4 trinn for fullstendig pasientsikkerhetsgaranti.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="cancel-fallback-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Avbryt
            </button>
            <button
              id="finalize-fallback-btn"
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalize}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <span>Fullfør og loggfør tiltak</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

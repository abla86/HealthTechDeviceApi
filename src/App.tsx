import React, { useState } from 'react';
import { Header } from './components/Header';
import { BeredskapApp } from './components/BeredskapApp';
import { TryggPaaroerendeApp } from './components/TryggPaaroerendeApp';
import { FallbackDrawer } from './components/FallbackDrawer';
import { AlarmTestModal } from './components/AlarmTestModal';
import { NewIncidentModal } from './components/NewIncidentModal';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { 
  INITIAL_PATIENTS, 
  INITIAL_FAILURES, 
  INITIAL_FALLBACK_ROUTINES, 
  INITIAL_OPERATIONAL_LOG, 
  INITIAL_ACTIVITY_MESSAGES, 
  SHIELDED_TECH_NOISE, 
  MOCK_RELATIVE 
} from './data/mockData';
import { 
  TechnicalFailure, 
  FallbackRoutine, 
  OperationalLogItem 
} from './types';

export default function App() {
  const [currentApp, setCurrentApp] = useState<'beredskap' | 'paaroerende'>('beredskap');
  
  // Data states
  const [patients] = useState(INITIAL_PATIENTS);
  const [failures, setFailures] = useState<TechnicalFailure[]>(INITIAL_FAILURES);
  const [routines, setRoutines] = useState<Record<string, FallbackRoutine>>(INITIAL_FALLBACK_ROUTINES);
  const [operationalLog, setOperationalLog] = useState<OperationalLogItem[]>(INITIAL_OPERATIONAL_LOG);
  const [activityMessages] = useState(INITIAL_ACTIVITY_MESSAGES);
  const [shieldedNoise] = useState(SHIELDED_TECH_NOISE);
  const [relative] = useState(MOCK_RELATIVE);

  // Modals & Drawers
  const [activeFallbackFailureId, setActiveFallbackFailureId] = useState<string | null>(null);
  const [isAlarmTestOpen, setIsAlarmTestOpen] = useState(false);
  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handler for 1-click quick report of door error
  const handleQuickReportDoorIssue = () => {
    const timeNow = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    const newLogItem: OperationalLogItem = {
      id: `log-${Date.now()}`,
      timestamp: timeNow,
      patientName: 'Astrid Berg',
      actor: 'Sykepleier Maria Lund',
      role: 'Vaktlag Sentrum',
      category: 'teknisk_meldt',
      message: 'Teknisk feil på dørstyring meldt til leverandør (Dorma/Aptus). Arbeidsordre generert.',
      status: 'aktiv',
      assignedTo: 'Maria Lund',
      urgent: true,
    };

    setOperationalLog((prev) => [newLogItem, ...prev]);
    addToast(
      'success',
      'Teknisk feil meldt til leverandør!',
      'Loggført i felles driftstabell. Dobbeltarbeid og unødvendige telefoner forhindret.'
    );
  };

  // Handler for adding a new log item
  const handleAddLogItem = (itemData: Omit<OperationalLogItem, 'id' | 'timestamp'>) => {
    const timeNow = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    const newItem: OperationalLogItem = {
      ...itemData,
      id: `log-${Date.now()}`,
      timestamp: timeNow,
    };

    setOperationalLog((prev) => [newItem, ...prev]);
    addToast(
      'success',
      'Hendelse publisert i felles logg',
      `Registrert under ${itemData.patientName || 'Felles drift'}.`
    );
  };

  // Handler for 1-click acknowledge of log item
  const handleAcknowledgeLogItem = (logId: string) => {
    setOperationalLog((prev) =>
      prev.map((item) => (item.id === logId ? { ...item, status: 'kvittert' } : item))
    );
    addToast('success', 'Tiltak kvittert ut (1 klikk)', 'Vaktlaget er varslet om at oppgaven er ivaretatt.');
  };

  // Handler for acknowledging failure directly
  const handleAcknowledgeFailure = (failureId: string) => {
    const failure = failures.find((f) => f.id === failureId);
    setFailures((prev) =>
      prev.map((f) => (f.id === failureId ? { ...f, status: 'kvittert' } : f))
    );

    if (failure) {
      const timeNow = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
      const logItem: OperationalLogItem = {
        id: `log-${Date.now()}`,
        timestamp: timeNow,
        patientName: failure.patientName,
        actor: 'Sykepleier Maria Lund',
        role: 'Vaktlag Sentrum',
        category: 'kvittering',
        message: `${failure.patientName}: Fysisk tilsyn kvittert ut. Klinisk sikkerhetskrav innfridd.`,
        status: 'kvittert',
        assignedTo: 'Maria Lund',
        urgent: false,
      };
      setOperationalLog((prev) => [logItem, ...prev]);
    }

    addToast('success', 'Tilsyn bekreftet og kvittert', 'Sensorsvikt håndtert i henhold til pleieplan.');
  };

  // Handler for updating fallback routine in progress
  const handleUpdateRoutine = (updated: FallbackRoutine) => {
    setRoutines((prev) => ({ ...prev, [updated.id]: updated }));
  };

  // Handler for completing fallback routine
  const handleCompleteRoutine = (routineId: string, finalLogMessage: string) => {
    const routine = routines[routineId];
    if (!routine) return;

    // Update routine
    setRoutines((prev) => ({
      ...prev,
      [routineId]: { ...routine, status: 'fullført' },
    }));

    // Update failure
    setFailures((prev) =>
      prev.map((f) => (f.id === routine.failureId ? { ...f, status: 'løst' } : f))
    );

    // Add to operational log
    const timeNow = new Date().toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' });
    const logItem: OperationalLogItem = {
      id: `log-${Date.now()}`,
      timestamp: timeNow,
      patientName: routine.patientName.replace(/\s*\(\d+ år\)/, ''),
      actor: 'Sykepleier Maria Lund',
      role: 'Vaktlag Sentrum',
      category: 'tiltak_utført',
      message: finalLogMessage,
      status: 'løst',
      assignedTo: 'Maria Lund',
      urgent: false,
    };
    setOperationalLog((prev) => [logItem, ...prev]);

    addToast(
      'success',
      'Digital brannslukningsmeny fullført!',
      'Pasientsikkerhet sikret: Fysisk sjekk gjennomført, 4G-nødknapp tildelt, journalført og teknisk sak opprettet.'
    );
  };

  // Current active failure & routine for drawer
  const activeFailure = failures.find((f) => f.id === activeFallbackFailureId) || null;
  const activeRoutine = activeFailure ? routines[activeFailure.fallbackId] || null : null;
  const activePatient = activeFailure ? patients.find((p) => p.id === activeFailure.patientId) || null : null;

  const activeIncidentsCount = failures.filter((f) => f.status === 'aktiv').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Universal Header */}
      <Header
        currentApp={currentApp}
        setCurrentApp={setCurrentApp}
        activeIncidentsCount={activeIncidentsCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {currentApp === 'beredskap' ? (
          <BeredskapApp
            failures={failures}
            routines={routines}
            patients={patients}
            operationalLog={operationalLog}
            onOpenFallback={(failureId) => setActiveFallbackFailureId(failureId)}
            onOpenNewIncidentModal={() => setIsNewIncidentOpen(true)}
            onAcknowledgeLogItem={handleAcknowledgeLogItem}
            onAcknowledgeFailure={handleAcknowledgeFailure}
            onQuickReportDoorIssue={handleQuickReportDoorIssue}
          />
        ) : (
          <TryggPaaroerendeApp
            relative={relative}
            patient={patients[0]} // Per Hansen
            activityMessages={activityMessages}
            shieldedNoise={shieldedNoise}
            onOpenAlarmTest={() => setIsAlarmTestOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-semibold text-slate-300">
              Nasjonal Velferdsteknologisk Løsning • Helse & Omsorgstjenesten
            </p>
            <p className="text-[11px] text-slate-300 mt-0.5">
              App 2: Beredskap & Rutine for vaktlag | App 3: TryggPårørende for familie og pårørende
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-300">
            <span>Sikkerhetsnivå: Helse-Nettverk Normen</span>
            <span>•</span>
            <span>GDPR & Personvern: Innebygd</span>
          </div>
        </div>
      </footer>

      {/* Drawers & Modals */}
      <FallbackDrawer
        routine={activeRoutine}
        failure={activeFailure}
        patient={activePatient}
        onClose={() => setActiveFallbackFailureId(null)}
        onUpdateRoutine={handleUpdateRoutine}
        onCompleteRoutine={handleCompleteRoutine}
      />

      <AlarmTestModal
        isOpen={isAlarmTestOpen}
        onClose={() => setIsAlarmTestOpen(false)}
        relative={relative}
      />

      <NewIncidentModal
        isOpen={isNewIncidentOpen}
        onClose={() => setIsNewIncidentOpen(false)}
        patients={patients}
        onAddLogItem={handleAddLogItem}
      />

      {/* Floating Notifications */}
      <NotificationToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

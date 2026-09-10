/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Heart, 
  HardDrive, 
  Activity, 
  FileText, 
  Sliders, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw,
  Bell,
  Cpu,
  User,
  Info
} from 'lucide-react';
import { SeniorModeView } from './components/SeniorModeView';
import { StorageDiagnostics } from './components/StorageDiagnostics';
import { HealthMonitorView } from './components/HealthMonitorView';
import { ArchitectureSolutionView } from './components/ArchitectureSolutionView';
import { 
  INITIAL_MICROSD_METRICS, 
  INITIAL_NVME_METRICS, 
  INITIAL_CONTACTS, 
  INITIAL_MEDICATIONS, 
  INITIAL_SCHEDULE, 
  INITIAL_CLIMATE, 
  INITIAL_VITALS, 
  INITIAL_LOGS 
} from './data/mockData';
import { StorageMetrics, StorageMedium, SystemLogEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'senior' | 'storage' | 'health' | 'architecture'>('senior');
  const [currentMedium, setCurrentMedium] = useState<StorageMedium>('microSD');
  const [storageMetrics, setStorageMetrics] = useState<StorageMetrics>(INITIAL_MICROSD_METRICS);
  const [contacts] = useState(INITIAL_CONTACTS);
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [schedule] = useState(INITIAL_SCHEDULE);
  const [climate, setClimate] = useState(INITIAL_CLIMATE);
  const [vitals, setVitals] = useState(INITIAL_VITALS);
  const [logs, setLogs] = useState<SystemLogEntry[]>(INITIAL_LOGS);
  const [lastCheckedIn, setLastCheckedIn] = useState<string>('14:28');
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(true);
  const [isScanningSmart, setIsScanningSmart] = useState<boolean>(false);
  const [showLogDrawer, setShowLogDrawer] = useState<boolean>(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 4000);
  };

  const addLog = (level: SystemLogEntry['level'], source: SystemLogEntry['source'], message: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newEntry: SystemLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      level,
      source,
      message
    };
    setLogs(prev => [newEntry, ...prev.slice(0, 49)]);
  };

  // Toggle storage medium (SD vs NVMe SSD)
  const handleToggleMedium = (medium: StorageMedium) => {
    setCurrentMedium(medium);
    if (medium === 'microSD') {
      setStorageMetrics(INITIAL_MICROSD_METRICS);
      addLog('warn', 'STORAGE_DAEMON', 'Byttet til aktiv lagring: SanDisk Ultra 32GB MicroSD. Advarsel: Lav utholdenhet.');
      triggerToast('Aktiv lagring endret til MicroSD (Høy slitasjerisiko)');
    } else {
      setStorageMetrics(INITIAL_NVME_METRICS);
      addLog('success', 'STORAGE_DAEMON', 'Byttet til aktiv lagring: Industriell M.2 NVMe SSD. Slitasjehelse: 94% optimal.');
      triggerToast('Aktiv lagring endret til NVMe SSD (Maksimal stabilitet)');
    }
  };

  // Toggle log2ram
  const handleToggleLog2Ram = () => {
    setStorageMetrics(prev => {
      const nextState = !prev.log2ramEnabled;
      const newDailyMB = nextState ? 650 : 4800;
      const newWriteRate = nextState ? 35 : 240;
      addLog(
        nextState ? 'success' : 'warn',
        'STORAGE_DAEMON',
        nextState 
          ? 'log2ram aktivert: /var/log montert i RAM. Skrivebelastning redusert med 85%.' 
          : 'log2ram deaktivert: Logger skrives nå direkte til flash-blokker.'
      );
      triggerToast(nextState ? 'log2ram aktivert: 85% redusert slitasje' : 'log2ram deaktivert');
      return {
        ...prev,
        log2ramEnabled: nextState,
        avgDailyWritesMB: newDailyMB,
        writeRateKBps: newWriteRate
      };
    });
  };

  // Toggle SQLite WAL mode
  const handleToggleWalMode = () => {
    setStorageMetrics(prev => {
      const nextState = !prev.walModeEnabled;
      addLog(
        nextState ? 'info' : 'warn',
        'STORAGE_DAEMON',
        nextState 
          ? 'SQLite PRAGMA journal_mode=WAL satt. Sekvensiell I/O aktivert.' 
          : 'SQLite WAL deaktivert. Gikk tilbake til rollback journal.'
      );
      triggerToast(nextState ? 'SQLite WAL-modus aktivert' : 'SQLite WAL deaktivert');
      return {
        ...prev,
        walModeEnabled: nextState,
        ioWaitPercent: nextState ? 0.8 : 14.8
      };
    });
  };

  // Senior check-in
  const handleConfirmImOk = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setLastCheckedIn(timeStr);
    setHasCheckedInToday(true);
    addLog('success', 'SENIOR_UI', `Senior bekreftet trygghet kl. ${timeStr}. Varsling sendt til pårørende.`);
    triggerToast('Trygghetsmelding sendt til pårørende og vaktrom!');
  };

  // Senior takes medication
  const handleTakeMedication = (id: string) => {
    setMedications(prev => prev.map(m => m.id === id ? { ...m, taken: true } : m));
    const target = medications.find(m => m.id === id);
    addLog('success', 'HEALTH_BLE', `Medisin '${target?.name}' bekreftet tatt av senior.`);
    triggerToast(`Medisin registrert som tatt: ${target?.name}`);
  };

  // Senior or simulated alarm
  const handleTriggerAlarm = () => {
    addLog('error', 'SENIOR_UI', 'AKUTT NØDALARM utløst fra berøringsskjerm! Pårørende og alarmsentral varsles.');
    triggerToast('AKUTT ALARM UTKALT! Pårørende ringes opp.');
  };

  // Health Fall simulation
  const handleTriggerSimulatedFall = () => {
    setVitals(prev => ({
      ...prev,
      fallDetected: true,
      lastMovementMinutesAgo: 0
    }));
    addLog('error', 'FALL_RADAR', 'mmWave sensor varsler: Hurtig fall mot gulvflate registrert i stue.');
    triggerToast('Fallalarm utløst fra mmWave radarsensor!');
  };

  const handleResetFallAlert = () => {
    setVitals(prev => ({
      ...prev,
      fallDetected: false
    }));
    addLog('info', 'FALL_RADAR', 'Fallalarm manuelt nullstilt etter verifisering.');
    triggerToast('Fallalarm er nullstilt.');
  };

  // S.M.A.R.T diagnostic test simulation
  const handleRunSmartTest = () => {
    setIsScanningSmart(true);
    addLog('info', 'STORAGE_DAEMON', `Starter dyp S.M.A.R.T-skanning på ${storageMetrics.modelName}...`);
    
    setTimeout(() => {
      setIsScanningSmart(false);
      const now = new Date();
      const scanTime = `I dag kl. ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      setStorageMetrics(prev => ({
        ...prev,
        lastSmartScan: scanTime
      }));
      addLog('success', 'STORAGE_DAEMON', `S.M.A.R.T-skanning fullført for ${storageMetrics.modelName}.`);
      triggerToast('S.M.A.R.T-skanning fullført!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Toast banner */}
      {notificationMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-fade-in">
          <Info className="w-5 h-5 text-teal-400 shrink-0" />
          <span className="font-semibold text-sm">{notificationMsg}</span>
        </div>
      )}

      {/* Navigation Header / Role Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3">
            
            {/* Logo & Prototype Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow">
                V
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                    Velferdsteknologi Prototype
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Konsept
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Hardware-stabilitet (SD vs SSD) &bull; Helsetelemetri &bull; Seniormodus
                </p>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto">
              
              {/* Tab 1: Seniormodus */}
              <button
                id="nav-senior-mode"
                onClick={() => setActiveTab('senior')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'senior'
                    ? 'bg-white text-teal-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${activeTab === 'senior' ? 'text-teal-600 fill-teal-100' : 'text-slate-500'}`} />
                <span>Seniormodus (Bruker)</span>
              </button>

              {/* Tab 2: Lagring & Maskinvare */}
              <button
                id="nav-storage-mode"
                onClick={() => setActiveTab('storage')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'storage'
                    ? 'bg-white text-blue-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HardDrive className={`w-4 h-4 ${activeTab === 'storage' ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>Lagring (SD vs SSD)</span>
                {storageMetrics.wearLevelingPercentage < 30 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>

              {/* Tab 3: Helseovervåking */}
              <button
                id="nav-health-mode"
                onClick={() => setActiveTab('health')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'health'
                    ? 'bg-white text-purple-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'health' ? 'text-purple-600' : 'text-slate-500'}`} />
                <span>Helse & Sensorer</span>
                {vitals.fallDetected && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-bounce" />
                )}
              </button>

              {/* Tab 4: Teknisk Arkitektur & Stack */}
              <button
                id="nav-architecture-mode"
                onClick={() => setActiveTab('architecture')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 ${
                  activeTab === 'architecture'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'architecture' ? 'text-slate-900' : 'text-slate-500'}`} />
                <span>Løsningsforslag (Stack)</span>
              </button>
            </div>

            {/* Quick Diagnostic Badge & Log Drawer Toggle */}
            <div className="hidden lg:flex items-center gap-3">
              <div 
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  storageMetrics.wearLevelingPercentage > 50 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>{currentMedium === 'microSD' ? 'SD: 26% levetid' : 'NVMe: 94% levetid'}</span>
              </div>

              <button
                id="btn-toggle-logs"
                onClick={() => setShowLogDrawer(prev => !prev)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 relative"
                title="Vis telemetrilogg i sanntid"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-500" />
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 py-4">
        {activeTab === 'senior' && (
          <SeniorModeView
            contacts={contacts}
            medications={medications}
            schedule={schedule}
            climate={climate}
            onConfirmImOk={handleConfirmImOk}
            onTakeMedication={handleTakeMedication}
            onTriggerAlarm={handleTriggerAlarm}
            lastCheckedIn={lastCheckedIn}
            hasCheckedInToday={hasCheckedInToday}
          />
        )}

        {activeTab === 'storage' && (
          <StorageDiagnostics
            metrics={storageMetrics}
            onToggleMedium={handleToggleMedium}
            onToggleLog2Ram={handleToggleLog2Ram}
            onToggleWalMode={handleToggleWalMode}
            onRunSmartTest={handleRunSmartTest}
            isScanning={isScanningSmart}
          />
        )}

        {activeTab === 'health' && (
          <HealthMonitorView
            vitals={vitals}
            climate={climate}
            medications={medications}
            onTriggerSimulatedFall={handleTriggerSimulatedFall}
            onResetFallAlert={handleResetFallAlert}
          />
        )}

        {activeTab === 'architecture' && (
          <ArchitectureSolutionView />
        )}
      </main>

      {/* Telemetry Log Drawer (Collapsible) */}
      {showLogDrawer && (
        <div className="fixed bottom-0 right-0 left-0 md:left-auto md:w-96 bg-white border-t md:border-l border-slate-300 shadow-2xl z-50 p-4 max-h-96 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
            <span className="font-bold text-xs uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Sanntids Hendelseslogg</span>
            </span>
            <button
              id="btn-close-logs"
              onClick={() => setShowLogDrawer(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-0.5 rounded"
            >
              Lukk
            </button>
          </div>
          <div className="overflow-y-auto space-y-2 flex-1 font-mono text-[11px]">
            {logs.map(entry => (
              <div key={entry.id} className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-400 mb-0.5">
                  <span className="font-bold text-slate-700">[{entry.source}]</span>
                  <span>{entry.timestamp}</span>
                </div>
                <p className={`leading-snug ${
                  entry.level === 'error' ? 'text-rose-600 font-bold' :
                  entry.level === 'warn' ? 'text-amber-700 font-medium' :
                  entry.level === 'success' ? 'text-emerald-700' : 'text-slate-600'
                }`}>
                  {entry.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Velferdsteknologisk Konseptprototype &bull; Sikret mot minnekortkorrupsjon (SD vs SSD)</span>
          <span className="font-medium text-slate-600">Utviklet med Python/Flask arkitektur &amp; Lovelace/React</span>
        </div>
      </footer>
    </div>
  );
}

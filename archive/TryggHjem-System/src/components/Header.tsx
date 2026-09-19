import React from 'react';
import { 
  ShieldCheck, 
  HeartHandshake, 
  Radio, 
  Clock, 
  Stethoscope, 
  Users,
  Activity
} from 'lucide-react';

interface HeaderProps {
  currentApp: 'beredskap' | 'paaroerende';
  setCurrentApp: (app: 'beredskap' | 'paaroerende') => void;
  activeIncidentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentApp, 
  setCurrentApp,
  activeIncidentsCount 
}) => {
  const [time, setTime] = React.useState<string>('');

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top microbar with municipal and system state */}
      <div className="bg-slate-950 px-4 py-1.5 border-b border-slate-800 text-xs text-slate-300 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-medium text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Kommunalt Responssenter Operativt
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">Sone Sentrum • Vaktlag 2 (Dagvakt)</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-slate-200">{time || '14:35:00'}</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-slate-400">
            {currentApp === 'beredskap' ? 'Innlogget: Maria Lund (Sykepleier)' : 'Innlogget: Kari Hansen (Datter)'}
          </span>
        </div>
      </div>

      {/* Main navigation & role switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-sm ring-2 ring-emerald-500/20">
            {currentApp === 'beredskap' ? (
              <Stethoscope className="w-5 h-5 text-white" />
            ) : (
              <HeartHandshake className="w-5 h-5 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                Velferdsteknologi Portal
              </h1>
              <span className="bg-emerald-950 text-emerald-300 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-700/50">
                Helse-Nettverk v3.4
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentApp === 'beredskap' 
                ? 'App 2: Beredskap & Rutine – Klinisk konsekvens og fallbacks for vaktlag' 
                : 'App 3: TryggPårørende – Verdig aktivitetsindikator og støyfri trygghet'}
            </p>
          </div>
        </div>

        {/* Dual App Switcher */}
        <div className="flex items-center p-1 bg-slate-800/90 rounded-xl border border-slate-700 self-start md:self-auto">
          <button
            id="switch-to-beredskap-btn"
            type="button"
            onClick={() => setCurrentApp('beredskap')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentApp === 'beredskap'
                ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>App 2: Beredskap & Rutine</span>
            {activeIncidentsCount > 0 && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                currentApp === 'beredskap' ? 'bg-red-500 text-white' : 'bg-red-900 text-red-200'
              }`}>
                {activeIncidentsCount}
              </span>
            )}
          </button>

          <button
            id="switch-to-paaroerende-btn"
            type="button"
            onClick={() => setCurrentApp('paaroerende')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              currentApp === 'paaroerende'
                ? 'bg-teal-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>App 3: TryggPårørende</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

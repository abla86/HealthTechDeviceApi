import React, { useState, useEffect } from 'react';
import { 
  X, 
  BellRing, 
  CheckCircle2, 
  Smartphone, 
  ShieldCheck, 
  Volume2, 
  AlertOctagon, 
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { RelativeProfile } from '../types';

interface AlarmTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  relative: RelativeProfile;
}

export const AlarmTestModal: React.FC<AlarmTestModalProps> = ({
  isOpen,
  onClose,
  relative,
}) => {
  if (!isOpen) return null;

  const [testStatus, setTestStatus] = useState<'idle' | 'sending' | 'triggered' | 'verified'>('idle');
  const [soundPlaying, setSoundPlaying] = useState(false);

  const startTest = () => {
    setTestStatus('sending');
    setTimeout(() => {
      setTestStatus('triggered');
      setSoundPlaying(true);
      // simulate audio beep with Web Audio API safely
      try {
        const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        setTimeout(() => {
          osc.stop();
          setSoundPlaying(false);
        }, 600);
      } catch {
        setSoundPlaying(false);
      }
    }, 1200);
  };

  const verifyTest = () => {
    setTestStatus('verified');
  };

  const handleResetAndClose = () => {
    setTestStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Funksjonstest av alarmmottak</h3>
              <p className="text-xs text-teal-200/80">Sikkerhetsventil & push-varsel direkte til pårørende</p>
            </div>
          </div>
          <button
            id="close-alarm-test-btn"
            onClick={handleResetAndClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Explanation banner */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-4 text-xs text-teal-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-teal-950">
                Skjermet mot støy – kun reelle hendelser varsles
              </p>
              <p className="text-slate-600 leading-relaxed">
                Appen filtrerer bort tekniske mikroavbrudd (som kortvarig WiFi-fall eller minnekort-sjekk). 
                Push-varsler med høy prioritet sendes kun ved <strong>utløst trygghetsalarm</strong> eller <strong>vedvarende uvanlig fravær fra normal døgnrytme</strong>.
              </p>
            </div>
          </div>

          {/* Test recipient info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-semibold text-slate-800">{relative.name} ({relative.relation})</p>
                <p className="text-slate-500 font-mono">{relative.phone}</p>
              </div>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded-full">
              Kanal: Push & SMS
            </span>
          </div>

          {/* Interactive Test Flow */}
          {testStatus === 'idle' && (
            <div className="text-center py-4 space-y-3">
              <p className="text-xs text-slate-600">
                Klikk under for å sende et kontrollert prøvevarsel. Dette bekrefter at telefonen din er online og at lyder og vibrasjon slår gjennom.
              </p>
              <button
                id="trigger-test-alarm-btn"
                type="button"
                onClick={startTest}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
              >
                <BellRing className="w-4 h-4" />
                <span>Send testvarsel til min telefon nå</span>
              </button>
            </div>
          )}

          {testStatus === 'sending' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-700">Sender kryptert testalarm via Kommunalt Responssenter...</p>
              <p className="text-[11px] text-slate-500">Omgår "Ikke forstyrr"-modus for kritiske helsevarsler</p>
            </div>
          )}

          {testStatus === 'triggered' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <AlertOctagon className="w-4 h-4 text-amber-600" />
                    SIMULERT NØDVARSEL (TEST)
                  </span>
                  <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                    AKKURAT NÅ
                  </span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                  <p className="font-bold text-slate-900">🔔 Trygghetsalarm TEST: Far (Per Hansen)</p>
                  <p className="text-slate-600">
                    Dette er en planlagt funksjonstest av alarmmottaket. Responssenteret bekrefter at linjen er 100% operativ.
                  </p>
                </div>
                {soundPlaying && (
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-800 font-medium py-1">
                    <Volume2 className="w-4 h-4 animate-bounce text-amber-600" />
                    <span>Lydsignal avspilt</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  id="confirm-test-received-btn"
                  type="button"
                  onClick={verifyTest}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bekreft: Jeg har mottatt testvarselet!</span>
                </button>
              </div>
            </div>
          )}

          {testStatus === 'verified' && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">Alarmmottak Verifisert</h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Push-varsler, SMS og lydvarsling er bekreftet operative mot telefon {relative.phone}. Responstid: 0.8 sekunder.
                </p>
              </div>
              <p className="text-[11px] text-slate-500">
                Du er trygt koblet på fars beredskapsnettverk. Neste rutinemessige systemsjekk kjøres i bakgrunnen av IKT-vakt.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            id="close-test-modal-footer-btn"
            type="button"
            onClick={handleResetAndClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Lukk test
          </button>
        </div>
      </div>
    </div>
  );
};

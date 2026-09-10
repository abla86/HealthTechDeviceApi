import React, { useState } from 'react';
import { 
  HeartHandshake, 
  ShieldCheck, 
  EyeOff, 
  MicOff, 
  Sun, 
  Moon, 
  Coffee, 
  Armchair, 
  BellRing, 
  CheckCircle2, 
  BatteryCharging, 
  Wifi, 
  Phone, 
  AlertTriangle, 
  Sparkles, 
  ChevronRight, 
  VolumeX, 
  Info,
  Shield,
  Activity
} from 'lucide-react';
import { ActivityMessage, FilteredTechNoise, RelativeProfile, Patient } from '../types';

interface TryggPaaroerendeAppProps {
  relative: RelativeProfile;
  patient: Patient;
  activityMessages: ActivityMessage[];
  shieldedNoise: FilteredTechNoise[];
  onOpenAlarmTest: () => void;
}

export const TryggPaaroerendeApp: React.FC<TryggPaaroerendeAppProps> = ({
  relative,
  patient,
  activityMessages,
  shieldedNoise,
  onOpenAlarmTest,
}) => {
  const [selectedPerson, setSelectedPerson] = useState('far');
  const [showNoiseDetails, setShowNoiseDetails] = useState(false);

  return (
    <div className="space-y-6">
      {/* Top Banner: Peaceful & Dignified Identity */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-teal-500/20 text-teal-300 text-xs font-bold px-3 py-0.5 rounded-full border border-teal-400/30 flex items-center gap-1.5">
                <HeartHandshake className="w-3.5 h-3.5" />
                App 3: TryggPårørende
              </span>
              <span className="text-teal-400/60 text-xs">•</span>
              <span className="text-xs text-teal-200">Familie & Pårørendeportal</span>
            </div>
            
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Trygghet for {patient.name} (84 år)
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed">
              Omsorgsfull trygghetsstatus basert på diskrete døgnrytmeprinsipper. 
              Respekterer fars privatliv og verdighet fullt ut, samtidig som du vet at kommunens helseteam passer på.
            </p>

            {/* Strict Privacy Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-teal-200/90">
              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-teal-500/20">
                <EyeOff className="w-4 h-4 text-teal-300" />
                <span>100% Kamerafritt</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-teal-500/20">
                <MicOff className="w-4 h-4 text-teal-300" />
                <span>Ingen lydopptak</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-teal-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kommuneovervåket 24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Alarm Test Trigger Button */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 self-start md:self-auto flex flex-col items-center text-center space-y-2.5 min-w-[220px]">
            <div className="w-10 h-10 rounded-xl bg-teal-400/20 border border-teal-300/30 flex items-center justify-center text-teal-200">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Sikkerhetsventil for varsling</p>
              <p className="text-[11px] text-teal-200/80 mt-0.5">Test alarmmottaket til din mobil</p>
            </div>
            <button
              id="test-alarm-header-btn"
              type="button"
              onClick={onOpenAlarmTest}
              className="w-full py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>Test alarmmottak nå</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Main Functional Columns / Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT & CENTER: Aktivitetsindikator uten overvåking (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Aktivitetsindikator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Aktivitetsindikator uten overvåking
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Normal døgnrytme
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diskrete, trygge døgnrytmemeldinger. Ingen sensorer samler inn bilder eller stemme.
                </p>
              </div>

              <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 self-start">
                Sist oppdatert: <strong>Kl. 13:45</strong>
              </div>
            </div>

            {/* Visual 24-Hour Rhythm Timeline */}
            <div className="space-y-2 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Døgnrytmebånd i dag (Per Hansen):</span>
                <span className="text-emerald-700 font-bold">100% i henhold til normal mønster</span>
              </div>
              
              <div className="grid grid-cols-4 gap-1.5 h-10">
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-1.5 flex items-center justify-center gap-1 text-[11px] text-emerald-900 font-medium" title="23:00 - 07:30: Rolig søvn">
                  <Moon className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Natt (00-08)</span>
                </div>
                <div className="bg-emerald-200 border border-emerald-400 rounded-lg p-1.5 flex items-center justify-center gap-1 text-[11px] text-emerald-950 font-bold" title="08:00 - 11:00: Morgenrutine og kaffe">
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Morgen (08-11)</span>
                </div>
                <div className="bg-emerald-200 border border-emerald-400 rounded-lg p-1.5 flex items-center justify-center gap-1 text-[11px] text-emerald-950 font-bold" title="11:00 - 14:00: Kjøkken og stueaktivitet">
                  <Coffee className="w-3.5 h-3.5 text-emerald-800" />
                  <span className="hidden sm:inline">Formiddag (11-14)</span>
                </div>
                <div className="bg-emerald-100 border border-emerald-300 rounded-lg p-1.5 flex items-center justify-center gap-1 text-[11px] text-emerald-900 font-medium" title="14:00 - 18:00: Hvilestund og stue">
                  <Armchair className="w-3.5 h-3.5 text-teal-700" />
                  <span className="hidden sm:inline">Nå (14-18)</span>
                </div>
              </div>

              <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>24:00</span>
              </div>
            </div>

            {/* List of gentle activity messages */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Dagens trygghetsoppdateringer:
              </h4>

              <div className="space-y-3">
                {activityMessages.map((msg) => (
                  <div 
                    key={msg.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 transition-all flex items-start gap-3.5 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                      {msg.period === 'natt' && <Moon className="w-4 h-4" />}
                      {msg.period === 'morgen' && <Sun className="w-4 h-4 text-amber-600" />}
                      {msg.period === 'formiddag' && <Coffee className="w-4 h-4" />}
                      {msg.period === 'ettermiddag' && <Armchair className="w-4 h-4 text-teal-700" />}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {msg.title}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {msg.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-0.5">
                        <EyeOff className="w-3 h-3 text-slate-400" />
                        <span>Målemetode: {msg.sensorBasis}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dignity Guarantee Note */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 font-semibold">Respekt for fars verdighet:</strong>{' '}
                Systemet bruker utelukkende passiv infrarød sensorikk og anonyme radarbølger for å bekrefte normal livsutfoldelse. Ingen bilder, video eller lydstrømmer forlater noensinne hjemmet.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Systemets helsestatus & Sikkerhetsventil for varsling (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Section 2: Systemets helsestatus */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Systemets helsestatus</h3>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Alt operativt
              </span>
            </div>

            {/* Calm reassuring indicator */}
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-4 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-emerald-950 text-sm">
                Alt fungerer som det skal
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Hjemmesentralen er online, batterinivåer er gode og kommunal IT-vakt overvåker systemet kontinuerlig i bakgrunnen.
              </p>
            </div>

            {/* Hardware & Network Status Badges */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Wifi className="w-4 h-4 text-emerald-600" />
                  Hjemmesentral (4G + Fiber)
                </span>
                <span className="font-semibold text-emerald-700">Online (Stabil)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                  Batteristatus (Trygghetsalarm)
                </span>
                <span className="font-semibold text-slate-800">98% (God)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                <span className="flex items-center gap-2 text-slate-700 font-medium">
                  <Shield className="w-4 h-4 text-teal-600" />
                  Kommunal IT-vakt
                </span>
                <span className="font-semibold text-slate-800">24/7 Bemannet</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-mono">
              Siste automatiske helsesjekk: For 2 minutter siden
            </p>
          </div>

          {/* Section 3: Sikkerhetsventil for varsling */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900">Sikkerhetsventil for varsling</h3>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-semibold">
                  Aktiv
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Skjermer pårørende for teknisk støy og unødig uro.
              </p>
            </div>

            {/* Noise Shield Explanation */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <VolumeX className="w-3.5 h-3.5 text-teal-600" />
                  Teknisk støyfilter:
                </span>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
                  {shieldedNoise.length} hendelser skjermet
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Kortvarige WiFi-mikrobrudd og minnekort-slitasje rutes direkte til hjemmetjenesten og IT-vakt. 
                Du mottar aldri unødige tekniske feilmeldinger.
              </p>

              <button
                id="toggle-noise-details-btn"
                type="button"
                onClick={() => setShowNoiseDetails(!showNoiseDetails)}
                className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold underline"
              >
                {showNoiseDetails ? 'Skjul skjermede hendelser' : 'Se hvilke feil som ble skjermet i dag'}
              </button>

              {showNoiseDetails && (
                <div className="mt-2 pt-2 border-t border-slate-200 space-y-2 animate-in fade-in duration-200">
                  {shieldedNoise.map((noise) => (
                    <div key={noise.id} className="bg-white p-2 rounded border border-slate-200 text-[10px] space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-700">
                        <span>{noise.rawEvent}</span>
                        <span className="text-slate-400 font-mono">{noise.timestamp}</span>
                      </div>
                      <p className="text-slate-500">{noise.explanation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Real Events Policy & Test Button */}
            <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-3.5 space-y-2.5">
              <span className="text-xs font-bold text-teal-950 block">
                Når sender systemet push-varsel til deg?
              </span>
              <ul className="text-[11px] text-teal-900 space-y-1.5 list-disc list-inside">
                <li><strong>Reell utløst trygghetsalarm</strong> (pasient trykker eller fall oppdages)</li>
                <li><strong>Vedvarende uvanlig fravær</strong> fra normal døgnrytme (&gt; 4 timer)</li>
              </ul>

              <button
                id="test-alarm-card-btn"
                type="button"
                onClick={onOpenAlarmTest}
                className="w-full mt-2 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Test alarmmottaket direkte</span>
              </button>
            </div>

            {/* Contact Network */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs font-bold text-slate-800 block">Døgnbemannet kontakt:</span>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">Hjemmetjenesten Vakttelefon</p>
                  <p className="text-slate-500 font-mono text-[11px]">Sone Sentrum (24/7)</p>
                </div>
                <a
                  href="tel:22000000"
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-emerald-800 font-semibold rounded border border-slate-300 flex items-center gap-1 text-[11px]"
                >
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>22 00 00 00</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

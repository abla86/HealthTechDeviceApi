import React, { useState } from 'react';
import { 
  X, 
  Send, 
  PlusCircle, 
  Wrench, 
  UserCheck, 
  Battery, 
  Radio, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { OperationalLogItem, Patient } from '../types';

interface NewIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  onAddLogItem: (item: Omit<OperationalLogItem, 'id' | 'timestamp'>) => void;
}

export const NewIncidentModal: React.FC<NewIncidentModalProps> = ({
  isOpen,
  onClose,
  patients,
  onAddLogItem,
}) => {
  if (!isOpen) return null;

  const [selectedPatient, setSelectedPatient] = useState(patients[0]?.name || 'Per Hansen');
  const [category, setCategory] = useState<OperationalLogItem['category']>('teknisk_meldt');
  const [message, setMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [assignedTo, setAssignedTo] = useState('Maria Lund');

  // Quick preset templates as required by user prompt
  const QUICK_TEMPLATES = [
    {
      label: 'Teknisk feil på dørstyring meldt til leverandør',
      cat: 'teknisk_meldt' as const,
      text: 'Teknisk feil på dørstyring meldt til leverandør (Dorma/Aptus). Arbeidsordre opprettet.',
      urgent: true,
    },
    {
      label: 'Fysisk tilsyn gjennomført – Pasient i god behold',
      cat: 'tiltak_utført' as const,
      text: 'Fysisk sjekkrunde gjennomført. Pasient i god behold. Ingen skade observert.',
      urgent: false,
    },
    {
      label: 'Midlertidig 4G-nødknapp tildelt og funksjonstestet',
      cat: 'tiltak_utført' as const,
      text: 'Midlertidig 4G-nødknapp levert ut fra reservekoffert og testoppringt til sentralen med OK resultat.',
      urgent: false,
    },
    {
      label: 'Batteri byttet på sensor (reservekoffert)',
      cat: 'tiltak_utført' as const,
      text: 'Lavt batteri utbedret med nytt litiumelement. Grønn diode bekrefter drift.',
      urgent: false,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onAddLogItem({
      patientName: selectedPatient,
      actor: assignedTo,
      role: 'Vaktlag Sentrum (Hjemmetjenesten)',
      category,
      message: message.trim(),
      status: 'aktiv',
      assignedTo,
      urgent: isUrgent,
    });

    setMessage('');
    onClose();
  };

  const handleApplyTemplate = (tpl: typeof QUICK_TEMPLATES[0]) => {
    setCategory(tpl.cat);
    setMessage(tpl.text);
    setIsUrgent(tpl.urgent);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Meld inn hendelse eller tiltak</h3>
              <p className="text-xs text-slate-400">Deles umiddelbart med hele vaktlaget for å hindre dobbeltarbeid</p>
            </div>
          </div>
          <button
            id="close-new-incident-modal-btn"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quick preset chips */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Hurtigmaler (1-klikk utfylling):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TEMPLATES.map((tpl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-left text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  ⚡ {tpl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gjelder pasient:</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} ({p.age} år)
                  </option>
                ))}
                <option value="Generelt vaktrom / drift">Felles/Drift (Ingen spesifikk pasient)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OperationalLogItem['category'])}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="teknisk_meldt">Teknisk vakt / leverandør meldt</option>
                <option value="tiltak_utført">Tiltak utført (fysisk sjekk/reserve)</option>
                <option value="kvittering">Kvittering ut tiltak</option>
                <option value="pasienttilsyn">Rutinemessig pasienttilsyn</option>
              </select>
            </div>
          </div>

          {/* Message Text */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Beskrivelse av hendelse eller tiltak:
            </label>
            <textarea
              required
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="F.eks: Teknisk feil på dørstyring meldt til leverandør Dorma kl. 14:40..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>

          {/* Actor & Urgent Checkbox */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <input
                id="urgent-check"
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
              <label htmlFor="urgent-check" className="text-xs font-semibold text-red-700">
                Kritisk / Haster for neste vaktlag
              </label>
            </div>

            <div className="text-xs text-slate-500">
              Registreres av: <strong className="text-slate-800">{assignedTo}</strong>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              id="cancel-log-item-btn"
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Avbryt
            </button>
            <button
              id="submit-log-item-btn"
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publiser i felles logg</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

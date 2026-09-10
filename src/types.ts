export type UrgencyLevel = 'kritisk' | 'høy' | 'moderat';

export type IncidentStatus = 'aktiv' | 'tiltak_pågår' | 'løst' | 'kvittert';

export interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  address: string;
  keyBoxCode?: string;
  primaryDiagnosis: string;
  cognitiveStatus: string;
  fallRiskScore: string;
  assignedNurse: string;
  relativesContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface TechnicalFailure {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  sensorType: 'fallradar' | 'sengematte' | 'dørsensor' | 'medisindispenser' | 'hjemmesentral';
  failureCause: string;
  timestamp: string;
  rawTechError: string;
  
  // Konsekvensanalyse koblet direkte mot pleieplanen
  clinicalConsequence: string;
  patientContext: string;
  requiredAction: string;
  deadlineMinutes: number;
  urgency: UrgencyLevel;
  
  status: IncidentStatus;
  fallbackId: string;
}

export interface FallbackStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  actionType: 'check' | 'assign_device' | 'journal' | 'tech_contact';
  details?: string;
}

export interface FallbackRoutine {
  id: string;
  failureId: string;
  patientName: string;
  steps: FallbackStep[];
  temporaryDeviceId?: string;
  journalNoteDraft: string;
  techTicketCreated: boolean;
  status: 'ikke_startet' | 'påbegynt' | 'fullført';
}

export interface OperationalLogItem {
  id: string;
  timestamp: string;
  patientName?: string;
  actor: string;
  role: string;
  category: 'tiltak_utført' | 'teknisk_meldt' | 'kvittering' | 'pasienttilsyn' | 'system';
  message: string;
  status: 'aktiv' | 'kvittert' | 'løst';
  assignedTo?: string;
  urgent: boolean;
}

export interface ActivityMessage {
  id: string;
  time: string;
  period: 'natt' | 'morgen' | 'formiddag' | 'ettermiddag' | 'kveld';
  title: string;
  description: string;
  status: 'normal' | 'rolig' | 'aktiv';
  sensorBasis: string; // f.eks. "Passiv infrarød / dørsensor (ingen kamera)"
}

export interface FilteredTechNoise {
  id: string;
  timestamp: string;
  rawEvent: string;
  explanation: string;
  shieldedFromPaaroerende: boolean;
}

export interface RelativeProfile {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
  notificationPreferences: {
    criticalAlarms: boolean;
    unusualInactivity: boolean;
    dailySummary: boolean;
    technicalNoise: boolean; // always false to protect them!
  };
}

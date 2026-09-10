import { StorageMetrics, SeniorContact, MedicationItem, ScheduleEvent, IndoorClimate, HealthVitals, SystemLogEntry } from '../types';

export const INITIAL_MICROSD_METRICS: StorageMetrics = {
  medium: 'microSD',
  modelName: 'SanDisk Ultra 32GB A1 Class 10',
  totalCapacityGB: 32,
  tbwWritten: 18.4,
  tbwRating: 25.0, // Typical endurance for consumer SD
  wearLevelingPercentage: 26, // Only 26% life left!
  badBlocksCount: 42,
  reallocatedSectors: 89,
  readOnlyRisk: 'moderate',
  tempCelsius: 48,
  writeRateKBps: 240,
  avgDailyWritesMB: 4800,
  estimatedRemainingDays: 45,
  log2ramEnabled: false,
  walModeEnabled: false,
  filesystemStatus: 'warning',
  ioWaitPercent: 14.8,
  lastSmartScan: 'I dag kl. 14:32'
};

export const INITIAL_NVME_METRICS: StorageMetrics = {
  medium: 'nvmeSSD',
  modelName: 'Kingston NV2 / Transcend Industrial M.2 NVMe 256GB',
  totalCapacityGB: 256,
  tbwWritten: 19.2,
  tbwRating: 320.0, // High endurance
  wearLevelingPercentage: 94, // 94% life remaining
  badBlocksCount: 0,
  reallocatedSectors: 0,
  readOnlyRisk: 'low',
  tempCelsius: 38,
  writeRateKBps: 35,
  avgDailyWritesMB: 650,
  estimatedRemainingDays: 3280,
  log2ramEnabled: true,
  walModeEnabled: true,
  filesystemStatus: 'healthy',
  ioWaitPercent: 0.4,
  lastSmartScan: 'I dag kl. 14:32'
};

export const INITIAL_CONTACTS: SeniorContact[] = [
  {
    id: '1',
    name: 'Ingrid (Datter)',
    relation: 'Pårørende / Primærkontakt',
    phone: '+47 912 34 567',
    avatarBg: 'bg-emerald-600',
    initials: 'IN'
  },
  {
    id: '2',
    name: 'Henrik (Sønn)',
    relation: 'Pårørende',
    phone: '+47 988 76 543',
    avatarBg: 'bg-blue-600',
    initials: 'HE'
  },
  {
    id: '3',
    name: 'Hjemmesykepleien',
    relation: 'Vakttelefon Sone Sentrum',
    phone: '+47 33 00 11 22',
    avatarBg: 'bg-teal-700',
    initials: 'HS'
  }
];

export const INITIAL_MEDICATIONS: MedicationItem[] = [
  {
    id: 'm1',
    name: 'Morgenmedisin (Dosett rom 1)',
    time: '08:30',
    dosage: '1 tabl. Blodtrykk + Vitamin D',
    taken: true,
    importantNote: 'Tas med et glass vann'
  },
  {
    id: 'm2',
    name: 'Middagsmedisin (Dosett rom 2)',
    time: '13:30',
    dosage: '1 tabl. Kalsium',
    taken: true
  },
  {
    id: 'm3',
    name: 'Kveldsmedisin (Dosett rom 3)',
    time: '20:00',
    dosage: '1 tabl. Hjertemedisin',
    taken: false,
    importantNote: 'Viktig: Ta før sengetid'
  }
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 's1',
    time: '11:00',
    title: 'Hjemmetjenesten besøk',
    subtitle: 'Morgentilsyn og sjekk av sårbandasje',
    type: 'visit'
  },
  {
    id: 's2',
    time: '13:30',
    title: 'Middagsmedisin',
    subtitle: 'Ta tablett sammen med lunsj',
    type: 'medicine'
  },
  {
    id: 's3',
    time: '16:00',
    title: 'Kaffebesøk av Ingrid',
    subtitle: 'Datteren din kommer innom med ferske boller',
    type: 'visit'
  }
];

export const INITIAL_CLIMATE: IndoorClimate = {
  temp: 21.8,
  humidity: 42,
  co2: 610,
  airQualityText: 'God'
};

export const INITIAL_VITALS: HealthVitals = {
  heartRateBpm: 68,
  spo2Percent: 97,
  lastMovementMinutesAgo: 4,
  fallSensorArmed: true,
  fallDetected: false,
  sleepHours: 7.5,
  presenceRoom: 'Stue (Godstol)',
  stepsToday: 1840
};

export const INITIAL_LOGS: SystemLogEntry[] = [
  {
    id: 'l1',
    timestamp: '14:32:05',
    level: 'info',
    source: 'STORAGE_DAEMON',
    message: 'Periodisk S.M.A.R.T-analyse fullført: /dev/mmcblk0 rapporterer 26% levetid gjenværende.'
  },
  {
    id: 'l2',
    timestamp: '14:30:12',
    level: 'warn',
    source: 'STORAGE_DAEMON',
    message: 'Høy I/O-skrivebelastning observert på SD-kort (240 KB/s vedvarende logging uten log2ram).'
  },
  {
    id: 'l3',
    timestamp: '14:28:44',
    level: 'success',
    source: 'SENIOR_UI',
    message: 'Senior trykket "Jeg har det bra". Status oppdatert for pårørende og vaktrom.'
  },
  {
    id: 'l4',
    timestamp: '14:15:00',
    level: 'info',
    source: 'FALL_RADAR',
    message: 'mmWave sensor bekrefter normal stående/sittende holdning i stue. Ingen fall registrert.'
  },
  {
    id: 'l5',
    timestamp: '13:30:20',
    level: 'success',
    source: 'HEALTH_BLE',
    message: 'Smart dosett lokk åpnet og lukket for kammer 2. Registrert som inntatt.'
  }
];

export type StorageMedium = 'microSD' | 'nvmeSSD';

export interface StorageMetrics {
  medium: StorageMedium;
  modelName: string;
  totalCapacityGB: number;
  tbwWritten: number;
  tbwRating: number;
  wearLevelingPercentage: number; // 0 to 100% health remaining
  badBlocksCount: number;
  reallocatedSectors: number;
  readOnlyRisk: 'low' | 'moderate' | 'critical';
  tempCelsius: number;
  writeRateKBps: number;
  avgDailyWritesMB: number;
  estimatedRemainingDays: number;
  log2ramEnabled: boolean;
  walModeEnabled: boolean;
  filesystemStatus: 'healthy' | 'warning' | 'read_only' | 'corrupted';
  ioWaitPercent: number;
  lastSmartScan: string;
}

export interface SeniorContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  avatarBg: string;
  initials: string;
  statusBadge?: string;
}

export interface EmergencyMessageEvent {
  id: string;
  recipientId: string;
  recipientName: string;
  message: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isEmergency: boolean;
}

export interface MedicationItem {
  id: string;
  name: string;
  time: string;
  dosage: string;
  taken: boolean;
  importantNote?: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  type: 'visit' | 'medicine' | 'activity' | 'meal';
}

export interface IndoorClimate {
  temp: number;
  humidity: number;
  co2: number;
  airQualityText: 'Utmerket' | 'God' | 'Bør luftes';
}

export interface HealthVitals {
  heartRateBpm: number;
  spo2Percent: number;
  lastMovementMinutesAgo: number;
  fallSensorArmed: boolean;
  fallDetected: boolean;
  sleepHours: number;
  presenceRoom: string;
  stepsToday: number;
}

export type LogLevel = 'info' | 'warn' | 'error' | 'success';
export type LogSource = 'STORAGE_DAEMON' | 'HEALTH_BLE' | 'SENIOR_UI' | 'FALL_RADAR' | 'PLEIE_NOTAT' | 'VARSELSYSTEM';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: LogSource;
  message: string;
  details?: string;
}

export interface VisualAlert {
  id: string;
  severity: 'critical' | 'warning' | 'reminder' | 'info';
  title: string;
  description: string;
  timestamp: string;
  source: 'fall' | 'hardware' | 'emergency' | 'medication' | 'climate';
  actionLabel?: string;
  targetTab?: 'senior' | 'storage' | 'health';
  dismissed?: boolean;
}

export type DateTimeDisplay = 'date' | 'time' | 'datetime';

const EMPTY_VALUE = '-';

export function isValidTimeZone(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function resolveTimeZone(preference?: string | null): string {
  if (isValidTimeZone(preference)) return preference;
  const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return isValidTimeZone(detected) ? detected : 'UTC';
}

export function getTimeZoneOptions(): Array<{ label: string; value: string }> {
  const intl = Intl as typeof Intl & { supportedValuesOf?: (key: 'timeZone') => string[] };
  const supportedZones = intl.supportedValuesOf?.('timeZone') ?? [
    'UTC',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Europe/London',
    'Europe/Paris',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles'
  ];
  const zones = supportedZones.includes('UTC') ? supportedZones : ['UTC', ...supportedZones];
  return zones.map(value => ({ label: value, value }));
}

export function formatDateTime(
  value: string | Date | null | undefined,
  preference?: string | null,
  display: DateTimeDisplay = 'datetime',
  locale: string = typeof navigator === 'undefined' ? 'en-US' : navigator.language
): string {
  if (!value) return EMPTY_VALUE;
  const instant = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(instant.getTime())) return EMPTY_VALUE;

  const showDate = display !== 'time';
  const showTime = display !== 'date';
  const options: Intl.DateTimeFormatOptions = {
    timeZone: resolveTimeZone(preference),
    ...(showDate && { year: 'numeric', month: '2-digit', day: '2-digit' }),
    ...(showTime && { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  };

  try {
    return new Intl.DateTimeFormat(locale, options).format(instant);
  } catch {
    return EMPTY_VALUE;
  }
}

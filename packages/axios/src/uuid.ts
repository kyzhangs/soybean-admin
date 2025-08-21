export function generateUuidV4(): string {
  const cryptoObj = (globalThis as any)?.crypto as any;
  if (cryptoObj && typeof cryptoObj.randomUUID === 'function') {
    return cryptoObj.randomUUID();
  }

  const buffer = new Uint8Array(16);
  if (cryptoObj && typeof cryptoObj.getRandomValues === 'function') {
    cryptoObj.getRandomValues(buffer);
  } else {
    for (let i = 0; i < 16; i += 1) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
  }

  // eslint-disable-next-line no-bitwise
  buffer[6] = (buffer[6] & 0x0f) | 0x40; // version 4
  // eslint-disable-next-line no-bitwise
  buffer[8] = (buffer[8] & 0x3f) | 0x80; // variant 10

  const hex = Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

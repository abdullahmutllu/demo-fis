const tryFmt = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 2,
});

export function formatTry(value: number): string {
  return tryFmt.format(value);
}

export function formatPercent(delta: number): string {
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}%`;
}

/** Tutar alanı: virgül/nokta; TR biçimi 1.234,56 için basit destek */
export function parseTryInput(raw: string): number {
  let s = raw.trim().replace(/\s/g, '');
  if (!s) return Number.NaN;
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');
  if (hasComma && hasDot) {
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
      s = s.replace(/\./g, '').replace(',', '.');
    } else {
      s = s.replace(/,/g, '');
    }
  } else if (hasComma) {
    s = s.replace(',', '.');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : Number.NaN;
}

export type MockOcrResult = {
  amount: number;
  dateISO: string;
  time: string;
  merchant: string;
  suggestedCategoryId: string;
};

const MERCHANTS: { name: string; category: string }[] = [
  { name: 'Migros', category: 'yemek' },
  { name: 'CarrefourSA', category: 'yemek' },
  { name: 'Shell', category: 'ulasim' },
  { name: 'Opet', category: 'ulasim' },
  { name: 'Teknosa', category: 'ofis' },
  { name: 'D&R Kırtasiye', category: 'ofis' },
  { name: 'Getir', category: 'yemek' },
  { name: 'Trendyol', category: 'diger' },
  { name: 'Amazon TR', category: 'diger' },
  { name: 'KORKMAZ A.Ş.', category: 'temizlik' },
];

function hashFromString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Demo OCR: üretimde Google Cloud Vision / Document AI ile değiştirilir.
 */
export async function mockReceiptOcr(
  hint: string,
  imageFile?: File | null,
): Promise<MockOcrResult> {
  const base = hint || imageFile?.name || 'fis';
  await sleep(1400 + Math.random() * 900);

  const h = hashFromString(base);
  const pick = MERCHANTS[h % MERCHANTS.length];
  const amount =
    Math.round((180 + (h % 12000) + Math.random() * 400) * 100) / 100;

  const now = new Date();
  const jitterDays = (h % 5) - 2;
  const d = new Date(now);
  d.setDate(d.getDate() + jitterDays);
  const dateISO = d.toISOString().slice(0, 10);
  const hour = 8 + (h % 10);
  const min = (h * 7) % 60;
  const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

  return {
    amount,
    dateISO,
    time,
    merchant: pick.name,
    suggestedCategoryId: pick.category,
  };
}

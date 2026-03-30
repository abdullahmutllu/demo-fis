import type { Expense } from '../types/expense';

const STORAGE_KEY = 'demo-fis-expenses-v1';

function randomId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function buildExpense(
  partial: Omit<Expense, 'id' | 'createdAt'>,
  createdAt?: string,
): Expense {
  return {
    ...partial,
    id: randomId(),
    createdAt: createdAt ?? new Date().toISOString(),
  };
}

/** Seed: çok aylık, karışık kategoriler — analiz demosu için */
export function createSeedExpenses(referenceDate = new Date()): Expense[] {
  const y = referenceDate.getFullYear();
  const m = referenceDate.getMonth();

  const monthsBack = (b: number) => new Date(y, m - b, 15);

  const d = (date: Date, day: number) => {
    const x = new Date(date);
    x.setDate(day);
    return x.toISOString().slice(0, 10);
  };

  const base: Omit<Expense, 'id' | 'createdAt'>[] = [
    {
      source: 'receipt',
      amount: 1840.5,
      currency: 'TRY',
      dateISO: d(monthsBack(0), 3),
      time: '09:42',
      categoryId: 'yemek',
      merchant: 'CarrefourSA',
      note: 'Ofis ikramlık',
      imageDataUrl: undefined,
    },
    {
      source: 'manual',
      amount: 12999,
      currency: 'TRY',
      dateISO: d(monthsBack(0), 5),
      time: '14:00',
      categoryId: 'yazilim',
      merchant: '',
      note: 'Slack yıllık plan',
    },
    {
      source: 'receipt',
      amount: 420,
      currency: 'TRY',
      dateISO: d(monthsBack(0), 8),
      time: '12:10',
      categoryId: 'ulasim',
      merchant: 'Shell',
      note: '',
    },
    {
      source: 'receipt',
      amount: 2680,
      currency: 'TRY',
      dateISO: d(monthsBack(0), 12),
      time: '11:05',
      categoryId: 'ofis',
      merchant: 'D&R Kırtasiye',
      note: '',
    },
    {
      source: 'receipt',
      amount: 9500,
      currency: 'TRY',
      dateISO: d(monthsBack(0), 18),
      time: '16:30',
      categoryId: 'pazarlama',
      merchant: 'Meta Ads',
      note: 'Harcama faturası',
    },
    {
      source: 'manual',
      amount: 3200,
      currency: 'TRY',
      dateISO: d(monthsBack(1), 4),
      time: '10:00',
      categoryId: 'temizlik',
      merchant: '',
      note: 'Temizlik firması aylık',
    },
    {
      source: 'receipt',
      amount: 1420,
      currency: 'TRY',
      dateISO: d(monthsBack(1), 7),
      time: '13:22',
      categoryId: 'yemek',
      merchant: 'Getir',
      note: '',
    },
    {
      source: 'receipt',
      amount: 890,
      currency: 'TRY',
      dateISO: d(monthsBack(1), 9),
      time: '08:50',
      categoryId: 'ulasim',
      merchant: 'Opet',
      note: '',
    },
    {
      source: 'receipt',
      amount: 2100,
      currency: 'TRY',
      dateISO: d(monthsBack(1), 14),
      time: '15:40',
      categoryId: 'ofis',
      merchant: 'Teknosa',
      note: 'Kablo & adaptör',
    },
    {
      source: 'manual',
      amount: 4599,
      currency: 'TRY',
      dateISO: d(monthsBack(1), 20),
      time: '09:00',
      categoryId: 'yazilim',
      merchant: '',
      note: 'Notion Business',
    },
    {
      source: 'receipt',
      amount: 780,
      currency: 'TRY',
      dateISO: d(monthsBack(2), 6),
      time: '12:00',
      categoryId: 'yemek',
      merchant: 'Migros',
      note: '',
    },
    {
      source: 'receipt',
      amount: 550,
      currency: 'TRY',
      dateISO: d(monthsBack(2), 10),
      time: '17:10',
      categoryId: 'ulasim',
      merchant: 'BP',
      note: '',
    },
    {
      source: 'manual',
      amount: 7200,
      currency: 'TRY',
      dateISO: d(monthsBack(2), 22),
      time: '11:00',
      categoryId: 'pazarlama',
      merchant: '',
      note: 'Google Ads bakiye',
    },
    {
      source: 'receipt',
      amount: 340,
      currency: 'TRY',
      dateISO: d(monthsBack(3), 2),
      time: '10:15',
      categoryId: 'diger',
      merchant: 'PTT',
      note: 'Kargo',
    },
  ];

  return base.map((b, i) =>
    buildExpense(b, new Date(Date.now() - i * 60_000).toISOString()),
  );
}

export function loadRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function loadExpenses(): Expense[] {
  const raw = loadRaw();
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as Expense[];
  } catch {
    return [];
  }
}

export function saveExpenses(expenses: Expense[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

export function initStoreIfEmpty(): Expense[] {
  const list = loadExpenses();
  if (list.length > 0) return list;
  const seeded = createSeedExpenses();
  saveExpenses(seeded);
  return seeded;
}

export function resetToSeed(): Expense[] {
  const list = createSeedExpenses();
  saveExpenses(list);
  return list;
}

export function clearAll(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export { randomId };

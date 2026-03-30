export type ExpenseSource = 'receipt' | 'manual';

export type Expense = {
  id: string;
  source: ExpenseSource;
  amount: number;
  currency: 'TRY';
  dateISO: string;
  time: string;
  categoryId: string;
  merchant: string;
  note: string;
  imageDataUrl?: string;
  createdAt: string;
};

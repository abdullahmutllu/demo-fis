import { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../lib/categories';
import { parseTryInput } from '../lib/format';
import { randomId } from '../lib/expenseStore';
import type { Expense } from '../types/expense';

export default function ManualExpense() {
  const { addExpense } = useExpenses();
  const { show } = useToast();

  const [amount, setAmount] = useState('');
  const [dateISO, setDateISO] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [time, setTime] = useState('10:00');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0]?.id ?? 'diger');
  const [note, setNote] = useState('');

  const save = () => {
    const n = parseTryInput(amount);
    if (!Number.isFinite(n) || n <= 0) {
      show('Geçerli bir tutar girin.');
      return;
    }
    const e: Expense = {
      id: randomId(),
      source: 'manual',
      amount: n,
      currency: 'TRY',
      dateISO,
      time,
      categoryId,
      merchant: '',
      note: note.trim(),
      createdAt: new Date().toISOString(),
    };
    addExpense(e);
    show('Manuel gider eklendi.');
    setAmount('');
    setNote('');
  };

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Manuel gider
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Fiş olmadan yapılan harcamaları aynı deftere ekleyin.
        </p>
      </div>

      <div className="space-y-4 rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-[11px] font-medium text-slate-500">
              Tutar (₺)
            </label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
              placeholder="0,00"
              inputMode="decimal"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">
              Kategori
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">
              Tarih
            </label>
            <input
              type="date"
              value={dateISO}
              onChange={(e) => setDateISO(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">
              Saat
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
            />
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium text-slate-500">
            Açıklama
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full resize-none rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
            placeholder="Örn. Slack aboneliği, temizlik ücreti…"
          />
        </div>
        <button
          type="button"
          onClick={save}
          className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/20"
        >
          Gideri kaydet
        </button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES, categoryLabel } from '../lib/categories';
import { formatTry, parseTryInput } from '../lib/format';
import type { Expense } from '../types/expense';

const sources: { id: 'all' | 'receipt' | 'manual'; label: string }[] = [
  { id: 'all', label: 'Tümü' },
  { id: 'receipt', label: 'Fiş / fatura' },
  { id: 'manual', label: 'Manuel' },
];

export default function ExpenseList() {
  const { expenses, updateExpense, removeExpense, resetDemoData } =
    useExpenses();
  const { show } = useToast();

  const [source, setSource] = useState<(typeof sources)[number]['id']>('all');
  const [categoryId, setCategoryId] = useState<string>('all');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [editing, setEditing] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    if (editing) setEditAmount(String(editing.amount));
  }, [editing]);

  const filtered = useMemo(() => {
    return expenses
      .filter((e) => (source === 'all' ? true : e.source === source))
      .filter((e) => (categoryId === 'all' ? true : e.categoryId === categoryId))
      .filter((e) => (from ? e.dateISO >= from : true))
      .filter((e) => (to ? e.dateISO <= to : true))
      .sort(
        (a, b) =>
          new Date(b.dateISO + 'T' + b.time).getTime() -
          new Date(a.dateISO + 'T' + a.time).getTime(),
      );
  }, [expenses, source, categoryId, from, to]);

  const saveEdit = () => {
    if (!editing) return;
    const n = parseTryInput(editAmount);
    if (!Number.isFinite(n) || n <= 0) {
      show('Geçerli tutar girin.');
      return;
    }
    updateExpense(editing.id, {
      amount: n,
      dateISO: editing.dateISO,
      time: editing.time,
      categoryId: editing.categoryId,
      merchant: editing.merchant,
      note: editing.note,
    });
    setEditing(null);
    show('Gider güncellendi.');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Giderler
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Filtreleyin, düzenleyin veya silin.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            resetDemoData();
            show('Demo verileri sıfırlandı.');
          }}
          className="rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08]"
        >
          Demo verisini sıfırla
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-4">
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">
            Kaynak
          </label>
          <select
            value={source}
            onChange={(e) =>
              setSource(e.target.value as (typeof sources)[number]['id'])
            }
            className="mt-1 block rounded-lg border border-white/[0.1] bg-black/30 px-2 py-1.5 text-sm text-white"
          >
            {sources.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">
            Kategori
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block rounded-lg border border-white/[0.1] bg-black/30 px-2 py-1.5 text-sm text-white"
          >
            <option value="all">Tümü</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">
            Başlangıç
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 block rounded-lg border border-white/[0.1] bg-black/30 px-2 py-1.5 text-sm text-white"
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold uppercase text-slate-500">
            Bitiş
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 block rounded-lg border border-white/[0.1] bg-black/30 px-2 py-1.5 text-sm text-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] text-[11px] uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Tarih</th>
              <th className="px-4 py-3 font-semibold">Kaynak</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Satıcı / not</th>
              <th className="px-4 py-3 text-right font-semibold">Tutar</th>
              <th className="px-4 py-3 font-semibold" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr
                key={e.id}
                className="border-b border-white/[0.04] text-slate-200 last:border-0"
              >
                <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-300">
                  {e.dateISO} <span className="text-slate-500">{e.time}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      e.source === 'receipt'
                        ? 'bg-amber-500/15 text-amber-200'
                        : 'bg-slate-500/15 text-slate-300'
                    }`}
                  >
                    {e.source === 'receipt' ? 'Fiş' : 'Manuel'}
                  </span>
                </td>
                <td className="px-4 py-3">{categoryLabel(e.categoryId)}</td>
                <td className="max-w-[200px] truncate px-4 py-3 text-slate-400">
                  {e.merchant || e.note || '—'}
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums text-white">
                  {formatTry(e.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...e })}
                      className="rounded-lg p-2 text-slate-400 hover:bg-white/[0.06] hover:text-white"
                      aria-label="Düzenle"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        removeExpense(e.id);
                        show('Silindi.');
                      }}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-500/15 hover:text-red-300"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-slate-500">
            Kayıt bulunamadı.
          </p>
        ) : null}
      </div>

      {editing ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0c0c14] p-5 shadow-2xl">
            <h2 className="text-lg font-semibold text-white">Gideri düzenle</h2>
            <div className="mt-4 grid gap-3">
              <div>
                <label className="text-[11px] text-slate-500">Tutar</label>
                <input
                  value={editAmount}
                  onChange={(ev) => setEditAmount(ev.target.value)}
                  className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                  inputMode="decimal"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-500">Tarih</label>
                  <input
                    type="date"
                    value={editing.dateISO}
                    onChange={(ev) =>
                      setEditing({ ...editing, dateISO: ev.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500">Saat</label>
                  <input
                    type="time"
                    value={editing.time}
                    onChange={(ev) =>
                      setEditing({ ...editing, time: ev.target.value })
                    }
                    className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Kategori</label>
                <select
                  value={editing.categoryId}
                  onChange={(ev) =>
                    setEditing({ ...editing, categoryId: ev.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Satıcı</label>
                <input
                  value={editing.merchant}
                  onChange={(ev) =>
                    setEditing({ ...editing, merchant: ev.target.value })
                  }
                  className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-500">Not</label>
                <textarea
                  value={editing.note}
                  onChange={(ev) =>
                    setEditing({ ...editing, note: ev.target.value })
                  }
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-lg border border-white/[0.12] px-4 py-2 text-sm text-slate-300"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={saveEdit}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-black"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

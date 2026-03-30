import { useCallback, useState } from 'react';
import { Loader2, Upload } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { CATEGORIES } from '../lib/categories';
import { mockReceiptOcr } from '../lib/mockReceiptOcr';
import { randomId } from '../lib/expenseStore';
import type { Expense } from '../types/expense';

export default function ReceiptAdd() {
  const { addExpense } = useExpenses();
  const { show } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [amount, setAmount] = useState('');
  const [dateISO, setDateISO] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [time, setTime] = useState('12:00');
  const [merchant, setMerchant] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0]?.id ?? 'diger');
  const [note, setNote] = useState('');

  const onPickFile = useCallback((f: File | null) => {
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    const r = new FileReader();
    r.onload = () => setPreview(typeof r.result === 'string' ? r.result : null);
    r.readAsDataURL(f);
  }, []);

  const runOcr = async () => {
    setLoading(true);
    try {
      const hint = file?.name ?? 'fis';
      const r = await mockReceiptOcr(hint, file);
      setAmount(String(r.amount));
      setDateISO(r.dateISO);
      setTime(r.time);
      setMerchant(r.merchant);
      setCategoryId(r.suggestedCategoryId);
      show('Görüntü analizi tamamlandı (demo simülasyonu). Alanları kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const save = () => {
    const n = Number(amount.replace(',', '.'));
    if (!Number.isFinite(n) || n <= 0) {
      show('Geçerli bir tutar girin.');
      return;
    }
    if (!categoryId) {
      show('Kategori seçin.');
      return;
    }
    const e: Expense = {
      id: randomId(),
      source: 'receipt',
      amount: n,
      currency: 'TRY',
      dateISO,
      time,
      categoryId,
      merchant: merchant.trim(),
      note: note.trim(),
      imageDataUrl: preview ?? undefined,
      createdAt: new Date().toISOString(),
    };
    addExpense(e);
    show('Fiş kaydedildi.');
    setAmount('');
    setMerchant('');
    setNote('');
    setFile(null);
    setPreview(null);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Fiş / fatura ekle
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Görsel yükleyin; demo ortamında OCR simüle edilir. Üretimde Google
          Cloud Vision veya Document AI ile değiştirilebilir.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-black/20 px-4 py-12 transition hover:border-amber-500/40 hover:bg-amber-500/[0.03]">
            <Upload className="h-8 w-8 text-amber-400/80" aria-hidden />
            <span className="mt-2 text-sm font-medium text-slate-200">
              Görsel seçin
            </span>
            <span className="mt-1 text-xs text-slate-500">
              PNG, JPG — tarayıcıda önizlenir
            </span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(ev) =>
                onPickFile(ev.target.files?.[0] ?? null)
              }
            />
          </label>
          {preview ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-white/[0.08]">
              <img
                src={preview}
                alt="Fiş önizleme"
                className="max-h-64 w-full object-contain bg-black/40"
              />
            </div>
          ) : null}
          <button
            type="button"
            disabled={loading}
            onClick={runOcr}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-sm font-semibold text-black shadow-lg shadow-amber-500/25 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            Görüntüyü analiz et (demo)
          </button>
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
              Satıcı / işletme
            </label>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="mt-1 w-full rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
              placeholder="Örn. Migros"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-slate-500">
              Not
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-1 w-full resize-none rounded-lg border border-white/[0.1] bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-amber-500/50"
              placeholder="İsteğe bağlı"
            />
          </div>
          <button
            type="button"
            onClick={save}
            className="w-full rounded-xl border border-emerald-500/40 bg-emerald-500/15 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/25"
          >
            Kaydet — muhasebe listesine ekle
          </button>
          <p className="text-[11px] text-slate-500">
            Kayıt sonrası özet ve gider listesi anında güncellenir.
          </p>
        </div>
      </div>
    </div>
  );
}

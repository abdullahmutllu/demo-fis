import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import {
  buildInsightBullets,
  categoryDeltas,
  sumByMonth,
} from '../lib/insights';
import { formatPercent, formatTry } from '../lib/format';

function monthKeyFromRef(ref: Date): string {
  return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
}

export default function Analytics() {
  const { expenses, resetDemoData } = useExpenses();
  const ref = useMemo(() => new Date(), []);
  const thisM = monthKeyFromRef(ref);
  const prev = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const prevM = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

  const totalThis = sumByMonth(expenses, thisM);
  const totalPrev = sumByMonth(expenses, prevM);
  const deltas = categoryDeltas(expenses, ref);
  const bullets = buildInsightBullets(expenses, ref);

  const barData = deltas.map((d) => ({
    label: d.label,
    buAy: d.thisMonth,
    gecenAy: d.prevMonth,
  }));

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Analiz ve tasarruf
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Aylık kategori karşılaştırması ve tasarruf odaklı özet.
          </p>
        </div>
        <button
          type="button"
          onClick={() => resetDemoData()}
          className="self-start rounded-lg border border-white/[0.12] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.08]"
        >
          Demo verisini sıfırla
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Bu ay ({thisM})
          </div>
          <div className="mt-1 text-2xl font-bold text-white">
            {formatTry(totalThis)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Geçen ay ({prevM})
          </div>
          <div className="mt-1 text-2xl font-bold text-slate-200">
            {formatTry(totalPrev)}
          </div>
          {totalPrev > 0 ? (
            <div className="mt-2 text-xs text-slate-400">
              Değişim:{' '}
              <span
                className={
                  totalThis > totalPrev ? 'text-amber-400' : 'text-emerald-400'
                }
              >
                {formatPercent(((totalThis - totalPrev) / totalPrev) * 100)}
              </span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
        <h2 className="text-sm font-semibold text-white">
          Kategori bazlı bu ay / geçen ay
        </h2>
        <div className="mt-4 h-[300px]">
          {barData.length === 0 ? (
            <p className="text-sm text-slate-500">Veri yok.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickFormatter={(v) =>
                    new Intl.NumberFormat('tr-TR', {
                      notation: 'compact',
                      compactDisplay: 'short',
                    }).format(v)
                  }
                />
                <Tooltip
                  formatter={(v) =>
                    formatTry(typeof v === 'number' ? v : Number(v))
                  }
                  contentStyle={{
                    background: '#0c0c14',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="gecenAy" name="Geçen ay" fill="rgba(148,163,184,0.45)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="buAy" name="Bu ay" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
        <h2 className="text-sm font-semibold text-white">
          Kategori değişimleri
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/[0.06] text-[11px] uppercase text-slate-500">
              <tr>
                <th className="py-2 pr-4 font-semibold">Kategori</th>
                <th className="py-2 pr-4 text-right font-semibold">Bu ay</th>
                <th className="py-2 pr-4 text-right font-semibold">Geçen ay</th>
                <th className="py-2 text-right font-semibold">Değişim</th>
              </tr>
            </thead>
            <tbody>
              {deltas.map((d) => (
                <tr key={d.categoryId} className="border-b border-white/[0.04]">
                  <td className="py-2 pr-4 text-slate-200">{d.label}</td>
                  <td className="py-2 pr-4 text-right tabular-nums text-white">
                    {formatTry(d.thisMonth)}
                  </td>
                  <td className="py-2 pr-4 text-right tabular-nums text-slate-400">
                    {formatTry(d.prevMonth)}
                  </td>
                  <td className="py-2 text-right">
                    {d.percentChange === null ? (
                      <span className="text-slate-500">—</span>
                    ) : (
                      <span
                        className={
                          d.percentChange > 10
                            ? 'font-medium text-amber-400'
                            : d.percentChange < -5
                              ? 'font-medium text-emerald-400'
                              : 'text-slate-300'
                        }
                      >
                        {formatPercent(d.percentChange)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.06] p-5">
        <h2 className="text-sm font-semibold text-amber-100">
          Tasarruf ve içgörü özeti
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-amber-100/90">
          {bullets.map((b) => (
            <li key={b.id} className="leading-relaxed">
              • {b.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

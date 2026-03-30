import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ArrowRight, Camera, TrendingDown, TrendingUp } from 'lucide-react';
import { useExpenses } from '../context/ExpenseContext';
import { categoryColor, categoryLabel } from '../lib/categories';
import {
  buildInsightBullets,
  sumByCategoryInMonth,
  sumByMonth,
} from '../lib/insights';
import { formatTry } from '../lib/format';

function monthKeyFromRef(ref: Date): string {
  return `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}`;
}

export default function Dashboard() {
  const { expenses } = useExpenses();
  const ref = useMemo(() => new Date(), []);
  const thisM = monthKeyFromRef(ref);
  const prev = new Date(ref.getFullYear(), ref.getMonth() - 1, 1);
  const prevM = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

  const totalThis = sumByMonth(expenses, thisM);
  const totalPrev = sumByMonth(expenses, prevM);
  const deltaPct =
    totalPrev > 0 ? ((totalThis - totalPrev) / totalPrev) * 100 : null;

  const byCat = sumByCategoryInMonth(expenses, thisM);
  const chartData = Object.entries(byCat)
    .map(([id, value]) => ({
      id,
      name: categoryLabel(id),
      value,
      color: categoryColor(id),
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  const bullets = buildInsightBullets(expenses, ref);

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
          Özet
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Bu ayın giderleri ve hızlı içgörüler.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Bu ay toplam
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-white">
            {formatTry(totalThis)}
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Geçen ay toplam
          </div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-slate-200">
            {formatTry(totalPrev)}
          </div>
          {deltaPct !== null ? (
            <div
              className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${
                deltaPct > 0 ? 'text-amber-400' : 'text-emerald-400'
              }`}
            >
              {deltaPct > 0 ? (
                <TrendingUp className="h-4 w-4" aria-hidden />
              ) : (
                <TrendingDown className="h-4 w-4" aria-hidden />
              )}
              Geçen aya göre {deltaPct > 0 ? '+' : ''}
              {deltaPct.toFixed(1)}%
            </div>
          ) : null}
        </div>
        <Link
          to="/fis-ekle"
          className="group flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-emerald-600/5 p-5 transition hover:border-amber-400/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20">
              <Camera className="h-5 w-5 text-amber-300" aria-hidden />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Fiş ekle
              </div>
              <div className="text-xs text-slate-400">
                Görüntüden otomatik doldurma (demo)
              </div>
            </div>
          </div>
          <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-200">
            Devam et
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <h2 className="text-sm font-semibold text-white">
            Kategori dağılımı (bu ay)
          </h2>
          <div className="mt-4 h-[260px] w-full">
            {chartData.length === 0 ? (
              <p className="text-sm text-slate-500">Henüz gider yok.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {chartData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
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
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <ul className="mt-2 flex flex-wrap gap-2">
            {chartData.map((d) => (
              <li
                key={d.id}
                className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] text-slate-300"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: d.color }}
                />
                {d.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c0c14]/80 p-5">
          <h2 className="text-sm font-semibold text-white">İçgörüler</h2>
          <p className="mt-1 text-xs text-slate-500">
            Kural tabanlı özet; üretimde AI ile zenginleştirilebilir.
          </p>
          <ul className="mt-4 space-y-3">
            {bullets.map((b) => (
              <li
                key={b.id}
                className={`rounded-xl border px-3 py-2.5 text-sm leading-snug ${
                  b.tone === 'warn'
                    ? 'border-amber-500/25 bg-amber-500/[0.06] text-amber-100/95'
                    : b.tone === 'ok'
                      ? 'border-emerald-500/25 bg-emerald-500/[0.06] text-emerald-100/95'
                      : 'border-white/[0.08] bg-white/[0.03] text-slate-200'
                }`}
              >
                {b.text}
              </li>
            ))}
          </ul>
          <Link
            to="/analiz"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-amber-200"
          >
            Detaylı analiz
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

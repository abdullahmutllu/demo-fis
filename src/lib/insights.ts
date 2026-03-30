import type { Expense } from '../types/expense';
import { CATEGORIES } from './categories';
import { formatPercent, formatTry } from './format';

function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function currentMonthKeys(ref: Date): { thisM: string; prevM: string } {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const thisM = `${y}-${String(m + 1).padStart(2, '0')}`;
  const prev = new Date(y, m - 1, 1);
  const prevM = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  return { thisM, prevM };
}

export function sumByMonth(expenses: Expense[], ym: string): number {
  return expenses
    .filter((e) => monthKey(e.dateISO) === ym)
    .reduce((a, e) => a + e.amount, 0);
}

export function sumByCategoryInMonth(
  expenses: Expense[],
  ym: string,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of expenses) {
    if (monthKey(e.dateISO) !== ym) continue;
    out[e.categoryId] = (out[e.categoryId] ?? 0) + e.amount;
  }
  return out;
}

export type CategoryDelta = {
  categoryId: string;
  label: string;
  thisMonth: number;
  prevMonth: number;
  percentChange: number | null;
};

export function categoryDeltas(expenses: Expense[], ref = new Date()): CategoryDelta[] {
  const { thisM, prevM } = currentMonthKeys(ref);
  const thisCat = sumByCategoryInMonth(expenses, thisM);
  const prevCat = sumByCategoryInMonth(expenses, prevM);

  return CATEGORIES.map((c) => {
    const thisMonth = thisCat[c.id] ?? 0;
    const prevMonth = prevCat[c.id] ?? 0;
    let percentChange: number | null = null;
    if (prevMonth > 0) {
      percentChange = ((thisMonth - prevMonth) / prevMonth) * 100;
    } else if (thisMonth > 0) {
      percentChange = 100;
    }
    return {
      categoryId: c.id,
      label: c.label,
      thisMonth,
      prevMonth,
      percentChange,
    };
  }).filter((r) => r.thisMonth > 0 || r.prevMonth > 0);
}

export type InsightBullet = { id: string; text: string; tone: 'warn' | 'info' | 'ok' };

export function buildInsightBullets(expenses: Expense[], ref = new Date()): InsightBullet[] {
  const { thisM, prevM } = currentMonthKeys(ref);
  const totalThis = sumByMonth(expenses, thisM);
  const totalPrev = sumByMonth(expenses, prevM);
  const deltas = categoryDeltas(expenses, ref);
  const bullets: InsightBullet[] = [];

  if (totalPrev > 0) {
    const tDelta = ((totalThis - totalPrev) / totalPrev) * 100;
    if (Math.abs(tDelta) < 0.05) {
      bullets.push({
        id: 'total',
        tone: 'info',
        text: `Toplam gider geçen ay ile aynı düzeyde (${formatTry(totalThis)} bu ay, ${formatTry(totalPrev)} geçen ay).`,
      });
    } else if (tDelta > 0) {
      bullets.push({
        id: 'total',
        tone: tDelta > 8 ? 'warn' : 'info',
        text: `Toplam gider geçen aya göre ${formatPercent(tDelta)} arttı (${formatTry(totalThis)} bu ay).`,
      });
    } else {
      bullets.push({
        id: 'total',
        tone: tDelta < -5 ? 'ok' : 'info',
        text: `Toplam gider geçen aya göre ${formatPercent(tDelta)} azaldı (${formatTry(totalThis)} bu ay).`,
      });
    }
  } else if (totalThis > 0) {
    bullets.push({
      id: 'total',
      tone: 'info',
      text: `Bu dönem için toplam ${formatTry(totalThis)} gider kaydı görünüyor (geçen ay ile karşılaştırma için yeterli veri yok).`,
    });
  }

  const rising = deltas
    .filter((d) => d.percentChange !== null && d.percentChange >= 12)
    .sort((a, b) => (b.percentChange ?? 0) - (a.percentChange ?? 0));

  for (const d of rising.slice(0, 3)) {
    bullets.push({
      id: `rise-${d.categoryId}`,
      tone: 'warn',
      text: `“${d.label}” geçen aya göre yaklaşık %${(d.percentChange ?? 0).toFixed(0)} yükseldi (${formatTry(d.thisMonth)}).`,
    });
  }

  const topCat = [...deltas].sort((a, b) => b.thisMonth - a.thisMonth)[0];
  if (topCat && topCat.thisMonth > 0) {
    bullets.push({
      id: 'top',
      tone: 'info',
      text: `Bu ay en yüksek pay “${topCat.label}” kategorisinde (${formatTry(topCat.thisMonth)}).`,
    });
  }

  const receiptShare =
    totalThis > 0
      ? (expenses
          .filter((e) => monthKey(e.dateISO) === thisM && e.source === 'receipt')
          .reduce((a, e) => a + e.amount, 0) /
        totalThis) *
        100
      : 0;

  if (totalThis > 0 && receiptShare < 35) {
    bullets.push({
      id: 'receipt',
      tone: 'info',
      text:
        'Fiş/fatura ile kayıtlı pay düşük görünüyor; muhasebe için daha çok belge dijitalleştirmek iade ve denetimde fayda sağlar.',
    });
  }

  bullets.push({
    id: 'tip',
    tone: 'ok',
    text:
      'Yüksek artan kategorilerde tedarikçi karşılaştırması ve abonelik optimizasyonu genelde hızlı kazanımdır.',
  });

  return bullets.slice(0, 8);
}

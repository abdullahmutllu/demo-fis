export type Category = {
  id: string;
  label: string;
  chartColor: string;
};

export const CATEGORIES: Category[] = [
  { id: 'ofis', label: 'Ofis & kırtasiye', chartColor: '#f59e0b' },
  { id: 'yemek', label: 'Yemek & ikram', chartColor: '#10b981' },
  { id: 'ulasim', label: 'Ulaşım', chartColor: '#38bdf8' },
  { id: 'yazilim', label: 'Yazılım & abonelik', chartColor: '#a78bfa' },
  { id: 'temizlik', label: 'Temizlik & bakım', chartColor: '#f472b6' },
  { id: 'pazarlama', label: 'Pazarlama', chartColor: '#fb923c' },
  { id: 'diger', label: 'Diğer', chartColor: '#94a3b8' },
];

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function categoryColor(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.chartColor ?? '#64748b';
}

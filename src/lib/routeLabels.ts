const ROUTES: Record<string, string> = {
  '/': 'Özet',
  '/fis-ekle': 'Fiş / fatura ekle',
  '/giderler': 'Giderler',
  '/manuel-gider': 'Manuel gider',
  '/analiz': 'Analiz ve tasarruf',
};

export function getBreadcrumbs(pathname: string): {
  product: string;
  section: string;
} {
  const section = ROUTES[pathname] ?? ROUTES['/'] ?? 'Özet';
  return { product: 'GiderTakip', section };
}

# GiderTakip — İşletme gider demosu

## Ne bu?

B2B gider takip ve tasarruf fikrinin **canlı arayüz demosu**: fiş görseli (simüle OCR), manuel gider, liste, özet grafikleri ve kural tabanlı aylık içgörüler. Veriler **tarayıcıda (localStorage)** tutulur.

## Teknoloji

- **Vite** · **React** · **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Recharts** (grafikler)
- **Lucide React** (ikonlar)

## Çalıştırma

```bash
npm install
npm run dev
```

## Derleme

```bash
npm run build
npm run preview
```

GitHub Pages için yerel test (taban yolu `/demo-fis/`):

```bash
set GITHUB_PAGES=true&& npm run build&& npm run preview
```

(PowerShell: `$env:GITHUB_PAGES='true'; npm run build; npm run preview`)

## Dağıtım (GitHub Pages)

Canlı örnek: [https://abdullahmutllu.github.io/demo-fis/](https://abdullahmutllu.github.io/demo-fis/) (repo adı `demo-fis` ise).

1. GitHub’da **New repository** → ad: `demo-fis` (vite.config.ts içindeki `repo` ile aynı olmalı).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `main` dalına push edin; `.github/workflows/deploy-pages.yml` derleyip yayınlar.

`vite.config.ts` içindeki `repo` sabiti, GitHub’daki depo adından farklıysa güncelleyin.

## Dağıtım (Vercel)

Kökteki `vercel.json` SPA yönlendirmesi içerir. Depoyu Vercel’e bağlayıp **Framework Preset: Vite** ile yayınlayın.

## Not

OCR, gerçek Google Cloud Vision değildir; ürünleştirmede API ile değiştirilmek üzere demo simülasyonu kullanılır.

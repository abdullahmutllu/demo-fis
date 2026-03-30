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

Canlı adres: [https://abdullahmutllu.github.io/demo-fis/](https://abdullahmutllu.github.io/demo-fis/)

Workflow, `dist` çıktısını **`gh-pages` dalına** push eder (klasik branch yayını).

### İlk kurulum (bir kez)

1. İlk workflow yeşil olduktan sonra: **Settings → Pages**  
   [https://github.com/abdullahmutllu/demo-fis/settings/pages](https://github.com/abdullahmutllu/demo-fis/settings/pages)
2. **Build and deployment → Source:** **Deploy from a branch** seçin.
3. **Branch:** `gh-pages`, **folder:** `/ (root)` → **Save**.

“GitHub Actions” kaynağı kullanılmaz; bu yüzden `deploy-pages` ile ilgili 404 oluşmaz.

`vite.config.ts` içindeki `repo` sabiti, GitHub’daki depo adıyla aynı olmalıdır (şu an: `demo-fis`).

## Dağıtım (Vercel)

Kökteki `vercel.json` SPA yönlendirmesi içerir. Depoyu Vercel’e bağlayıp **Framework Preset: Vite** ile yayınlayın.

## Not

OCR, gerçek Google Cloud Vision değildir; ürünleştirmede API ile değiştirilmek üzere demo simülasyonu kullanılır.

# GiderTakip — Demo

İşletme gider takibi prototipi: fiş önizleme (simüle OCR), manuel gider, liste, özet ve analiz. Veriler tarayıcıda saklanır.

## Geliştirme

```bash
npm install
npm run dev
```

## Derleme

```bash
npm run build
```

## Canlı demo

https://abdullahmutllu.github.io/demo-fis/

### Sayfa 404 veya “There isn't a GitHub Pages site here” ise

Kod ve `gh-pages` dalı hazır olsa bile GitHub’da **bir kez** yayın kaynağını seçmeniz şarttır:

1. Açın: [github.com/abdullahmutllu/demo-fis/settings/pages](https://github.com/abdullahmutllu/demo-fis/settings/pages)
2. **Build and deployment** → **Source:** **Deploy from a branch** (GitHub Actions değil).
3. **Branch:** `gh-pages` · **Folder:** `/ (root)` → **Save**.

Kaydettikten sonra genelde **1–2 dakika** içinde site açılır; bazen 5 dakikaya kadar sürebilir.

OCR gerçek bir API değildir; sunum amaçlı simülasyondur.

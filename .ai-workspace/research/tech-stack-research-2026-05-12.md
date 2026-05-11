# Teknoloji Stack Araştırması — Özmar Market E-Ticaret

**Tarih:** 2026-05-12  
**Araştıran:** Antigravity AI Agent  
**Kaynaklar:** Vercel Docs, Prisma Docs, Stripe Docs, Next.js Docs, Google Merchant Center Docs

---

## 1. Frontend Framework

### Seçim: Next.js 15 (App Router)

- **Mevcut Kararlı Sürüm:** Next.js 15.x
- **Yönlendirici:** App Router (Pages Router artık legacy sayılıyor)
- **Rendering Stratejisi:**
  - Server Components → ürün listeleri, kategoriler (SEO kritik)
  - Client Components → sepet, slider, interaktif UI
  - ISR (Incremental Static Regeneration) → ürün sayfaları (revalidate: 60s)
  - Dynamic → stok durumuna duyarlı sayfalar
- **Neden:** Vercel-native, en iyi Core Web Vitals, built-in Image & Font optimizasyonu, native metadata API

---

## 2. Database & ORM

### Seçim: Neon (Serverless PostgreSQL) + Prisma ORM

- **Neon:** Serverless PostgreSQL, Vercel Marketplace entegrasyonu, database branching (staging/prod ayrımı için mükemmel)
- **Prisma:** Type-safe ORM, migration sistemi, schema-first geliştirme
- **Alternatifler değerlendirildi:** Supabase (all-in-one ama vendor lock-in fazla), Prisma Postgres (yeni, henüz production-battle-tested değil)
- **Neden Neon:** Serverless → Vercel ile sıfır cold start sorunu, scale-to-zero (düşük trafik = düşük maliyet), database branching (PR başına izole test ortamı)

---

## 3. Authentication

### Seçim: Better-Auth

- **Sürüm:** En güncel kararlı sürüm
- **Neden Better-Auth > Clerk:** Tam veri sahipliği, vendor lock-in yok, aylık kullanıcı başına maliyet yok, RBAC built-in, TypeScript-native
- **Neden Better-Auth > Auth.js v5:** Daha modern API, RBAC ve MFA out-of-the-box, Next.js 15 App Router için resmi destek
- **Güvenlik:** Middleware koruma (`middleware.ts`), Server Component session verification, Data Access Layer (DAL) pattern

---

## 4. Payment

### Seçim: Stripe

- **Entegrasyon:** Server Actions ile (güvenli, secret key sadece server'da)
- **Yöntem:** Stripe Hosted Checkout (hızlı entegrasyon) → ileride Elements ile custom
- **Kritik:** Webhook validation ile sipariş onayı (success URL'e güvenme!)
- **İyatı Türk siteler için:** Stripe Turkey'de destekleniyor mu? → İyzico alternatifi araştırılabilir

---

## 5. File Storage (Ürün Görselleri)

### Seçim: Vercel Blob

- **Neden:** Native Vercel entegrasyonu, CDN built-in, admin panelden doğrudan upload
- **Desteklenen Formatlar:** JPEG, PNG, WebP (next/image ile otomatik optimizasyon)
- **Alternatif:** Cloudinary (daha güçlü görsel dönüşüm ama ayrı hesap/maliyet)

---

## 6. Styling

### Seçim: Vanilla CSS + CSS Custom Properties

- **Neden:** Admin panelden dinamik tema değişimi için CSS Variables zorunlu
- **Yaklaşım:** CSS Custom Properties sistem → tema değerleri DB'den çekilir, :root'a inject edilir
- **Fonts:** Google Fonts (next/font ile — CLS sıfır)

---

## 7. Admin Panel UI

### Seçim: Custom built (shadcn/ui bileşenleri + Recharts)

- **shadcn/ui:** Headless, copy-paste, tamamen özelleştirilebilir
- **Recharts:** Satış grafikleri, stok analizi
- **Neden custom değil hazır admin template:** Tam özelleştirme kontrolü, theme engine entegrasyonu

---

## 8. SEO & Google Shopping

### Structured Data (JSON-LD)
- Server-side render → crawlable
- Schema.org `Product`, `BreadcrumbList`, `WebSite`, `Organization`
- Google Rich Results Test ile validation

### Sitemap & Robots
- `app/sitemap.ts` → dinamik, DB'den ürün/kategori URL'leri
- `app/robots.ts` → /admin, /api, /checkout disallow
- XML sitemap → Google Search Console'a gönderim

### Google Merchant Center (GMC)
- `/api/feed` route → XML product feed (Google Product Data Specification)
- ISR ile cache (her 24 saatte bir revalidate)
- İleride: Google Content API for Shopping ile otomatik senkronizasyon

---

## 9. Analytics & Search

### Seçim: Vercel Analytics + Speed Insights (yerleşik)

---

## 10. Deployment

- **Platform:** Vercel (Pro plan önerilir — bandwidth + functions için)
- **CI/CD:** GitHub → Vercel otomatik deployment
- **Environment:** Preview (Neon branch) + Production

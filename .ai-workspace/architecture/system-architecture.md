# Özmar Market — Sistem Mimarisi

**Tarih:** 2026-05-12  
**Durum:** v1.0 — Başlangıç

---

## Klasör Yapısı

```
ozmar-market/
├── app/
│   ├── (store)/                    # Müşteri mağaza arayüzü
│   │   ├── layout.tsx              # Mağaza layout (header, footer, theme)
│   │   ├── page.tsx                # Ana sayfa (slider + featured products)
│   │   ├── products/
│   │   │   ├── page.tsx            # Ürün listeleme
│   │   │   └── [slug]/page.tsx     # Ürün detay (SSR + JSON-LD)
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx     # Kategori sayfası
│   │   ├── cart/page.tsx           # Sepet
│   │   ├── checkout/page.tsx       # Ödeme
│   │   ├── orders/page.tsx         # Siparişlerim
│   │   └── account/page.tsx        # Hesabım
│   ├── (auth)/                     # Kimlik doğrulama
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── admin/                      # Yönetim paneli (korumalı)
│   │   ├── layout.tsx              # Admin layout (sidebar nav)
│   │   ├── page.tsx                # Dashboard (istatistikler)
│   │   ├── products/               # Ürün yönetimi
│   │   │   ├── page.tsx            # Ürün listesi
│   │   │   ├── new/page.tsx        # Yeni ürün
│   │   │   └── [id]/page.tsx       # Ürün düzenle
│   │   ├── categories/page.tsx     # Kategori yönetimi
│   │   ├── orders/                 # Sipariş yönetimi
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── customers/page.tsx      # Müşteri yönetimi
│   │   ├── inventory/page.tsx      # Stok takibi
│   │   ├── slider/page.tsx         # Slider yönetimi
│   │   ├── coupons/page.tsx        # Kupon yönetimi
│   │   ├── settings/               # Site ayarları
│   │   │   ├── general/page.tsx    # Ad, logo, favicon, meta
│   │   │   ├── theme/page.tsx      # Renkler, fontlar, tasarım
│   │   │   ├── payment/page.tsx    # Ödeme ayarları
│   │   │   ├── shipping/page.tsx   # Kargo ayarları
│   │   │   └── seo/page.tsx        # SEO & Google Shopping
│   │   └── analytics/page.tsx      # Analitik raporlar
│   ├── api/
│   │   ├── auth/[...all]/route.ts  # Better-Auth handler
│   │   ├── products/route.ts       # Ürün API
│   │   ├── orders/route.ts         # Sipariş API
│   │   ├── upload/route.ts         # Vercel Blob upload
│   │   ├── feed/route.ts           # Google Shopping XML feed
│   │   ├── sitemap-data/route.ts   # Sitemap verisi
│   │   └── webhooks/
│   │       └── stripe/route.ts     # Stripe webhook
│   ├── sitemap.ts                  # Dinamik sitemap
│   ├── robots.ts                   # Robots.txt
│   └── layout.tsx                  # Root layout
├── components/
│   ├── store/                      # Mağaza bileşenleri
│   │   ├── Hero/                   # Ana sayfa slider
│   │   ├── ProductCard/            # Ürün kartı
│   │   ├── ProductGrid/            # Ürün ızgarası
│   │   ├── Cart/                   # Sepet
│   │   ├── Header/                 # Üst menü
│   │   ├── Footer/                 # Alt bölüm
│   │   └── Search/                 # Arama
│   ├── admin/                      # Admin bileşenleri
│   │   ├── Sidebar/                # Admin yan menü
│   │   ├── Dashboard/              # Dashboard kartları
│   │   ├── DataTable/              # Veri tabloları
│   │   ├── ProductForm/            # Ürün formu
│   │   ├── SliderManager/          # Slider yönetimi
│   │   ├── ThemeEditor/            # Tema düzenleyici
│   │   └── Charts/                 # Grafikler
│   └── ui/                         # Genel UI bileşenleri
│       ├── Button/
│       ├── Modal/
│       ├── Input/
│       └── Badge/
├── lib/
│   ├── db.ts                       # Prisma client (singleton)
│   ├── auth.ts                     # Better-Auth config
│   ├── stripe.ts                   # Stripe client
│   ├── blob.ts                     # Vercel Blob helpers
│   ├── theme.ts                    # Tema yönetimi
│   └── validators/                 # Zod schemas
├── prisma/
│   ├── schema.prisma               # DB schema
│   └── migrations/                 # Migration geçmişi
├── public/
│   ├── icons/
│   └── images/
└── middleware.ts                    # Auth koruma, route guard
```

---

## Veritabanı Şeması (Prisma)

### Ana Modeller

```
User            → id, email, passwordHash, role, createdAt
Session         → id, userId, expiresAt (Better-Auth)
Product         → id, name, slug, description, price, comparePrice, stock, sku, images[], categoryId, isActive, metaTitle, metaDesc, createdAt
Category        → id, name, slug, description, image, parentId (hiyerarşi)
ProductVariant  → id, productId, name, options (JSON), price, stock
Order           → id, userId, status, total, shippingAddress, stripeSessionId
OrderItem       → id, orderId, productId, quantity, price
Cart            → id, userId/sessionId, items[]
CartItem        → id, cartId, productId, variantId, quantity
Slider          → id, title, subtitle, image, link, buttonText, order, isActive
SiteSettings    → id, key, value (JSON) — tek satır, tüm ayarlar
Coupon          → id, code, type, value, minOrder, usageLimit, usedCount, expiresAt
Review          → id, productId, userId, rating, comment, isApproved
```

---

## Güvenlik Mimarisi

```
middleware.ts
├── /admin/*     → requireRole('ADMIN')
├── /account/*   → requireAuth()
├── /checkout/*  → requireAuth() veya guest checkout
└── /api/admin/* → requireRole('ADMIN')
```

---

## Theme Engine Mimarisi

```
SiteSettings DB (key: 'theme')
→ JSON: { primaryColor, secondaryColor, fontFamily, logoUrl, faviconUrl, siteName, ... }
→ app/layout.tsx → generateMetadata (faviconUrl, siteName)
→ <style> inject → :root { --color-primary: ...; --color-secondary: ...; }
→ Tüm bileşenler CSS variables kullanır
→ Admin Theme Editor → Server Action → DB güncelle → revalidatePath('/')
```

---

## Google SEO & Shopping Akışı

```
Ürün Sayfası
├── Server Component → HTML tam render (crawlable)
├── generateMetadata() → title, description, openGraph, canonical
├── JSON-LD inject → Product schema (price, availability, images)
└── next/image → optimized, alt text

Sitemap
├── app/sitemap.ts → DB'den tüm aktif ürün + kategori URL'leri
└── /sitemap.xml → Google Search Console'a submit

Google Shopping Feed
├── /api/feed → XML (Google Product Data Specification)
├── ISR revalidate: 86400 (24 saat)
└── Google Merchant Center → Scheduled fetch
```

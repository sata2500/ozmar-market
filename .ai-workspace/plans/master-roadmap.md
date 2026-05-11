# Özmar Market — Master Geliştirme Yol Haritası

**Tarih:** 2026-05-12  
**Durum:** 🔲 Başlamadı  
**Metodoloji:** Atomik Geliştirme (Planla → Kodla → Test Et → Onayla → İlerle)

---

## ÖNCELİK 1 — FAZA 1: Temel Altyapı (Proje İskeleti)

> Hiçbir özelliğe geçilmeden temel altyapı %100 çalışır olmalı.

- [ ] **1.1** Next.js 15 projesini App Router ile başlat (`create-next-app`)
- [ ] **1.2** TypeScript, ESLint, Prettier konfigürasyonu
- [ ] **1.3** Prisma ORM kurulumu + Neon PostgreSQL bağlantısı
- [ ] **1.4** Temel veritabanı şeması yaz (`User`, `Session`, `SiteSettings`)
- [ ] **1.5** Better-Auth kurulumu (admin + müşteri rolleri)
- [ ] **1.6** Middleware yazımı (route protection: /admin /account)
- [ ] **1.7** CSS design system (CSS variables, typography, spacing)
- [ ] **1.8** Root layout (`app/layout.tsx`) — theme injection mekanizması
- [ ] **1.9** Vercel Blob entegrasyonu
- [ ] **1.10** Vercel'e ilk deploy (boş proje — altyapı testi)

**✅ Kabul Kriteri:** `vercel build` hatasız, login/logout çalışıyor, DB bağlantısı sağlanıyor.

---

## ÖNCELİK 2 — FAZA 2: Admin Panel Temeli

> Admin panel olmadan mağaza içeriği oluşturulamaz. Admin önce gelmeli.

- [x] **2.1** Admin layout (sidebar, topbar, responsive)
- [x] **2.2** Dashboard sayfası (istatistik kartları — placeholder veri ile)
- [x] **2.3** **Site Ayarları** modülü
  - [x] Genel Ayarlar (site adı, meta, iletişim)
  - [x] Logo & Favicon yükleme (Vercel Blob)
  - [x] Tema Editörü (renkler, fontlar — CSS variables kontrolü)
- [x] **2.4** Yönetici hesabı seed scripti (`prisma/seed.ts`)

**✅ Kabul Kriteri:** Admin login, tema renk değiştir, logo yükle — hepsi çalışıyor ve değişiklikler mağaza ön yüzüne yansıyor.

---

## ÖNCELİK 3 — FAZA 3: Ürün & Kategori Yönetimi

- [ ] **3.1** Veritabanı: `Category`, `Product`, `ProductVariant`, `ProductImage` modelleri
- [ ] **3.2** Kategori CRUD (admin paneli)
- [ ] **3.3** Ürün CRUD (admin paneli)
  - [ ] Çoklu görsel yükleme (drag & drop, Vercel Blob)
  - [ ] Varyant sistemi (beden, renk, vs.)
  - [ ] SEO alanları (meta title, description, slug)
  - [ ] Stok & fiyat yönetimi
- [ ] **3.4** Stok takip modülü (uyarı eşikleri, kritik stok bildirimi)

**✅ Kabul Kriteri:** Ürün ekle, düzenle, sil, stok güncelle — tüm işlemler başarılı.

---

## ÖNCELİK 4 — FAZA 4: Mağaza Ön Yüzü (Müşteri Arayüzü)

- [ ] **4.1** Ana sayfa layout (Header, Hero Slider, Featured Products, Footer)
- [ ] **4.2** **Hero Slider bileşeni**
  - [ ] Admin panelden slide yönetimi (görsel, başlık, link, buton)
  - [ ] Sonsuz döngü, touch/swipe desteği
  - [ ] Mobil/masaüstü ayrı yükseklik kontrolü
- [ ] **4.3** Ürün listeleme sayfası
  - [ ] Filtreleme (kategori, fiyat aralığı, stok durumu)
  - [ ] Sıralama (fiyat, yenilik, popülerlik)
  - [ ] Sayfalama (infinite scroll veya pagination)
- [ ] **4.4** Ürün detay sayfası (SSR + ISR)
  - [ ] Görsel galerisi
  - [ ] Varyant seçimi
  - [ ] Stok durumu gösterimi
  - [ ] JSON-LD Product schema (SEO)
  - [ ] Benzer ürünler
- [ ] **4.5** Kategori sayfaları
- [ ] **4.6** Arama fonksiyonu (full-text search)
- [ ] **4.7** Ürün inceleme/yorum sistemi

**✅ Kabul Kriteri:** Google "Rich Results Test" ürün sayfasında başarılı. Core Web Vitals yeşil.

---

## ÖNCELİK 5 — FAZA 5: Sepet & Ödeme

- [ ] **5.1** Sepet sistemi (session-based + user-based, merge on login)
- [ ] **5.2** İyzico entegrasyonu (Server Actions)
- [ ] **5.3** Checkout akışı (Misafir alışverişi dahil, adres, kargo seçimi, ödeme)
- [ ] **5.4** İyzico callback/webhook → sipariş oluşturma
- [ ] **5.5** Sipariş onay e-postası (Resend entegrasyonu)
- [ ] **5.6** Kupon/indirim kodu sistemi

**✅ Kabul Kriteri:** Test kart ile uçtan uca (misafir veya kayıtlı üye olarak) sipariş tamamlanabiliyor, İyzico callback sipariş oluşturuyor, Resend mail atıyor.

---

## ÖNCELİK 6 — FAZA 6: Sipariş & Müşteri Yönetimi (Admin)

- [ ] **6.1** Sipariş yönetimi (liste, detay, durum güncelleme)
- [ ] **6.2** Kargo yönetimi (PTT öncelikli, kargo takip numarası girişi ve entegrasyon planı)
- [ ] **6.3** Müşteri yönetimi (liste, detay, sipariş geçmişi)
- [ ] **6.4** Sipariş detay sayfası (admin + müşteri arayüzü)
- [ ] **6.5** Hesabım sayfası (müşteri — sipariş geçmişi, adres defteri)

**✅ Kabul Kriteri:** Admin siparişi görüntüleyebilir, durum ve PTT kargo kodunu güncelleyebilir, müşteri siparişini takip edebilir.

---

## ÖNCELİK 7 — FAZA 7: SEO & Google Shopping

- [ ] **7.1** `app/sitemap.ts` — dinamik sitemap (tüm ürün + kategori URL'leri)
- [ ] **7.2** `app/robots.ts` — robots.txt (admin/api/checkout disallow)
- [ ] **7.3** `generateMetadata()` — tüm sayfalarda dinamik meta
- [ ] **7.4** Yapısal veri (JSON-LD): Product, BreadcrumbList, WebSite, Organization
- [ ] **7.5** Open Graph görselleri (otomatik veya özel)
- [ ] **7.6** `/api/feed` — Google Shopping XML ürün feed'i
- [ ] **7.7** Google Search Console doğrulaması
- [ ] **7.8** Google Merchant Center feed bağlantısı

**✅ Kabul Kriteri:** Sitemap erişilebilir, Rich Results Test geçiyor, GMC feed hatasız.

---

## ÖNCELİK 8 — FAZA 8: Analytics & Optimizasyon

- [ ] **8.1** Vercel Analytics + Speed Insights entegrasyonu
- [ ] **8.2** Admin dashboard grafikleri (satış, gelir, ziyaretçi)
- [ ] **8.3** Performans optimizasyonu (Core Web Vitals)
- [ ] **8.4** Güvenlik denetimi (rate limiting, CSRF, input validation)

---

## ÖNCELİK 9 — FAZA 9: Production Hazırlığı

- [ ] **9.1** Environment variables (production secrets)
- [ ] **9.2** Error monitoring (Sentry veya Vercel native)
- [ ] **9.3** Custom domain bağlantısı
- [ ] **9.4** Son güvenlik taraması
- [ ] **9.5** **Production launch** 🚀

---

## Teknik Borç & Sonraki Aşama (v2)

- Mobil uygulama (React Native)
- Email pazarlama entegrasyonu
- AI destekli ürün açıklaması oluşturma
- Gelişmiş analitik dashboard
- Kargo Firmaları API Entegrasyonları (PTT, Yurtiçi vb. otomatik barkod)

*(Not: Proje dili sadece Türkçe ve hedef kitle Türkiye'dir. Çoklu dil ihtiyacı yoktur. Sitenin adı "Özmar Market" olarak belirlenmiş olup, veritabanından dinamik yönetilebilir yapılacaktır.)*

---

## Güncel Durum

| Faz | Başlık | Durum |
|-----|--------|-------|
| Faz 1 | Temel Altyapı | ✅ Tamamlandı |
| Faz 2 | Admin Panel Temeli | ✅ Tamamlandı |
| Faz 3 | Ürün & Kategori Yönetimi | 🔄 Devam Ediyor |
| Faz 4 | Mağaza Ön Yüzü | 🔲 Bekliyor |
| Faz 5 | Sepet & Ödeme | 🔲 Bekliyor |
| Faz 6 | Sipariş & Müşteri Yönetimi | 🔲 Bekliyor |
| Faz 7 | SEO & Google Shopping | 🔲 Bekliyor |
| Faz 8 | Analytics & Optimizasyon | 🔲 Bekliyor |
| Faz 9 | Production Hazırlığı | 🔲 Bekliyor |

import { PrismaClient } from "@prisma/client";
import { createHash } from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Admin kullanıcı oluştur
  // Not: Better-Auth'un password hash formatı için bcrypt benzeri bir sistem kullanılır.
  // İlk admin kullanıcısını Better-Auth UI'dan oluşturun, sonra role'ü manuel güncelleyin.
  
  // Varsayılan tema ayarları
  await prisma.siteSettings.upsert({
    where: { key: "theme" },
    update: {},
    create: {
      key: "theme",
      value: {
        siteName: "Özmar Market",
        siteSlogan: "Kaliteli alışverişin adresi",
        logoUrl: null,
        faviconUrl: null,
        primaryColor: "#6366f1",
        primaryColorHover: "#4f46e5",
        secondaryColor: "#f59e0b",
        accentColor: "#10b981",
        backgroundColor: "#0f0f14",
        surfaceColor: "#1a1a24",
        textColor: "#f1f5f9",
        textMuted: "#94a3b8",
        borderColor: "#2d2d3f",
        headerBg: "#0f0f14",
        headerText: "#f1f5f9",
        footerBg: "#0a0a10",
        footerText: "#94a3b8",
        adminSidebarBg: "#0f0f14",
        adminSidebarText: "#94a3b8",
        adminSidebarAccent: "#6366f1",
        fontFamily: "'Inter', sans-serif",
        borderRadius: "0.5rem",
        metaTitle: "Özmar Market — Kaliteli Alışveriş",
        metaDescription:
          "Özmar Market'te yüzlerce ürün arasından seçim yapın. Hızlı kargo, güvenli ödeme.",
        contactEmail: "info@ozmarmarket.com",
        contactPhone: "+90 (555) 000 0000",
        contactAddress: "İstanbul, Türkiye",
        socialInstagram: "",
        socialTwitter: "",
        socialFacebook: "",
        freeShippingThreshold: 500,
        shippingCost: 49.9,
      },
    },
  });
  console.log("✅ Site settings seeded");

  // Örnek kategoriler
  const categories = [
    { name: "Elektronik", slug: "elektronik", sortOrder: 1 },
    { name: "Giyim", slug: "giyim", sortOrder: 2 },
    { name: "Ev & Yaşam", slug: "ev-yasam", sortOrder: 3 },
    { name: "Spor", slug: "spor", sortOrder: 4 },
    { name: "Kitap & Kırtasiye", slug: "kitap-kirtasiye", sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }
  console.log("✅ Categories seeded");

  // Demo slider
  await prisma.slider.deleteMany();
  await prisma.slider.createMany({
    data: [
      {
        title: "Yeni Sezon",
        subtitle: "En Yeni Ürünler Burada",
        description: "Binlerce ürün arasından seçiminizi yapın, kapınıza kadar getiriyoruz.",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80",
        link: "/products",
        buttonText: "Alışverişe Başla",
        textAlign: "left",
        sortOrder: 1,
        isActive: true,
      },
      {
        title: "%50'ye Varan İndirim",
        subtitle: "Seçili Ürünlerde",
        description: "Kampanyalı ürünleri kaçırmayın, sınırlı stok.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
        link: "/products?featured=true",
        buttonText: "Kampanyaları Gör",
        textAlign: "center",
        sortOrder: 2,
        isActive: true,
      },
      {
        title: "Ücretsiz Kargo",
        subtitle: "500 TL ve Üzeri Siparişlerde",
        description: "Aynı gün kargo ile siparişiniz hızlıca kapınızda.",
        image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920&q=80",
        link: "/products",
        buttonText: "Hemen Sipariş Ver",
        textAlign: "right",
        sortOrder: 3,
        isActive: true,
      },
    ],
  });
  console.log("✅ Sliders seeded");

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📌 Next steps:");
  console.log(
    "   1. Run the app: npm run dev"
  );
  console.log(
    "   2. Register at /login to create your account"
  );
  console.log(
    "   3. Update your role to ADMIN in the database"
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

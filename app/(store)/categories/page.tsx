import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "Mağazamızdaki tüm ürün kategorileri",
};

export default async function CategoriesIndexPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="container" style={{ paddingBlock: "4rem" }}>
      <div className="section-title">
        <h1 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>Kategoriler</h1>
        <p style={{ color: "var(--color-text-muted)" }}>Aradığınız ürünleri kategorilere göre keşfedin.</p>
      </div>

      {categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--color-surface)", borderRadius: "var(--border-radius)" }}>
          Henüz kategori bulunmuyor.
        </div>
      ) : (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
          gap: "2rem" 
        }}>
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.slug}`}
              className="card card-hover"
              style={{ display: "flex", flexDirection: "column", background: "var(--color-surface)", borderRadius: "var(--border-radius)", overflow: "hidden", textDecoration: "none", border: "1px solid var(--color-border)" }}
            >
              <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "var(--color-bg)" }}>
                {category.image ? (
                  <Image 
                    src={category.image} 
                    alt={category.name} 
                    fill 
                    style={{ objectFit: "cover" }} 
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div style={{ padding: "1.25rem", textAlign: "center" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--color-text)", margin: 0 }}>
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

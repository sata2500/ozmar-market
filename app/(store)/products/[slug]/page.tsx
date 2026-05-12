import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ProductGallery from "@/components/store/ProductGallery";
import AddToCart from "@/components/store/AddToCart";
import ProductCard from "@/components/store/ProductCard";

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, metaTitle: true, metaDesc: true, shortDesc: true }
  });

  if (!product) return { title: "Ürün Bulunamadı" };

  return {
    title: product.metaTitle || product.name,
    description: product.metaDesc || product.shortDesc || `${product.name} Özmar Market'te.`,
  };
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: { where: { isActive: true } },
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  let relatedProducts: any[] = [];
  if (product.categoryId) {
    relatedProducts = await prisma.product.findMany({
      where: { 
        categoryId: product.categoryId, 
        id: { not: product.id },
        isActive: true
      },
      take: 4,
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } }
      }
    });
  }

  return (
    <div className="container" style={{ paddingBlock: "4rem" }}>
      {/* Breadcrumbs */}
      <nav style={{ marginBottom: "2rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
        <Link href="/" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>Ana Sayfa</Link>
        <span style={{ margin: "0 0.5rem" }}>/</span>
        {product.category ? (
          <>
            <Link href={`/categories/${product.category.slug}`} style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
              {product.category.name}
            </Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
          </>
        ) : (
          <>
            <Link href="/products" style={{ color: "var(--color-text-muted)", textDecoration: "none" }}>
              Ürünler
            </Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
          </>
        )}
        <span style={{ color: "var(--color-text)" }}>{product.name}</span>
      </nav>

      {/* Product Top */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "3rem", marginBottom: "4rem" }}>
        
        {/* Gallery */}
        <div>
          <ProductGallery 
            images={product.images.map(img => ({ id: img.id, url: img.url, alt: img.alt }))} 
            productName={product.name} 
          />
        </div>

        {/* Details & Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            {product.category && (
              <span style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {product.category.name}
              </span>
            )}
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0.5rem 0", color: "var(--color-text)" }}>
              {product.name}
            </h1>
            {product.sku && (
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", margin: 0 }}>
                Stok Kodu: {product.sku}
              </p>
            )}
          </div>

          {product.shortDesc && (
            <p style={{ fontSize: "1.125rem", lineHeight: 1.6, color: "var(--color-text-muted)" }}>
              {product.shortDesc}
            </p>
          )}

          {/* Add to Cart Component */}
          <AddToCart product={{
            id: product.id,
            name: product.name,
            basePrice: Number(product.price),
            comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
            stock: product.stock,
            variants: product.variants.map(v => ({
              id: v.id,
              name: v.name,
              price: v.price ? Number(v.price) : null,
              stock: v.stock
            }))
          }} />

          {/* Meta Info */}
          <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
            <p><strong>Barkod:</strong> {product.barcode || "-"}</p>
            {product.weight && <p><strong>Ağırlık:</strong> {product.weight.toString()} kg</p>}
          </div>
        </div>
      </div>

      {/* Description Tab */}
      {product.description && (
        <div style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--color-border)" }}>
            Ürün Açıklaması
          </h2>
          <div 
            style={{ lineHeight: 1.8, color: "var(--color-text-muted)", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: product.description }} 
          />
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="section-title">
            <h2>İlgili Ürünler</h2>
            <p>Bu ürüne bakanlar bunlara da göz attı</p>
          </div>
          <div className="product-grid">
            {relatedProducts.map(rp => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

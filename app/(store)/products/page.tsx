import { prisma } from "@/lib/db";
import ProductCard from "@/components/store/ProductCard";
import styles from "./ProductsPage.module.css";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Mağazamızdaki tüm ürünleri inceleyin ve en iyi fırsatları yakalayın.",
};

// Next.js searchParams
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage(props: Props) {
  const searchParams = await props.searchParams;
  
  const q = typeof searchParams.search === "string" ? searchParams.search : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";
  const featured = searchParams.featured === "true";
  const catSlug = typeof searchParams.category === "string" ? searchParams.category : null;

  // Build Prisma query
  const where: any = { isActive: true };
  
  if (q) {
    where.name = { contains: q, mode: "insensitive" };
  }
  
  if (featured) {
    where.isFeatured = true;
  }
  
  if (catSlug) {
    where.category = { slug: catSlug };
  }

  // Sorting
  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-asc") orderBy = { price: "asc" };
  if (sort === "price-desc") orderBy = { price: "desc" };
  if (sort === "name-asc") orderBy = { name: "asc" };
  
  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className={`container ${styles.page}`}>
      {/* Sidebar for Filters */}
      <aside className={styles.sidebar}>
        <div className={styles.filterSection}>
          <h3 className={styles.filterTitle}>Kategoriler</h3>
          <ul className={styles.filterList}>
            <li>
              <Link href="/products" className={!catSlug ? styles.activeFilter : ""}>
                Tümü
              </Link>
            </li>
            {categories.map(c => (
              <li key={c.id}>
                <Link 
                  href={`/products?category=${c.slug}`}
                  className={catSlug === c.slug ? styles.activeFilter : ""}
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className={styles.main}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              {featured ? "Kampanyalı Ürünler" : q ? `"${q}" için sonuçlar` : catSlug ? categories.find(c => c.slug === catSlug)?.name || "Kategori" : "Tüm Ürünler"}
            </h1>
            <p className={styles.count}>{products.length} ürün bulundu</p>
          </div>
          
          <div className={styles.sort}>
            <label htmlFor="sort">Sırala:</label>
            <select 
              id="sort" 
              defaultValue={sort}
              // Simple JS reload for sorting (in a real app, use next/navigation push)
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("sort", e.target.value);
                window.location.href = url.toString();
              }}
              style={{ padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)", background: "var(--color-bg)", color: "var(--color-text)" }}
            >
              <option value="newest">En Yeniler</option>
              <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
              <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
              <option value="name-asc">İsim (A-Z)</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className={styles.empty}>
            <p>Aradığınız kriterlere uygun ürün bulunamadı.</p>
            <Link href="/products" className="btn btn-primary" style={{ marginTop: "1rem" }}>
              Tüm Ürünleri Gör
            </Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

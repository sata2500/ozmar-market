import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import styles from "../../products/ProductsPage.module.css";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) return { title: "Kategori Bulunamadı" };

  return {
    title: category.metaTitle || category.name,
    description: category.metaDesc || category.description || `${category.name} kategorisindeki ürünleri inceleyin.`,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";

  // Build Prisma query
  const where: any = { 
    isActive: true,
    category: { slug: params.slug }
  };
  
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
              <Link href="/products">
                Tümü
              </Link>
            </li>
            {categories.map(c => (
              <li key={c.id}>
                <Link 
                  href={`/categories/${c.slug}`}
                  className={params.slug === c.slug ? styles.activeFilter : ""}
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
            <h1 className={styles.title}>{category.name}</h1>
            {category.description && (
              <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
                {category.description}
              </p>
            )}
            <p className={styles.count}>{products.length} ürün bulundu</p>
          </div>
          
          <div className={styles.sort}>
            <label htmlFor="sort">Sırala:</label>
            <select 
              id="sort" 
              defaultValue={sort}
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
            <p>Bu kategoride henüz ürün bulunmuyor.</p>
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

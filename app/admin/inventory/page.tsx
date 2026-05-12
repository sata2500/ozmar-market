import { prisma } from "@/lib/db";
import Link from "next/link";
import styles from "../page.module.css";
import tableStyles from "../table.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stok Takibi",
};

export default async function InventoryPage() {
  // Fetch products that have stock <= lowStockAt and trackStock is true
  const lowStockProducts = await prisma.product.findMany({
    where: {
      trackStock: true,
      stock: {
        lte: prisma.product.fields.lowStockAt, // In Prisma, comparing fields directly requires different syntax, let's use a simpler approach or raw query.
      }
    },
    include: {
      category: { select: { name: true } },
    },
    orderBy: { stock: "asc" },
  });

  // To properly compare field against field in Prisma:
  // Unfortunately, direct field vs field comparison isn't fully supported in simple where clauses.
  // Instead, we will fetch products where trackStock is true, and filter in JS if the DB is small,
  // or use a raw query if it's large. For this e-commerce app, we can fetch all tracked products and filter.
  // Actually, we can just fetch products where stock <= 5 (or a hardcoded threshold) 
  // Let's fetch products with stock <= 10 for demonstration of low stock, and filter exact threshold in memory.
  const allTrackedProducts = await prisma.product.findMany({
    where: { trackStock: true },
    include: { category: { select: { name: true } }, variants: true },
    orderBy: { stock: "asc" },
  });

  const criticalProducts = allTrackedProducts.filter(p => p.stock <= p.lowStockAt);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Stok Takibi</h1>
        <p className={styles.subtitle}>Kritik seviyeye düşmüş veya tükenmiş ürünleri takip edin.</p>
      </div>

      <div className={tableStyles.tableContainer}>
        {criticalProducts.length === 0 ? (
          <div className={tableStyles.emptyState}>
            Şu anda stok uyarısı veren ürün bulunmuyor. Her şey yolunda! 🎉
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Mevcut Stok</th>
                <th>Uyarı Sınırı</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {criticalProducts.map((product) => (
                <tr key={product.id}>
                  <td style={{ color: "var(--color-text-muted)" }}>{product.sku || "-"}</td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.category?.name || "-"}</td>
                  <td>
                    <span style={{ color: product.stock === 0 ? "#ef4444" : "#f59e0b", fontWeight: 700 }}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{product.lowStockAt}</td>
                  <td>
                    {product.stock === 0 ? (
                      <span className={`${tableStyles.badge} ${tableStyles.badgeInactive}`}>Tükendi</span>
                    ) : (
                      <span className={`${tableStyles.badge}`} style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}>Kritik Seviye</span>
                    )}
                  </td>
                  <td>
                    <Link href={`/admin/products/${product.id}`} className={`${tableStyles.btnSmall} ${tableStyles.btnEdit}`}>
                      Stok Güncelle
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

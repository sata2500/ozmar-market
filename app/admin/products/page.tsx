import { prisma } from "@/lib/db";
import Link from "next/link";
import styles from "../page.module.css";
import tableStyles from "../table.module.css";
import { Metadata } from "next";
import DeleteProductButton from "@/components/admin/products/DeleteProductButton";

export const metadata: Metadata = {
  title: "Ürünler",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: { select: { name: true } },
      images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      _count: { select: { variants: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className={styles.title}>Ürünler</h1>
          <p className={styles.subtitle}>Mağazanızdaki ürünleri yönetin.</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Yeni Ürün
        </Link>
      </div>

      <div className={tableStyles.tableContainer}>
        {products.length === 0 ? (
          <div className={tableStyles.emptyState}>
            Henüz hiç ürün eklenmemiş.
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Varyant</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.images[0] ? (
                      <img src={product.images[0].url} alt={product.name} width="40" height="40" style={{ borderRadius: "4px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", background: "var(--color-surface-2)", borderRadius: "4px" }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.category?.name || "-"}</td>
                  <td>₺{product.price.toString()}</td>
                  <td>{product.stock}</td>
                  <td>{product._count.variants}</td>
                  <td>
                    <span className={`${tableStyles.badge} ${product.isActive ? tableStyles.badgeActive : tableStyles.badgeInactive}`}>
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link href={`/admin/products/${product.id}`} className={`${tableStyles.btnSmall} ${tableStyles.btnEdit}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Düzenle
                      </Link>
                      <DeleteProductButton id={product.id} />
                    </div>
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

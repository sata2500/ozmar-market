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
                <th>Ürün Adı</th>
                <th>Kategori</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td style={{ fontWeight: 500 }}>{product.name}</td>
                  <td>{product.category?.name || "-"}</td>
                  <td>₺{product.price.toString()}</td>
                  <td>{product.stock}</td>
                  <td>
                    <span className={`${tableStyles.badge} ${product.isActive ? tableStyles.badgeActive : tableStyles.badgeInactive}`}>
                      {product.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className={tableStyles.actions}>
                      {/* TODO: Add edit page link when implemented */}
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

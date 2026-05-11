import { prisma } from "@/lib/db";
import Link from "next/link";
import styles from "../page.module.css";
import tableStyles from "../table.module.css";
import { Metadata } from "next";
import DeleteCategoryButton from "@/components/admin/categories/DeleteCategoryButton";

export const metadata: Metadata = {
  title: "Kategoriler",
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } }
    },
    orderBy: [
      { parentId: "asc" },
      { sortOrder: "asc" },
      { name: "asc" }
    ],
  });

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className={styles.title}>Kategoriler</h1>
          <p className={styles.subtitle}>Mağazanızdaki ürün kategorilerini yönetin.</p>
        </div>
        <Link href="/admin/categories/new" className="btn btn-primary">
          + Yeni Kategori
        </Link>
      </div>

      <div className={tableStyles.tableContainer}>
        {categories.length === 0 ? (
          <div className={tableStyles.emptyState}>
            Henüz hiç kategori eklenmemiş.
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Kategori Adı</th>
                <th>Üst Kategori</th>
                <th>Ürün Sayısı</th>
                <th>Durum</th>
                <th>Sıra</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    {category.image ? (
                      <img src={category.image} alt={category.name} width="40" height="40" style={{ borderRadius: "4px", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", background: "var(--color-surface-2)", borderRadius: "4px" }} />
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>{category.name}</td>
                  <td>{category.parent?.name || "-"}</td>
                  <td>{category._count.products}</td>
                  <td>
                    <span className={`${tableStyles.badge} ${category.isActive ? tableStyles.badgeActive : tableStyles.badgeInactive}`}>
                      {category.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>{category.sortOrder}</td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link href={`/admin/categories/${category.id}`} className={`${tableStyles.btnSmall} ${tableStyles.btnEdit}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Düzenle
                      </Link>
                      <DeleteCategoryButton id={category.id} />
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

import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import styles from "../../page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yeni Kategori Ekle",
};

export default async function NewCategoryPage() {
  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yeni Kategori Ekle</h1>
        <p className={styles.subtitle}>Mağazanız için yeni bir ürün kategorisi oluşturun.</p>
      </div>

      <div className={styles.section}>
        <CategoryForm allCategories={allCategories} />
      </div>
    </div>
  );
}

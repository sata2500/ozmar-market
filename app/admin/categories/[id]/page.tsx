import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import styles from "../../page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Kategori Düzenle",
};

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  });

  if (!category) {
    notFound();
  }

  const allCategories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Kategori Düzenle</h1>
        <p className={styles.subtitle}>{category.name} kategorisini güncelliyorsunuz.</p>
      </div>

      <div className={styles.section}>
        <CategoryForm 
          category={category} 
          allCategories={allCategories} 
        />
      </div>
    </div>
  );
}

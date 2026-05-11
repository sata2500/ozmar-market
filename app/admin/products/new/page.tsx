import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/products/ProductForm";
import styles from "../../page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yeni Ürün Ekle",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yeni Ürün Ekle</h1>
        <p className={styles.subtitle}>Mağazanıza yeni bir ürün ekleyin.</p>
      </div>

      <div className={styles.section}>
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}

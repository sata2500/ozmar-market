import { prisma } from "@/lib/db";
import ProductForm from "@/components/admin/products/ProductForm";
import styles from "../../page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Ürün Düzenle",
};

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      variants: true,
    },
  });

  if (!product) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ürün Düzenle</h1>
        <p className={styles.subtitle}>{product.name} ürününü güncelliyorsunuz.</p>
      </div>

      <div className={styles.section}>
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  );
}

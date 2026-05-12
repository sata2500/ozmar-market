import Link from "next/link";
import styles from "./FeaturedProducts.module.css";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: unknown;
  comparePrice: unknown;
  stock: number;
  isFeatured: boolean;
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string } | null;
};

type Props = {
  products: Product[];
};

export default function FeaturedProducts({ products }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-title">
          <h2>Öne Çıkan Ürünler</h2>
          <p>En çok tercih edilen ürünler</p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href="/products" className="btn btn-outline btn-lg">
            Tüm Ürünleri Gör
          </Link>
        </div>
      </div>
    </section>
  );
}

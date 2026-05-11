import Link from "next/link";
import Image from "next/image";
import styles from "./FeaturedProducts.module.css";

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
          {products.map((product) => {
            const image = product.images[0];
            const price = Number(product.price);
            const comparePrice = product.comparePrice
              ? Number(product.comparePrice)
              : null;
            const discount = comparePrice
              ? Math.round(((comparePrice - price) / comparePrice) * 100)
              : null;

            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className={`card card-hover ${styles.card}`}
              >
                <div className={styles.imageWrap}>
                  {image ? (
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      fill
                      className={styles.image}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className={styles.noImage}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
                  {discount && (
                    <span className={`badge badge-danger ${styles.discount}`}>
                      -{discount}%
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className={styles.outOfStock}>Stok Tükendi</div>
                  )}
                </div>

                <div className={styles.info}>
                  {product.category && (
                    <span className={styles.category}>{product.category.name}</span>
                  )}
                  <h3 className={styles.name}>{product.name}</h3>
                  <div className={styles.pricing}>
                    <span className={styles.price}>
                      {price.toLocaleString("tr-TR", {
                        style: "currency",
                        currency: "TRY",
                      })}
                    </span>
                    {comparePrice && (
                      <span className={styles.comparePrice}>
                        {comparePrice.toLocaleString("tr-TR", {
                          style: "currency",
                          currency: "TRY",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
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

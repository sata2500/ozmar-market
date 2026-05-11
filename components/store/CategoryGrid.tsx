import Link from "next/link";
import Image from "next/image";
import styles from "./CategoryGrid.module.css";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

type Props = {
  categories: Category[];
};

const CATEGORY_ICONS: Record<string, string> = {
  elektronik: "💻",
  giyim: "👗",
  "ev-yasam": "🏠",
  spor: "⚽",
  "kitap-kirtasiye": "📚",
};

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container">
        <div className="section-title">
          <h2>Kategoriler</h2>
          <p>İlgilendiğiniz kategoriyi seçin</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className={styles.card}
            >
              <div className={styles.iconWrap}>
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 640px) 50vw, 200px"
                  />
                ) : (
                  <span className={styles.emoji}>
                    {CATEGORY_ICONS[cat.slug] || "🛍️"}
                  </span>
                )}
                <div className={styles.overlay} />
              </div>
              <span className={styles.name}>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

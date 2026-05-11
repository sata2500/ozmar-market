import Link from "next/link";
import styles from "./StoreFooter.module.css";

export default function StoreFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <span className={styles.logoText}>Özmar Market</span>
            <p className={styles.tagline}>Kaliteli alışverişin adresi</p>
            <div className={styles.social}>
              <a href="#" className={styles.socialLink} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className={styles.socialLink} aria-label="Twitter/X">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Alışveriş</h3>
            <nav>
              <Link href="/products" className={styles.link}>Tüm Ürünler</Link>
              <Link href="/categories" className={styles.link}>Kategoriler</Link>
              <Link href="/products?featured=true" className={styles.link}>Kampanyalar</Link>
              <Link href="/products?new=true" className={styles.link}>Yeni Gelenler</Link>
            </nav>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Hesabım</h3>
            <nav>
              <Link href="/account" className={styles.link}>Profilim</Link>
              <Link href="/account/orders" className={styles.link}>Siparişlerim</Link>
              <Link href="/account/addresses" className={styles.link}>Adreslerim</Link>
              <Link href="/cart" className={styles.link}>Sepetim</Link>
            </nav>
          </div>

          <div className={styles.col}>
            <h3 className={styles.colTitle}>Yardım</h3>
            <nav>
              <Link href="/help/shipping" className={styles.link}>Kargo Bilgisi</Link>
              <Link href="/help/returns" className={styles.link}>İade & Değişim</Link>
              <Link href="/help/faq" className={styles.link}>Sık Sorulan Sorular</Link>
              <Link href="/contact" className={styles.link}>İletişim</Link>
            </nav>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Özmar Market. Tüm hakları saklıdır.
          </p>
          <div className={styles.legal}>
            <Link href="/privacy" className={styles.legalLink}>Gizlilik Politikası</Link>
            <Link href="/terms" className={styles.legalLink}>Kullanım Koşulları</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

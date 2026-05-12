import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import styles from "./StoreHeader.module.css";
import SearchBar from "./SearchBar";

// Bu bileşen Server Component — theme verisini doğrudan okuyabilir
// Cart sayısı için bir Client Component wrapper kullanacağız

export default function StoreHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Özmar Market</span>
        </Link>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Ana navigasyon">
          <Link href="/products" className={styles.navLink}>Ürünler</Link>
          <Link href="/categories" className={styles.navLink}>Kategoriler</Link>
          <Link href="/products?featured=true" className={styles.navLink}>Kampanyalar</Link>
        </nav>

        {/* Actions */}
        <div className={styles.actions}>
          <Suspense fallback={<div style={{ width: 36, height: 36 }} />}>
            <SearchBar />
          </Suspense>

          <Link href="/account" className={styles.iconBtn} aria-label="Hesabım">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          <Link href="/cart" className={styles.cartBtn} aria-label="Sepet">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span className={styles.cartBadge} aria-live="polite">0</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Dashboard",
};

const STAT_CARDS = [
  { label: "Toplam Sipariş", value: "0", icon: "📦", color: "var(--color-primary)", change: "+0%" },
  { label: "Toplam Gelir", value: "₺0", icon: "💰", color: "var(--color-accent)", change: "+0%" },
  { label: "Aktif Ürün", value: "0", icon: "🛍️", color: "var(--color-secondary)", change: "+0" },
  { label: "Toplam Müşteri", value: "0", icon: "👥", color: "var(--color-info)", change: "+0" },
];

export default function AdminDashboardPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Genel Bakış</h1>
        <p className={styles.subtitle}>Mağazanızın anlık durumunu takip edin</p>
      </div>

      {/* Stat Cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map((card) => (
          <div key={card.label} className={`card ${styles.statCard}`}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon} style={{ background: `${card.color}20` }}>
                {card.icon}
              </span>
              <span className={styles.statChange}>{card.change}</span>
            </div>
            <div className={styles.statValue}>{card.value}</div>
            <div className={styles.statLabel}>{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Hızlı İşlemler</h2>
        <div className={styles.quickActions}>
          <a href="/admin/products/new" className={`btn btn-primary ${styles.quickBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Yeni Ürün Ekle
          </a>
          <a href="/admin/orders" className={`btn btn-outline ${styles.quickBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Siparişleri Görüntüle
          </a>
          <a href="/admin/slider" className={`btn btn-outline ${styles.quickBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 3H8"/>
            </svg>
            Slider Düzenle
          </a>
          <a href="/admin/settings/theme" className={`btn btn-outline ${styles.quickBtn}`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            Tema Düzenle
          </a>
        </div>
      </div>

      {/* Setup Notice */}
      <div className={`card ${styles.setupNotice}`}>
        <div className={styles.noticeIcon}>🚀</div>
        <div>
          <h3 className={styles.noticeTitle}>Kurulum Tamamlandı!</h3>
          <p className={styles.noticeText}>
            Temel altyapı başarıyla kuruldu. Neon PostgreSQL bağlantınızı yapılandırın ve
            ürünlerinizi eklemeye başlayın. Sonraki adım: <strong>Veritabanı migration</strong>
          </p>
          <div className={styles.noticeSteps}>
            <div className={styles.step}>
              <span className={styles.stepNum}>1</span>
              <code>.env</code> dosyasına Neon <code>DATABASE_URL</code> ekleyin
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>2</span>
              <code>npm run db:push</code> ile şemayı uygulayın
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>3</span>
              <code>npm run db:seed</code> ile başlangıç verilerini yükleyin
            </div>
            <div className={styles.step}>
              <span className={styles.stepNum}>4</span>
              <code>/login</code> adresinden hesabınızı oluşturun ve admin rolünü atayın
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

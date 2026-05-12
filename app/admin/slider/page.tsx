import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
import Link from "next/link";
import styles from "../page.module.css";
import tableStyles from "../table.module.css";
import { Metadata } from "next";
import DeleteSliderButton from "@/components/admin/slider/DeleteSliderButton";

export const metadata: Metadata = {
  title: "Slider Yönetimi",
};

export default async function SliderPage() {
  const sliders = await prisma.slider.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 className={styles.title}>Slider Yönetimi</h1>
          <p className={styles.subtitle}>Ana sayfadaki büyük kaydırıcı (manşet) görsellerini yönetin.</p>
        </div>
        <Link href="/admin/slider/new" className="btn btn-primary">
          + Yeni Slayt
        </Link>
      </div>

      <div className={tableStyles.tableContainer}>
        {sliders.length === 0 ? (
          <div className={tableStyles.emptyState}>
            Henüz hiç slayt eklenmemiş. Ana sayfada boş görünecektir.
          </div>
        ) : (
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Görsel</th>
                <th>Başlık</th>
                <th>Bağlantı</th>
                <th>Sıra</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((slider) => (
                <tr key={slider.id}>
                  <td>
                    <img src={slider.image} alt={slider.title || "Slider"} width="80" height="40" style={{ borderRadius: "4px", objectFit: "cover" }} />
                  </td>
                  <td style={{ fontWeight: 500 }}>{slider.title || "(Başlıksız)"}</td>
                  <td style={{ color: "var(--color-text-muted)" }}>{slider.link || "-"}</td>
                  <td>{slider.sortOrder}</td>
                  <td>
                    <span className={`${tableStyles.badge} ${slider.isActive ? tableStyles.badgeActive : tableStyles.badgeInactive}`}>
                      {slider.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td>
                    <div className={tableStyles.actions}>
                      <Link href={`/admin/slider/${slider.id}`} className={`${tableStyles.btnSmall} ${tableStyles.btnEdit}`}>
                        Düzenle
                      </Link>
                      <DeleteSliderButton id={slider.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

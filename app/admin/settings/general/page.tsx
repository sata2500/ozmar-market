import { getTheme } from "@/lib/theme";
import GeneralSettingsForm from "@/components/admin/settings/GeneralSettingsForm";
import styles from "../../page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Genel Ayarlar",
};

export default async function GeneralSettingsPage() {
  const theme = await getTheme();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Genel Ayarlar</h1>
        <p className={styles.subtitle}>Sitenizin temel kimlik ve iletişim bilgilerini yönetin.</p>
      </div>

      <div className={styles.section}>
        <GeneralSettingsForm theme={theme} />
      </div>
    </div>
  );
}

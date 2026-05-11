import { getTheme } from "@/lib/theme";
import ThemeSettingsForm from "@/components/admin/settings/ThemeSettingsForm";
import styles from "../../page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tema Editörü",
};

export default async function ThemeSettingsPage() {
  const theme = await getTheme();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Tema Editörü</h1>
        <p className={styles.subtitle}>Sitenizin renklerini ve görsel kimliğini özelleştirin.</p>
      </div>

      <div className={styles.section}>
        <ThemeSettingsForm theme={theme} />
      </div>
    </div>
  );
}

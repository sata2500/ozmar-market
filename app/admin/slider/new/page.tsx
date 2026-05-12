import SliderForm from "@/components/admin/slider/SliderForm";
import styles from "../../page.module.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yeni Slayt Ekle",
};

export default function NewSliderPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Yeni Slayt Ekle</h1>
        <p className={styles.subtitle}>Ana sayfa için yeni bir kaydırıcı görseli oluşturun.</p>
      </div>

      <div className={styles.section}>
        <SliderForm />
      </div>
    </div>
  );
}

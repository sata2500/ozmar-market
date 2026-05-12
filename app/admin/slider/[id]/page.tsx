import { prisma } from "@/lib/db";
import SliderForm from "@/components/admin/slider/SliderForm";
import styles from "../../page.module.css";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Slayt Düzenle",
};

export default async function EditSliderPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const slider = await prisma.slider.findUnique({
    where: { id: params.id },
  });

  if (!slider) {
    notFound();
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Slayt Düzenle</h1>
        <p className={styles.subtitle}>Slayt içeriğini ve görsellerini güncelliyorsunuz.</p>
      </div>

      <div className={styles.section}>
        <SliderForm slider={slider} />
      </div>
    </div>
  );
}

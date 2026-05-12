"use client";

import { useTransition, useState } from "react";
import { createSlider, updateSlider } from "@/app/admin/slider/actions";
import styles from "../../settings/SettingsForm.module.css";

type SliderFormProps = {
  slider?: any;
};

export default function SliderForm({ slider }: SliderFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let result;
      if (slider?.id) {
        result = await updateSlider(slider.id, formData);
      } else {
        result = await createSlider(formData);
      }

      if (result && !result.success) {
        setError(result.message || "Bir hata oluştu.");
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
      {error && (
        <div className={`${styles.alert} ${styles.error}`}>
          {error}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Slayt Görselleri</h3>
        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="imageFile">Masaüstü Görseli (1920x800 vb.) {!slider?.id && "*"}</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/*" required={!slider?.id} />
            {slider?.image && (
              <div className={styles.preview} style={{ marginTop: "1rem" }}>
                <img src={slider.image} alt="Desktop Preview" style={{ maxHeight: "200px", objectFit: "cover", width: "100%", borderRadius: "8px" }} />
              </div>
            )}
          </div>
          
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="mobileImageFile">Mobil Görseli (Opsiyonel - 800x1000 vb.)</label>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "-5px", marginBottom: "8px" }}>Belirtilmezse masaüstü görseli mobilde de kullanılır.</p>
            <input type="file" id="mobileImageFile" name="mobileImageFile" accept="image/*" />
            {slider?.mobileImage && (
              <div className={styles.preview} style={{ marginTop: "1rem" }}>
                <img src={slider.mobileImage} alt="Mobile Preview" style={{ maxHeight: "200px", width: "auto", borderRadius: "8px" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>İçerik</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Büyük Başlık</label>
            <input type="text" id="title" name="title" defaultValue={slider?.title || ""} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subtitle">Üst Başlık (Küçük)</label>
            <input type="text" id="subtitle" name="subtitle" defaultValue={slider?.subtitle || ""} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Açıklama Metni</label>
            <textarea id="description" name="description" defaultValue={slider?.description || ""} rows={2} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Aksiyon & Görünüm</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="link">Hedef Link (URL)</label>
            <input type="text" id="link" name="link" defaultValue={slider?.link || ""} placeholder="/kategori/giyim" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="buttonText">Buton Metni</label>
            <input type="text" id="buttonText" name="buttonText" defaultValue={slider?.buttonText || ""} placeholder="Hemen Alışverişe Başla" />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="textAlign">Metin Hizalama</label>
            <select id="textAlign" name="textAlign" defaultValue={slider?.textAlign || "left"}>
              <option value="left">Sola Dayalı</option>
              <option value="center">Ortalı</option>
              <option value="right">Sağa Dayalı</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="buttonStyle">Buton Stili</label>
            <select id="buttonStyle" name="buttonStyle" defaultValue={slider?.buttonStyle || "primary"}>
              <option value="primary">Ana Renk (Primary)</option>
              <option value="white">Beyaz</option>
              <option value="outline">Çizgili (Outline)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sortOrder">Sıralama</label>
            <input type="number" id="sortOrder" name="sortOrder" defaultValue={slider?.sortOrder ?? 0} />
          </div>
          <div className={styles.formGroup} style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text)", fontWeight: 600 }}>
              <input type="checkbox" name="isActive" defaultChecked={slider?.isActive ?? true} style={{ width: "18px", height: "18px" }} />
              Aktif (Sitede Göster)
            </label>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <a href="/admin/slider" className="btn btn-outline" style={{ marginRight: "1rem" }}>İptal</a>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : (slider?.id ? "Değişiklikleri Kaydet" : "Slayt Oluştur")}
        </button>
      </div>
    </form>
  );
}

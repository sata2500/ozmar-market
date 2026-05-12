"use client";

import { useTransition, useState } from "react";
import { createCategory, updateCategory } from "@/app/admin/categories/actions";
import styles from "../settings/SettingsForm.module.css"; // Reuse settings form CSS

type CategoryParams = {
  id?: string;
  name?: string;
  slug?: string;
  description?: string;
  parentId?: string | null;
  sortOrder?: number;
  isActive?: boolean;
  metaTitle?: string;
  metaDesc?: string;
  image?: string | null;
};

type CategoryFormProps = {
  category?: CategoryParams;
  allCategories: { id: string; name: string }[];
};

export default function CategoryForm({ category, allCategories }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Otomatik slug oluşturma
  const [name, setName] = useState(category?.name || "");
  const [slug, setSlug] = useState(category?.slug || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!category?.id) { // Sadece yeni eklerken otomatik slug
      setSlug(
        val
          .toLowerCase()
          .replace(/ğ/g, "g")
          .replace(/ü/g, "u")
          .replace(/ş/g, "s")
          .replace(/ı/g, "i")
          .replace(/ö/g, "o")
          .replace(/ç/g, "c")
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let result;
      if (category?.id) {
        result = await updateCategory(category.id, formData);
      } else {
        result = await createCategory(formData);
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
        <h3 className={styles.sectionTitle}>Temel Bilgiler</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Kategori Adı *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={name}
              onChange={handleNameChange}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="slug">URL Slug *</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required 
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="parentId">Üst Kategori</label>
            <select id="parentId" name="parentId" defaultValue={category?.parentId || ""}>
              <option value="">(Yok - Ana Kategori)</option>
              {allCategories.map(c => (
                <option key={c.id} value={c.id} disabled={c.id === category?.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sortOrder">Sıralama</label>
            <input 
              type="number" 
              id="sortOrder" 
              name="sortOrder" 
              defaultValue={category?.sortOrder ?? 0} 
            />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Açıklama</label>
            <textarea 
              id="description" 
              name="description" 
              defaultValue={category?.description || ""} 
              rows={3} 
            />
          </div>

          <div className={styles.formGroup}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text)", fontWeight: 600 }}>
              <input 
                type="checkbox" 
                name="isActive" 
                defaultChecked={category?.isActive ?? true} 
                style={{ width: "18px", height: "18px" }}
              />
              Aktif (Sitede Göster)
            </label>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Görsel</h3>
        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="imageFile">Kategori Görseli (Opsiyonel)</label>
            <input type="file" id="imageFile" name="imageFile" accept="image/*" />
            {category?.image && (
              <div className={styles.preview}>
                <img src={category.image} alt="Kategori" style={{ maxHeight: "150px" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>SEO (Arama Motoru Optimizasyonu)</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="metaTitle">SEO Başlık</label>
            <input 
              type="text" 
              id="metaTitle" 
              name="metaTitle" 
              defaultValue={category?.metaTitle || ""} 
            />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="metaDesc">SEO Açıklama</label>
            <textarea 
              id="metaDesc" 
              name="metaDesc" 
              defaultValue={category?.metaDesc || ""} 
              rows={2} 
            />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <a href="/admin/categories" className="btn btn-outline" style={{ marginRight: "1rem" }}>
          İptal
        </a>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : (category?.id ? "Değişiklikleri Kaydet" : "Kategori Oluştur")}
        </button>
      </div>
    </form>
  );
}

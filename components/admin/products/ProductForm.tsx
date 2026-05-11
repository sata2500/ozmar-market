"use client";

import { useTransition, useState } from "react";
import { createProduct } from "@/app/admin/products/actions";
import styles from "../../settings/SettingsForm.module.css";

type Category = { id: string; name: string };

type ProductFormProps = {
  product?: any;
  categories: Category[];
};

export default function ProductForm({ product, categories }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!product?.id) {
      setSlug(
        val.toLowerCase()
          .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
          .replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      let result;
      if (product?.id) {
        // update (to be implemented)
      } else {
        result = await createProduct(formData);
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
            <label htmlFor="name">Ürün Adı *</label>
            <input type="text" id="name" name="name" value={name} onChange={handleNameChange} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="slug">URL Slug *</label>
            <input type="text" id="slug" name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="categoryId">Kategori</label>
            <select id="categoryId" name="categoryId" defaultValue={product?.categoryId || ""}>
              <option value="">(Kategorisiz)</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="sku">SKU / Stok Kodu</label>
            <input type="text" id="sku" name="sku" defaultValue={product?.sku || ""} />
          </div>

          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="shortDesc">Kısa Açıklama</label>
            <textarea id="shortDesc" name="shortDesc" defaultValue={product?.shortDesc || ""} rows={2} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="description">Detaylı Açıklama</label>
            <textarea id="description" name="description" defaultValue={product?.description || ""} rows={4} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Fiyat & Stok</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Satış Fiyatı (₺) *</label>
            <input type="number" step="0.01" id="price" name="price" defaultValue={product?.price || ""} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comparePrice">İndirimsiz Fiyat (₺) (Üstü çizili gösterilir)</label>
            <input type="number" step="0.01" id="comparePrice" name="comparePrice" defaultValue={product?.comparePrice || ""} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="stock">Stok Miktarı</label>
            <input type="number" id="stock" name="stock" defaultValue={product?.stock || 0} />
          </div>
          
          <div className={styles.formGroup} style={{ justifyContent: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text)", fontWeight: 600 }}>
              <input type="checkbox" name="isActive" defaultChecked={product?.isActive ?? true} style={{ width: "18px", height: "18px" }} />
              Aktif (Sitede Göster)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: "var(--color-text)", fontWeight: 600, marginTop: "0.5rem" }}>
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured ?? false} style={{ width: "18px", height: "18px" }} />
              Öne Çıkan Ürün
            </label>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <a href="/admin/products" className="btn btn-outline" style={{ marginRight: "1rem" }}>İptal</a>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : (product?.id ? "Değişiklikleri Kaydet" : "Ürün Oluştur")}
        </button>
      </div>
    </form>
  );
}

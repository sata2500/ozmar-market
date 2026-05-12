"use client";

import { useTransition, useState } from "react";
import { createProduct } from "@/app/admin/products/actions";
import styles from "../settings/SettingsForm.module.css";

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

  const [variants, setVariants] = useState<any[]>(product?.variants || []);

  const addVariant = () => {
    setVariants([...variants, { name: "", price: "", stock: 0, sku: "", options: {} }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("variantsData", JSON.stringify(variants));
    
    startTransition(async () => {
      let result;
      if (product?.id) {
        result = await updateProduct(product.id, formData);
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
        <h3 className={styles.sectionTitle}>Görseller</h3>
        <div className={styles.grid}>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="images">Yeni Görseller (Çoklu Seçim)</label>
            <input type="file" id="images" name="images" accept="image/*" multiple />
          </div>
          {product?.images && product.images.length > 0 && (
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Mevcut Görseller</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {product.images.map((img: any) => (
                  <div key={img.id} className={styles.preview}>
                    <img src={img.url} alt="Product Image" style={{ height: '80px', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Fiyat & Stok (Temel Ürün)</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="price">Satış Fiyatı (₺) *</label>
            <input type="number" step="0.01" id="price" name="price" defaultValue={product?.price?.toString() || ""} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="comparePrice">İndirimsiz Fiyat (₺) (Üstü çizili)</label>
            <input type="number" step="0.01" id="comparePrice" name="comparePrice" defaultValue={product?.comparePrice?.toString() || ""} />
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

      <div className={styles.section}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", borderBottom: "1px solid var(--color-border)", paddingBottom: "0.75rem" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--color-text)", margin: 0 }}>Varyantlar (Renk, Beden vb.)</h3>
          <button type="button" onClick={addVariant} className="btn btn-outline" style={{ padding: "0.3rem 0.6rem", fontSize: "0.85rem" }}>
            + Varyant Ekle
          </button>
        </div>
        
        {variants.length === 0 ? (
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem" }}>Bu ürüne ait varyant bulunmuyor.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {variants.map((v, index) => (
              <div key={index} style={{ display: "flex", gap: "1rem", alignItems: "flex-end", background: "var(--color-bg)", padding: "1rem", borderRadius: "var(--radius-md)" }}>
                <div className={styles.formGroup} style={{ flex: 2 }}>
                  <label>Varyant Adı (Örn: M - Kırmızı)</label>
                  <input type="text" value={v.name} onChange={e => updateVariant(index, "name", e.target.value)} required />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Fiyat (Opsiyonel)</label>
                  <input type="number" step="0.01" value={v.price} onChange={e => updateVariant(index, "price", e.target.value)} placeholder="0.00" />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Stok</label>
                  <input type="number" value={v.stock} onChange={e => updateVariant(index, "stock", e.target.value)} />
                </div>
                <button type="button" onClick={() => removeVariant(index)} style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", height: "42px" }}>
                  X
                </button>
              </div>
            ))}
          </div>
        )}
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

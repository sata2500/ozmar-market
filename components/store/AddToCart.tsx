"use client";

import { useState } from "react";
import styles from "./AddToCart.module.css";
// import { useCart } from "@/lib/cart-store"; // Sepet context'i ileride eklenecek

type Variant = {
  id: string;
  name: string;
  price: string | number | null;
  stock: number;
};

type AddToCartProps = {
  product: {
    id: string;
    name: string;
    basePrice: number;
    comparePrice: number | null;
    stock: number;
    variants: Variant[];
  };
};

export default function AddToCart({ product }: AddToCartProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  // Current selected variant (if any)
  const variant = selectedVariantId 
    ? product.variants.find(v => v.id === selectedVariantId) 
    : null;

  // Determine current price and stock
  const currentPrice = variant?.price ? Number(variant.price) : product.basePrice;
  const currentStock = variant ? variant.stock : product.stock;

  // Has variants but none selected
  const needsVariantSelection = product.variants.length > 0 && !selectedVariantId;
  const isOutOfStock = currentStock === 0;

  const handleAddToCart = async () => {
    if (needsVariantSelection || isOutOfStock) return;
    
    setAdding(true);
    // TODO: Sepete ekleme mantığı Faz 4.3'te entegre edilecek
    // Örnek simülasyon:
    setTimeout(() => {
      setAdding(false);
      alert(`${product.name} sepete eklendi!`);
    }, 600);
  };

  return (
    <div className={styles.container}>
      <div className={styles.priceArea}>
        <span className={styles.price}>
          {currentPrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
        </span>
        {product.comparePrice && product.comparePrice > currentPrice && (
          <span className={styles.comparePrice}>
            {product.comparePrice.toLocaleString("tr-TR", { style: "currency", currency: "TRY" })}
          </span>
        )}
      </div>

      {product.variants.length > 0 && (
        <div className={styles.variants}>
          <label className={styles.label}>Seçenekler</label>
          <div className={styles.variantList}>
            {product.variants.map(v => (
              <button
                key={v.id}
                onClick={() => {
                  setSelectedVariantId(v.id);
                  setQuantity(1); // Reset quantity when changing variant
                }}
                className={`${styles.variantBtn} ${selectedVariantId === v.id ? styles.variantActive : ""} ${v.stock === 0 ? styles.variantDisabled : ""}`}
                disabled={v.stock === 0}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.stockInfo}>
        {currentStock > 0 ? (
          <span className={styles.inStock}>Stokta: {currentStock} adet</span>
        ) : (
          <span className={styles.outOfStock}>Geçici olarak temin edilemiyor</span>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.quantity}>
          <button 
            type="button" 
            className={styles.qtyBtn} 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isOutOfStock}
          >
            -
          </button>
          <input 
            type="number" 
            className={styles.qtyInput} 
            value={quantity} 
            readOnly
          />
          <button 
            type="button" 
            className={styles.qtyBtn} 
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            disabled={quantity >= currentStock || isOutOfStock}
          >
            +
          </button>
        </div>

        <button
          type="button"
          className={`btn btn-primary ${styles.addBtn}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || needsVariantSelection || adding}
        >
          {adding ? "Ekleniyor..." : isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}
        </button>
      </div>
    </div>
  );
}

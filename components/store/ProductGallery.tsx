"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ProductGallery.module.css";

type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
};

export default function ProductGallery({ images, productName }: { images: ProductImage[], productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={styles.noImage}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      {/* Main Image */}
      <div className={styles.mainImageWrap}>
        <Image 
          src={images[activeIndex].url}
          alt={images[activeIndex].alt || productName}
          fill
          className={styles.mainImage}
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={`${styles.thumbnailBtn} ${idx === activeIndex ? styles.active : ""}`}
              aria-label={`Görsel ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt || `Thumbnail ${idx + 1}`}
                fill
                className={styles.thumbnailImg}
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useTransition } from "react";
import { deleteCategory } from "@/app/admin/categories/actions";
import styles from "../../../app/admin/table.module.css";

export default function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Bu kategoriyi silmek istediğinize emin misiniz? Altındaki ürünler veya alt kategoriler etkilenebilir.")) {
      startTransition(async () => {
        const result = await deleteCategory(id);
        if (result && !result.success) {
          alert(result.message);
        }
      });
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      className={`${styles.btnSmall} ${styles.btnDelete}`}
      disabled={isPending}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
      {isPending ? "..." : "Sil"}
    </button>
  );
}

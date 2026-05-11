"use client";

import { useTransition, useState } from "react";
import { updateSiteSettings } from "@/app/admin/settings/actions";
import type { ThemeSettings } from "@/lib/theme";
import styles from "./SettingsForm.module.css";

export default function ThemeSettingsForm({ theme }: { theme: ThemeSettings }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await updateSiteSettings(formData);
      setMessage({ type: result.success ? "success" : "error", text: result.message });
      if (result.success) {
        setTimeout(() => setMessage(null), 3000);
      }
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {message && (
        <div className={`${styles.alert} ${message.type === "success" ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Ana Renkler</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="primaryColor">Birincil Renk (Primary)</label>
            <input type="color" id="primaryColor" name="primaryColor" defaultValue={theme.primaryColor} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="primaryColorHover">Birincil Renk (Hover)</label>
            <input type="color" id="primaryColorHover" name="primaryColorHover" defaultValue={theme.primaryColorHover} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="secondaryColor">İkincil Renk (Secondary)</label>
            <input type="color" id="secondaryColor" name="secondaryColor" defaultValue={theme.secondaryColor} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="accentColor">Vurgu Rengi (Accent)</label>
            <input type="color" id="accentColor" name="accentColor" defaultValue={theme.accentColor} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Arkaplan ve Metin Renkleri</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="backgroundColor">Ana Arkaplan</label>
            <input type="color" id="backgroundColor" name="backgroundColor" defaultValue={theme.backgroundColor} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="surfaceColor">Yüzey Arkaplanı (Kartlar vb.)</label>
            <input type="color" id="surfaceColor" name="surfaceColor" defaultValue={theme.surfaceColor} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="textColor">Ana Metin Rengi</label>
            <input type="color" id="textColor" name="textColor" defaultValue={theme.textColor} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="textMuted">Soluk Metin Rengi</label>
            <input type="color" id="textMuted" name="textMuted" defaultValue={theme.textMuted} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="borderColor">Kenarlık Rengi (Border)</label>
            <input type="color" id="borderColor" name="borderColor" defaultValue={theme.borderColor} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Üst ve Alt Bilgi (Header & Footer)</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="headerBg">Header Arkaplan</label>
            <input type="color" id="headerBg" name="headerBg" defaultValue={theme.headerBg} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="headerText">Header Metin</label>
            <input type="color" id="headerText" name="headerText" defaultValue={theme.headerText} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="footerBg">Footer Arkaplan</label>
            <input type="color" id="footerBg" name="footerBg" defaultValue={theme.footerBg} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="footerText">Footer Metin</label>
            <input type="color" id="footerText" name="footerText" defaultValue={theme.footerText} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Tipografi ve Diğer</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="fontFamily">Yazı Tipi (Font Family)</label>
            <input type="text" id="fontFamily" name="fontFamily" defaultValue={theme.fontFamily} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="borderRadius">Köşe Yuvarlama (Border Radius)</label>
            <input type="text" id="borderRadius" name="borderRadius" defaultValue={theme.borderRadius} placeholder="0.5rem" />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Temayı Kaydet"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useTransition, useState } from "react";
import { updateSiteSettings } from "@/app/admin/settings/actions";
import type { ThemeSettings } from "@/lib/theme";
import styles from "./SettingsForm.module.css";

export default function GeneralSettingsForm({ theme }: { theme: ThemeSettings }) {
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
    <form className={styles.form} onSubmit={handleSubmit} encType="multipart/form-data">
      {message && (
        <div className={`${styles.alert} ${message.type === "success" ? styles.success : styles.error}`}>
          {message.text}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Logo & Favicon</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="logoFile">Site Logosu (Opsiyonel)</label>
            <input type="file" id="logoFile" name="logoFile" accept="image/*" />
            {theme.logoUrl && (
              <div className={styles.preview}>
                <img src={theme.logoUrl} alt="Logo" height="40" />
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="faviconFile">Favicon (Opsiyonel)</label>
            <input type="file" id="faviconFile" name="faviconFile" accept="image/x-icon,image/png" />
            {theme.faviconUrl && (
              <div className={styles.preview}>
                <img src={theme.faviconUrl} alt="Favicon" height="32" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Marka Bilgileri</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="siteName">Site Adı</label>
            <input type="text" id="siteName" name="siteName" defaultValue={theme.siteName} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="siteSlogan">Slogan</label>
            <input type="text" id="siteSlogan" name="siteSlogan" defaultValue={theme.siteSlogan} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>İletişim</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="contactEmail">E-posta</label>
            <input type="email" id="contactEmail" name="contactEmail" defaultValue={theme.contactEmail} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contactPhone">Telefon</label>
            <input type="text" id="contactPhone" name="contactPhone" defaultValue={theme.contactPhone} />
          </div>
          <div className={`${styles.formGroup} ${styles.fullWidth}`}>
            <label htmlFor="contactAddress">Adres</label>
            <textarea id="contactAddress" name="contactAddress" defaultValue={theme.contactAddress} rows={3} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sosyal Medya</h3>
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="socialInstagram">Instagram Linki</label>
            <input type="url" id="socialInstagram" name="socialInstagram" defaultValue={theme.socialInstagram} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="socialTwitter">Twitter Linki</label>
            <input type="url" id="socialTwitter" name="socialTwitter" defaultValue={theme.socialTwitter} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="socialFacebook">Facebook Linki</label>
            <input type="url" id="socialFacebook" name="socialFacebook" defaultValue={theme.socialFacebook} />
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </button>
      </div>
    </form>
  );
}

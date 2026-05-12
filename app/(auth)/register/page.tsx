"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import styles from "../login/login.module.css";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signUp.email({ 
        email, 
        password, 
        name,
        callbackURL: "/"
      });
      
      if (result.error) {
        setError(result.error.message || "Kayıt sırasında bir hata oluştu.");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>Özmar Market</Link>
          <h1 className={styles.title}>Kayıt Ol</h1>
          <p className={styles.subtitle}>Yeni bir hesap oluşturun</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error} role="alert">{error}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Ad Soyad</label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Adınız Soyadınız"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">E-posta</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="ornek@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Şifre</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="animate-spin" style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} />
                Kaydediliyor...
              </>
            ) : (
              "Kayıt Ol"
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Zaten hesabınız var mı? <Link href="/login" className={styles.link}>Giriş Yap</Link></p>
        </div>
      </div>
    </div>
  );
}

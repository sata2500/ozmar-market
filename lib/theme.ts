import { prisma } from "@/lib/db";
import { cache } from "react";

export type ThemeSettings = {
  // Genel
  siteName: string;
  siteSlogan: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  // Renkler
  primaryColor: string;
  primaryColorHover: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  textMuted: string;
  borderColor: string;
  // Header
  headerBg: string;
  headerText: string;
  // Footer
  footerBg: string;
  footerText: string;
  // Admin
  adminSidebarBg: string;
  adminSidebarText: string;
  adminSidebarAccent: string;
  // Typography
  fontFamily: string;
  borderRadius: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  // Social
  socialInstagram: string;
  socialTwitter: string;
  socialFacebook: string;
  // Shipping
  freeShippingThreshold: number;
  shippingCost: number;
};

export const DEFAULT_THEME: ThemeSettings = {
  siteName: "Özmar Market",
  siteSlogan: "Kaliteli alışverişin adresi",
  logoUrl: null,
  faviconUrl: null,
  primaryColor: "#6366f1",
  primaryColorHover: "#4f46e5",
  secondaryColor: "#f59e0b",
  accentColor: "#10b981",
  backgroundColor: "#0f0f14",
  surfaceColor: "#1a1a24",
  textColor: "#f1f5f9",
  textMuted: "#94a3b8",
  borderColor: "#2d2d3f",
  headerBg: "#0f0f14",
  headerText: "#f1f5f9",
  footerBg: "#0a0a10",
  footerText: "#94a3b8",
  adminSidebarBg: "#0f0f14",
  adminSidebarText: "#94a3b8",
  adminSidebarAccent: "#6366f1",
  fontFamily: "'Inter', sans-serif",
  borderRadius: "0.5rem",
  metaTitle: "Özmar Market — Kaliteli Alışveriş",
  metaDescription:
    "Özmar Market'te yüzlerce ürün arasından seçim yapın. Hızlı kargo, güvenli ödeme.",
  contactEmail: "info@ozmarmarket.com",
  contactPhone: "+90 (555) 000 0000",
  contactAddress: "İstanbul, Türkiye",
  socialInstagram: "",
  socialTwitter: "",
  socialFacebook: "",
  freeShippingThreshold: 500,
  shippingCost: 49.9,
};

// React cache — aynı request içinde tekrar DB sorgusu atmaz
export const getTheme = cache(async (): Promise<ThemeSettings> => {
  try {
    const setting = await prisma.siteSettings.findUnique({
      where: { key: "theme" },
    });
    if (setting?.value) {
      return { ...DEFAULT_THEME, ...(setting.value as Partial<ThemeSettings>) };
    }
  } catch {
    // DB henüz bağlı değilse veya migration çalışmadıysa default döndür
  }
  return DEFAULT_THEME;
});

export function themeToCSS(theme: ThemeSettings): string {
  return `
    --color-primary: ${theme.primaryColor};
    --color-primary-hover: ${theme.primaryColorHover};
    --color-secondary: ${theme.secondaryColor};
    --color-accent: ${theme.accentColor};
    --color-bg: ${theme.backgroundColor};
    --color-surface: ${theme.surfaceColor};
    --color-text: ${theme.textColor};
    --color-text-muted: ${theme.textMuted};
    --color-border: ${theme.borderColor};
    --color-header-bg: ${theme.headerBg};
    --color-header-text: ${theme.headerText};
    --color-footer-bg: ${theme.footerBg};
    --color-footer-text: ${theme.footerText};
    --color-admin-sidebar-bg: ${theme.adminSidebarBg};
    --color-admin-sidebar-text: ${theme.adminSidebarText};
    --color-admin-sidebar-accent: ${theme.adminSidebarAccent};
    --font-family: ${theme.fontFamily};
    --border-radius: ${theme.borderRadius};
  `.trim();
}

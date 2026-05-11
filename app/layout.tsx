import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { getTheme, themeToCSS } from "@/lib/theme";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();

  return {
    title: {
      default: theme.metaTitle,
      template: `%s | ${theme.siteName}`,
    },
    description: theme.metaDescription,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    ),
    openGraph: {
      type: "website",
      siteName: theme.siteName,
      locale: "tr_TR",
    },
    icons: {
      icon: theme.faviconUrl || "/favicon.ico",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getTheme();
  const cssVars = themeToCSS(theme);

  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <style>{`:root { ${cssVars} }`}</style>
      </head>
      <body style={{ fontFamily: theme.fontFamily }}>{children}</body>
    </html>
  );
}

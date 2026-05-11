import type { Metadata } from "next";
import { getTheme } from "@/lib/theme";
import StoreHeader from "@/components/store/StoreHeader";
import StoreFooter from "@/components/store/StoreFooter";

export async function generateMetadata(): Promise<Metadata> {
  const theme = await getTheme();
  return {
    title: theme.metaTitle,
    description: theme.metaDescription,
  };
}

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHeader />
      <main>{children}</main>
      <StoreFooter />
    </>
  );
}

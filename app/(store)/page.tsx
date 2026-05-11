import { prisma } from "@/lib/db";
import HeroSlider from "@/components/store/HeroSlider";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import CategoryGrid from "@/components/store/CategoryGrid";

export const revalidate = 60;

async function getHomeData() {
  try {
    const [sliders, featuredProducts, categories] = await Promise.all([
      prisma.slider.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        take: 8,
        include: {
          images: { orderBy: { sortOrder: "asc" }, take: 1 },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        where: { isActive: true, parentId: null },
        orderBy: { sortOrder: "asc" },
        take: 6,
      }),
    ]);
    return { sliders, featuredProducts, categories };
  } catch {
    return { sliders: [], featuredProducts: [], categories: [] };
  }
}

export default async function HomePage() {
  const { sliders, featuredProducts, categories } = await getHomeData();

  return (
    <>
      <HeroSlider slides={sliders} />
      {categories.length > 0 && <CategoryGrid categories={categories} />}
      {featuredProducts.length > 0 && (
        <FeaturedProducts products={featuredProducts} />
      )}
    </>
  );
}

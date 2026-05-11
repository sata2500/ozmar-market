"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const shortDesc = formData.get("shortDesc") as string;
    const price = parseFloat(formData.get("price") as string);
    const comparePrice = formData.get("comparePrice") ? parseFloat(formData.get("comparePrice") as string) : null;
    const stock = parseInt(formData.get("stock") as string) || 0;
    const categoryId = formData.get("categoryId") as string;
    const isActive = formData.get("isActive") === "on";
    const isFeatured = formData.get("isFeatured") === "on";
    const sku = formData.get("sku") as string || null;

    // TODO: Upload images to Vercel Blob and save as ProductImage
    // TODO: Handle variants

    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc,
        price,
        comparePrice,
        stock,
        categoryId: categoryId || null,
        isActive,
        isFeatured,
        sku,
      },
    });

    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, message: "Ürün oluşturulurken bir hata oluştu." };
  }
  
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });
    
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("Delete product error:", error);
    return { success: false, message: "Ürün silinirken bir hata oluştu." };
  }
}

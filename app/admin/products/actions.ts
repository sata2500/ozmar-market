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

    // Parse Variants
    const variantsData = formData.get("variantsData") as string;
    let variants: any[] = [];
    if (variantsData) {
      try { variants = JSON.parse(variantsData); } catch(e) {}
    }

    const newProduct = await prisma.product.create({
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
        variants: {
          create: variants.map(v => ({
            name: v.name,
            price: v.price ? parseFloat(v.price) : null,
            stock: parseInt(v.stock) || 0,
            sku: v.sku || null,
            options: v.options || {},
          }))
        }
      },
    });

    // Upload Images
    const imageFiles = formData.getAll("images") as File[];
    for (const [index, file] of imageFiles.entries()) {
      if (file.size > 0) {
        const blob = await put(`products/${newProduct.id}/${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
        });
        await prisma.productImage.create({
          data: {
            productId: newProduct.id,
            url: blob.url,
            sortOrder: index,
          }
        });
      }
    }

    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Create product error:", error);
    return { success: false, message: "Ürün oluşturulurken bir hata oluştu." };
  }
  
  redirect("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
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

    // Parse Variants
    const variantsData = formData.get("variantsData") as string;
    let variants: any[] = [];
    if (variantsData) {
      try { variants = JSON.parse(variantsData); } catch(e) {}
    }

    await prisma.product.update({
      where: { id },
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

    // Replace Variants (Simple approach: delete all and recreate)
    // Note: In a real prod app, you might want to update existing variants to keep cart connections
    await prisma.productVariant.deleteMany({ where: { productId: id } });
    if (variants.length > 0) {
      await prisma.productVariant.createMany({
        data: variants.map(v => ({
          productId: id,
          name: v.name,
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock) || 0,
          sku: v.sku || null,
          options: v.options || {},
        }))
      });
    }

    // Upload New Images (Existing images are kept, new ones appended)
    const imageFiles = formData.getAll("images") as File[];
    for (const file of imageFiles) {
      if (file.size > 0) {
        const blob = await put(`products/${id}/${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
        });
        await prisma.productImage.create({
          data: {
            productId: id,
            url: blob.url,
            // Simple sortOrder
            sortOrder: 99,
          }
        });
      }
    }

    revalidatePath("/admin/products");
  } catch (error) {
    console.error("Update product error:", error);
    return { success: false, message: "Ürün güncellenirken bir hata oluştu." };
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

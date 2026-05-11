"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createCategory(formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "on";
    const metaTitle = formData.get("metaTitle") as string;
    const metaDesc = formData.get("metaDesc") as string;
    
    let imageUrl = null;
    const imageFile = formData.get("imageFile") as File;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`categories/${imageFile.name}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
        sortOrder,
        isActive,
        metaTitle,
        metaDesc,
        image: imageUrl,
      },
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Create category error:", error);
    return { success: false, message: "Kategori oluşturulurken bir hata oluştu." };
  }
  
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "on";
    const metaTitle = formData.get("metaTitle") as string;
    const metaDesc = formData.get("metaDesc") as string;

    const dataToUpdate: any = {
      name,
      slug,
      description,
      parentId: parentId || null,
      sortOrder,
      isActive,
      metaTitle,
      metaDesc,
    };

    const imageFile = formData.get("imageFile") as File;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`categories/${imageFile.name}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      dataToUpdate.image = blob.url;
    }

    await prisma.category.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/categories");
  } catch (error) {
    console.error("Update category error:", error);
    return { success: false, message: "Kategori güncellenirken bir hata oluştu." };
  }
  
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  try {
    // Alt kategorileri kontrol et veya null yap vs. Schema'ya göre değişir
    await prisma.category.delete({
      where: { id },
    });
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return { success: false, message: "Kategori silinirken bir hata oluştu." };
  }
}

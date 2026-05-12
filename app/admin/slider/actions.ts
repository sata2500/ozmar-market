"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";

export async function createSlider(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonStyle = formData.get("buttonStyle") as string;
    const textAlign = formData.get("textAlign") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "on";
    
    const imageFile = formData.get("imageFile") as File;
    const mobileImageFile = formData.get("mobileImageFile") as File | null;

    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`sliders/desktop-${imageFile.name}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      imageUrl = blob.url;
    }

    let mobileImageUrl = null;
    if (mobileImageFile && mobileImageFile.size > 0) {
      const blob = await put(`sliders/mobile-${mobileImageFile.name}`, mobileImageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      mobileImageUrl = blob.url;
    }

    await prisma.slider.create({
      data: {
        title,
        subtitle,
        description,
        link,
        buttonText,
        buttonStyle,
        textAlign,
        sortOrder,
        isActive,
        image: imageUrl,
        mobileImage: mobileImageUrl,
      },
    });

    revalidatePath("/admin/slider");
    revalidatePath("/");
  } catch (error) {
    console.error("Create slider error:", error);
    return { success: false, message: "Slayt oluşturulurken bir hata oluştu." };
  }
  
  redirect("/admin/slider");
}

export async function updateSlider(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonStyle = formData.get("buttonStyle") as string;
    const textAlign = formData.get("textAlign") as string;
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
    const isActive = formData.get("isActive") === "on";
    
    const dataToUpdate: any = {
      title,
      subtitle,
      description,
      link,
      buttonText,
      buttonStyle,
      textAlign,
      sortOrder,
      isActive,
    };

    const imageFile = formData.get("imageFile") as File;
    if (imageFile && imageFile.size > 0) {
      const blob = await put(`sliders/desktop-${imageFile.name}`, imageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      dataToUpdate.image = blob.url;
    }

    const mobileImageFile = formData.get("mobileImageFile") as File;
    if (mobileImageFile && mobileImageFile.size > 0) {
      const blob = await put(`sliders/mobile-${mobileImageFile.name}`, mobileImageFile, {
        access: "public",
        addRandomSuffix: true,
      });
      dataToUpdate.mobileImage = blob.url;
    }

    await prisma.slider.update({
      where: { id },
      data: dataToUpdate,
    });

    revalidatePath("/admin/slider");
    revalidatePath("/");
  } catch (error) {
    console.error("Update slider error:", error);
    return { success: false, message: "Slayt güncellenirken bir hata oluştu." };
  }
  
  redirect("/admin/slider");
}

export async function deleteSlider(id: string) {
  try {
    await prisma.slider.delete({
      where: { id },
    });
    
    revalidatePath("/admin/slider");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete slider error:", error);
    return { success: false, message: "Slayt silinirken bir hata oluştu." };
  }
}

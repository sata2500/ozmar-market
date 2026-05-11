"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";

export async function updateSiteSettings(formData: FormData) {
  try {
    const data: Record<string, any> = {};
    
    // Process form fields manually to handle files and strings
    for (const [key, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        // Upload to Vercel Blob
        const blob = await put(value.name, value, {
          access: "public",
          addRandomSuffix: true,
        });
        
        // Convert input name 'logoFile' to 'logoUrl' etc.
        if (key === "logoFile") data["logoUrl"] = blob.url;
        if (key === "faviconFile") data["faviconUrl"] = blob.url;
      } else if (typeof value === "string") {
        data[key] = value;
      }
    }
    
    // Convert numeric fields
    if (data.freeShippingThreshold) data.freeShippingThreshold = Number(data.freeShippingThreshold);
    if (data.shippingCost) data.shippingCost = Number(data.shippingCost);

    // Get current settings first
    const current = await prisma.siteSettings.findUnique({
      where: { key: "theme" },
    });
    
    const currentTheme = (current?.value as Record<string, any>) || {};
    
    // Merge updates
    const updatedTheme = { ...currentTheme, ...data };

    await prisma.siteSettings.upsert({
      where: { key: "theme" },
      update: { value: updatedTheme },
      create: { key: "theme", value: updatedTheme },
    });

    revalidatePath("/", "layout"); // Revalidate entire app to apply theme/settings
    
    return { success: true, message: "Ayarlar başarıyla güncellendi." };
  } catch (error) {
    console.error("Settings update error:", error);
    return { success: false, message: "Ayarlar güncellenirken bir hata oluştu." };
  }
}

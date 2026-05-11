import { z } from "zod";

// ─── Product ─────────────────────────────────
export const ProductSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug sadece küçük harf, rakam ve - içerebilir"),
  description: z.string().optional(),
  shortDesc: z.string().max(200).optional(),
  price: z.number().positive("Fiyat pozitif olmalı"),
  comparePrice: z.number().positive().optional(),
  costPrice: z.number().positive().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  stock: z.number().int().min(0),
  lowStockAt: z.number().int().min(0).default(5),
  trackStock: z.boolean().default(true),
  weight: z.number().positive().optional(),
  categoryId: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
  metaKeywords: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type ProductInput = z.infer<typeof ProductSchema>;

// ─── Category ────────────────────────────────
export const CategorySchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  image: z.string().url().optional(),
  parentId: z.string().optional(),
  isActive: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  metaTitle: z.string().max(60).optional(),
  metaDesc: z.string().max(160).optional(),
});

export type CategoryInput = z.infer<typeof CategorySchema>;

// ─── Slider ──────────────────────────────────
export const SliderSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  image: z.string().url("Geçerli bir görsel URL'si giriniz"),
  mobileImage: z.string().url().optional(),
  link: z.string().optional(),
  buttonText: z.string().optional(),
  buttonStyle: z.enum(["primary", "secondary", "outline", "ghost"]).default("primary"),
  textAlign: z.enum(["left", "center", "right"]).default("left"),
  textColor: z.string().default("#ffffff"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type SliderInput = z.infer<typeof SliderSchema>;

// ─── Coupon ──────────────────────────────────
export const CouponSchema = z.object({
  code: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[A-Z0-9-]+$/, "Kupon kodu büyük harf ve rakam içerebilir"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.number().positive(),
  minOrder: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional(),
});

export type CouponInput = z.infer<typeof CouponSchema>;

// ─── Address ─────────────────────────────────
export const AddressSchema = z.object({
  title: z.string().min(2),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z
    .string()
    .regex(/^[0-9+\s-]{10,15}$/, "Geçerli bir telefon numarası girin"),
  address: z.string().min(10),
  city: z.string().min(2),
  district: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default("TR"),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof AddressSchema>;

// ─── Auth ────────────────────────────────────
export const LoginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta girin"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
});

export const RegisterSchema = z
  .object({
    name: z.string().min(2, "Ad en az 2 karakter olmalı"),
    email: z.string().email("Geçerli bir e-posta girin"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalı"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

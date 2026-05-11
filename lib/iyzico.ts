import Iyzipay from "iyzipay";

// Iyzico (iyzipay) ayarları
// Gerçek ortamda Vercel environment variable'larından alınacak.
export const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY || "sandbox-api-key",
  secretKey: process.env.IYZICO_SECRET_KEY || "sandbox-secret-key",
  uri: process.env.IYZICO_URI || "https://sandbox-api.iyzipay.com",
});

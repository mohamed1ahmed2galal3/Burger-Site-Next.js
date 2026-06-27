// سكريبت تعبية المينيو الحقيقي بتاع Last Burger
// بيمسح أي منتجات قديمة (تجريبية) ويضيف المينيو ده بالكامل
//
// طريقة التشغيل:
//   npm run seed

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    image: String,
    category: { type: String, enum: ["chicken", "beef", "addons"] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

// صور مؤقتة (placeholder) — الأدمن يقدر يغيّرها لاحقًا برفع صور حقيقية من Dashboard
const IMG_CHICKEN = "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800";
const IMG_BEEF = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800";
const IMG_ADDON = "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800";

// الأصناف الأساسية (برجر) — هتتعمل نسخة دجاج ونسخة بيف لكل واحدة، وكل واحدة بحجمين (سنجل / دابل)
const burgerItems = [
  {
    name: "كلاسيك",
    extra: "",
    single: 90,
    double: 130,
    featured: true,
  },
  {
    name: "هامر",
    extra: "اتنين موتزريلا استيك + ",
    single: 105,
    double: 145,
  },
  {
    name: "فاير لاست",
    extra: "اتنين موتزريلا استيك + هوت صوص + هالبينو + ",
    single: 115,
    double: 155,
    featured: true,
  },
  {
    name: "جوسي بوم",
    extra: "اتنين موتزريلا استيك + اتشيز بوم + شيدر + ",
    single: 140,
    double: 180,
  },
  {
    name: "اسموك لاست",
    extra: "اتنين موتزريلا استيك + تركي + شيدر + ",
    single: 125,
    double: 165,
  },
];

const baseDesc = (protein, extra) =>
  `${protein} + بطاطس + بيج تستي + ${extra}كاتشب + باربيكيو + كابوتشا + طماطم + خيار مخلل`;

const products = [];

for (const item of burgerItems) {
  // نسخة الدجاج (سنجل + دابل)
  products.push({
    name: `${item.name} (دجاج - سنجل)`,
    description: baseDesc("صدور فراخ كريسبي", item.extra),
    price: item.single,
    image: IMG_CHICKEN,
    category: "chicken",
    featured: item.featured || false,
  });
  products.push({
    name: `${item.name} (دجاج - دابل)`,
    description: baseDesc("صدور فراخ كريسبي", item.extra),
    price: item.double,
    image: IMG_CHICKEN,
    category: "chicken",
    featured: item.featured || false,
  });

  // نسخة البيف (سنجل + دابل)
  products.push({
    name: `${item.name} (بيف - سنجل)`,
    description: baseDesc("قطعة برجر محشية جبن مكس خطير", item.extra),
    price: item.single,
    image: IMG_BEEF,
    category: "beef",
    featured: item.featured || false,
  });
  products.push({
    name: `${item.name} (بيف - دابل)`,
    description: baseDesc("قطعة برجر محشية جبن مكس خطير", item.extra),
    price: item.double,
    image: IMG_BEEF,
    category: "beef",
    featured: item.featured || false,
  });
}

// الإضافات (Add-ons)
const addons = [
  { name: "فرايز شيدر هالبينو صوصات", price: 55 },
  { name: "فرايز جبنة", price: 45 },
  { name: "موتزريلا استيك", price: 15 },
  { name: "اتشيز بوم", price: 30 },
  { name: "إضافة بيف", price: 40 },
  { name: "إضافة تشكن", price: 40 },
  { name: "كاب شيدر", price: 10 },
  { name: "كاب باربيكيو", price: 10 },
  { name: "كاب كاتشب", price: 10 },
  { name: "كاب تيستي", price: 10 },
  { name: "كاب هالبينو", price: 10 },
];

for (const addon of addons) {
  products.push({
    name: addon.name,
    description: "إضافة لطلبك",
    price: addon.price,
    image: IMG_ADDON,
    category: "addons",
    featured: false,
  });
}

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error("❌ مفيش MONGO_URI في .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ اتصل بقاعدة البيانات");

  const deleted = await Product.deleteMany({});
  console.log(`🗑️  تم مسح ${deleted.deletedCount} منتج قديم`);

  const inserted = await Product.insertMany(products);
  console.log(`✅ تم إضافة ${inserted.length} منتج جديد (المينيو الحقيقي)`);

  await mongoose.disconnect();
  console.log("🎉 خلصنا!");
}

seed().catch((err) => {
  console.error("❌ حصل خطأ:", err.message);
  process.exit(1);
});

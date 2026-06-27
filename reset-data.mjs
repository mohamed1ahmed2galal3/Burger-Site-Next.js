// سكريبت تنظيف — بيمسح كل الأوردرات وكل حسابات الأدمن
// عشان الموقع يبدأ من الصفر (المنتجات مش بتتأثر خالص)
//
// طريقة التشغيل:
//   npm run reset

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const orderSchema = new mongoose.Schema({}, { strict: false });
const adminSchema = new mongoose.Schema({}, { strict: false });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function reset() {
  if (!process.env.MONGO_URI) {
    console.error("❌ مفيش MONGO_URI في .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ اتصل بقاعدة البيانات");

  const deletedOrders = await Order.deleteMany({});
  console.log(`🗑️  تم مسح ${deletedOrders.deletedCount} أوردر`);

  const deletedAdmins = await Admin.deleteMany({});
  console.log(`🗑️  تم مسح ${deletedAdmins.deletedCount} حساب أدمن`);

  console.log("ℹ️  المنتجات لم تتأثر خالص.");

  await mongoose.disconnect();
  console.log("🎉 الموقع بقى نضيف وجاهز يبدأ من الصفر!");
  console.log("⚠️  لازم تعمل حساب أدمن جديد من صفحة الـ setup قبل ما تستخدم لوحة التحكم.");
}

reset().catch((err) => {
  console.error("❌ حصل خطأ:", err.message);
  process.exit(1);
});

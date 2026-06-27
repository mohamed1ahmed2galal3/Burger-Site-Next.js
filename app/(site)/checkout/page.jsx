"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MapPin, Phone, User, CreditCard, Wallet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api/orders.js";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    altPhone: "",
    address: "",
    payment: "cash",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!form.phone.trim()) newErrors.phone = "رقم التليفون مطلوب";
    else if (!/^01[0-9]{9}$/.test(form.phone)) newErrors.phone = "رقم غير صحيح";
    if (form.altPhone.trim() && !/^01[0-9]{9}$/.test(form.altPhone)) {
      newErrors.altPhone = "رقم غير صحيح";
    }
    if (!form.address.trim()) newErrors.address = "العنوان مطلوب";
    return newErrors;
  }

  function handleSubmit() {
    if (cartItems.length === 0) return;
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    const orderData = {
      customerName: form.name,
      phone: form.phone,
      altPhone: form.altPhone,
      address: form.address,
      paymentMethod: form.payment,
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
    };
    createOrder(orderData)
      .then((res) => {
        setOrderNumber(res.data._id);
        setSubmitted(true);
        clearCart();
      })
      .catch(() => toast.error("في مشكلة، حاول تاني"))
      .finally(() => setLoading(false));
  }

  if (submitted) {
    return (
      <motion.div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-12 max-w-md w-full">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
          >
            <CheckCircle className="text-green-400 mx-auto mb-6" size={64} />
          </motion.div>
          <motion.h2
            className="text-3xl font-black text-white mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            تم الطلب! 🎉
          </motion.h2>
          <motion.p
            className="text-zinc-400 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            طلبك اتسجل وبيتجهز دلوقتي
          </motion.p>
          <motion.div
            className="bg-zinc-900 rounded-2xl p-4 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-zinc-400 text-sm mb-2">رقم طلبك — محتاجه للتتبع</p>
            <p className="text-orange-400 font-black text-lg break-all">{orderNumber}</p>
          </motion.div>
          <motion.p
            className="text-zinc-500 text-sm mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            انسخ الرقم ده عشان تتابع طلبك
          </motion.p>
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                navigator.clipboard.writeText(orderNumber);
                toast.success("اتنسخ! 📋");
              }}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-medium py-3 rounded-full transition-colors"
            >
              انسخ رقم الطلب 📋
            </motion.button>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/track"
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-full transition-colors text-center block"
              >
                تتبع طلبك
              </Link>
            </motion.div>
            <button
              onClick={() => router.push("/")}
              className="w-full text-zinc-400 hover:text-white text-sm py-2 transition-colors"
            >
              ارجع للهوم
            </button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (cartItems.length === 0) {
    router.push("/menu");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.h1
        className="text-3xl font-black text-white mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        إتمام الطلب
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div className="lg:col-span-2 flex flex-col gap-5" initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp}>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <User size={15} /> الاسم
            </label>
            <input
              type="text"
              placeholder="اسمك الكامل"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full bg-zinc-900 border rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition-colors text-right ${
                errors.name ? "border-red-500" : "border-zinc-800 focus:border-orange-500"
              }`}
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <Phone size={15} /> رقم التليفون
            </label>
            <input
              type="tel"
              placeholder="01XXXXXXXXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full bg-zinc-900 border rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition-colors text-right ${
                errors.phone ? "border-red-500" : "border-zinc-800 focus:border-orange-500"
              }`}
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.phone}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <Phone size={15} /> رقم بديل (اختياري)
            </label>
            <input
              type="tel"
              placeholder="رقم تليفون شخص تاني تقدر نوصله لو حصلت مشكلة"
              value={form.altPhone}
              onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
              className={`w-full bg-zinc-900 border rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition-colors text-right ${
                errors.altPhone ? "border-red-500" : "border-zinc-800 focus:border-orange-500"
              }`}
            />
            <AnimatePresence>
              {errors.altPhone && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.altPhone}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <MapPin size={15} /> العنوان
            </label>
            <textarea
              placeholder="العنوان بالتفصيل..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              rows={3}
              className={`w-full bg-zinc-900 border rounded-xl py-3 px-4 text-white placeholder-zinc-600 focus:outline-none transition-colors text-right resize-none ${
                errors.address ? "border-red-500" : "border-zinc-800 focus:border-orange-500"
              }`}
            />
            <AnimatePresence>
              {errors.address && (
                <motion.p
                  className="text-red-400 text-sm mt-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {errors.address}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp}>
            <label className="text-zinc-400 text-sm mb-3 flex items-center gap-2">
              <CreditCard size={15} /> طريقة الدفع
            </label>
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ ...form, payment: "cash" })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium transition-colors ${
                  form.payment === "cash"
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <Wallet size={18} />
                كاش عند الاستلام
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setForm({ ...form, payment: "online" })}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-medium transition-colors ${
                  form.payment === "online"
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-zinc-800 text-zinc-400 hover:border-zinc-700"
                }`}
              >
                <CreditCard size={18} />
                دفع أونلاين
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-white font-bold text-lg mb-5">ملخص الطلب</h2>

            <div className="flex flex-col gap-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-zinc-400">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="text-white">{item.price * item.quantity} جنيه</span>
                </div>
              ))}
            </div>

            <div className="border-t border-zinc-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-white font-bold">الإجمالي</span>
                <span className="text-orange-400 font-black text-xl">{totalPrice} جنيه</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 rounded-full transition-colors text-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "تأكيد الطلب 🍔"
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Checkout;

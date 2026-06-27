"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, UserPlus, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api/axios.js";

function AdminRegisterContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const key = searchParams.get("key");

  // الصفحة مش بتشتغل من غير المفتاح ده في الرابط: ?key=...
  const authorized = key === process.env.NEXT_PUBLIC_SETUP_KEY;

  if (!authorized) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <motion.div
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ShieldAlert className="text-red-400 mx-auto mb-4" size={40} />
          <h1 className="text-white font-bold text-lg mb-2">الصفحة دي محمية</h1>
          <p className="text-zinc-500 text-sm">لازم مفتاح صحيح في الرابط للوصول هنا</p>
        </motion.div>
      </div>
    );
  }

  function handleSubmit() {
    if (!email || !password) {
      setError("ادخل الإيميل والباسورد");
      return;
    }
    if (password.length < 6) {
      setError("الباسورد لازم يكون 6 حروف على الأقل");
      return;
    }
    setLoading(true);
    setError("");
    api
      .post("/auth/register", { email, password })
      .then((res) => {
        localStorage.setItem("adminToken", res.data.token);
        setSuccess(true);
        setTimeout(() => router.push("/admin/dashboard"), 1200);
      })
      .catch((err) => setError(err.response?.data?.message || "حصل خطأ"))
      .finally(() => setLoading(false));
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <motion.div
        className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-2 text-orange-400 mb-4">
            <img src="/logo.png" alt="Last Burger" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-2xl tracking-wide" style={{ fontFamily: "'Bangers', cursive" }}>LAST BURGER</span>
          </div>
          <h1 className="text-white font-bold text-xl">إنشاء حساب أدمن جديد</h1>
          <p className="text-zinc-500 text-sm mt-1">للتجربة فقط — هتستخدمه بعد كده لتسجيل الدخول</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-6 text-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              تم إنشاء الحساب! بيتم تحويلك...
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <Mail size={14} /> الإيميل
            </label>
            <input
              type="email"
              placeholder="admin@burger.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors text-right"
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm mb-2 flex items-center gap-2">
              <Lock size={14} /> الباسورد
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors text-right"
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading || success}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={18} />
                إنشاء الحساب
              </>
            )}
          </motion.button>

          <Link
            href="/admin"
            className="text-center text-zinc-500 hover:text-zinc-300 text-sm mt-2 transition-colors"
          >
            عندك حساب؟ سجل دخولك
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function AdminRegister() {
  return (
    <Suspense fallback={null}>
      <AdminRegisterContent />
    </Suspense>
  );
}

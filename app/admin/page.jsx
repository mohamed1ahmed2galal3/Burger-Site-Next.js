"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginAdmin } from "@/lib/api/admin.js";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit() {
    if (!email || !password) {
      setError("ادخل الإيميل والباسورد");
      return;
    }
    setLoading(true);
    setError("");
    loginAdmin(email, password)
      .then((res) => {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin/dashboard");
      })
      .catch(() => setError("بيانات غلط"))
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
          <motion.div
            className="flex items-center justify-center gap-2 text-orange-400 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          >
            <img src="/logo.png" alt="Last Burger" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-2xl tracking-wide" style={{ fontFamily: "'Bangers', cursive" }}>LAST BURGER</span>
          </motion.div>
          <h1 className="text-white font-bold text-xl">لوحة التحكم</h1>
          <p className="text-zinc-500 text-sm mt-1">سجل دخولك للمتابعة</p>
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
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors mt-2 flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "دخول"
            )}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminLogin;

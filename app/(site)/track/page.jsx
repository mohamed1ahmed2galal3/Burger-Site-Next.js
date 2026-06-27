"use client";

import { useState } from "react";
import { Search, Package, Clock, Truck, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { trackOrder } from "@/lib/api/orders.js";

const steps = [
  { key: "pending", label: "قيد الانتظار", icon: <Clock size={20} /> },
  { key: "preparing", label: "جاري التحضير", icon: <Package size={20} /> },
  { key: "out_for_delivery", label: "خرج للتوصيل", icon: <Truck size={20} /> },
  { key: "delivered", label: "تم التوصيل", icon: <CheckCircle size={20} /> },
];

function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTrack() {
    if (!orderId.trim()) {
      setError("ادخل رقم الأوردر");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    trackOrder(orderId.trim())
      .then((res) => setOrder(res.data))
      .catch(() => setError("الأوردر ده مش موجود، تأكد من الرقم"))
      .finally(() => setLoading(false));
  }

  const currentStep = steps.findIndex((s) => s.key === order?.status);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-black text-white mb-3">تتبع طلبك 📦</h1>
        <p className="text-zinc-400">ادخل رقم الأوردر اللي جالك وهتعرف فين طلبك</p>
      </motion.div>

      {/* Search */}
      <motion.div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="ادخل رقم الأوردر..."
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTrack()}
            className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-600 rounded-xl py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors text-right"
          />
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleTrack}
            disabled={loading}
            className="flex-shrink-0 bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={18} />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              className="text-red-400 text-sm mt-3 flex items-center gap-2"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <XCircle size={16} />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Order Result */}
      <AnimatePresence>
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
          >
            {/* Order Info */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-zinc-500 text-sm mb-1">اسم العميل</p>
                  <p className="text-white font-bold text-lg">{order.customerName}</p>
                  {order.altPhone && (
                    <p className="text-zinc-500 text-sm mt-1">رقم بديل: {order.altPhone}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-zinc-500 text-sm mb-1">الإجمالي</p>
                  <p className="text-orange-400 font-black text-xl">{order.totalPrice} جنيه</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {order.items.map((item, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-zinc-800 text-zinc-300 text-xs px-3 py-1 rounded-full"
                  >
                    {item.name} × {item.quantity}
                  </motion.span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">{order.address}</span>
                <span className="text-zinc-500">{new Date(order.createdAt).toLocaleDateString("ar-EG")}</span>
              </div>
            </motion.div>

            {/* Status Steps */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white font-bold mb-6">حالة الطلب</h3>
              <div className="flex flex-col gap-1">
                {steps.map((step, i) => {
                  const isDone = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <div key={step.key}>
                      <motion.div
                        className="flex items-center gap-4 py-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            isCurrent
                              ? "bg-orange-500 text-white"
                              : isDone
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-zinc-800 text-zinc-600"
                          }`}
                          animate={isCurrent ? { scale: [1, 1.1, 1] } : {}}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          {step.icon}
                        </motion.div>

                        <div className="flex-1">
                          <p
                            className={`font-medium ${
                              isCurrent ? "text-orange-400" : isDone ? "text-green-400" : "text-zinc-600"
                            }`}
                          >
                            {step.label}
                          </p>
                        </div>

                        {isCurrent && (
                          <motion.span
                            className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-1 rounded-full"
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                          >
                            الحالة الحالية
                          </motion.span>
                        )}

                        {isDone && !isCurrent && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <CheckCircle size={18} className="text-green-400" />
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Connector Line */}
                      {i < steps.length - 1 && <div className="ml-5 w-0.5 h-4 bg-zinc-800 rounded-full" />}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TrackOrder;

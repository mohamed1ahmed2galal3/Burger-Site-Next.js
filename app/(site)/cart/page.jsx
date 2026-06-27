"use client";

import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (cartItems.length === 0) {
    return (
      <motion.div
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.p
          className="text-6xl mb-6"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
        >
          🛒
        </motion.p>
        <h2 className="text-2xl font-bold text-white mb-3">السلة فاضية!</h2>
        <p className="text-zinc-400 mb-8">روح اختار من المنيو وارجع هنا</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2"
          >
            روح المنيو
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.h1
        className="text-3xl font-black text-white mb-8 flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ShoppingBag className="text-orange-400" size={32} />
        سلة المشتريات
      </motion.h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold mb-1 truncate">{item.name}</h3>
                    <p className="text-orange-400 font-black">{item.price} جنيه</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => removeFromCart(item.productId)}
                    className="text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0 sm:hidden"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Minus size={14} />
                    </motion.button>
                    <motion.span
                      key={item.quantity}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-white font-bold w-6 text-center"
                    >
                      {item.quantity}
                    </motion.span>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-colors flex-shrink-0"
                    >
                      <Plus size={14} />
                    </motion.button>
                  </div>

                  <div className="text-right min-w-[70px]">
                    <motion.p
                      key={item.quantity}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    className="text-white font-black"
                  >
                    {item.price * item.quantity} جنيه
                  </motion.p>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => removeFromCart(item.productId)}
                  className="hidden sm:block text-zinc-600 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <Trash2 size={18} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-white font-bold text-lg mb-6">ملخص الطلب</h2>

            <div className="flex flex-col gap-3 mb-6">
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
                <motion.span
                  key={totalPrice}
                  initial={{ scale: 1.2, color: "#f97316" }}
                  animate={{ scale: 1, color: "#f97316" }}
                  className="text-orange-400 font-black text-xl"
                >
                  {totalPrice} جنيه
                </motion.span>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/checkout"
                className="w-full bg-orange-500 hover:bg-orange-400 text-white font-bold py-4 rounded-full transition-colors flex items-center justify-center gap-2 text-lg"
              >
                إتمام الطلب
                <ArrowRight size={20} />
              </Link>
            </motion.div>

            <Link
              href="/menu"
              className="w-full mt-3 text-zinc-400 hover:text-white text-sm font-medium py-2 flex items-center justify-center gap-2 transition-colors"
            >
              + اضف المزيد
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Cart;

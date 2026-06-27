"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, ShoppingCart, Star, CheckCircle, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { getProductById } from "@/lib/api/products.js";
import { useCart } from "@/context/CartContext";

const categoryLabels = {
  chicken: "🍗 تشكن",
  beef: "🥩 بيف",
  addons: "➕ إضافات",
};

function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch(() => router.push("/menu"))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Back Button */}
      <motion.button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ x: -4 }}
      >
        <ArrowRight size={18} className="rotate-180" />
        <span className="text-sm font-medium">رجوع</span>
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          className="relative rounded-3xl overflow-hidden h-80 lg:h-full min-h-[320px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.7 }}
          />
          {product.featured && (
            <motion.div
              className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              ⭐ الأكثر طلباً
            </motion.div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.span
            className="text-sm text-orange-400 font-medium mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {categoryLabels[product.category]}
          </motion.span>

          <motion.h1
            className="text-4xl font-black text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            {product.name}
          </motion.h1>

          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
            ))}
            <span className="text-zinc-400 text-sm mr-1">4.9 (120+ تقييم)</span>
          </motion.div>

          <motion.p
            className="text-zinc-400 leading-relaxed mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
          >
            {product.description}
          </motion.p>

          <motion.div
            className="flex items-center gap-3 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-orange-400 font-black text-4xl">{product.price * quantity}</span>
            <span className="text-orange-400 font-black text-2xl">جنيه</span>
            {quantity > 1 && (
              <span className="text-zinc-500 text-sm">
                ({product.price} × {quantity})
              </span>
            )}
          </motion.div>

          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            <span className="text-zinc-400 text-sm font-medium">الكمية:</span>
            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <Minus size={16} />
              </motion.button>
              <motion.span
                key={quantity}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-white font-bold w-6 text-center"
              >
                {quantity}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setQuantity((q) => q + 1)}
                className="text-white hover:text-orange-400 transition-colors"
              >
                <Plus size={16} />
              </motion.button>
            </div>
          </motion.div>

          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
              added ? "bg-green-500 text-white" : "bg-orange-500 hover:bg-orange-400 text-white"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {added ? (
              <>
                <CheckCircle size={22} />
                اتضاف للسلة!
              </>
            ) : (
              <>
                <ShoppingCart size={22} />
                اضف للسلة — {product.price * quantity} جنيه
              </>
            )}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetails;

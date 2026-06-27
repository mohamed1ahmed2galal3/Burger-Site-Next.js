"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getProducts } from "@/lib/api/products.js";
import { categories } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setLoading(true);
    const category = activeCategory === "all" ? null : activeCategory;
    getProducts(category)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleAdd(product) {
    addToCart(product);
    setAddedId(product._id);
    setTimeout(() => setAddedId(null), 1500);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black text-white mb-3">🍔 المنيو</h1>
        <p className="text-zinc-400">اختار اللي يعجبك واطلبه دلوقتي</p>
      </motion.div>

      <motion.div
        className="relative max-w-md mx-auto mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="ابحث عن أي حاجة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 rounded-full py-3 pr-12 pl-5 focus:outline-none focus:border-orange-500 transition-colors text-right"
        />
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-3 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            whileTap={{ scale: 0.95 }}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.id
                ? "bg-orange-500 text-white"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-orange-500/50 hover:text-white"
            }`}
          >
            {cat.label}
          </motion.button>
        ))}
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">جاري التحميل...</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div className="text-center py-20 text-zinc-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg">مفيش نتائج للبحث ده</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {filtered.map((product) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors duration-300"
              >
                <Link href={`/product/${product._id}`}>
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>
                <div className="p-5">
                  <Link href={`/product/${product._id}`}>
                    <h3 className="text-white font-bold text-lg mb-1 hover:text-orange-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-black text-xl">{product.price} جنيه</span>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleAdd(product)}
                      className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 ${
                        addedId === product._id
                          ? "bg-green-500 text-white"
                          : "bg-orange-500 hover:bg-orange-400 text-white"
                      }`}
                    >
                      {addedId === product._id ? (
                        <>
                          <CheckCircle size={15} />
                          اتضاف!
                        </>
                      ) : (
                        "+ اضف للسلة"
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default Menu;

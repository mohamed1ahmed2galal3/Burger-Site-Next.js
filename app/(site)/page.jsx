"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getProducts } from "@/lib/api/products.js";
import { offers } from "@/data/products";
import { useCart } from "@/context/CartContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

function Home() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((res) => setFeatured(res.data.filter((p) => p.featured)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source
            src="https://videos.pexels.com/video-files/8880955/8880955-uhd_2732_1440_25fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/70" />

        <motion.div
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.span
            variants={fadeUp}
            className="inline-block bg-orange-500/20 text-orange-400 text-sm font-medium px-4 py-1.5 rounded-full mb-6 border border-orange-500/30"
          >
            🔥 أحسن برجر في المدينة
          </motion.span>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            الجوع ده
            <span className="text-orange-400"> كلامه</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-zinc-300 text-lg md:text-xl mb-10 max-w-xl mx-auto">
            برجر طازج يتعمل أمامك، من أجود الخامات، يوصلك ساخن في أسرع وقت
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full text-lg transition-colors flex items-center justify-center gap-2"
            >
              اطلب دلوقتي
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/offers"
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full text-lg transition-colors border border-white/20"
            >
              شوف العروض
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Burgers */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-20">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">⭐ الأكثر طلباً</h2>
            <p className="text-zinc-400">اختارات عملاؤنا المفضلة</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {featured.map((product) => (
              <motion.div
                key={product._id}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-colors duration-300"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white font-bold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <Star size={14} fill="currentColor" />
                      <span>4.9</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4 leading-relaxed">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-black text-xl">{product.price} جنيه</span>
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      onClick={() => addToCart(product)}
                      className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
                    >
                      اضف للسلة
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center mt-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/menu"
              className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-2 justify-center transition-colors"
            >
              شوف المنيو كامل
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </section>
      )}

      {/* Offers Section */}
      <section className="bg-zinc-900 border-t border-b border-zinc-800 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              <Zap className="inline text-orange-400 mb-1" size={36} /> عروض حصرية
            </h2>
            <p className="text-zinc-400">للطلبات أونلاين بس</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {offers.map((offer) => (
              <motion.div
                key={offer.id}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 hover:border-orange-500/40 transition-colors"
              >
                <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  {offer.badge}
                </span>
                <h3 className="text-white font-bold text-lg mb-2">{offer.title}</h3>
                <p className="text-zinc-400 text-sm">{offer.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      <motion.section
        className="text-center py-20 px-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-black text-white mb-4">جاهز تطلب؟</h2>
        <p className="text-zinc-400 mb-8">التوصيل سريع والأكل أسرع 🚀</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-full text-lg transition-colors inline-flex items-center gap-2"
          >
            اطلب دلوقتي
            <ArrowRight size={20} />
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
}

export default Home;

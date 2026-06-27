"use client";

import Link from "next/link";
import { ArrowRight, Zap, Tag, Gift } from "lucide-react";
import { motion } from "framer-motion";

const details = [
  {
    icon: <Gift size={28} className="text-orange-400" />,
    title: "بطاطس مجانية",
    description: "مع أول طلب أونلاين ليك، بطاطس كريسبي مجانية",
    badge: "جديد",
    condition: "للعملاء الجدد فقط",
  },
  {
    icon: <Tag size={28} className="text-orange-400" />,
    title: "خصم 10% دايم",
    description: "كل أوردر عبر الموقع بياخد خصم 10% تلقائي",
    badge: "10%",
    condition: "على كل الطلبات",
  },
  {
    icon: <Zap size={28} className="text-orange-400" />,
    title: "اشتري 1 هدية 1",
    description: "كل يوم جمعة على البرجر الكلاسيك — اشتري واحد وهدية واحد",
    badge: "BOGO",
    condition: "كل يوم جمعة بس",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

function Offers() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">🔥 العروض الحصرية</h1>
        <p className="text-zinc-400 text-lg">عروض بتتجدد — للطلبات أونلاين بس</p>
      </motion.div>

      <motion.div className="flex flex-col gap-6 mb-14" initial="hidden" animate="visible" variants={stagger}>
        {details.map((offer, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ x: 6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-7 flex flex-col sm:flex-row items-start gap-5 hover:border-orange-500/40 transition-colors"
          >
            <motion.div
              className="bg-orange-500/10 p-4 rounded-2xl"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              {offer.icon}
            </motion.div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-white font-black text-xl">{offer.title}</h3>
                <motion.span
                  className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                >
                  {offer.badge}
                </motion.span>
              </div>
              <p className="text-zinc-400 mb-2">{offer.description}</p>
              <p className="text-zinc-600 text-sm">* {offer.condition}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white font-black text-2xl mb-3">استفد من العروض دلوقتي</h2>
        <p className="text-zinc-400 mb-6">روح المنيو واطلب وهتشوف الفرق</p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors inline-flex items-center gap-2"
          >
            اطلب دلوقتي
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Offers;

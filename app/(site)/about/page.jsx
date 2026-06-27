"use client";

import Link from "next/link";
import { ArrowRight, Flame, Clock, Star, Truck } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: <Star size={24} className="text-orange-400" />, value: "4.9", label: "تقييم العملاء" },
  { icon: <Clock size={24} className="text-orange-400" />, value: "30 دقيقة", label: "متوسط التوصيل" },
  { icon: <Truck size={24} className="text-orange-400" />, value: "+5000", label: "أوردر اتوصل" },
  { icon: <Flame size={24} className="text-orange-400" />, value: "100%", label: "لحمة طازجة" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">عننا 🍔</h1>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto">إحنا مش بس مطعم برجر — إحنا بنعمل تجربة أكل مختلفة</p>
      </motion.div>

      <motion.div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden mb-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="overflow-hidden h-64">
          <motion.img
            src="https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=1200"
            alt="about us"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <div className="p-8">
          <motion.h2
            className="text-white font-black text-2xl mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            قصتنا
          </motion.h2>
          <motion.p
            className="text-zinc-400 leading-relaxed mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            بدأنا من حلم بسيط — إننا نعمل أحسن برجر في المدينة. من أول يوم وإحنا شغلتنا الشاغلة إن كل أكلة تطلع
            بأعلى جودة وبأطيب طعم.
          </motion.p>
          <motion.p
            className="text-zinc-400 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            بنستخدم لحمة بقري طازجة 100%، خضار طازجة، وصوصات بنعملها إحنا بإيدينا كل يوم. مفيش حاجة مجمدة ومفيش
            تنازل عن الجودة.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
      >
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ y: -5, borderColor: "rgba(249,115,22,0.5)" }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-center transition-colors"
          >
            <motion.div
              className="flex justify-center mb-3"
              animate={{ rotate: [0, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 3, repeatDelay: i }}
            >
              {stat.icon}
            </motion.div>
            <motion.p
              className="text-white font-black text-2xl mb-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              {stat.value}
            </motion.p>
            <p className="text-zinc-500 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/menu"
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-full transition-colors inline-flex items-center gap-2"
          >
            جرب بنفسك
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default About;

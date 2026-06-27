"use client";

import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "201118207465";

const info = [
  {
    icon: <Phone size={22} className="text-orange-400" />,
    title: "التليفون / واتساب",
    value: "01118207465 - 01124459890",
    sub: "متاح من 12 ظهر لـ 12 بالليل",
  },
  {
    icon: <MapPin size={22} className="text-orange-400" />,
    title: "العنوان",
    value: "شبرا الخيمة - الشارع الجديد، أول الشعراوي القديم",
    sub: "التوصيل لكل المناطق",
  },
  {
    icon: <Clock size={22} className="text-orange-400" />,
    title: "أوقات العمل",
    value: "12 ظهر — 12 بالليل",
    sub: "طول أيام الأسبوع",
  },
];

const socials = [
  {
    name: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    color: "bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-600/30",
    icon: <MessageCircle size={20} />,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/17f3GPe1mt/",
    color: "bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.13 8.44 9.94v-7.03H7.9v-2.91h2.54V9.41c0-2.51 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.81 8.44-4.94 8.44-9.94Z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/last_burger_?igsh=dXZldnIwcTVxeXVj",
    color: "bg-pink-600/20 hover:bg-pink-600/30 text-pink-400 border-pink-600/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.46.66.25 1.22.6 1.78 1.15.5.5.85 1.02 1.15 1.78.24.64.41 1.37.46 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.46 2.43a4.9 4.9 0 0 1-1.15 1.78 4.9 4.9 0 0 1-1.78 1.15c-.64.24-1.37.41-2.43.46-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.46a4.9 4.9 0 0 1-1.78-1.15 4.9 4.9 0 0 1-1.15-1.78c-.24-.64-.41-1.37-.46-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.46-2.43.25-.66.6-1.22 1.15-1.78.5-.5 1.02-.85 1.78-1.15.64-.24 1.37-.41 2.43-.46C8.94 2.01 9.28 2 12 2Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.4-9.97a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@last_burger_?_r=1&_t=ZS-97WmPnnwi88",
    color: "bg-zinc-600/20 hover:bg-zinc-600/30 text-zinc-200 border-zinc-600/30",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.5 2h-3v13.5a3 3 0 1 1-3-3 3 3 0 0 1 .5.04V9.4a6 6 0 1 0 5.5 5.98V8.2a7.3 7.3 0 0 0 4.5 1.55V6.6a4.5 4.5 0 0 1-4.5-4.6Z" />
      </svg>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        className="text-center mb-14"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">تواصل معانا 📞</h1>
        <p className="text-zinc-400 text-lg">في أي سؤال أو مشكلة — إحنا هنا</p>
      </motion.div>

      <motion.div className="flex flex-col gap-4 mb-10" initial="hidden" animate="visible" variants={stagger}>
        {info.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            whileHover={{ x: 6 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 hover:border-orange-500/40 transition-colors"
          >
            <motion.div
              className="bg-orange-500/10 p-4 rounded-xl"
              whileHover={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              {item.icon}
            </motion.div>
            <div>
              <p className="text-zinc-500 text-sm mb-1">{item.title}</p>
              <p className="text-white font-bold text-lg">{item.value}</p>
              <p className="text-zinc-500 text-sm">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-white font-bold text-xl mb-2">تابعنا على السوشيال ميديا</h2>
        <p className="text-zinc-400 text-sm mb-6">عروض وأخبار كل يوم</p>
        <div className="flex flex-wrap justify-center gap-3">
          {socials.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 border px-5 py-3 rounded-xl transition-colors font-medium ${social.color}`}
            >
              {social.icon}
              {social.name}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Contact;

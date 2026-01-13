"use client";

import React from "react";
import { Shirt, Dumbbell, Sparkles, PaintBucket } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const services = [
  {
    icon: "/icon/Shirt-1.svg",
    title: "Seragam Sekolah",
    desc: "Seragam PAUD, TK, SD, SMP, SMA/SMK, custom atau sesuai standar sekolah.",
  },
  {
    icon: "/icon/PDLIcon-1.svg",
    title: "Seragam Kerja",
    desc: "Seragam kantor, pabrik, dan instansi dengan bahan kuat, nyaman, dan profesional.",
  },
  {
    icon: "/icon/ShirtCom.svg",
    title: "Kaos Komunitas",
    desc: "Kaos event, komunitas, organisasi, hingga kaos promosi dengan desain custom.",
  },
  {
    icon: "/icon/PDLIcon-1.svg",
    title: "PDH Kantor / Kampus",
    desc: "Pakaian Dinas Harian untuk kantor, kampus, organisasi, dan lembaga. Bahan drill berkualitas dengan bordir logo rapi.",
  },
  {
    icon: "/icon/PDLIcon-1.svg",
    title: "PDL Lapangan / Organisasi",
    desc: "Seragam lapangan untuk tim operational, komunitas, mapala, menwa, keamanan, dan organisasi kampus.",
  },
  {
    icon: "/icon/Shirt-1.svg",
    title: "Seragam Organisasi & Komunitas",
    desc: "Kaos komunitas, seragam event, panitia, himpunan kampus, UKM, hingga jersey ekskul sekolah.",
  },
  {
    icon: Dumbbell,
    title: "Baju Olahraga",
    desc: "Jersey futsal, bola, badminton, dan baju olahraga lainnya untuk tim atau sekolah.",
  },
  {
    icon: Sparkles,
    title: "Custom Order",
    desc: "Bisa request model dan bahan sesuai kebutuhan: hoodie, jaket, totebag, dsb.",
  },
  {
    icon: PaintBucket,
    title: "Sablon & Bordir",
    desc: "Layanan sablon & bordir berkualitas untuk logo, nama, dan identitas brand Anda.",
  },
];

// Variants container: buat stagger kayak puzzle yang masuk satu-satu
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

// Variants card: posisi awal “berantakan”, lalu nyatu ke tengah
const cardVariants = {
  hidden: (i) => {
    // bikin offset beda-beda biar berasa puzzle
    const col = i % 3; // 0,1,2
    const row = Math.floor(i / 3); // 0,1,2

    let x = 0;
    let y = 0;
    let rotate = 0;

    // kiri / tengah / kanan
    if (col === 0) x = -80;
    if (col === 2) x = 80;

    // baris atas / tengah / bawah
    if (row === 0) y = -60;
    if (row === 2) y = 60;

    // sedikit rotasi biar kayak kepingan puzzle
    rotate = (col - 1) * 6 + (row - 1) * 3; // kecil tapi berasa

    return {
      opacity: 0,
      x,
      y,
      rotate,
      scale: 0.9,
    };
  },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 16,
    },
  },
};

export default function Services() {
  return (
    <motion.section
      id="layanan"
      className="py-16 bg-slate-950 border-t border-slate-800 scroll-mt-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }} // animasi sekali pas discroll
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-50">
            Layanan Kardinal Konveksi
          </h3>
          <p className="mt-2 text-sm md:text-base text-slate-400 max-w-xl mx-auto">
            Menerima pesanan partai kecil hingga besar untuk kebutuhan bisnis,
            instansi, komunitas, maupun personal.
          </p>
        </div>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-5 group hover:-translate-y-1 hover:border-orange-400/70 hover:shadow-lg hover:shadow-orange-500/20 transition"
              variants={cardVariants}
              custom={idx}
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-400/40 flex items-center justify-center mb-4">
                  {typeof service.icon === "string" ? (
                    <Image
                      src={service.icon}
                      alt={service.title}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <service.icon className="w-5 h-5 text-orange-300" />
                  )}
                </div>

                <h4 className="text-sm font-semibold text-slate-50 mb-2">
                  {service.title}
                </h4>
                <p className="text-xs md:text-sm text-slate-300">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

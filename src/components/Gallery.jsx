"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import SectionWrapper from "./SectionWrapper";

import kerjaImg from "@/assets/gallery/seragam-kerja.jpeg";
import komunitasImg from "@/assets/gallery/kaos-komunitas.jpeg";
import jerseyImg from "@/assets/gallery/JERSEY.jpeg";
import sdImg from "@/assets/gallery/sd.jpeg";
import smpImg from "@/assets/gallery/smp.jpeg";
import smaImg from "@/assets/gallery/sma.jpeg";
import paudImg from "@/assets/gallery/paud.jpeg";

const slides = [
  {
    label: "Seragam Kerja Kantor",
    tag: "Seragam Kerja",
    image: kerjaImg,
    caption:
      "Seragam kerja kantor dengan bahan adem, cocok untuk harian dan event formal perusahaan.",
  },
  {
    label: "Kaos Komunitas",
    tag: "Kaos Komunitas",
    image: komunitasImg,
    caption:
      "Kaos komunitas untuk gathering, event, dan merchandise dengan sablon awet.",
  },
  {
    label: "Jersey Olahraga",
    tag: "Baju Olahraga",
    image: jerseyImg,
    caption:
      "Jersey olahraga full printing untuk futsal, basket, dan kegiatan sport lainnya.",
  },
  {
    label: "Seragam SD Putih Merah",
    tag: "Seragam Sekolah",
    image: sdImg,
    caption:
      "Paket seragam SD merah putih lengkap, siap pakai untuk kegiatan belajar.",
  },
  {
    label: "Seragam SMP Putih Biru",
    tag: "Seragam Sekolah",
    image: smpImg,
    caption:
      "Seragam putih biru dengan bahan nyaman dan kuat untuk aktivitas siswa SMP.",
  },
  {
    label: "Seragam SMA Putih Abu",
    tag: "Seragam Sekolah",
    image: smaImg,
    caption:
      "Seragam putih abu untuk SMA/SMK, bisa menyesuaikan ketentuan sekolah.",
  },
  {
    label: "Seragam PAUD / TK",
    tag: "Seragam Sekolah",
    image: paudImg,
    caption:
      "Seragam ceria untuk siswa PAUD/TK dengan warna yang bisa dikustom.",
  },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const next = () => setActiveIndex((i) => (i + 1) % slides.length);

  const prev = () =>
    setActiveIndex((i) => (i === 0 ? slides.length - 1 : i - 1));

  // Auto slide (Strict Mode safe)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="galeri"
      className="relative bg-slate-950 py-16 border-t border-slate-800 scroll-mt-10"
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 w-80 h-80 bg-orange-500/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-sky-500/10 blur-3xl rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h2 className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full bg-slate-900 border border-slate-700 text-slate-300">
            <ImageIcon className="w-4 h-4 text-orange-300" />
            Galeri
          </h2>

          <h3 className="mt-3 text-2xl md:text-3xl font-bold text-white">
            Showcase Hasil Produksi
          </h3>

          <p className="mt-2 text-sm md:text-base text-slate-400">
            Beberapa contoh hasil jadi produk konveksi kami.
          </p>
        </div>

        {/* Slider */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
          <SectionWrapper direction="down">
            <div className="relative w-full aspect-[4/5] sm:aspect-[3/2] md:aspect-[2/1]">
              {slides.map((slide, index) => (
                <div
                  key={slide.label}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === activeIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105 pointer-events-none"
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.label}
                    fill
                    priority={index === 0}
                    className="object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/40 to-transparent" />

                  {/* Caption */}
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-10">
                    <span className="inline-block mb-2 text-xs px-4 py-1 rounded-full bg-black/50 border border-white/10 text-orange-200">
                      {slide.tag}
                    </span>
                    <h4 className="text-lg md:text-2xl font-semibold text-white">
                      {slide.label}
                    </h4>
                    <p className="mt-1 text-xs md:text-sm text-slate-300 max-w-xl">
                      {slide.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <button
              onClick={prev}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full bg-black/60 border border-white/10
              items-center justify-center text-white hover:bg-black/80"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={next}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2
              w-10 h-10 rounded-full bg-black/60 border border-white/10
              items-center justify-center text-white hover:bg-black/80"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots */}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === activeIndex ? "w-8 bg-orange-400" : "w-3 bg-slate-600"
                  }`}
                />
              ))}
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}

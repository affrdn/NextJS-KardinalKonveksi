"use client";

// src/components/Catalog.jsx
import React, { useState } from "react";
import { Shirt, School, MessageCircle } from "lucide-react";

import SectionWrapper from "./SectionWrapper";

const catalogData = {
  paud: {
    label: "PAUD / TK",
    desc: "Seragam warna ceria dan nyaman untuk anak usia dini.",
    items: [
      {
        name: "Paket Seragam Harian",
        includes: [
          "Atasan seragam PAUD/TK",
          "Bawahan (rok/celana)",
          "Logo sekolah (sablon/bordir)",
          "Nama siswa (opsional)",
        ],
      },
      {
        name: "Paket Olahraga",
        includes: [
          "Kaos olahraga",
          "Celana olahraga",
          "Custom warna sesuai identitas sekolah",
        ],
      },
      {
        name: "Paket Custom Full Set",
        includes: [
          "Seragam harian",
          "Seragam olahraga",
          "Jaket/rompi (opsional)",
          "Desain warna & model custom",
        ],
      },
    ],
  },
  sd: {
    label: "SD",
    desc: "Seragam SD putih merah & variasi custom sesuai kebijakan sekolah.",
    items: [
      {
        name: "Paket Standar SD",
        includes: [
          "Atasan putih",
          "Bawahan merah",
          "Topi & dasi (opsional)",
          "Logo sekolah & nama siswa",
        ],
      },
      {
        name: "Paket Olahraga",
        includes: [
          "Setelan olahraga sekolah",
          "Bisa jersey kelas/event",
          "Sablon logo & nama kelas",
        ],
      },
      {
        name: "Paket Batik Jumat",
        includes: [
          "Kemeja batik sekolah",
          "Bawahan menyesuaikan sekolah",
          "Motif batik bisa custom",
        ],
      },
      {
        name: "Paket Custom Full Set",
        includes: [
          "Harian + olahraga + batik",
          "Atribut (topi/dasi/badge)",
          "Warna & desain sesuai sekolah",
        ],
      },
    ],
  },
  smp: {
    label: "SMP",
    desc: "Seragam SMP putih biru dan paket lengkap untuk satu sekolah.",
    items: [
      {
        name: "Paket Standar SMP",
        includes: [
          "Atasan putih",
          "Bawahan biru",
          "Logo sekolah bordir",
          "Nama siswa (opsional)",
        ],
      },
      {
        name: "Paket Olahraga & Ekskul",
        includes: [
          "Setelan olahraga sekolah",
          "Jersey ekskul (futsal/basket/dll)",
          "Sablon logo & nomor punggung",
        ],
      },
      {
        name: "Paket Pramuka",
        includes: ["Seragam pramuka lengkap", "Atribut (hasduk, badge, topi)"],
      },
    ],
  },
  sma: {
    label: "SMA / SMK",
    desc: "Seragam putih abu atau model khusus SMK & sekolah kejuruan.",
    items: [
      {
        name: "Paket Standar SMA/SMK",
        includes: [
          "Atasan putih",
          "Bawahan abu/warna khusus sekolah",
          "Logo sekolah bordir",
        ],
      },
      {
        name: "Paket Seragam Praktik (SMK)",
        includes: [
          "Seragam praktik/kerja lapangan",
          "Model menyesuaikan jurusan",
          "Bahan kuat & nyaman",
        ],
      },
      {
        name: "Paket Custom Satu Angkatan",
        includes: [
          "Seragam custom untuk 1 angkatan",
          "Bisa tambah jaket/hoodie angkatan",
          "Desain & warna bebas (approval sekolah)",
        ],
      },
    ],
  },
};

export default function Catalog() {
  const [activeLevel, setActiveLevel] = useState("paud");
  const levels = Object.keys(catalogData);

  const handleWhatsApp = (packageName, levelLabel) => {
    const text = encodeURIComponent(
      `Halo Kardinal Konveksi, saya ingin tanya soal ${packageName} untuk jenjang ${levelLabel}.`
    );
    window.open(`https://wa.me/6285279422010?text=${text}`, "_blank");
  };

  return (
    <section
      id="katalog"
      className="py-16 bg-slate-950 border-t border-slate-800 scroll-mt-10 "
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Katalog */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs text-slate-300">
              <School className="w-4 h-4 text-orange-300" />
              Katalog Seragam Sekolah Custom
            </h2>
            <h4 className="mt-3 text-xl md:text-2xl font-bold text-slate-50">
              Seragam dari PAUD hingga SMA/SMK
            </h4>
            <p className="mt-2 text-xs md:text-sm text-slate-400 max-w-xl">
              Pilih jenjang sekolah untuk melihat paket seragam yang bisa
              disesuaikan dengan standar sekolah Anda maupun desain khusus
              yayasan.
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <Shirt className="w-4 h-4 text-orange-300" />
            <SectionWrapper direction="right">
              <span>
                Menerima order per kelas, per angkatan, atau satu sekolah
                lengkap.
              </span>
            </SectionWrapper>
          </div>
        </div>

        {/* Tabs jenjang */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 flex-nowrap">
          {levels.map((key) => {
            const level = catalogData[key];
            const isActive = activeLevel === key;
            return (
              <button
                key={key}
                onClick={() => setActiveLevel(key)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold border transition shrink-0 ${
                  isActive
                    ? "bg-orange-500 text-slate-950 border-orange-400 shadow-md shadow-orange-500/30"
                    : "bg-slate-900 text-slate-300 border-slate-700 hover:border-orange-400/60 hover:text-orange-200"
                }`}
              >
                {level.label}
              </button>
            );
          })}
        </div>

        {/* Isi katalog */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 md:p-6 shadow-xl shadow-black/40">
          <SectionWrapper direction="left">
            <div className="mb-5">
              <p className="text-sm md:text-base text-slate-200 font-semibold">
                {catalogData[activeLevel].label}
              </p>
              <p className="text-xs md:text-sm text-slate-400">
                {catalogData[activeLevel].desc}
              </p>
            </div>
          </SectionWrapper>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {catalogData[activeLevel].items.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 flex flex-col justify-between hover:border-orange-400/70 hover:shadow-lg hover:shadow-orange-500/20 transition"
              >
                <div>
                  <SectionWrapper direction="down">
                    <p className="text-xs font-semibold text-slate-100 mb-2">
                      {item.name}
                    </p>
                    <ul className="space-y-1.5 text-[11px] text-slate-300 mb-3">
                      {item.includes.map((inc, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-[3px] inline-block w-1 h-1 rounded-full bg-orange-400" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-orange-300">
                      Harga fleksibel sesuai jumlah & bahan — konsultasi dulu.
                    </p>
                  </SectionWrapper>
                </div>
                <SectionWrapper direction="up">
                  <button
                    type="button"
                    onClick={() =>
                      handleWhatsApp(item.name, catalogData[activeLevel].label)
                    }
                    className="mt-4 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-slate-950 text-[11px] font-semibold hover:bg-orange-400 transition shadow-md shadow-orange-500/30"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Konsultasi Paket Ini
                  </button>
                </SectionWrapper>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

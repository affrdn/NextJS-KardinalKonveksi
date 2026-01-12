import React, { useState } from "react";
import { GraduationCap, Users } from "lucide-react";

const portfolioItems = {
  paud: [
    {
      name: "TK Melati Indah",
      desc: "Seragam PAUD warna cerah dengan bahan katun lembut",
      students: 150,
    },
    {
      name: "KB-TK Permata Bunda",
      desc: "Seragam batik dan olahraga untuk anak usia dini",
      students: 200,
    },
    {
      name: "PAUD Ceria",
      desc: "Seragam harian dan seragam upacara",
      students: 120,
    },
  ],
  sd: [
    {
      name: "SD Negeri 5 Jakarta",
      desc: "Seragam lengkap putih-merah dan pramuka",
      students: 450,
    },
    {
      name: "SD Islam Terpadu",
      desc: "Seragam muslim dan batik untuk siswa SD",
      students: 380,
    },
    {
      name: "SD Bina Nusantara",
      desc: "Seragam harian, olahraga, dan batik",
      students: 520,
    },
  ],
  smp: [
    {
      name: "SMP Negeri 12",
      desc: "Seragam putih-biru dan seragam pramuka",
      students: 650,
    },
    {
      name: "SMP Islam Al-Azhar",
      desc: "Seragam muslim modern untuk siswa SMP",
      students: 480,
    },
    {
      name: "SMP Kristen Gloria",
      desc: "Seragam lengkap termasuk jas almamater",
      students: 420,
    },
  ],
  sma: [
    {
      name: "SMA Negeri 8",
      desc: "Seragam putih-abu dan seragam batik",
      students: 720,
    },
    {
      name: "SMA Taruna Nusantara",
      desc: "Seragam PDH dan PDL khusus sekolah berasrama",
      students: 450,
    },
    {
      name: "SMK Teknologi",
      desc: "Seragam kerja praktek dan seragam harian",
      students: 580,
    },
  ],
};

const tabs = [
  { key: "paud", label: "PAUD & TK" },
  { key: "sd", label: "SD" },
  { key: "smp", label: "SMP" },
  { key: "sma", label: "SMA & SMK" },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState("paud");

  return (
    <section id="portfolio" className="py-16 bg-gray-50 scroll-mt-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio Kami
          </h3>
          <p className="text-gray-600 text-lg">
            Dipercaya oleh sekolah-sekolah terbaik
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {portfolioItems[activeTab].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition group"
            >
              <div className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <GraduationCap className="w-24 h-24 text-white/80 group-hover:scale-110 transition" />
              </div>
              <div className="p-6">
                <h4 className="font-bold text-xl text-gray-900 mb-2">
                  {item.name}
                </h4>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  {item.students} Siswa
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

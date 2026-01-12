import React from "react";
import { GraduationCap, PhoneCall } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12 border-t border-slate-800 ">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-8 h-8 text-orange-400" />
              <span className="text-xl font-bold text-white">
                Kardinal Konveksi
              </span>
            </div>
            <p className="text-sm">
              Solusi jahit terpercaya untuk seragam sekolah berkualitas di
              Bandar Lampung
            </p>
          </div>

          {/* Layanan */}
          <div>
            <h5 className="font-bold text-white mb-4">Layanan</h5>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>Seragam PAUD - SMA</li>
              <li>Kaos Komunitas</li>
              <li>Topi</li>
              <li>PDH</li>
              <li>Sablon Custom</li>
              <li>Bordir Custom</li>
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h5 className="font-bold text-white mb-4">Perusahaan</h5>

            <p className="text-sm text-slate-300 mt-2">
              Alamat workshop: Jalan Ikan Layur No.33 B, Teluk Betung Selatan,
              Bandar Lampung, Lampung 35221
            </p>
          </div>

          {/* Jam Operasional */}
          <div>
            <h5 className="font-bold text-white mb-4">Jam Operasional</h5>
            <ul className="space-y-2 text-sm">
              <li>Senin - Jumat: 08:00 - 17:00</li>
              <li>Sabtu: 08:00 - 14:00</li>
              <li>Minggu: Libur</li>
            </ul>
            <a
              href="https://wa.me/6285279422010"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-orange-500 text-slate-950 font-semibold px-4 py-2 rounded-full hover:bg-orange-400 transition shadow-lg shadow-orange-500/30"
            >
              <PhoneCall className="w-4 h-4" />
              Konsultasi
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm">
          <p>&copy; 2026 Kardinal Konveksi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

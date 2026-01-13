import React from "react";
import {
  Building2,
  BadgeCheck,
  Spool,
  MapPin,
  ExternalLink,
} from "lucide-react";
import SectionWrapper from "./SectionWrapper";

export default function About() {
  return (
    <section
      id="tentang"
      className="py-16 bg-slate-900 border-t border-slate-800 scroll-mt-10 flex justify-center items-center"
    >
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2  items-start">
        {/* Left Section */}
        <div className="space-y-6">
          <SectionWrapper direction="left">
            <h2 className="inline-flex items-center  gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-300 border border-slate-700">
              <Building2 className="w-4 h-4 text-orange-300" />
              Tentang Kami
            </h2>
          </SectionWrapper>

          <SectionWrapper direction="left">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-50">
              Kami berpengalaman lebih dari 15 tahun
            </h3>
          </SectionWrapper>

          <SectionWrapper direction="left">
            <p className="text-sm md:text-base text-slate-300">
              Kardinal Konveksi juga menerima pembuatan{" "}
              <span className="font-semibold text-orange-300">
                seragam sekolah lengkap
              </span>{" "}
              untuk PAUD, TK, SD, SMP, hingga SMA/SMK. Bisa mengikuti standar
              nasional atau desain khusus yayasan sekolah.
            </p>
          </SectionWrapper>

          <SectionWrapper direction="left">
            <p className="text-sm md:text-base text-slate-300">
              Kami mengutamakan kualitas jahitan, ketepatan waktu, dan pelayanan
              yang ramah. Menerima pesanan{" "}
              <span className="font-semibold">custom</span> dengan layanan{" "}
              <span className="font-semibold">sablon & bordir</span> sesuai
              desain yang Anda inginkan.
            </p>
          </SectionWrapper>

          <SectionWrapper direction="left">
            <div className="grid gap-3 text-sm pt-2">
              <div className="flex items-start gap-2">
                <BadgeCheck className="mt-[2px] w-4 h-4 text-orange-400" />
                <span className="text-slate-300">
                  Spesialis konveksi dan sablon/bordir untuk berbagai kebutuhan
                  (kantor, sekolah, komunitas, merchandise).
                </span>
              </div>

              <div className="flex items-start gap-2">
                <Spool className="mt-[2px] w-4 h-4 text-orange-400" />
                <span className="text-slate-300">
                  Pengerjaan rapi dengan kontrol kualitas sebelum pengiriman.
                </span>
              </div>
            </div>
          </SectionWrapper>
        </div>

        {/* Right Section */}
        <div className="space-y-4 flex flex-col justify-center  h-full ">
          <SectionWrapper direction="right">
            <div className="rounded-2xl  bg-slate-950 border border-slate-800 p-5 md:p-6 shadow-xl shadow-black/40 mx-auto sm:mx-16">
              <h4 className="text-sm font-semibold text-slate-100 mb-1">
                Lokasi Workshop
              </h4>

              <div className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin className="w-5 h-5 text-orange-300 mt-0.5" />
                <div>
                  <p>Jalan Ikan Layur No. 33 B</p>
                  <p>Teluk Betung Selatan</p>
                  <p>Kota Bandar Lampung, Lampung 35221</p>
                </div>
              </div>

              <a
                href="https://maps.app.goo.gl/bE5jtuKGRmpMyDNx8"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-orange-500 text-slate-950 text-xs font-semibold hover:bg-orange-400 transition shadow-lg shadow-orange-500/30"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di Google Maps
              </a>

              <div className="pt-4 text-xs text-slate-400 border-t border-slate-800 mt-4">
                <p>Jam operasional (flexible by order):</p>
                <p>Senin – Sabtu, 09.00 – 17.00 WIB</p>
              </div>
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}

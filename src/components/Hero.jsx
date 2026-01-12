import React from "react";
import { CheckCircle2, Scissors, Shirt, MapPin } from "lucide-react";
// import { ReactComponents as ShirtIcon } from "@/assets/icon/Shirt.svg";
// import bgVideo from "../assets/videos/720p.mp4";
import SectionWrapper from "./SectionWrapper";

export default function Hero() {
  return (
    <section className="relative overflow-hidden scroll-mt-20 py-12" id="hero">
      {/* Video background */}
      <div className="absolute inset-0 -z-20">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero.webp')" }}
          aria-hidden="true"
        />

        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/90"></div>
      </div>

      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-10 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="absolute top-40 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <SectionWrapper direction="left">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-400/40 bg-orange-500/10 text-xs text-orange-200 font-semibold ">
              <Scissors className="w-4 h-4" aria-hidden="true" />
              Konveksi & Seragam Sekolah di Bandar Lampung
            </span>

            <div>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
                Kardinal{" "}
                <span className="text-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.45)]">
                  Konveksi
                </span>
              </h1>
              <p className="mt-3 text-lg md:text-xl text-slate-100">
                <span className="font-semibold text-orange-300">
                  “Solusi Jahit Terbaik Bandar Lampung”
                </span>
              </p>
            </div>

            <p className="text-sm md:text-base text-slate-300 max-w-xl">
              Konveksi terpercaya di{" "}
              <span className="font-bold text-orange-300">Bandar Lampung</span>,
              melayani pembuatan{" "}
              <span className="font-semibold">seragam sekolah</span>, seragam
              kerja, kaos komunitas, jersey olahraga, dan berbagai produk
              tekstil custom lainnya.
            </p>

            <div className="grid gap-3 text-sm">
              <div className="inline-flex items-start gap-2">
                <CheckCircle2
                  className="mt-[2px] w-4 h-4 text-orange-400"
                  aria-hidden="true"
                />
                <span className="text-slate-100">
                  <span className="font-semibold text-orange-200">
                    Seragam Sekolah PAUD, TK, SD, SMP, SMA/SMK
                  </span>{" "}
                  – bisa sesuai standar sekolah atau desain khusus yayasan.
                </span>
              </div>
              <div className="inline-flex items-start gap-2">
                <CheckCircle2
                  className="mt-[2px] w-4 h-4 text-orange-400"
                  aria-hidden="true"
                />
                <span className="text-slate-100">
                  Seragam kerja, kaos komunitas, dan jersey event untuk kantor,
                  organisasi, hingga komunitas hobi.
                </span>
              </div>
              <div className="inline-flex items-start gap-2">
                <CheckCircle2
                  className="mt-[2px] w-4 h-4 text-orange-400"
                  aria-hidden="true"
                />
                <span className="text-slate-100">
                  PDH kantor & kampus, serta PDL organisasi dan komunitas –
                  lengkap dengan bordir logo resmi.
                </span>
              </div>
              <div className="inline-flex items-start gap-2">
                <CheckCircle2
                  className="mt-[2px] w-4 h-4 text-orange-400"
                  aria-hidden="true"
                />
                <span className="text-slate-100">
                  Sablon & bordir logo profesional – cocok untuk branding
                  sekolah maupun perusahaan.
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://wa.me/6285279422010?text=Halo%20Kardinal%20Konveksi,%20saya%20ingin%20konsultasi%20pemesanan%20seragam/kaos."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-orange-500 text-slate-950 font-semibold text-sm hover:bg-orange-400 transition shadow-lg shadow-orange-500/40"
              >
                Konsultasi via WhatsApp
              </a>
              <a
                href="#layanan"
                className="text-sm text-slate-300 hover:text-orange-300 underline-offset-4 hover:underline"
              >
                Lihat layanan lengkap
              </a>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-200 pt-3">
              <MapPin className="w-4 h-4 text-orange-300" aria-hidden="true" />
              <span>
                Jalan Ikan Layur No. 33 B, Teluk Betung Selatan, Kota Bandar
                Lampung
              </span>
            </div>
          </div>
        </SectionWrapper>

        {/* Visual Card */}
        <div className="relative">
          <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 md:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.75)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - Seragam Sekolah (Dominan) */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:shadow-orange-500/20 transition">
                <SectionWrapper direction="left">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/Shirt.svg"
                      alt="Seragam Kerja"
                      className="w-6 h-6"
                    />

                    <span className="text-xs font-semibold text-slate-200">
                      Seragam Sekolah
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-200">
                    Paket seragam PAUD sampai SMA/SMK: harian, olahraga, batik,
                    pramuka & atribut lengkap.
                  </p>
                </SectionWrapper>
              </div>

              {/* Card 2 - Seragam Kerja */}
              <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-4 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 transition">
                <SectionWrapper direction="right">
                  <div className="flex items-center gap-2">
                    <img
                      src="/icons/Shirt.svg"
                      alt="Seragam Kerja"
                      className="w-6 h-6"
                    />
                    <span className="text-xs font-semibold text-slate-200">
                      Seragam Kerja & Kantor
                    </span>
                  </div>
                  <p className="mt-3 text-[11px] text-slate-200">
                    Kemeja kantor, seragam pabrik, dan setelan kerja rapi untuk
                    perusahaan dan instansi.
                  </p>
                </SectionWrapper>
              </div>

              {/* Card 3 - Kaos & Komunitas */}
              <div className="col-span-2 rounded-2xl bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-blue-500/20 p-4 border border-orange-400/40 flex items-center justify-between gap-4">
                <SectionWrapper direction="up">
                  <div>
                    <p className="text-xs text-orange-200 font-semibold">
                      Kaos Komunitas & Event
                    </p>
                    <p className="text-[11px] text-slate-100 mt-1 max-w-xs">
                      Kaos komunitas, event, gathering, dan jersey custom dengan
                      sablon & bordir logo brand atau sekolah.
                    </p>
                  </div>
                  <div className="hidden sm:block text-right text-[11px] text-slate-100/80">
                    <p>Minimal order fleksibel</p>
                    <p className="text-lg font-bold text-orange-300 leading-none">
                      Bisa nego
                    </p>
                    <p>sesuai kebutuhan & quantity</p>
                  </div>
                </SectionWrapper>
              </div>
            </div>
            <SectionWrapper direction="up">
              <div className="absolute -top-4 -right-4 px-3 py-1 rounded-full bg-orange-500 text-slate-950 text-[11px] font-semibold shadow-lg shadow-orange-500/40">
                Seragam Sekolah & Kerja
              </div>
            </SectionWrapper>
          </div>
        </div>
      </div>
    </section>
  );
}

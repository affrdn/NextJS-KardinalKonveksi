"use client";

import React, { useEffect, useState } from "react";
import { PhoneCall, Grid, Image, Layers, Info, MapPin } from "lucide-react";

const sections = ["", "katalog", "galeri", "layanan", "tentang", "kontak"];

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

export default function Header() {
  const [active, setActive] = useState("");
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
        window.removeEventListener("scroll", onScroll);
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hasScrolled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [hasScrolled]);

  return (
    <>
      {/* ===== TOP NAV (DESKTOP + MOBILE) ===== */}
      <header
        className="fixed top-0 left-0 right-0 z-50
        bg-slate-950 border-b border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => scrollToSection("hero")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-400/40">
              <img
                src="/icon/Logo.png"
                alt="Kardinal Konveksi Logo"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-bold text-white">
                Kardinal <span className="text-orange-400">Konveksi</span>
              </h1>
              <p className="hidden sm:block text-xs text-slate-400">
                Solusi Jahit Terbaik Bandar Lampung
              </p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {sections.map((id) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`transition-colors ${
                  active === id ? "text-orange-400" : "hover:text-orange-300"
                }`}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            ))}

            <a
              href="https://wa.me/6285279422010"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange-500 text-slate-950 font-semibold px-4 py-2 rounded-full hover:bg-orange-400 transition"
            >
              <PhoneCall className="w-4 h-4" />
              Konsultasi
            </a>
          </nav>
        </div>
      </header>

      {/* ===== BOTTOM NAV (MOBILE ONLY) ===== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50
        bg-slate-950 border-t border-slate-800
        h-[64px] grid grid-cols-5"
      >
        {[
          { id: "katalog", label: "Katalog", Icon: Grid },
          { id: "galeri", label: "Galeri", Icon: Image },
          { id: "layanan", label: "Layanan", Icon: Layers },
          { id: "tentang", label: "Tentang", Icon: Info },
          { id: "kontak", label: "Kontak", Icon: MapPin },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => {
              setActive(id);
              scrollToSection(id);
            }}
            className={`relative flex flex-col items-center justify-center gap-1 text-xs
              ${
                active === id
                  ? "text-orange-400"
                  : "text-slate-400 hover:text-orange-300"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px]">{label}</span>

            {active === id && (
              <span className="absolute top-0 w-8 h-[2px] bg-orange-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Phone, Mail, MapPin, UploadCloud } from "lucide-react";

export default function ContactSection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const objectUrlRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(
      "Terima kasih! Formulir Anda telah dikirim. Kami akan segera menghubungi Anda."
    );
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    // Reset jika tidak ada file
    if (!file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setSelectedFile(null);
      setPreviewUrl(null);
      return;
    }

    setSelectedFile(file);

    // Preview hanya untuk image
    if (file.type.startsWith("image/") && typeof window !== "undefined") {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // Cleanup saat unmount (Strict Mode safe)
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  return (
    <section
      id="kontak"
      className="py-16 bg-slate-950 border-t border-slate-800 scroll-mt-10"
    >
      <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-10 items-start">
        {/* INFO KONTAK */}
        <div className="space-y-5">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-50">
            Konsultasi & Pemesanan
          </h3>

          <p className="text-sm md:text-base text-slate-300">
            Kirimkan detail kebutuhan seragam, kaos, atau produk tekstil Anda.
            Lampirkan desain (jika ada), tim Kardinal Konveksi akan menghubungi
            Anda untuk penawaran terbaik.
          </p>

          <div className="space-y-3 text-sm text-slate-300">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-orange-300 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-100">
                  WhatsApp / Telepon
                </p>
                <p>0852-7942-2010</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-300 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-100">Email</p>
                <p>kardinalkonveksi@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-orange-300 mt-0.5" />
              {/* <div>
                <p className="font-semibold text-slate-100">Alamat</p>
                <p>Jalan Ikan Layur No. 33 B</p>
                <p>Teluk Betung Selatan, Kota Bandar Lampung, Lampung 35221</p>
              </div> */}
              <p>
                <span className="font-semibold text-slate-100">Alamat: </span>
                <br />
                Jalan Ikan Layur No. 33 B
                <br />
                Bandar Lampung, Lampung
                <br />
                WhatsApp: 0852-7942-2010
                <br />
                Melayani area Bandar Lampung - Lampung & sekitarnya
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 md:p-6 shadow-xl shadow-black/40">
          <h4 className="text-sm font-semibold text-slate-100 mb-4">
            Formulir Kontak
          </h4>

          <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
            <Input label="Nama Lengkap" placeholder="Nama Anda" required />
            <Input
              label="Nomor WhatsApp"
              type="tel"
              placeholder="0852xxxxxxx"
              required
            />
            <Input label="Email" type="email" placeholder="email@contoh.com" />

            <Textarea
              label="Kebutuhan"
              placeholder="Contoh: seragam sekolah 100 pcs, bahan, warna, dll..."
              required
            />

            {/* UPLOAD */}
            <div className="space-y-1">
              <label className="block text-slate-200">
                Upload File Desain (opsional)
              </label>

              <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-950 border border-dashed border-slate-700 cursor-pointer hover:border-orange-400 transition">
                <span className="text-xs text-slate-200">PNG / JPG / PDF</span>
                <UploadCloud className="w-5 h-5 text-orange-300" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFile && (
                <div className="relative mt-3 p-3 rounded-lg border border-slate-800 bg-slate-900">
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-2 right-2 w-5 h-5 text-xs rounded-full bg-red-500/30 text-red-200"
                  >
                    x
                  </button>

                  <p className="text-xs text-slate-300 mb-2">
                    File:
                    <span className="font-semibold"> {selectedFile.name}</span>
                  </p>

                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview desain"
                      className="h-24 rounded-md border border-slate-700"
                    />
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-4 py-2.5 rounded-lg bg-orange-500 text-slate-950 font-semibold hover:bg-orange-400 transition"
            >
              Kirim Formulir
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ===== Small Components ===== */

function Input({ label, type = "text", placeholder, required }) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-200">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

function Textarea({ label, placeholder, required }) {
  return (
    <div className="space-y-1">
      <label className="block text-slate-200">{label}</label>
      <textarea
        rows="4"
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 resize-none focus:ring-2 focus:ring-orange-400"
      />
    </div>
  );
}

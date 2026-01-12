import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Kepala Sekolah SD Negeri 5",
    text: "Kualitas jahitan rapi, bahan nyaman, dan pengerjaan tepat waktu. Sangat puas!",
    rating: 5,
  },
  {
    name: "Yayasan Al-Azhar",
    text: "Sudah langganan 5 tahun. Harga terjangkau dengan kualitas terbaik.",
    rating: 5,
  },
  {
    name: "Komite SMA Negeri 8",
    text: "Proses pemesanan mudah, bisa custom sesuai kebutuhan sekolah.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section id="testimoni" className="py-16 bg-white scroll-mt-10">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni Klien
          </h3>
          <p className="text-gray-600 text-lg">Apa kata mereka tentang kami?</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testi.text}"</p>
              <p className="font-semibold text-gray-900">{testi.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

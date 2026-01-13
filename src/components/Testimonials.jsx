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
    <section
      id="testimoni"
      className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-20"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
            Testimoni Klien
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600">
            Apa kata mereka tentang kami?
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testi, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-white
              p-5 sm:p-6 lg:p-8
              rounded-2xl shadow-md hover:shadow-lg
              transition-shadow"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {[...Array(testi.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm sm:text-base text-gray-700 mb-4 italic leading-relaxed">
                "{testi.text}"
              </p>

              {/* Name */}
              <p className="text-sm sm:text-base font-semibold text-gray-900">
                {testi.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

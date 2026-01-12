import React from "react";
import { CheckCircle, Award, Clock, Users } from "lucide-react";

const benefits = [
  {
    icon: CheckCircle,
    title: "Bahan Premium",
    desc: "Katun, polyester, dan bahan berkualitas tinggi",
  },
  {
    icon: Award,
    title: "Jahitan Rapi",
    desc: "Dikerjakan oleh penjahit berpengalaman",
  },
  {
    icon: Clock,
    title: "Tepat Waktu",
    desc: "Pengerjaan cepat sesuai deadline",
  },
  {
    icon: Users,
    title: "Harga Terjangkau",
    desc: "Harga grosir untuk pesanan sekolah",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white scroll-mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-4xl font-bold mb-4">Mengapa Memilih Kami?</h3>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map((item, idx) => (
            <div key={idx} className="text-center">
              <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-lg">
                <item.icon className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-xl mb-2">{item.title}</h4>
              <p className="text-blue-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

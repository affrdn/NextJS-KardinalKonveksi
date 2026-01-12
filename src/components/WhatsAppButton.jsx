import React from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/6285279422010?text=Halo%20Kardinal%20Konveksi,%20saya%20ingin%20tanya%20soal%20pemesanan."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 sm:bottom-5 right-5 z-50 inline-flex items-center gap-2 px-3 py-2 sm:px-4 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/40 hover:bg-green-400 transition transform hover:-translate-y-1"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-xs font-semibold hidden sm:inline">
        Chat WhatsApp
      </span>
    </a>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Kardinal Konveksi Bandar Lampung",
    template: "%s | Kardinal Konveksi",
  },
  description:
    "Kardinal Konveksi Bandar Lampung melayani pembuatan seragam sekolah, kantor, komunitas, PDH & PDL. Bisa custom, harga terjangkau.",
  keywords: [
    "konveksi bandar lampung",
    "konveksi seragam lampung",
    "konveksi seragam sekolah",
    "jahit seragam lampung",
    "baju mbg",
    "buat kaos mbg bandar lampung",
    "buat seragam sekolah terdekat",
    "tukang jahit terdekat",
    "buat baju lampung",
    "buat baju bandar lampung",
    "buat kaos lampung",
    "buat kaos bandar lampung",
    "sablon bandar lampung",
    "sablon bandar lampung",
    "bordir lampung",
    "bordir bandar lampung",
  ],
  metadataBase: new URL("https://kardinalkonveksi.com"),
  openGraph: {
    title: "Kardinal Konveksi - Seragam Sekolah Bandar Lampung",
    description:
      "Spesialis konveksi seragam sekolah, kantor, komunitas & custom di Bandar Lampung.",
    url: "https://kardinalkonveksi.com",
    siteName: "Kardinal Konveksi",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kardinal Konveksi Bandar Lampung",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kardinalkonveksi.com"),

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
    "buat seragam sekolah terdekat",
    "tukang jahit terdekat",
    "buat kaos lampung",
    "buat kaos bandar lampung",
    "sablon lampung",
    "bordir lampung",
  ],

  alternates: {
    canonical: "https://kardinalkonveksi.com",
  },

  robots: {
    index: true,
    follow: true,
  },

  googleBot: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Kardinal Konveksi Bandar Lampung",
    description:
      "Spesialis konveksi seragam sekolah, kantor, komunitas & custom di Bandar Lampung.",
    url: "https://kardinalkonveksi.com",
    siteName: "Kardinal Konveksi",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/icon/Logo.png",
        width: 1200,
        height: 630,
        alt: "Kardinal Konveksi Bandar Lampung",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Local Business Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Kardinal Konveksi",
              url: "https://kardinalkonveksi.com",
              image: "https://kardinalkonveksi.com/icon/Logo.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bandar Lampung",
                addressRegion: "Lampung",
                addressCountry: "ID",
              },
              areaServed: "Bandar Lampung",
            }),
          }}
        />

        {children}

        {/* Vercel Analytics */}
        <Analytics />
      </body>
    </html>
  );
}

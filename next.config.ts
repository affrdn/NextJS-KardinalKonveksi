/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xyz.supabase.co", // GANTI dengan hostname Supabase Anda
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Opsi ini mematikan warning saat build jika ada error eslint/typescript kecil
  // (Gunakan hanya jika kepepet, idealnya perbaiki errornya)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

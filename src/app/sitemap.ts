import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://kardinalkonveksi.com",
      lastModified: new Date(),
    },
  ];
}

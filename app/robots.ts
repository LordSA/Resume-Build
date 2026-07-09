import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/create", "/editor/", "/api/"],
    },
    sitemap: "https://resumesolutions.co/sitemap.xml",
  };
}

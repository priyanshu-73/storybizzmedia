import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const ROUTES = [
  "",
  "/about",
  "/careers",
  "/contact",
  "/the-draft",
  "/services/press-releases",
  "/services/magazine-features",
  "/services/podcasts-and-talk-shows",
  "/services/social-media-publicity",
  "/industries/tech-and-ai",
  "/industries/real-estate",
  "/industries/doctors",
  "/industries/d2c",
  "/industries/b2b",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

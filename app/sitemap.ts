import { siteConfig } from "@/config/site";
export default async function sitemap() {
  const baseUrl = siteConfig.url;

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/showcases`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/feedback`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/change-logs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/agency`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
    },
  ];
}

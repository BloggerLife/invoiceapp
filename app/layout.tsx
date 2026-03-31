import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import Providers from "@/components/Providers";

const onest = Onest({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s - ${siteConfig.title}`,
  },
  metadataBase: new URL(siteConfig.url ?? ""),
  description: siteConfig.description,
  keywords: [
    // Product Identity
    "HubStack",
    "SaaS starter kit",
    "Next.js boilerplate",
    "React starter template",
    "TypeScript starter",
    "SaaS boilerplate",
    "Full-stack starter kit",

    // Core Features
    "Authentication system",
    "Payment integration",
    "Admin dashboard",
    "User management",
    "Email system",
    "File uploads",
    "Database integration",
    "API development",

    // Technical Stack
    "Next.js 14",
    "React development",
    "TypeScript",
    "Prisma ORM",
    "Tailwind CSS",
    "tRPC",
    "REST API",
    "GraphQL",

    // Integrations
    "Stripe payments",
    "NextAuth.js",
    "OAuth providers",
    "Email templates",
    "Discord integration",
    "GitHub integration",
    "Google authentication",

    // Development Features
    "Rapid development",
    "Developer toolkit",
    "Code generation",
    "Type safety",
    "Developer experience",
    "Production ready",

    // UI/UX
    "Modern UI components",
    "Responsive design",
    "Dark mode support",
    "Customizable themes",
    "Accessible components",
    "Mobile-first design",

    // Business Features
    "SaaS development",
    "Subscription management",
    "User analytics",
    "Role-based access",
    "Multi-tenancy",
    "B2B solutions",

    // Performance
    "SEO optimization",
    "Performance optimized",
    "Edge deployment",
    "Server components",
    "Static generation",

    // Development Process
    "Time-saving solution",
    "Quick setup",
    "Scalable architecture",
    "Best practices",
    "Security focused",
  ],
  authors: [
    {
      name: "Maczain",
      url: "https://maczain.com",
    },
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  creator: "Maczain",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.links.twitter,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InvoicePro" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
      </head>
      <body className={onest.className}>
        <Toaster richColors />
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

export const siteConfig = {
  name: "Invoice Pro",
  title:
    "Invoice Pro | Professional Invoice Generator - Create, Send & Track Invoices",
  url: "https://invoice-generator-pro-phi.vercel.app",
  ogImage: "https://invoice-generator-pro-phi.vercel.app/og-image.png", // You'll need to create this image
  description:
    "Invoice Pro is a professional invoice generator that helps businesses create, send, and track invoices effortlessly. Generate unlimited professional invoices, manage clients, track payments, and get paid faster with our easy-to-use platform.",
  keywords: [
    "invoice generator",
    "professional invoices",
    "invoice software",
    "billing system",
    "invoice maker",
    "business invoicing",
    "invoice templates",
    "payment tracking",
    "client management",
    "invoice PDF",
    "online invoicing",
    "small business tools",
  ],
  links: {
    twitter: "https://twitter.com/invoicepro",
    github: "https://github.com/invoicepro/invoice-generator",
    linkedin: "https://linkedin.com/company/invoicepro",
    support: "https://help.invoicepro.com",
    docs: "https://docs.invoicepro.com",
    blog: "https://blog.invoicepro.com",
  },
  contact: {
    support: "support@invoicepro.com",
    sales: "sales@invoicepro.com",
    hello: "hello@invoicepro.com",
    phone: "+1 (555) 123-4567",
  },
  features: {
    generator: "Professional invoice generation with custom templates",
    templates: "Beautiful, customizable invoice templates for any industry",
    clients: "Complete client management system with contact details",
    tracking: "Real-time payment tracking and invoice status updates",
    pdf: "High-quality PDF export and email delivery",
    branding: "Custom branding with your logo and company colors",
    analytics: "Detailed reporting and revenue analytics",
    automation: "Automated reminders and recurring invoices",
    security: "Bank-level security and data protection",
    mobile: "Mobile-responsive design for invoicing on the go",
  },
  pricing: {
    free: {
      name: "Free",
      price: 0,
      invoices: 10,
      features: [
        "10 invoices per month",
        "Basic templates",
        "PDF export",
        "Email support",
      ],
    },
    pro: {
      name: "Invoice Pro",
      price: 9.99,
      invoices: "unlimited",
      features: [
        "Unlimited invoices",
        "Premium templates",
        "Custom branding",
        "Payment tracking",
        "Client management",
        "Analytics dashboard",
        "Priority support",
        "Advanced reporting",
      ],
    },
  },
  company: {
    foundedYear: 2024,
    location: "San Francisco, CA",
    employees: "10-50",
    industry: "Financial Software",
    mission:
      "To simplify invoicing for businesses of all sizes and help them get paid faster.",
    vision: "To become the world's most trusted invoice generation platform.",
  },
  social: {
    twitter: "@InvoicePro",
    linkedin: "company/invoicepro",
    facebook: "InvoiceProApp",
    youtube: "InvoiceProOfficial",
  },
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
    cookies: "/cookie-policy",
    refund: "/refund-policy",
  },
  analytics: {
    googleAnalytics: "G-XXXXXXXXXX", // Replace with your GA4 ID
    hotjar: "XXXXXXX", // Replace with your Hotjar ID
    mixpanel: "XXXXXXXXXX", // Replace with your Mixpanel token
  },
  integrations: {
    stripe: "Secure payment processing",
    nextauth: "Multiple authentication providers",
    prisma: "Robust database management",
    resend: "Professional email delivery",
    vercel: "Fast, reliable hosting",
  },
  seo: {
    defaultTitle: "Softinvoice Pro - Professional Invoice Generator",
    titleTemplate: "%s | Softinvoice Pro",
    defaultDescription:
      "Create professional invoices in seconds. Manage clients, track payments, and get paid faster with Softinvoice.",
    siteUrl: "https://www.softinvoice.pro",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Softinvoice",
    },
    twitter: {
      handle: "@softinvoice",
      site: "@softinvoice",
      cardType: "summary_large_image",
    },
  },
};

export type SiteConfig = typeof siteConfig;

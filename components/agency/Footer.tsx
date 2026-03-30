import React from "react";
import Link from "next/link";

import { Twitter, Linkedin, Mail } from "lucide-react";
import Logo from "../global/Logo";

// Types
interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

// Footer Data
const footerSections: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Templates", href: "/templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "Features", href: "/features" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "API Docs", href: "/api-docs" },
      { label: "Invoice Guide", href: "/guide" },
      { label: "Contact Support", href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const socialLinks: SocialLink[] = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Mail, href: "mailto:support@invoicepro.com", label: "Email" },
];

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Company Info */}
          <div className="">
            <div className="mb-6">
              <Logo variant="dark" />
            </div>
            <p className="text-slate-400 mb-6 max-w-sm leading-relaxed">
              Create professional invoices in seconds. Trusted by thousands of
              businesses worldwide for fast, reliable invoice generation.
            </p>
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-sm font-semibold mb-4 text-slate-200">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-500 text-sm">
              © {new Date().getFullYear()} Invoice Pro. All rights reserved.
            </div>
            <div className="text-slate-500 text-sm">
              Made with ❤️ for better business invoicing
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

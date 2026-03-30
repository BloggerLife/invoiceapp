"use client";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import AuthModal from "../auth/auth-modal";
import { AuthUser } from "@/config/useAuth";
import { UserDropdownMenu } from "../UserDropdownMenu";

import { usePathname } from "next/navigation";
import Logo from "../global/Logo";

export default function NavBar({ user }: { user: AuthUser | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  // Handle scroll events for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Invoice-focused navigation items
  const navItems = [
    {
      name: "Create Invoice",
      href: "/dashboard/invoices/new",
    },
    // {
    //   name: "Templates",
    //   href: "/templates",
    // },

    { name: "Pricing", href: "/pricing" },
    // {
    //   name: "Resources",
    //   href: "#",
    //   dropdown: [
    //     { name: "Help Center", href: "/help" },
    //     { name: "Invoice Best Practices", href: "/resources/best-practices" },
    //     { name: "Tax Guidelines", href: "/resources/tax-guidelines" },
    //     { name: "API Documentation", href: "/resources/api-docs" },
    //   ],
    // },
  ];

  const toggleDropdown = (name: string | null) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-16 flex justify-between items-center transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-slate-200/50"
            : "bg-white border-b border-slate-200"
        }`}
      >
        <div className="flex items-center">
          <Logo variant="light" />
        </div>

        {/* Desktop Navigation - Centered Links */}
        <div className="hidden lg:flex items-center justify-center space-x-1 flex-1 mx-4">
          {navItems.map((item) => (
            <div key={item.name}>
              {/* {item.dropdown ? (
                <div className="relative group">
                  <button
                    className={`px-4 py-2 rounded-md hover:bg-slate-100 transition duration-300 flex items-center ${
                      activeDropdown === item.name
                        ? "text-blue-600 bg-blue-50"
                        : "text-slate-700"
                    }`}
                    onClick={() => toggleDropdown(item.name)}
                    onMouseEnter={() =>
                      item.dropdown && setActiveDropdown(item.name)
                    }
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.name}
                    {item.dropdown && (
                      <ChevronDown
                        size={16}
                        className={`ml-1 transition-transform duration-300 ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                
                  {item.dropdown && activeDropdown === item.name && (
                    <div
                      className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-20"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition duration-150"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`block px-4 py-2 text-sm rounded-md transition duration-150 ${
                    pathname === item.href
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {item.name}
                </Link>
              )} */}
              <Link
                href={item.href}
                className={`block px-4 py-2 text-sm rounded-md transition duration-150 ${
                  pathname === item.href
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                }`}
              >
                {item.name}
              </Link>
            </div>
          ))}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 md:gap-4">
          {user && user.id ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition"
              >
                Dashboard
              </Link>
              <div className="hidden md:block">
                <UserDropdownMenu
                  username={user.name || "User"}
                  email={user.email || ""}
                  avatarUrl={user.image || undefined}
                />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth"
                className="px-4 py-2 text-xs md:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition duration-300"
              >
                Get Started
              </Link>
              <div className="hidden md:block">
                <AuthModal
                  trigger={
                    <button className="px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
                      Sign In
                    </button>
                  }
                />
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-slate-700 p-2 rounded-md hover:bg-slate-100 transition duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-xl lg:hidden overflow-y-auto">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <Logo variant="light" />
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-md hover:bg-slate-100 transition duration-200"
                >
                  <X size={24} className="text-slate-700" />
                </button>
              </div>

              <div className="flex-1 py-4 overflow-y-auto">
                {/* Mobile Menu Items with Accordions */}
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <div key={item.name} className="border-b border-slate-100">
                      {/* {item.dropdown ? (
                        <div>
                          <button
                            onClick={() => toggleDropdown(item.name)}
                            className="flex items-center justify-between w-full px-6 py-4 text-slate-700 hover:bg-slate-50 transition duration-200"
                          >
                            <span>{item.name}</span>
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-300 ${
                                activeDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {activeDropdown === item.name && (
                            <div className="bg-slate-50/50">
                              {item.dropdown.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className="block px-10 py-3 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition duration-200"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`block px-6 py-4 transition duration-200 ${
                            pathname === item.href
                              ? "text-blue-600 bg-blue-50"
                              : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )} */}
                      <Link
                        href={item.href}
                        className={`block px-6 py-4 transition duration-200 ${
                          pathname === item.href
                            ? "text-blue-600 bg-blue-50"
                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Auth/User Section */}
              <div className="p-6 border-t border-slate-200 mt-auto">
                {user && user.id ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-slate-200">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-600 text-white font-medium">
                            {user.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-slate-700 font-medium">
                          {user.name}
                        </p>
                        <p className="text-slate-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full py-2 text-center bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition duration-200"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <AuthModal
                      trigger={
                        <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition duration-300 text-white font-medium">
                          Sign In
                        </button>
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-[72px]"></div>
    </>
  );
}

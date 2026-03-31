"use client";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function Logo({
  variant = "light",
  href = "/",
  className = "",
  isCollapsed = false,
}: {
  variant?: "dark" | "light";
  href?: string;
  className?: string;
  isCollapsed?: boolean;
}) {
  // Professional invoice-themed colors
  const primaryColor = variant === "light" ? "text-[#1e293b]" : "text-white";
  const accentColor = "text-[#3b82f6]"; // Professional blue
  const gradientFrom = "from-[#3b82f6]"; // Blue
  const gradientTo = "to-[#1d4ed8]"; // Darker blue

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 transition-all hover:opacity-80",
        isCollapsed ? "justify-center" : "",
        className,
      )}
    >
      {/* Logo Mark - Professional invoice icon with "I" */}
      <div className="relative h-10 w-10 flex-shrink-0">
        <motion.div
          className={cn(
            "rounded-lg flex items-center justify-center shadow-lg",
            `bg-gradient-to-br ${gradientFrom} ${gradientTo}`,
            isCollapsed ? "h-10 w-10" : "h-10 w-10",
          )}
          initial={false}
          animate={
            isCollapsed
              ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 2, repeat: Infinity },
                }
              : { scale: 1 }
          }
        >
          {/* Invoice/Document Icon Background */}
          <motion.div
            className="relative flex items-center justify-center h-full w-full"
            initial={false}
            animate={
              isCollapsed
                ? {
                    rotate: [0, 2, 0],
                    transition: { duration: 3, repeat: Infinity },
                  }
                : { rotate: 0 }
            }
          >
            {/* Document/Invoice Lines */}
            <div className="absolute inset-2 flex flex-col justify-center space-y-0.5 opacity-20">
              <div className="h-0.5 bg-white rounded w-4"></div>
              <div className="h-0.5 bg-white rounded w-3"></div>
              <div className="h-0.5 bg-white rounded w-4"></div>
            </div>

            {/* The "I" letter for Invoice */}
            <span className="text-xl font-bold text-white z-10">I</span>
          </motion.div>

          {/* Subtle glow animation when collapsed */}
          {isCollapsed && (
            <motion.div
              className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 opacity-20"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.1, 1],
                transition: { duration: 2, repeat: Infinity },
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Text part - Professional invoice branding */}
      {!isCollapsed && (
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-baseline">
            <span className={cn("text-2xl font-bold", accentColor)}>Soft</span>
            <span className={cn("text-2xl font-bold", primaryColor)}>
              invoice
            </span>
          </div>
          <span
            className={cn(
              "text-xs tracking-wider uppercase -mt-1 font-medium",
              variant === "light" ? "text-slate-500" : "text-slate-400",
            )}
          ></span>
        </motion.div>
      )}
    </Link>
  );
}

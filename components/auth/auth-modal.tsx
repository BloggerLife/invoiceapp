"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import AuthForm from "@/components/auth/auth-form";

import Link from "next/link";
import { Shield, CheckCircle, Zap } from "lucide-react";
import Logo from "../global/Logo";

interface AuthModalProps {
  trigger?: React.ReactNode;
}

export default function AuthModal({ trigger }: AuthModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default">Sign In</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 border-0 shadow-2xl bg-gradient-to-br from-white via-slate-50 to-blue-50/30">
        {/* Premium backdrop with subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.15),rgba(255,255,255,0))] rounded-lg"></div>

        {/* Subtle border glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-blue-100/50 via-transparent to-indigo-100/30 p-[1px]">
          <div className="rounded-lg bg-white/80 backdrop-blur-sm h-full w-full"></div>
        </div>

        <div className="relative rounded-lg p-8 w-full">
          {/* Premium header with Invoice Pro Logo */}
          <div className="flex flex-col items-center justify-center space-y-6">
            {/* Invoice Pro Logo with enhanced styling */}
            <div className="relative">
              <div className="p-3 px-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white shadow border border-slate-200/50">
                <Logo
                  href="/"
                  variant="light"
                  className="scale-110 transform"
                />
              </div>
            </div>

            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-blue-600 bg-clip-text text-transparent">
                Welcome to Softinvoice Pro
              </h1>
              <p className="text-slate-600 text-sm max-w-sm mx-auto leading-relaxed">
                Sign in to access your professional invoice generator and manage
                your business documents with ease
              </p>
            </div>

            <div className="w-full space-y-4">
              <AuthForm onSuccess={() => setOpen(false)} />
            </div>

            {/* Enhanced footer */}
            <div className="pt-6 border-t border-slate-100 w-full">
              <div className="text-center space-y-3">
                <div className="text-sm text-slate-600">
                  Need help getting started?{" "}
                  <Link
                    href="/contact"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors duration-200 hover:underline decoration-blue-600/30 underline-offset-4"
                  >
                    Contact our support team
                  </Link>
                </div>
                <div className="text-xs text-slate-500">
                  Join thousands of professionals using Softinvoice Pro
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle corner accents - adjusted colors to match invoice theme */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-100/40 to-transparent rounded-tl-lg"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-100/40 to-transparent rounded-br-lg"></div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

const SuccessPage: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);

    // Show animation after a delay
    setTimeout(() => setShowAnimation(true), 300);

    return () => clearInterval(interval);
  }, []);

  const features = [
    "Create unlimited professional invoices",
    "Add your custom branding and logo",
    "Track payment status in real-time",
    "Generate detailed financial reports",
    "Access priority customer support",
    "Export data in multiple formats",
  ];

  const handleCreateInvoice = () => {
    // Navigate to invoice creation page
    router.push("/dashboard/invoices");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Success Header */}
        <div
          className={`text-center mb-12 transform transition-all duration-1000 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome Aboard! 🎉
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Your subscription has been activated successfully
          </p>

          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-2" />
            Payment Confirmed
          </div>
        </div>

        {/* Features Unlocked Card */}
        <div
          className={`bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transform transition-all duration-1000 delay-300 mb-8 ${
            showAnimation
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Features Unlocked
            </h2>
            <p className="text-gray-600">
              You now have access to all premium features
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-700 font-medium text-center">
              💡 Pro Tip: Start with our invoice templates to create your first
              professional invoice in under 2 minutes!
            </p>
          </div>

          <button
            onClick={handleCreateInvoice}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center group shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            <span>Create Your First Invoice</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Simple Footer */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Need help getting started? We're here to help!
          </p>
          <button
            onClick={() => router.push("/support")}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;

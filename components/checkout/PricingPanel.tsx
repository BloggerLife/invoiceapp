"use client";
import React from "react";
// import { PricingOption } from "@/lib/stripe";
import { PricingOption, PricingTier } from "@/stores/subscription-store";

interface PricingPanelProps {
  selectedTier: PricingTier;
  pricingOption: PricingOption;
  onChangePlan: () => void;
}

export const PricingPanel: React.FC<PricingPanelProps> = ({
  selectedTier,
  pricingOption,
  onChangePlan,
}) => {
  return (
    <div className="bg-blue-700 text-white p-8 rounded-l-xl flex flex-col h-full">
      <div className="flex justify-center mb-8">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">
          Simple, Transparent pricing
        </h2>
        <p className="text-xl">For everyone</p>
        <p className="text-sm mt-4 text-white/80">
          Every paid plan includes a 14-day free trial. No credit card required.
        </p>
      </div>

      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-pink-200 rounded-lg flex items-center justify-center mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-pink-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <div>
            <p className="text-sm text-white/80">{pricingOption.name}</p>
            <p className="text-xl font-semibold">
              UGX {pricingOption.priceUGX.toLocaleString()}/month
            </p>
          </div>
        </div>
        <button
          onClick={onChangePlan}
          className="text-sm text-indigo-200 hover:text-white mt-2 float-right"
        >
          Change plan
        </button>
      </div>

      <div className="flex-grow">
        <ul className="space-y-4">
          {pricingOption.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-center space-x-2">
          <div className="flex -space-x-2">
            <img
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="User"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
              src="https://randomuser.me/api/portraits/women/44.jpg"
              alt="User"
            />
            <img
              className="w-8 h-8 rounded-full border-2 border-indigo-500"
              src="https://randomuser.me/api/portraits/men/51.jpg"
              alt="User"
            />
          </div>
          <span className="text-sm">4.3M</span>
        </div>
        <p className="text-xs text-center mt-1 text-white/70">
          Active users all around the globe
        </p>
      </div>

      <div className="mt-6 text-xs text-center text-white/60">
        <span className="cursor-pointer hover:text-white">
          Terms & Condition
        </span>
        <span className="mx-2">·</span>
        <span className="cursor-pointer hover:text-white">Policy</span>
      </div>
    </div>
  );
};

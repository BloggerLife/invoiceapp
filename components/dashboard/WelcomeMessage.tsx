import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "@/lib/generateInitials";

interface WelcomeSectionProps {
  user: {
    name: string;
    image?: string | null;
    role?: string;
  };
}

const WelcomeSection = ({ user }: WelcomeSectionProps) => {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  const initials = getInitials(user.name);
  return (
    <div className="mb-4">
      <div className="flex items-center gap-4">
        <Avatar className="hidden md:block">
          <AvatarImage src={user?.image ?? ""} alt={user.name ?? ""} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
            {getGreeting()}, {user.name}! 👋
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm md:text-base">
            Welcome back to your dashboard. Here's what's happening today.
          </p>
        </div>
      </div>

      {user.role && user.role !== "ADMIN" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
            <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Account Type
            </div>
            <div className="text-sm md:text-lg font-semibold text-purple-700 dark:text-purple-300 capitalize">
              {user.role?.toLowerCase() || "User"}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Last Login
            </div>
            <div className="text-sm md:text-lg font-semibold text-blue-700 dark:text-blue-300">
              {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-4 border border-emerald-100 dark:border-emerald-800">
            <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Status
            </div>
            <div className="text-sm md:text-lg font-semibold text-emerald-700 dark:text-emerald-300">
              Active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;

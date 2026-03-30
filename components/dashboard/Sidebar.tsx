"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BookOpenCheck,
  DollarSign,
  Home,
  LayoutGrid,
  Lock,
  Plus,
  Settings,
  User,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "../global/Logo";
import { signOut } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { getRoutesByGroup } from "@/config/protected-routes";
import { Session } from "next-auth";

interface SidebarProps {
  role: UserRole;
  session: Session;
}

export default function Sidebar({ role, session }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const routeGroups = getRoutesByGroup(role);
  const user = session.user;

  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        "h-screen border-r bg-gradient-to-b from-white to-slate-50/50 shadow-xl transition-all duration-300 ease-in-out flex flex-col",
        isCollapsed ? "w-[80px]" : "w-[220px] lg:w-[280px]"
      )}
    >
      {/* Header with Logo and Collapse Toggle */}
      <div className="flex h-14 items-center border-b border-slate-200/60 px-4 lg:h-[60px] lg:px-6 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          {!isCollapsed && <Logo href="/dashboard" />}
          {isCollapsed && (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">L</span>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center space-x-2">
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 hover:bg-slate-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-slate-600" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            )}
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
          <nav className="grid items-start gap-1 p-3 text-sm font-medium">
            {/* Grouped Navigation Items */}
            {Array.from(routeGroups.entries()).map(([group, routes]) => (
              <div key={group} className="space-y-1">
                {group !== "Other" && !isCollapsed && (
                  <h4 className="text-xs font-semibold text-slate-500 px-3 py-2 uppercase tracking-wider">
                    {group}
                  </h4>
                )}
                {routes.map((route, i) => {
                  const Icon = route.icon;
                  const isActive = route.href === pathname;
                  return (
                    <Link
                      key={i}
                      href={route.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-600 transition-all duration-200 hover:bg-slate-100/80 hover:text-slate-900 relative",
                        isActive &&
                          "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100",
                        isCollapsed && "justify-center px-2"
                      )}
                      title={isCollapsed ? route.title : undefined}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 transition-colors",
                          isActive && "text-blue-600"
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium">{route.title}</span>
                          {route.isNew && (
                            <span className="ml-auto text-xs bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-2 py-1 rounded-full font-semibold">
                              New
                            </span>
                          )}
                        </>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* User Profile Section */}
        <div className="border-t border-slate-200/60 bg-white/60 backdrop-blur-sm">
          <div className="p-4 space-y-3">
            {/* User Info */}
            <div
              className={cn(
                "flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/30 border border-slate-200/50",
                isCollapsed && "justify-center px-2"
              )}
            >
              <Avatar
                className={cn(
                  "ring-2 ring-blue-200 ring-offset-2",
                  isCollapsed ? "h-8 w-8" : "h-10 w-10"
                )}
              >
                <AvatarImage
                  src={user.image || undefined}
                  alt={user.name || "User"}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                  {getUserInitials(user.name || "User")}
                </AvatarFallback>
              </Avatar>

              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={cn(
                "w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 group",
                isCollapsed && "justify-center px-2"
              )}
              title={isCollapsed ? "Logout" : undefined}
            >
              <LogOut className="h-4 w-4 group-hover:text-red-600" />
              {!isCollapsed && <span className="ml-2">Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle accent line */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent"></div>
    </div>
  );
}

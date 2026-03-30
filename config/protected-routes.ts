// config/routes.ts

import { UserRole } from "@prisma/client";
import {
  Home,
  LayoutGrid,
  BookOpenCheck,
  Lock,
  Settings,
  Users,
  BookOpen,
  UserPen,
  Monitor,
  HandHeart,
  FileText,
  Crown,
  Package,
  BarChart3,
  Receipt,
  CreditCard,
  Building,
  FileTextIcon,
  Wallet,
} from "lucide-react";

export type Route = {
  title: string;
  href: string;
  icon: any;
  roles?: UserRole[]; // Which roles can access this route
  group?: string; // Optional grouping for related routes
  isNew?: boolean; // Optional flag for new features
};

export const routes: Route[] = [
  // Dashboard - accessible to all
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    roles: ["USER", "ADMIN"],
  },
  // ADMIN ONLY SECTIONS
  {
    title: "All Users",
    href: "/dashboard/users",
    icon: Users,
    roles: ["ADMIN"],
    group: "Administration",
  },
  // {
  //   title: "Pricing Plans",
  //   href: "/dashboard/admin/pricing",
  //   icon: Package,
  //   roles: ["ADMIN"],
  //   group: "Administration",
  //   isNew: true,
  // },
  // {
  //   title: "Subscriptions",
  //   href: "/dashboard/admin/subscriptions",
  //   icon: Crown,
  //   roles: ["ADMIN"],
  //   group: "Administration",
  // },

  // INVOICE MANAGEMENT SECTION

  {
    title: "Invoices",
    href: "/dashboard/invoices",
    icon: FileText,
    roles: ["USER", "ADMIN"],
    group: "Invoices",
  },
  {
    title: "Clients",
    href: "/dashboard/clients",
    icon: Building,
    roles: ["USER", "ADMIN"],
    group: "Invoices",
  },

  // BILLING & SUBSCRIPTION (For Users)
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: Wallet,
    roles: ["USER", "ADMIN"],
    group: "Billing",
    isNew: true,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
    roles: ["USER", "ADMIN"],
    group: "Billing",
  },
  {
    title: "Pro Users",
    href: "/dashboard/pro-users",
    icon: Users,
    roles: ["ADMIN"],
    group: "Billing",
  },
  // SETTINGS (Available to appropriate roles)
  // {
  //   title: "Invoice Templates",
  //   href: "/dashboard/settings/invoice-templates",
  //   icon: FileTextIcon,
  //   roles: ["USER", "ADMIN"],
  //   group: "Settings",
  // },
  {
    title: "Profile Settings",
    href: "/dashboard/settings/profile",
    icon: UserPen,
    roles: ["USER", "ADMIN"],
    group: "Settings",
  },
  {
    title: "Brand Settings",
    href: "/dashboard/settings/brand",
    icon: Building,
    roles: ["USER", "ADMIN"],
    group: "Settings",
  },
];

// Helper function to get routes for a specific role
export const getRoutesByRole = (role: UserRole) => {
  return routes.filter((route) => route.roles?.includes(role));
};

// Helper function to get routes by group for a specific role
export const getRoutesByGroup = (role: UserRole) => {
  const userRoutes = getRoutesByRole(role);
  const groups = new Map<string, Route[]>();

  userRoutes.forEach((route) => {
    const group = route.group || "Other";
    if (!groups.has(group)) {
      groups.set(group, []);
    }
    groups.get(group)?.push(route);
  });

  return groups;
};

// Helper to check if a user has access to a specific route
export const hasRouteAccess = (route: Route, role: UserRole) => {
  return route.roles?.includes(role);
};

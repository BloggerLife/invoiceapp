"use client";
import React from "react";
import Link from "next/link";
import { DollarSign, Home, Menu, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Session } from "next-auth";
import { AvatarMenuButton } from "./AvatarMenuButton";
import Logo from "../global/Logo";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { getRoutesByRole } from "@/config/protected-routes";
import { UserDropdownMenu } from "../UserDropdownMenu";
export default function Navbar({ session }: { session: Session }) {
  const router = useRouter();
  async function handleLogout() {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
    }
  }
  const user = session.user;
  const role = session.user.role;
  const pathname = usePathname();
  const routes = getRoutesByRole(role);
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-muted/40 px-4 backdrop-blur-sm lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            <Logo href="/dashboard" />
            {session.user.role === "ADMIN" && (
              <Button className="mt-4" asChild>
                <Link href="/dashboard/savings/new">Add Saving</Link>
              </Button>
            )}
            {routes.map((item, i) => {
              const Icon = item.icon;
              const isActive = item.href === pathname;
              return (
                <Link
                  key={i}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    isActive && " bg-muted  text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto">
            <Button onClick={handleLogout} size="sm" className="w-full">
              Logout
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1"></div>

      {/* <ModeToggle /> */}

      <UserDropdownMenu
        username={user.name || "User"}
        email={user.email || ""}
        avatarUrl={user.image || undefined}
      />
    </header>
  );
}

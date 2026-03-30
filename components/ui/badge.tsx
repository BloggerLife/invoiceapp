import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        success:
          "border-transparent bg-green-100 text-green-800 hover:bg-green-200",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
        info: "border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200",
        purple:
          "border-transparent bg-purple-100 text-purple-800 hover:bg-purple-200",
        orange:
          "border-transparent bg-orange-100 text-orange-800 hover:bg-orange-200",
        pink: "border-transparent bg-pink-100 text-pink-800 hover:bg-pink-200",
        indigo:
          "border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
        emerald:
          "border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
        slate:
          "border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200",
        zinc: "border-transparent bg-zinc-100 text-zinc-800 hover:bg-zinc-200",
        red: "border-transparent bg-red-100 text-red-800 hover:bg-red-200",
        amber:
          "border-transparent bg-amber-100 text-amber-800 hover:bg-amber-200",
        lime: "border-transparent bg-lime-100 text-lime-800 hover:bg-lime-200",
        cyan: "border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
        teal: "border-transparent bg-teal-100 text-teal-800 hover:bg-teal-200",
        violet:
          "border-transparent bg-violet-100 text-violet-800 hover:bg-violet-200",
        fuchsia:
          "border-transparent bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-200",
        rose: "border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };

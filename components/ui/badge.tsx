import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[#F3F4F6] text-[#6B7280]",
        success: "bg-[#DCFCE7] text-[#16A34A]",
        warning: "bg-[#FEE2E2] text-[#DC2626]",
        pending: "bg-[#FEF3C7] text-[#D97706]",
        primary: "bg-[#EEF2FF] text-[#6366F1]",
        secondary: "bg-[#F3F4F6] text-[#6B7280]",
        destructive: "bg-[#FEE2E2] text-[#DC2626]",
        outline: "border border-[#E5E7EB] text-[#6B7280]",
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

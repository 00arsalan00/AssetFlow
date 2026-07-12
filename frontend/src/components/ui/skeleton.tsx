import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted/70",
  {
    variants: {
      variant: {
        text: "h-4 w-full rounded-md",
        circle: "aspect-square h-10 w-10 rounded-full",
        rect: "h-6 w-full rounded-md",
      },
      size: {
        default: "",
        sm: "h-3",
        lg: "h-8",
      },
    },
    defaultVariants: {
      variant: "rect",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string
  height?: string
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, size, width, height, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(skeletonVariants({ variant, size, className }))}
      style={{ width, height, ...style }}
      {...props}
    />
  )
)
Skeleton.displayName = "Skeleton"

export { Skeleton, skeletonVariants }

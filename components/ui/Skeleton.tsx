import React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

/**
 * Skeleton variants using CVA.
 * - card: full-width rounded rectangle for song card placeholders
 * - text: inline text line placeholder
 * - circle: circular avatar / artwork placeholder
 */
const skeletonVariants = cva(["animate-pulse", "bg-gray-200", "dark:bg-gray-700"], {
  variants: {
    variant: {
      card: ["rounded-xl", "w-full"],
      text: ["rounded-md"],
      circle: ["rounded-full"],
    },
  },
  defaultVariants: {
    variant: "text",
  },
})

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof skeletonVariants> {}

/**
 * Skeleton loading placeholder with card, text, and circle variants.
 * Always hidden from screen readers (aria-hidden).
 */
export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return <div className={twMerge(skeletonVariants({ variant, className }))} aria-hidden="true" {...props} />
}

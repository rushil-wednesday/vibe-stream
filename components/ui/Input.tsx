"use client"

import { cva, type VariantProps } from "class-variance-authority"
import React from "react"
import { twMerge } from "tailwind-merge"

/**
 * Input variants using CVA.
 * - default: standard text input
 * - search: with left padding reserved for search icon
 */
const inputVariants = cva(
  [
    "flex",
    "w-full",
    "rounded-lg",
    "border",
    "bg-white",
    "text-gray-900",
    "placeholder:text-gray-400",
    "transition-colors",
    "duration-150",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-violet-500",
    "focus:border-transparent",
    "disabled:cursor-not-allowed",
    "disabled:opacity-50",
    "dark:bg-gray-900",
    "dark:text-gray-100",
    "dark:placeholder:text-gray-500",
    "dark:border-gray-700",
    "dark:focus:ring-violet-400",
  ],
  {
    variants: {
      variant: {
        default: ["border-gray-200", "px-4"],
        search: ["border-gray-200", "pl-10", "pr-10"],
      },
      size: {
        sm: ["h-8", "text-sm"],
        md: ["h-10", "text-sm"],
        lg: ["h-12", "text-base"],
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

// Omit native HTML `size` (number) to avoid conflict with CVA size variant (string union)
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

/**
 * Input component with default and search variants.
 * Forwards ref for integration with form libraries and focus management.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, size, ...props }, ref) => {
  return <input className={twMerge(inputVariants({ variant, size, className }))} ref={ref} {...props} />
})

Input.displayName = "Input"

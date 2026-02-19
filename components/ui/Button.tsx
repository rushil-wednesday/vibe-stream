"use client"

import React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

/**
 * Button variants using CVA.
 * - primary: filled violet, main CTAs
 * - secondary: outlined, secondary actions
 * - ghost: transparent, subtle actions
 * - icon: square/circle for icon-only buttons
 */
const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-lg",
    "font-medium",
    "transition-colors",
    "duration-150",
    "cursor-pointer",
    "select-none",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-violet-500",
    "focus-visible:ring-offset-2",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-violet-600",
          "text-white",
          "hover:bg-violet-700",
          "active:bg-violet-800",
          "dark:bg-violet-500",
          "dark:hover:bg-violet-400",
        ],
        secondary: [
          "border",
          "border-gray-200",
          "bg-white",
          "text-gray-900",
          "hover:bg-gray-50",
          "active:bg-gray-100",
          "dark:border-gray-700",
          "dark:bg-transparent",
          "dark:text-gray-100",
          "dark:hover:bg-gray-800",
        ],
        ghost: [
          "bg-transparent",
          "text-gray-700",
          "hover:bg-gray-100",
          "active:bg-gray-200",
          "dark:text-gray-300",
          "dark:hover:bg-gray-800",
          "dark:active:bg-gray-700",
        ],
        icon: [
          "rounded-full",
          "bg-gray-100",
          "text-gray-700",
          "hover:bg-gray-200",
          "active:bg-gray-300",
          "dark:bg-gray-800",
          "dark:text-gray-300",
          "dark:hover:bg-gray-700",
          "dark:active:bg-gray-600",
        ],
      },
      size: {
        sm: ["h-8", "px-3", "text-xs"],
        md: ["h-10", "px-4", "text-sm"],
        lg: ["h-12", "px-6", "text-base"],
        icon: ["h-10", "w-10", "p-0", "rounded-full"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Renders an <a> tag when provided */
  href?: string
  target?: string
  rel?: string
}

/**
 * Versatile Button component with primary/secondary/ghost/icon variants.
 * Renders as <a> when href is supplied, otherwise as <button>.
 */
export function Button({ className, variant, size, href, target, rel, children, ...props }: ButtonProps) {
  const classes = twMerge(buttonVariants({ variant, size, className }))

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}

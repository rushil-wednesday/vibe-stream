"use client"

import React from "react"

import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

/**
 * Card variants using CVA.
 * - default: static display card
 * - interactive: hover elevation for clickable cards
 * - playing: accent border + glow for the currently-playing song card
 */
const cardVariants = cva(["rounded-xl", "overflow-hidden", "transition-all", "duration-200"], {
  variants: {
    variant: {
      default: ["bg-white", "border", "border-gray-200", "dark:bg-gray-900", "dark:border-gray-700"],
      interactive: [
        "bg-white",
        "border",
        "border-gray-200",
        "cursor-pointer",
        "hover:shadow-lg",
        "hover:-translate-y-0.5",
        "dark:bg-gray-900",
        "dark:border-gray-700",
        "dark:hover:shadow-black/40",
      ],
      playing: [
        "bg-white",
        "border-2",
        "border-violet-500",
        "shadow-lg",
        "shadow-violet-500/20",
        "cursor-pointer",
        "dark:bg-gray-900",
        "dark:border-violet-400",
        "dark:shadow-violet-400/30",
      ],
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/**
 * Card surface component with default, interactive, and playing variants.
 * The playing variant applies a violet accent border + drop shadow for the
 * currently-playing song card.
 */
export function Card({ className, variant, ...props }: CardProps) {
  return <div className={twMerge(cardVariants({ variant, className }))} {...props} />
}

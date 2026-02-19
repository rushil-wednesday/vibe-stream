"use client"

import React from "react"

import * as RadixSlider from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

/**
 * Slider variants using CVA.
 * - progress: full-width seek bar for the audio player
 * - volume: compact horizontal volume control
 */
const rootVariants = cva(["relative", "flex", "items-center", "select-none", "touch-none", "w-full"], {
  variants: {
    variant: {
      progress: ["h-5", "cursor-pointer"],
      volume: ["h-5", "cursor-pointer", "max-w-28"],
    },
  },
  defaultVariants: { variant: "progress" },
})

const trackVariants = cva(["relative", "grow", "rounded-full"], {
  variants: {
    variant: {
      progress: ["h-1", "bg-gray-200", "dark:bg-gray-700"],
      volume: ["h-1", "bg-gray-200", "dark:bg-gray-700"],
    },
  },
  defaultVariants: { variant: "progress" },
})

const rangeVariants = cva(["absolute", "h-full", "rounded-full"], {
  variants: {
    variant: {
      progress: ["bg-violet-500", "dark:bg-violet-400"],
      volume: ["bg-violet-500", "dark:bg-violet-400"],
    },
  },
  defaultVariants: { variant: "progress" },
})

const thumbVariants = cva(
  [
    "block",
    "rounded-full",
    "bg-white",
    "border",
    "border-gray-300",
    "shadow-md",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-violet-500",
    "focus-visible:ring-offset-2",
    "transition-transform",
    "hover:scale-125",
    "dark:border-gray-600",
    "dark:focus-visible:ring-violet-400",
  ],
  {
    variants: {
      variant: {
        progress: ["w-3", "h-3"],
        volume: ["w-3", "h-3"],
      },
    },
    defaultVariants: { variant: "progress" },
  }
)

export interface SliderProps extends Omit<RadixSlider.SliderProps, "dir">, VariantProps<typeof rootVariants> {
  className?: string
  /** Hide the drag thumb (useful for read-only progress indicators) */
  showThumb?: boolean
}

/**
 * Accessible slider built on Radix Slider.
 * - progress variant: full-width audio seek bar
 * - volume variant: compact volume knob
 */
export function Slider({ className, variant, showThumb = true, ...props }: SliderProps) {
  return (
    <RadixSlider.Root className={twMerge(rootVariants({ variant, className }))} {...props}>
      <RadixSlider.Track className={trackVariants({ variant })}>
        <RadixSlider.Range className={rangeVariants({ variant })} />
      </RadixSlider.Track>
      {showThumb && <RadixSlider.Thumb className={thumbVariants({ variant })} aria-label="Adjust value" />}
    </RadixSlider.Root>
  )
}

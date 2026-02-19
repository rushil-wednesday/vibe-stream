"use client"

import React, { useState } from "react"

import { EyeIcon, EyeOffIcon } from "assets/icons"
import { Input, type InputProps } from "components/ui/Input"

interface PasswordInputProps extends Omit<InputProps, "type"> {
  label?: string
}

/**
 * Password input with a show/hide toggle button.
 * Wraps the existing Input component.
 */
export function PasswordInput({ label = "Password", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} aria-label={label} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-3 -translate-y-1/2 text-[--text-secondary] hover:text-[--text-primary]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>
  )
}

import * as React from "react"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <label className={cn("inline-flex items-center", className)}>
    <input
      type="checkbox"
      role="switch"
      ref={ref}
      className="peer sr-only"
      {...props}
    />
    <span className="inline-flex h-6 w-11 items-center rounded-full border border-input bg-muted transition-colors duration-200 peer-checked:border-primary peer-checked:bg-primary">
      <span className="ml-0.5 h-5 w-5 rounded-full bg-background shadow-sm transition-transform duration-200 peer-checked:translate-x-5" />
    </span>
  </label>
))
Switch.displayName = "Switch"

export { Switch }

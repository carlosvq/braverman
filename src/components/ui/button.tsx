import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium whitespace-nowrap transition-[color,background-color,border-color,transform] duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 motion-safe:active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-[var(--parc-button-bg)] bg-[var(--parc-button-bg)] text-[var(--parc-button-text)] hover:border-[var(--parc-button-bg-hover)] hover:bg-[var(--parc-button-bg-hover)]",
        outline:
          "border-[var(--parc-border-strong)] bg-transparent text-[var(--parc-heading)] hover:border-[var(--parc-heading)]",
        secondary:
          "border-[var(--parc-border)] bg-white text-[var(--parc-heading)] hover:border-[var(--parc-border-strong)]",
        ghost:
          "border-transparent bg-transparent text-[var(--parc-body)] hover:bg-[var(--parc-border)] hover:text-[var(--parc-heading)]",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4 text-sm",
        xs: "h-6 gap-1 px-2.5 text-xs",
        sm: "h-8 gap-1 px-3 text-sm",
        lg: "h-11 gap-1.5 px-5 text-sm",
        icon: "size-9 p-0",
        "icon-xs": "size-6 p-0 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 p-0 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

import React from "react"
import clsx from "clsx"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx("rounded-lg border border-slate-200 bg-white shadow-sm", className)}
      {...props}
    />
  )
)

Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)

CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, CardProps>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref as any} className={clsx("text-2xl font-semibold leading-none", className)} {...props} />
  )
)

CardTitle.displayName = "CardTitle"

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={clsx("p-6 pt-0", className)} {...props} />
  )
)

CardContent.displayName = "CardContent"

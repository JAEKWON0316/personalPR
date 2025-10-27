import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const cardVariants = cva(
  "relative overflow-hidden transition-all duration-300 group",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl rounded-xl",
        glassmorphism: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 shadow-xl hover:shadow-2xl rounded-2xl",
        elevated: "bg-white dark:bg-gray-800 border-0 shadow-xl hover:shadow-2xl rounded-2xl",
        gradient: "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl rounded-xl",
        minimal: "bg-transparent border border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg",
      },
      padding: {
        none: "",
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        none: "",
        hover: "hover:scale-[1.02] hover:-translate-y-1 cursor-pointer",
        subtle: "hover:scale-[1.01] cursor-pointer",
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "none",
      interactive: "none",
    },
  }
)

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  animated?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, animated = false, children, ...props }, ref) => {
    const {
      onAnimationStart: _onAnimationStart,
      onAnimationEnd: _onAnimationEnd,
      onDrag: _onDrag,
      onDragStart: _onDragStart,
      onDragEnd: _onDragEnd,
      onPointerDown: _onPointerDown,
      onPointerUp: _onPointerUp,
      ...restProps
    } = props;

    if (animated) {
      return (
        <motion.div
          ref={ref}
          className={cn(cardVariants({ variant, padding, interactive, className }))}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={interactive ? { y: -5, boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)' } : undefined}
          {...restProps}
        >
          {/* Glassmorphism overlay */}
          {variant === "glassmorphism" && (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-gray-700/10 dark:to-gray-800/5" />
          )}
          
          {/* Hover glow effect */}
          {interactive !== "none" && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          
          <div className="relative z-10">
            {children}
          </div>
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, interactive, className }))}
        {...props}
      >
        {/* Glassmorphism overlay */}
        {variant === "glassmorphism" && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 dark:from-gray-700/10 dark:to-gray-800/5" />
        )}
        
        {/* Hover glow effect */}
        {interactive !== "none" && (
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-gray-100", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-gray-600 dark:text-gray-400 leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants }
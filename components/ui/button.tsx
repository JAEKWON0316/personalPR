import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:from-blue-700 hover:to-cyan-600 border border-blue-500/30 backdrop-blur-lg rounded-xl",
        destructive:
          "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-600 hover:to-red-700 border border-red-500/30 backdrop-blur-lg rounded-xl",
        outline:
          "border border-white/30 dark:border-gray-700/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl shadow-lg hover:shadow-xl text-gray-700 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-800/90 rounded-xl",
        secondary:
          "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 border border-purple-500/30 backdrop-blur-lg rounded-xl",
        ghost: 
          "bg-transparent hover:bg-white/10 dark:hover:bg-gray-800/20 backdrop-blur-lg text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white rounded-xl border border-transparent hover:border-white/20 dark:hover:border-gray-700/30",
        link: 
          "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline bg-transparent p-0 h-auto hover:text-blue-700 dark:hover:text-blue-300",
        glassmorphism:
          "bg-white/20 dark:bg-gray-800/20 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 text-gray-800 dark:text-gray-200 hover:bg-white/30 dark:hover:bg-gray-800/30 shadow-xl hover:shadow-2xl rounded-2xl",
        gradient:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:from-emerald-600 hover:to-teal-600 border border-emerald-500/30 backdrop-blur-lg rounded-xl",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-xl px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  animated?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, animated = true, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // If not animated or asChild, use regular component
    if (!animated || asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {/* Animated background overlay */}
          {!asChild && variant !== "link" && variant !== "ghost" && (
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
          <span className="relative z-10">{children}</span>
        </Comp>
      )
    }

    // Animated version using Framer Motion
    // Framer Motion과 React의 이벤트 핸들러 타입 충돌을 근본적으로 해결하기 위해
    // 충돌 가능성이 있는 모든 이벤트 핸들러를 분리해서 넘기지 않음
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

    return (
      <motion.button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        whileHover={{ 
          scale: 1.02,
          y: -1
        }}
        whileTap={{ 
          scale: 0.98,
          y: 0
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17
        }}
        {...restProps}
      >
        {/* Animated background overlay */}
        {variant !== "link" && variant !== "ghost" && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
            initial={{ opacity: 0, x: '-100%' }}
            whileHover={{ 
              opacity: 1,
              x: '100%',
              transition: { duration: 0.6 }
            }}
          />
        )}
        
        {/* Ripple effect container */}
        <div className="absolute inset-0 overflow-hidden rounded-inherit">
          <motion.div
            className="absolute inset-0 bg-white/30"
            initial={{ scale: 0, opacity: 0 }}
            whileTap={{
              scale: 2,
              opacity: [0, 1, 0],
              transition: { duration: 0.3 }
            }}
            style={{
              borderRadius: "50%",
              transformOrigin: "center"
            }}
          />
        </div>
        
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
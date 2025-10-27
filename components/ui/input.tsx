import * as React from "react"
import { motion } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full transition-all duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 relative",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm hover:shadow-md focus:shadow-lg rounded-lg",
        glassmorphism: "bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl border border-white/30 dark:border-gray-700/30 focus:border-blue-500/50 dark:focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-xl focus:shadow-2xl rounded-xl",
        filled: "bg-gray-100 dark:bg-gray-700 border-0 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 shadow-sm focus:shadow-lg rounded-lg",
        minimal: "bg-transparent border-0 border-b-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-none px-0",
      },
      size: {
        sm: "h-9 px-3 py-2 text-sm",
        default: "h-11 px-4 py-3 text-base",
        lg: "h-13 px-5 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, 'size'>,
    VariantProps<typeof inputVariants> {
  label?: string
  floatingLabel?: boolean
  animated?: boolean
  icon?: React.ReactNode
  error?: string
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, size, label, icon, ...props }, ref) => {
    const id = React.useId()

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
      <div className="relative w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <motion.input
            type={type}
            id={id}
            className={cn(
              inputVariants({ variant, size, className }),
              icon ? "pl-10" : "pl-4"
            )}
            ref={ref}
            {...restProps}
          />
        </div>
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
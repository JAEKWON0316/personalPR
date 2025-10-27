'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface FadeInSectionProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale' | 'rotate';
  duration?: number;
  delay?: number;
  distance?: number;
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
  className?: string;
}

export default function FadeInSection({ 
  children,
  direction = 'up',
  duration = 0.8,
  delay = 0,
  distance = 30,
  threshold = 0.1,
  once = true,
  stagger = false,
  staggerDelay = 0.1,
  className = ''
}: FadeInSectionProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once
  });

  // Animation variants based on direction
  const getVariants = (): Variants => {
    const baseVariants = {
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        x: 0,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1], // Custom smooth easing
          when: "beforeChildren",
          staggerChildren: stagger ? staggerDelay : 0
        }
      },
      hidden: {}
    };

    switch (direction) {
      case 'up':
        baseVariants.hidden = { opacity: 0, y: distance };
        break;
      case 'down':
        baseVariants.hidden = { opacity: 0, y: -distance };
        break;
      case 'left':
        baseVariants.hidden = { opacity: 0, x: distance };
        break;
      case 'right':
        baseVariants.hidden = { opacity: 0, x: -distance };
        break;
      case 'scale':
        baseVariants.hidden = { opacity: 0, scale: 0.8 };
        break;
      case 'rotate':
        baseVariants.hidden = { opacity: 0, rotate: -10, scale: 0.95 };
        break;
      case 'fade':
      default:
        baseVariants.hidden = { opacity: 0 };
        break;
    }

    return baseVariants;
  };

  // Child animation variants for stagger effect
  const childVariants: Variants = {
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: duration * 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    },
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 15
    }
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    } else if (!once) {
      controls.start('hidden');
    }
  }, [isInView, controls, once]);

  // Respect user's motion preferences
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  const variants = getVariants();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {stagger ? (
        // Wrap children in motion divs for stagger animation
        Array.isArray(children) ? (
          children.map((child, index) => (
            <motion.div
              key={index}
              variants={childVariants}
              className="will-change-transform"
            >
              {child}
            </motion.div>
          ))
        ) : (
          <motion.div variants={childVariants} className="will-change-transform">
            {children}
          </motion.div>
        )
      ) : (
        children
      )}
    </motion.div>
  );
}

// Enhanced FadeInSection with multiple animations for complex layouts
interface FadeInContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export function FadeInContainer({ 
  children, 
  className = '',
  staggerDelay = 0.15 
}: FadeInContainerProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="will-change-transform"
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants} className="will-change-transform">
          {children}
        </motion.div>
      )}
    </motion.div>
  );
}

// Specialized component for text animations
interface FadeInTextProps {
  children: string;
  className?: string;
  delay?: number;
  split?: 'words' | 'letters';
}

export function FadeInText({ 
  children, 
  className = '',
  delay = 0,
  split = 'words'
}: FadeInTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.1, once: true });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: split === 'letters' ? 0.05 : 0.1,
        delayChildren: delay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  };

  const splitText = split === 'letters' 
    ? children.split('') 
    : children.split(' ');

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={`inline-block ${className}`}
    >
      {splitText.map((item, index) => (
        <motion.span
          key={index}
          variants={itemVariants}
          className="inline-block will-change-transform"
          style={{ 
            marginRight: split === 'words' ? '0.25em' : '0',
            whiteSpace: split === 'words' ? 'nowrap' : 'normal'
          }}
        >
          {item}
          {split === 'words' && index < splitText.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </motion.div>
  );
}

import { motion } from 'framer-motion';

// Smooth fade in animation
export const FadeIn = ({ children, delay = 0, duration = 0.5, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration,
      delay,
      ease: [0.25, 0.1, 0.25, 1] // Custom easing for smooth feel
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Slide in from side animation
export const SlideIn = ({ children, from = 'left', delay = 0, duration = 0.6, className = '' }) => {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    top: { x: 0, y: -50 },
    bottom: { x: 0, y: 50 }
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[from] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, ...directions[from] }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale animation
export const ScaleIn = ({ children, delay = 0, duration = 0.4, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.8 }}
    transition={{
      duration,
      delay,
      type: 'spring',
      stiffness: 200,
      damping: 20
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger container for list animations
export const StaggerContainer = ({ children, staggerDelay = 0.1, className = '' }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Stagger item for use inside StaggerContainer
export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Reveal animation (wipe effect)
export const Reveal = ({ children, delay = 0, duration = 0.8, className = '' }) => (
  <motion.div
    initial={{ clipPath: 'inset(0 100% 0 0)' }}
    animate={{ clipPath: 'inset(0 0 0 0)' }}
    exit={{ clipPath: 'inset(0 0 0 100%)' }}
    transition={{
      duration,
      delay,
      ease: [0.65, 0, 0.35, 1]
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Float animation
export const Float = ({ children, delay = 0, className = '' }) => (
  <motion.div
    animate={{
      y: [0, -10, 0],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Rotate animation
export const Rotate = ({ children, duration = 20, className = '' }) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration,
      repeat: Infinity,
      ease: 'linear'
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Pulse with glow animation
export const PulseGlow = ({ children, color = 'primary', className = '' }) => {
  const glowColors = {
    primary: 'rgba(6, 182, 212, 0.4)',
    success: 'rgba(16, 185, 129, 0.4)',
    danger: 'rgba(239, 68, 68, 0.4)',
    warning: 'rgba(245, 158, 11, 0.4)',
    violet: 'rgba(139, 92, 246, 0.4)'
  };

  return (
    <motion.div
      animate={{
        boxShadow: [
          `0 0 0px ${glowColors[color]}`,
          `0 0 20px ${glowColors[color]}`,
          `0 0 0px ${glowColors[color]}`
        ]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Page transition wrapper
export const PageTransition = ({ children, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Blur in animation
export const BlurIn = ({ children, delay = 0, duration = 0.6, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(10px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(10px)' }}
    transition={{
      duration,
      delay,
      ease: [0.25, 0.1, 0.25, 1]
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Elastic spring animation
export const ElasticSpring = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      delay,
      type: 'spring',
      stiffness: 260,
      damping: 20
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Hover lift effect
export const HoverLift = ({ children, lift = 8, className = '' }) => (
  <motion.div
    whileHover={{ 
      y: -lift,
      transition: { duration: 0.2, ease: 'easeOut' }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Tap scale effect
export const TapScale = ({ children, scale = 0.95, className = '' }) => (
  <motion.div
    whileTap={{ 
      scale,
      transition: { duration: 0.1 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

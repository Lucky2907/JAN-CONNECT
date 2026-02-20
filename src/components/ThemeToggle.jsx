import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl overflow-hidden transition-all ${
        isDark
          ? 'bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08]'
          : 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
      }`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {/* Animated Background Glow */}
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          background: isDark
            ? 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Icon with Smooth Transition */}
      <AnimatePresence mode="wait">
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <Sun size={20} className="text-amber-400" />
            <motion.div
              className="absolute inset-0"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(251, 191, 36, 0)',
                  '0 0 12px rgba(251, 191, 36, 0.5)',
                  '0 0 0px rgba(251, 191, 36, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
            className="relative"
          >
            <Moon size={20} className="text-indigo-600" />
            <motion.div
              className="absolute inset-0"
              animate={{
                boxShadow: [
                  '0 0 0px rgba(79, 70, 229, 0)',
                  '0 0 12px rgba(79, 70, 229, 0.5)',
                  '0 0 0px rgba(79, 70, 229, 0)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;

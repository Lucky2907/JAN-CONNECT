import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

const MetricCard = ({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendValue,
  color = 'cyan',
  delay = 0 
}) => {
  const { isDark } = useTheme();
  const colorClasses = {
    cyan: {
      gradient: 'from-primary-500/20 to-primary-600/20',
      glow: 'glow-cyan',
      text: 'text-primary-400',
      icon: 'text-primary-400',
      border: 'border-primary-500/30'
    },
    violet: {
      gradient: 'from-accent-violet/20 to-purple-600/20',
      glow: 'glow-violet',
      text: 'text-accent-violet',
      icon: 'text-accent-violet',
      border: 'border-accent-violet/30'
    },
    success: {
      gradient: 'from-success-500/20 to-emerald-600/20',
      glow: 'glow-success',
      text: 'text-success-400',
      icon: 'text-success-400',
      border: 'border-success-500/30'
    },
    danger: {
      gradient: 'from-danger-500/20 to-red-600/20',
      glow: 'glow-danger',
      text: 'text-danger-400',
      icon: 'text-danger-400',
      border: 'border-danger-500/30'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, delay }}
      className="glass-card group cursor-pointer relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          {/* Icon Circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center ${colors.glow} group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`w-6 h-6 ${colors.icon}`} />
          </motion.div>

          {/* Trend Badge */}
          {trend && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: delay + 0.3 }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                trend === 'up' ? 'bg-success-500/10 text-success-400' : 'bg-danger-500/10 text-danger-400'
              }`}
            >
              <span>{trend === 'up' ? '↑' : '↓'}</span>
              <span>{trendValue}%</span>
            </motion.div>
          )}
        </div>

        {/* Value */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.4 }}
          className={`text-4xl font-bold mb-2 ${colors.text} font-display`}
        >
          <AnimatedCounter value={value} />
        </motion.div>

        {/* Label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          className={`text-sm font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {label}
        </motion.p>

        {/* Animated underline */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
          className={`h-0.5 mt-4 rounded-full bg-gradient-to-r ${colors.gradient} origin-left`}
        />
      </div>
    </motion.div>
  );
};

export default MetricCard;

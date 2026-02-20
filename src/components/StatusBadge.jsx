import { getSeverityColor } from '../utils/calculations';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const StatusBadge = ({ status, severity, isEscalated }) => {
  const { isDark } = useTheme();
  const { t } = useLanguage();
  
  const getStatusColor = (status) => {
    if (isDark) {
      const colors = {
        'Submitted': 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
        'In Review': 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30',
        'Assigned': 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
        'Resolved': 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30'
      };
      return colors[status] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    } else {
      const colors = {
        'Submitted': 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-300',
        'In Review': 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300',
        'Assigned': 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300',
        'Resolved': 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300'
      };
      return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSeverityColorClass = (severity) => {
    if (isDark) {
      const colors = {
        low: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-500/30',
        medium: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30',
        high: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30'
      };
      return colors[severity] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    } else {
      const colors = {
        low: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-300',
        medium: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border-yellow-300',
        high: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-300'
      };
      return colors[severity] || 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (status) {
    return (
      <div className="flex items-center gap-2">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)} backdrop-blur-sm`}
        >
          {t(`status.${status}`)}
        </motion.span>
        {isEscalated && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            className="px-3 py-1 rounded-full text-xs font-medium border bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30 animate-pulse backdrop-blur-sm"
          >
            🚨 {t('complaintCard.escalated')}
          </motion.span>
        )}
      </div>
    );
  }

  if (severity) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColorClass(severity)} backdrop-blur-sm`}
      >
        {severity.toUpperCase()}
      </motion.span>
    );
  }

  return null;
};

export default StatusBadge;

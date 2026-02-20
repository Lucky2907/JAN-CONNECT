import { motion } from 'framer-motion';
import { MapPin, Calendar, AlertTriangle, Image as ImageIcon, Maximize2, ThumbsUp, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useState } from 'react';
import ImageModal from './ImageModal';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const ComplaintCard = ({ complaint, onClick, showActions, onStatusUpdate }) => {
  const [imageExpanded, setImageExpanded] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const getCategoryIcon = (category) => {
    const icons = {
      road: '🛣️',
      garbage: '🗑️',
      lighting: '💡',
      drainage: '💧'
    };
    return icons[category] || '📋';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'border-success-500',
      medium: 'border-warning-500',
      high: 'border-danger-500'
    };
    return colors[severity] || 'border-primary-500';
  };

  return (
    <motion.div
      whileHover={{ x: 4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`glass-card transition-all cursor-pointer group relative border-l-4 ${
        isDark
          ? 'hover:bg-white/[0.05] hover:border-primary-500/30'
          : 'hover:bg-gray-50 hover:border-primary-500/50'
      } ${getSeverityColor(complaint.severity)}`}
      onClick={() => onClick && onClick(complaint)}
    >
      {/* Background glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500/0 to-accent-violet/0 group-hover:from-primary-500/5 group-hover:to-accent-violet/5 transition-all pointer-events-none" />

      <div className="relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <motion.span
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-3xl"
              >
                {getCategoryIcon(complaint.category)}
              </motion.span>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold transition-colors ${
                  isDark
                    ? 'text-white group-hover:text-primary-400'
                    : 'text-gray-900 group-hover:text-primary-600'
                }`}>
                  {complaint.title}
                </h3>
                {/* Similar Issues Badge - Show prominently near title */}
                {complaint.upvotes > 1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 text-orange-400 text-xs font-semibold"
                    title={`${complaint.upvotes} people have reported this same issue in this area`}
                  >
                    <Users size={12} className="animate-pulse" />
                    <span>{t('complaintCard.similarIssues')} ({complaint.upvotes})</span>
                  </motion.div>
                )}
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{complaint.description}</p>
          </div>
        </div>

        {/* Image Display */}
        {complaint.imageUrl && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <div className={`relative rounded-xl overflow-hidden border group/image ${
                isDark ? 'border-white/[0.08]' : 'border-gray-200'
              }`}>
                <img
                  src={complaint.imageUrl}
                  alt={complaint.title}
                  className={`w-full object-cover transition-all ${
                    imageExpanded ? 'h-auto max-h-[500px]' : 'h-48'
                  }`}
                />
                
                {/* Hover overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageExpanded(!imageExpanded);
                    }}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-white/30 transition-all flex items-center gap-2"
                  >
                    {imageExpanded ? `↕️ ${t('common.close')}` : `↕️ ${t('common.view')}`}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowImageModal(true);
                    }}
                    className="px-4 py-2 bg-primary-500/80 backdrop-blur-sm rounded-lg text-white text-sm font-medium hover:bg-primary-500 transition-all flex items-center gap-2"
                  >
                    <Maximize2 size={16} />
                    {t('common.view')}
                  </motion.button>
                </div>

                {/* Badge */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-white flex items-center gap-1">
                  <ImageIcon size={12} />
                  Image attached
                </div>
              </div>
            </motion.div>

            {/* Image Modal */}
            {showImageModal && (
              <ImageModal
                imageUrl={complaint.imageUrl}
                alt={complaint.title}
                onClose={() => setShowImageModal(false)}
              />
            )}
          </>
        )}

        <div className={`flex items-center gap-6 mb-4 text-sm ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary-400" />
            <span>{complaint.latitude.toFixed(4)}, {complaint.longitude.toFixed(4)}</span>
          </div>
          <div className="w-1 h-1 bg-gray-600 rounded-full" />
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-accent-violet" />
            <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={complaint.status} isEscalated={complaint.isEscalated} />
            <StatusBadge severity={complaint.severity} />
            {complaint.imageUrl && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-400 text-xs font-medium"
              >
                <ImageIcon size={12} />
                <span>{t('common.view')}</span>
              </motion.div>
            )}
          </div>
          
          {/* Upvotes indicator in corner */}
          {complaint.upvotes > 1 && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-success-500/10 border border-success-500/30 text-success-400 text-xs font-medium"
              title={`${complaint.upvotes} people have reported this issue`}
            >
              <ThumbsUp size={12} />
              <span>{complaint.upvotes}</span>
            </motion.div>
          )}
        </div>

        {showActions && onStatusUpdate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-4 pt-4 border-t ${
              isDark ? 'border-white/[0.08]' : 'border-gray-200'
            }`}
          >
            <select
              className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.08] text-white focus:ring-primary-500/50 focus:border-primary-500/50'
                  : 'bg-white border border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
              }`}
              value={complaint.status}
              onChange={(e) => {
                e.stopPropagation();
                onStatusUpdate(complaint.id, e.target.value);
              }}
            >
              <option value="Submitted">{t('status.Submitted')}</option>
              <option value="In Review">{t('status.In Review')}</option>
              <option value="Assigned">{t('status.Assigned')}</option>
              <option value="Resolved">{t('status.Resolved')}</option>
            </select>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ComplaintCard;

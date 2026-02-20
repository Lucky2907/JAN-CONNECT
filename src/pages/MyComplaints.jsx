import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Filter, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import ComplaintCard from '../components/ComplaintCard';
import MetricCard from '../components/MetricCard';
import GlassCard from '../components/GlassCard';
import { PageWrapper, StaggerContainer, FadeIn } from '../components/MotionWrapper';

const MyComplaints = () => {
  const { getUserComplaints } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const userComplaints = getUserComplaints();
  const [filter, setFilter] = useState('all');

  const filteredComplaints = filter === 'all' 
    ? userComplaints 
    : userComplaints.filter(c => c.status.toLowerCase() === filter.toLowerCase());

  const stats = {
    total: userComplaints.length,
    resolved: userComplaints.filter(c => c.status === 'Resolved').length,
    pending: userComplaints.filter(c => c.status !== 'Resolved').length,
    escalated: userComplaints.filter(c => c.isEscalated).length
  };

  return (
    <PageWrapper>
      <FadeIn delay={0.1}>
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold font-display text-gradient mb-2"
          >
            {t('sidebar.myComplaints')}
          </motion.h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>{t('dashboard.trackStatus')}</p>
        </div>
      </FadeIn>

      <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={FileText}
          label={t('dashboard.totalComplaints')}
          value={stats.total}
          color="cyan"
          delay={0}
        />
        <MetricCard
          icon={CheckCircle}
          label={t('dashboard.resolved')}
          value={stats.resolved}
          color="success"
          delay={0.1}
        />
        <MetricCard
          icon={Clock}
          label={t('dashboard.pending')}
          value={stats.pending}
          color="violet"
          delay={0.2}
        />
        <MetricCard
          icon={AlertCircle}
          label={t('complaintCard.escalated')}
          value={stats.escalated}
          color="danger"
          delay={0.3}
        />
      </StaggerContainer>

      <FadeIn delay={0.4}>
        <GlassCard className="mb-6">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Filter size={20} className="text-primary-400" />
            </motion.div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`flex-1 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.08] text-white focus:ring-primary-500/50 focus:border-primary-500/50'
                  : 'bg-white border-2 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
              }`}
            >
              <option value="all">All Complaints</option>
              <option value="submitted">Submitted</option>
              <option value="in review">In Review</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </GlassCard>
      </FadeIn>

      {filteredComplaints.length === 0 ? (
        <FadeIn delay={0.5}>
          <GlassCard>
            <div className="text-center py-12">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 bg-gradient-to-br from-primary-500/20 to-accent-violet/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <FileText size={32} className="text-gray-400" />
              </motion.div>
              <p className="text-gray-400 text-lg">No complaints found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          </GlassCard>
        </FadeIn>
      ) : (
        <StaggerContainer delay={0.5} className="grid grid-cols-1 gap-4">
          {filteredComplaints.map((complaint, index) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.05 }}
            >
              <ComplaintCard complaint={complaint} />
            </motion.div>
          ))}
        </StaggerContainer>
      )}
    </PageWrapper>
  );
};

export default MyComplaints;

import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Shield } from 'lucide-react';
import { calculateRiskScore } from '../utils/calculations';
import RiskIndicator from '../components/RiskIndicator';
import MetricCard from '../components/MetricCard';
import GlassCard from '../components/GlassCard';
import { PageWrapper, StaggerContainer, FadeIn } from '../components/MotionWrapper';

const AdminDashboard = () => {
  const { complaints } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    pending: complaints.filter(c => c.status !== 'Resolved').length,
    escalated: complaints.filter(c => c.isEscalated).length,
    high: complaints.filter(c => c.severity === 'high').length
  };

  const riskScore = calculateRiskScore(complaints);

  const recentComplaints = complaints
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const categoryBreakdown = {
    road: complaints.filter(c => c.category === 'road').length,
    garbage: complaints.filter(c => c.category === 'garbage').length,
    lighting: complaints.filter(c => c.category === 'lighting').length,
    drainage: complaints.filter(c => c.category === 'drainage').length
  };

  return (
    <PageWrapper>
      <FadeIn delay={0.1}>
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 bg-gradient-to-br from-accent-violet to-purple-600 rounded-xl flex items-center justify-center glow-violet"
            >
              <Shield size={24} className="text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold font-display text-gradient">
              {t('adminDashboard.title')}
            </h1>
          </motion.div>
          <p className={`text-lg ml-15 ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>{t('adminDashboard.systemOverview')}</p>
        </div>
      </FadeIn>

      <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          icon={AlertCircle}
          label={t('adminDashboard.totalComplaints')}
          value={stats.total}
          trend="+5%"
          trendUp={true}
          color="violet"
          delay={0}
        />
        <MetricCard
          icon={CheckCircle}
          label={t('adminDashboard.resolved')}
          value={stats.resolved}
          trend="+12%"
          trendUp={true}
          color="success"
          delay={0.1}
        />
        <MetricCard
          icon={Clock}
          label={t('dashboard.pending')}
          value={stats.pending}
          trend="-8%"
          trendUp={false}
          color="cyan"
          delay={0.2}
        />
        <MetricCard
          icon={TrendingUp}
          label={t('complaintCard.escalated')}
          value={stats.escalated}
          trend="-3%"
          trendUp={false}
          color="danger"
          delay={0.3}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <GlassCard className="h-full flex flex-col items-center justify-center">
            <RiskIndicator score={riskScore} size="sm" />
          </GlassCard>
        </motion.div>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FadeIn delay={0.5}>
          <GlassCard>
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{t('analytics.categoryWise')}</h2>
            <div className="space-y-4">
              {Object.entries(categoryBreakdown).map(([category, count], index) => {
                const icons = { road: '🛣️', garbage: '🗑️', lighting: '💡', drainage: '💧' };
                const percentage = ((count / stats.total) * 100).toFixed(1);
                const colors = ['from-cyan-500 to-primary-500', 'from-green-500 to-emerald-500', 'from-yellow-500 to-orange-500', 'from-blue-500 to-indigo-500'];
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`capitalize flex items-center gap-2 ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        <span className="text-2xl">{icons[category]}</span>
                        <span className="font-medium">{category}</span>
                      </span>
                      <span className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{count} <span className="text-gray-500 text-sm">({percentage}%)</span></span>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className={`bg-gradient-to-r ${colors[index]} h-2.5 rounded-full relative`}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.6}>
          <GlassCard>
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Status Overview</h2>
            <div className="space-y-5">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-success-500/30 transition-all group"
              >
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Resolution Rate</span>
                <span className="text-3xl font-bold text-success-400 group-hover:scale-110 transition-transform">
                  {((stats.resolved / stats.total) * 100).toFixed(1)}%
                </span>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-danger-500/30 transition-all group"
              >
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>High Priority</span>
                <span className="text-3xl font-bold text-danger-400 group-hover:scale-110 transition-transform">{stats.high}</span>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] hover:border-primary-500/30 transition-all group"
              >
                <span className={`font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>Avg. Response Time</span>
                <span className="text-3xl font-bold text-primary-400 group-hover:scale-110 transition-transform">24h</span>
              </motion.div>
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.7}>
        <GlassCard>
          <h2 className={`text-2xl font-semibold font-display mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Recent Complaints</h2>
          <div className="space-y-3">
            {recentComplaints.map((complaint, index) => (
              <motion.div
                key={complaint.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ x: 4 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 hover:bg-white/[0.05] hover:border-accent-violet/30 transition-all group cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 group-hover:text-accent-violet transition-colors ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{complaint.title}</h3>
                    <div className={`flex items-center gap-4 text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span className="capitalize">{complaint.category}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <span className="w-1 h-1 bg-gray-600 rounded-full" />
                      <span>{complaint.citizenName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        complaint.severity === 'high' ? 'bg-danger-500/10 text-danger-300 border-danger-500/30' :
                        complaint.severity === 'medium' ? 'bg-warning-500/10 text-warning-300 border-warning-500/30' :
                        'bg-success-500/10 text-success-300 border-success-500/30'
                      }`}
                    >
                      {complaint.severity.toUpperCase()}
                    </motion.span>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        complaint.status === 'Resolved' ? 'bg-success-500/10 text-success-300 border-success-500/30' :
                        complaint.status === 'Assigned' ? 'bg-accent-violet/10 text-accent-violet border-accent-violet/30' :
                        complaint.status === 'In Review' ? 'bg-warning-500/10 text-warning-300 border-warning-500/30' :
                        'bg-primary-500/10 text-primary-300 border-primary-500/30'
                      }`}
                    >
                      {complaint.status}
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>
    </PageWrapper>
  );
};

export default AdminDashboard;

import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle, FileText, CheckCircle, Clock, ArrowRight, TrendingUp } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import GlassCard from '../components/GlassCard';
import LoadingShimmer from '../components/LoadingShimmer';
import { PageWrapper, StaggerContainer, FadeIn } from '../components/MotionWrapper';
import RealtimeStatus from '../components/RealtimeStatus';
import FirestoreTestPanel from '../components/FirestoreTestPanel';

const Dashboard = () => {
  const { user, getUserComplaints, loading } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const userComplaints = getUserComplaints();

  const recentComplaints = userComplaints.slice(0, 3);

  const stats = [
    {
      icon: FileText,
      label: t('dashboard.totalComplaints'),
      value: userComplaints.length,
      trend: '+12%',
      trendUp: true,
      color: 'cyan'
    },
    {
      icon: CheckCircle,
      label: t('dashboard.resolved'),
      value: userComplaints.filter(c => c.status === 'Resolved').length,
      trend: '+8%',
      trendUp: true,
      color: 'success'
    },
    {
      icon: Clock,
      label: t('dashboard.pending'),
      value: userComplaints.filter(c => c.status !== 'Resolved').length,
      trend: '-5%',
      trendUp: false,
      color: 'violet'
    },
    {
      icon: AlertCircle,
      label: t('complaintCard.escalated'),
      value: userComplaints.filter(c => c.isEscalated).length,
      trend: '-2%',
      trendUp: false,
      color: 'danger'
    }
  ];

  return (
    <>
      <RealtimeStatus />
    <PageWrapper>
      {/* Header */}
      <FadeIn delay={0.1}>
        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold font-display text-gradient mb-2"
          >
            {t('common.welcome')}, {user?.name}!
          </motion.h1>
          <p className={`text-lg ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>{t('dashboard.title')}</p>
        </div>
      </FadeIn>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <LoadingShimmer type="metric" count={4} />
        </div>
      ) : (
        <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <MetricCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendUp={stat.trendUp}
              color={stat.color}
              delay={index * 0.1}
            />
          ))}
        </StaggerContainer>
      )}

      {/* Quick Actions */}
      <StaggerContainer delay={0.4} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Link to="/submit">
          <GlassCard hover={true} gradient={true}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-teal rounded-2xl flex items-center justify-center mx-auto mb-4 glow-cyan"
              >
                <FileText size={32} className="text-white" />
              </motion.div>
              <h3 className={`text-xl font-semibold font-display mb-2 group-hover:text-gradient transition-all ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('dashboard.submitNew')}
              </h3>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{t('submitComplaint.descriptionPlaceholder')}</p>
              <div className="flex items-center justify-center gap-2 text-primary-400 text-sm font-medium">
                <span>{t('dashboard.submitNew')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </GlassCard>
        </Link>

        <Link to="/public-dashboard">
          <GlassCard hover={true} gradient={true}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="text-center p-6 group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-accent-violet to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 glow-violet"
              >
                <TrendingUp size={32} className="text-white" />
              </motion.div>
              <h3 className={`text-xl font-semibold font-display mb-2 group-hover:text-gradient transition-all ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {t('publicDashboard.title')}
              </h3>
              <p className={`text-sm mb-4 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{t('publicDashboard.subtitle')}</p>
              <div className="flex items-center justify-center gap-2 text-accent-violet text-sm font-medium">
                <span>{t('common.view')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          </GlassCard>
        </Link>
      </StaggerContainer>

      {/* Recent Complaints */}
      {recentComplaints.length > 0 && (
        <FadeIn delay={0.6}>
          <GlassCard>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold font-display ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{t('dashboard.recentActivity')}</h2>
              <Link
                to="/my-complaints"
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm font-medium group"
              >
                <span>{t('dashboard.viewAll')}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentComplaints.map((complaint, index) => (
                <motion.div
                  key={complaint.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className={`rounded-xl p-5 transition-all group cursor-pointer ${
                    isDark
                      ? 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-primary-500/30'
                      : 'bg-white border-2 border-gray-200 hover:bg-gray-50 hover:border-primary-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-2 group-hover:text-primary-400 transition-colors ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {complaint.title}
                      </h3>
                      <div className={`flex items-center gap-4 text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-600 rounded-full" />
                        <span className="capitalize">{complaint.category}</span>
                      </div>
                    </div>
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border ${
                        complaint.status === 'Resolved'
                          ? 'bg-success-500/10 text-success-400 border-success-500/30'
                          : complaint.status === 'Assigned'
                          ? 'bg-accent-violet/10 text-accent-violet border-accent-violet/30'
                          : complaint.status === 'In Review'
                          ? 'bg-warning-500/10 text-warning-400 border-warning-500/30'
                          : 'bg-primary-500/10 text-primary-400 border-primary-500/30'
                      }`}
                    >
                      {t(`status.${complaint.status}`)}
                    </motion.span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      )}
      <FadeIn delay={0.7}>
        <FirestoreTestPanel />
      </FadeIn>
    </PageWrapper>
    </>
  );
};

export default Dashboard;

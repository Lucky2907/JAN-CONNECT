import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { BarChartComponent, PieChartComponent } from '../components/AnalyticsChart';
import { calculateRiskScore } from '../utils/calculations';
import RiskIndicator from '../components/RiskIndicator';
import MetricCard from '../components/MetricCard';
import GlassCard from '../components/GlassCard';
import { PageWrapper, StaggerContainer, FadeIn } from '../components/MotionWrapper';

const PublicDashboard = () => {
  const { complaints } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const stats = {
    total: complaints.length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
    pending: complaints.filter(c => c.status !== 'Resolved').length,
    avgResolutionTime: 48
  };

  const resolutionRate = ((stats.resolved / stats.total) * 100).toFixed(1);

  const categoryData = [
    { name: t('categories.Roads'), value: complaints.filter(c => c.category === 'road').length },
    { name: t('categories.Water'), value: complaints.filter(c => c.category === 'garbage').length },
    { name: t('categories.Street Lights'), value: complaints.filter(c => c.category === 'lighting').length },
    { name: t('categories.Drainage'), value: complaints.filter(c => c.category === 'drainage').length }
  ];

  const mostCommonIssue = categoryData.reduce((max, item) => 
    item.value > max.value ? item : max, categoryData[0]
  ).name;

  const riskScore = calculateRiskScore(complaints);

  const weeklyTrend = [
    { name: 'Week 1', complaints: 12 },
    { name: 'Week 2', complaints: 15 },
    { name: 'Week 3', complaints: 8 },
    { name: 'Week 4', complaints: complaints.length }
  ];

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
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-teal rounded-xl flex items-center justify-center glow-cyan"
            >
              <BarChart3 size={24} className="text-white" />
            </motion.div>
            <h1 className="text-4xl font-bold font-display text-gradient">
              {t('publicDashboard.title')}
            </h1>
          </motion.div>
          <p className={`text-lg ml-15 ${
            isDark ? 'text-gray-400' : 'text-gray-700'
          }`}>{t('publicDashboard.subtitle')}</p>
        </div>
      </FadeIn>

      <StaggerContainer delay={0.2} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{t('adminDashboard.totalComplaints')}</p>
              <Activity size={20} className="text-primary-400" />
            </div>
            <p className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{stats.total}</p>
            <p className="text-xs text-success-400 flex items-center gap-1 font-medium">
              <TrendingDown size={14} />
              12% from last month
            </p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>{t('analytics.resolutionRate')}</p>
              <Activity size={20} className="text-success-400" />
            </div>
            <p className="text-4xl font-bold text-success-400 mb-2">{resolutionRate}%</p>
            <p className="text-xs text-success-400 flex items-center gap-1 font-medium">
              <TrendingUp size={14} />
              8% improvement
            </p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="h-full">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Avg. Resolution</p>
              <Activity size={20} className="text-warning-400" />
            </div>
            <p className={`text-4xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{stats.avgResolutionTime}h</p>
            <p className="text-xs text-warning-400 flex items-center gap-1 font-medium">
              <TrendingDown size={14} />
              6h faster
            </p>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ y: -4 }}>
          <GlassCard className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-sm font-medium ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>Civic Risk Index</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <RiskIndicator score={riskScore} size="sm" />
            </div>
          </GlassCard>
        </motion.div>
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <FadeIn delay={0.4} className="lg:col-span-2">
          <GlassCard className="h-full">
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Weekly Complaint Trend</h2>
            <BarChartComponent
              data={weeklyTrend}
              dataKey="complaints"
              xAxisKey="name"
              color="#06b6d4"
            />
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.5}>
          <GlassCard className="h-full">
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Key Insights</h2>
            <div className="space-y-4">
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:border-primary-500/30 transition-all"
              >
                <p className={`text-sm mb-2 font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Most Common Issue</p>
                <p className="text-2xl font-bold text-primary-400">{mostCommonIssue}</p>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:border-danger-500/30 transition-all"
              >
                <p className={`text-sm mb-2 font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>High Risk Wards</p>
                <p className="text-2xl font-bold text-danger-400">3</p>
              </motion.div>
              <motion.div
                whileHover={{ x: 4 }}
                className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 hover:border-warning-500/30 transition-all"
              >
                <p className={`text-sm mb-2 font-medium ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>Active Cases</p>
                <p className="text-2xl font-bold text-warning-400">{stats.pending}</p>
              </motion.div>
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <FadeIn delay={0.6}>
          <GlassCard>
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Issue Distribution</h2>
            <PieChartComponent data={categoryData} />
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.7}>
          <GlassCard>
            <h2 className={`text-2xl font-semibold font-display mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>City Performance Metrics</h2>
            <div className="space-y-5">
              {[
                { label: 'Citizen Satisfaction', value: 87, color: 'from-success-500 to-emerald-500' },
                { label: 'Response Efficiency', value: 92, color: 'from-primary-500 to-accent-teal' },
                { label: 'Transparency Score', value: 95, color: 'from-accent-violet to-purple-600' }
              ].map((metric, index) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-medium ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{metric.label}</span>
                    <span className={`font-bold text-lg ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{metric.value}%</span>
                  </div>
                  <div className="w-full bg-white/[0.05] rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${metric.value}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                      className={`bg-gradient-to-r ${metric.color} h-3 rounded-full relative`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-shimmer" />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      <FadeIn delay={0.9}>
        <GlassCard>
          <h2 className="text-2xl font-semibold font-display text-white mb-6">Department Response Times</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { dept: 'Roads & Transport', time: 42, icon: '🛣️', color: 'text-success-400', bgColor: 'from-success-500/20 to-emerald-500/20' },
              { dept: 'Sanitation', time: 36, icon: '🗑️', color: 'text-success-400', bgColor: 'from-success-500/20 to-emerald-500/20' },
              { dept: 'Electricity', time: 52, icon: '💡', color: 'text-warning-400', bgColor: 'from-warning-500/20 to-orange-500/20' },
              { dept: 'Water & Drainage', time: 48, icon: '💧', color: 'text-warning-400', bgColor: 'from-warning-500/20 to-orange-500/20' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + index * 0.05 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className={`bg-gradient-to-br ${item.bgColor} border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.15] transition-all`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{item.icon}</span>
                  <p className="text-gray-300 text-sm font-medium">{item.dept}</p>
                </div>
                <p className={`text-4xl font-bold ${item.color} mb-1`}>{item.time}h</p>
                <p className="text-xs text-gray-500 font-medium">avg. response</p>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </FadeIn>
    </PageWrapper>
  );
};

export default PublicDashboard;

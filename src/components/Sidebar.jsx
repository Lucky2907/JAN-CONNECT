import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, FileText, BarChart3, Map, AlertCircle, LogOut, Shield, Users, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const citizenLinks = [
    { to: '/dashboard', icon: Home, label: t('sidebar.dashboard') },
    { to: '/submit', icon: FileText, label: t('sidebar.submitComplaint') },
    { to: '/my-complaints', icon: AlertCircle, label: t('sidebar.myComplaints') },
    { to: '/public-dashboard', icon: BarChart3, label: t('sidebar.publicDashboard') }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: Shield, label: t('sidebar.adminDashboard') },
    { to: '/admin/map-view', icon: Map, label: t('sidebar.adminMap') },
    { to: '/admin/analytics', icon: BarChart3, label: t('sidebar.analytics') },
    { to: '/admin/complaints', icon: FileText, label: t('sidebar.allComplaints') }
  ];

  const links = user?.role === 'admin' ? adminLinks : citizenLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-72 h-screen glass flex flex-col fixed left-0 top-0 z-50 ${
        isDark ? 'border-r border-white/[0.08]' : 'border-r border-gray-200'
      }`}
    >
      {/* Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`p-6 border-b ${
          isDark ? 'border-white/[0.08]' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center glow-cyan"
          >
            <Sparkles className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold font-display text-gradient">
              {t('app.name')}
            </h1>
            <p className={`text-xs ${
              isDark ? 'text-gray-500' : 'text-gray-600'
            }`}>{t('app.subtitle')}</p>
          </div>
        </div>
      </motion.div>

      {/* User Profile */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-4 border-b ${
          isDark ? 'border-white/[0.08]' : 'border-gray-200'
        }`}
      >
        <div className="glass-card p-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center glow-cyan"
            >
              {user?.role === 'admin' ? <Shield size={20} /> : <Users size={20} />}
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold truncate ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{user?.name}</p>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {user?.role === 'admin' ? 'Administrator' : 'Citizen User'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link, index) => {
          const active = isActive(link.to);
          return (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link to={link.to}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all relative group ${
                    active
                      ? isDark 
                        ? 'bg-gradient-to-r from-primary-500/20 to-accent-violet/20 text-primary-400 glow-cyan'
                        : 'bg-gradient-to-r from-primary-500/15 to-accent-violet/15 text-primary-600'
                      : isDark
                        ? 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {/* Active Indicator */}
                  {active && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary-500 to-accent-violet rounded-r-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <link.icon 
                    size={20} 
                    className={active ? 'text-primary-400' : 'group-hover:text-primary-400 transition-colors'} 
                  />
                  <span className="font-medium text-sm">{link.label}</span>
                  
                  {/* Hover glow */}
                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-accent-violet/0 group-hover:from-primary-500/5 group-hover:to-accent-violet/5 transition-all" />
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`p-4 border-t ${
          isDark ? 'border-white/[0.08]' : 'border-gray-200'
        }`}
      >
        <motion.button
          onClick={logout}
          whileHover={{ scale: 1.02, x: 4 }}
          whileTap={{ scale: 0.98 }}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all w-full group ${
            isDark
              ? 'text-danger-400 hover:bg-danger-500/10'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut size={20} className="group-hover:rotate-6 transition-transform" />
          <span className="font-medium text-sm">{t('common.logout')}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;

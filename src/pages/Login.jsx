import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogIn, Shield, Users, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const quickLogin = (userEmail) => {
    setEmail(userEmail);
    setPassword('demo123');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const success = login(email, password);
    
    if (success) {
      const role = email.includes('admin') ? 'admin' : 'citizen';
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } else {
      setError('Invalid credentials. Use demo accounts below.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950'
          : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'
      }`}>
        <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDark ? 'bg-primary-500/10' : 'bg-primary-500/20'
        }`} />
        <div className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl animate-float ${
          isDark ? 'bg-accent-violet/10' : 'bg-accent-violet/20'
        }`} style={{ animationDelay: '2s' }} />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card max-w-md w-full relative z-10 shadow-2xl"
      >
        {/* Logo/Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-violet rounded-2xl flex items-center justify-center mx-auto mb-4 glow-cyan"
          >
            <Sparkles size={40} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold font-display text-gradient mb-2">
            {t('app.name')}
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{t('app.tagline')}</p>
        </motion.div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSubmit}
          className="space-y-5 mb-6"
        >
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{t('login.email')}</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-primary-500/20'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/30'
              }`}
              placeholder={t('login.emailPlaceholder')}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{t('login.password')}</label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 transition-all ${
                isDark
                  ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-primary-500/20'
                  : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/30'
              }`}
              placeholder={t('login.passwordPlaceholder')}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-4 text-danger-300 text-sm glow-danger"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl font-semibold shadow-lg transition-all"
          >
            <LogIn size={20} />
            {t('login.loginButton')}
          </motion.button>
        </motion.form>

        {/* Demo Accounts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`border-t pt-6 ${
            isDark ? 'border-white/[0.08]' : 'border-gray-200'
          }`}
        >
          <p className={`text-sm text-center mb-4 font-medium ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>{t('login.loginButton')}</p>
          
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => quickLogin('citizen@demo.com')}
              className={`w-full rounded-xl p-4 transition-all text-left group ${
                isDark
                  ? 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-primary-500/30'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-primary-500'
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-primary-500/20 to-accent-teal/20 rounded-xl flex items-center justify-center border border-primary-500/30"
                >
                  <Users size={20} className="text-primary-400" />
                </motion.div>
                <div className="flex-1">
                  <p className={`font-semibold group-hover:text-primary-400 transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{t('login.citizenCredentials')}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>citizen@demo.com • demo123</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => quickLogin('admin@demo.com')}
              className={`w-full rounded-xl p-4 transition-all text-left group ${
                isDark
                  ? 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] hover:border-accent-violet/30'
                  : 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-accent-violet'
              }`}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-gradient-to-br from-accent-violet/20 to-purple-600/20 rounded-xl flex items-center justify-center border border-accent-violet/30"
                >
                  <Shield size={20} className="text-accent-violet" />
                </motion.div>
                <div className="flex-1">
                  <p className={`font-semibold group-hover:text-accent-violet transition-colors ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{t('login.adminCredentials')}</p>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>admin@demo.com • demo123</p>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, ChevronDown, User, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasNotifications] = useState(true);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-16 glass border-b border-white/[0.08] flex items-center justify-between px-8 fixed top-0 right-0 left-72 z-40"
    >
      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-xl"
      >
        <div className="relative group">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
            isDark 
              ? 'text-gray-500 group-focus-within:text-primary-400' 
              : 'text-gray-400 group-focus-within:text-primary-500'
          }`} />
          <input
            type="text"
            placeholder={t('submitComplaint.searchAddress')}
            className={`w-full pl-12 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all ${
              isDark
                ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:border-primary-500/50 focus:ring-primary-500/20'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/30'
            }`}
          />
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-accent-violet/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"
            style={{ padding: '1px' }}
          />
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-8">
        {/* Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <ThemeToggle />
        </motion.div>

        {/* Language Switcher */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.27 }}
        >
          <LanguageSwitcher />
        </motion.div>

        {/* Notification Bell */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all relative group ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white hover:border-primary-500/50'
                : 'bg-white border-gray-300 text-gray-600 hover:text-gray-900 hover:border-primary-500'
            }`}
          >
            <Bell size={20} />
            {hasNotifications && (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full"
                />
                <div className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full animate-ping" />
              </>
            )}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/0 to-accent-violet/0 group-hover:from-primary-500/10 group-hover:to-accent-violet/10 transition-all" />
          </motion.button>
        </motion.div>

        {/* User Profile Dropdown */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <motion.button
            onClick={() => setShowDropdown(!showDropdown)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all group ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.08] hover:border-primary-500/50'
                : 'bg-white border-gray-300 hover:border-primary-500'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-violet flex items-center justify-center glow-cyan">
              <User size={16} />
            </div>
            <div className="text-left hidden md:block">
              <p className={`text-sm font-medium ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <motion.div
              animate={{ rotate: showDropdown ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={16} className="text-gray-400 group-hover:text-primary-400" />
            </motion.div>
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowDropdown(false)}
                  className="fixed inset-0 z-40"
                />

                {/* Menu */}
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute right-0 top-full mt-2 w-56 rounded-xl py-2 z-50 shadow-xl ${
                    isDark
                      ? 'glass-card border border-white/[0.08]'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className={`px-4 py-3 border-b ${
                    isDark ? 'border-white/[0.08]' : 'border-gray-200'
                  }`}>
                    <p className={`text-sm font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>{user?.name}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <DropdownItem icon={User} label="My Profile" isDark={isDark} />
                    <DropdownItem icon={Settings} label="Settings" isDark={isDark} />
                    <DropdownItem icon={HelpCircle} label="Help & Support" isDark={isDark} />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.nav>
  );
};

const DropdownItem = ({ icon: Icon, label, isDark }) => {
  return (
    <motion.button
      whileHover={{ 
        x: 4, 
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(59, 130, 246, 0.05)' 
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 transition-colors ${
        isDark 
          ? 'text-gray-400 hover:text-white' 
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <Icon size={16} />
      <span className="text-sm">{label}</span>
    </motion.button>
  );
};

export default Navbar;
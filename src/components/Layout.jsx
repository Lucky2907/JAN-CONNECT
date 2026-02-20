import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { isDark } = useTheme();
  
  return (
    <div className={`flex h-screen overflow-hidden ${
      isDark ? 'bg-dark-950' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-72">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className={`flex-1 overflow-y-auto mt-16 ${
            isDark
              ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950'
              : 'bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50'
          }`}
        >
          <div className="p-8 min-h-full">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-primary-500/5' : 'bg-primary-500/10'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-accent-violet/5' : 'bg-accent-violet/10'
        }`} />
      </div>
    </div>
  );
};

export default Layout;

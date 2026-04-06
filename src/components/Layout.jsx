import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Chatbot from './Chatbot';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className={`flex h-screen overflow-hidden ${
      isDark ? 'bg-dark-950' : 'bg-slate-50'
    }`}>
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-72 min-w-0">
        {/* Navbar */}
        <Navbar onMenuToggle={() => setIsSidebarOpen((prev) => !prev)} />
        
        {/* Page Content */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          onClick={() => setIsSidebarOpen(false)}
          className={`flex-1 overflow-y-auto mt-16 ${
            isDark
              ? 'bg-gradient-to-br from-dark-950 via-dark-900 to-dark-950'
              : 'bg-gradient-to-br from-white via-slate-50 to-white'
          }`}
        >
          <div className="p-4 sm:p-6 md:p-8 min-h-full">
            <Outlet />
          </div>
        </motion.main>
      </div>
      
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className={`absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-orange-500/10' : 'bg-orange-400/10'
        }`} />
        <div className={`absolute bottom-0 left-1/4 w-96 h-96 rounded-full blur-3xl ${
          isDark ? 'bg-green-500/10' : 'bg-green-500/10'
        }`} />
      </div>
      
      {/* Chatbot Assistant */}
      <Chatbot />
    </div>
  );
};

export default Layout;

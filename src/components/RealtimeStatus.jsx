import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AlertCircle, Wifi, WifiOff, Database, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Real-Time Status Indicator Component
 * 
 * Shows connection status and demonstrates real-time sync
 * Place this component anywhere in your app to monitor Firestore connectivity
 */
const RealtimeStatus = () => {
  const { useFirestore, loading, complaints } = useApp();
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setLastUpdate(new Date());
    setChangeCount(prev => prev + 1);
  }, [complaints]);

  // Auto-hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!useFirestore) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50"
        >
          <div 
            className="glass-card cursor-pointer"
            onClick={() => setShowDetails(!showDetails)}
          >
            {/* Main Status Bar */}
            <div className="flex items-center gap-3 px-4 py-2">
              {loading ? (
                <>
                  <RefreshCw size={16} className="text-blue-400 animate-spin" />
                  <span className="text-sm text-blue-300">Syncing...</span>
                </>
              ) : (
                <>
                  <div className="relative">
                    <Wifi size={16} className="text-green-400" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <span className="text-sm text-green-300">Real-time Active</span>
                </>
              )}
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-white/10 px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Total Records</span>
                    <span className="text-white font-semibold">{complaints.length}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Updates Received</span>
                    <span className="text-white font-semibold">{changeCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Last Update</span>
                    <span className="text-white font-semibold">
                      {lastUpdate.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={12} className="text-green-400 mt-0.5" />
                      <p className="text-xs text-gray-400">
                        Changes sync automatically across all devices
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RealtimeStatus;

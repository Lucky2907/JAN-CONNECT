import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Database, CheckCircle } from 'lucide-react';

/**
 * Firestore Testing Panel
 * 
 * Add this component to any page to test real-time Firestore functionality
 * It provides quick actions to test CRUD operations and see real-time updates
 * 
 * Usage:
 * import FirestoreTestPanel from '../components/FirestoreTestPanel';
 * <FirestoreTestPanel />
 */
const FirestoreTestPanel = () => {
  const { useFirestore, loading, complaints, addComplaint, updateComplaintStatus, user } = useApp();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const handleTestAdd = async () => {
    setIsSubmitting(true);
    setLastAction(null);

    try {
      const testComplaint = {
        title: `Test Complaint - ${new Date().toLocaleTimeString()}`,
        description: 'This is a test complaint to verify Firestore real-time sync',
        category: 'road',
        severity: 'medium',
        latitude: 28.6139 + (Math.random() - 0.5) * 0.01,
        longitude: 77.2090 + (Math.random() - 0.5) * 0.01,
        imageUrl: null
      };

      await addComplaint(testComplaint);
      setLastAction({ type: 'success', message: 'Complaint added successfully!' });
    } catch (error) {
      setLastAction({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTestUpdate = async () => {
    if (complaints.length === 0) {
      setLastAction({ type: 'error', message: 'No complaints to update' });
      return;
    }

    setIsSubmitting(true);
    setLastAction(null);

    try {
      const randomComplaint = complaints[Math.floor(Math.random() * complaints.length)];
      const statuses = ['Submitted', 'In Progress', 'Resolved', 'Rejected'];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

      await updateComplaintStatus(randomComplaint.id, newStatus);
      setLastAction({ 
        type: 'success', 
        message: `Updated complaint #${randomComplaint.id} to ${newStatus}` 
      });
    } catch (error) {
      setLastAction({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!useFirestore) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 border-orange-500/30 bg-orange-500/5"
      >
        <div className="flex items-start gap-3">
          <Database className="text-orange-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-orange-300 mb-2">
              Mock Data Mode Active
            </h3>
            <p className="text-sm text-gray-400 mb-3">
              Firestore is currently disabled. To enable real-time sync:
            </p>
            <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
              <li>Configure Firebase in <code className="text-orange-300">src/config/firebase.js</code></li>
              <li>Set up Firestore database in Firebase Console</li>
              <li>Change <code className="text-orange-300">USE_FIRESTORE = true</code> in AppContext</li>
            </ol>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="text-green-400" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-white">Firestore Test Panel</h3>
            <p className="text-xs text-gray-400">Real-time sync active</p>
          </div>
        </div>
        {loading && (
          <RefreshCw className="text-blue-400 animate-spin" size={20} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleTestAdd}
          disabled={isSubmitting}
          className="px-4 py-3 bg-green-500/20 hover:bg-green-500/30 disabled:bg-green-500/10 
                     text-green-300 rounded-lg transition-all flex items-center justify-center gap-2
                     disabled:cursor-not-allowed"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">Add Test Complaint</span>
        </button>

        <button
          onClick={handleTestUpdate}
          disabled={isSubmitting || complaints.length === 0}
          className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 disabled:bg-blue-500/10
                     text-blue-300 rounded-lg transition-all flex items-center justify-center gap-2
                     disabled:cursor-not-allowed"
        >
          <RefreshCw size={18} />
          <span className="text-sm font-medium">Update Random</span>
        </button>
      </div>

      {lastAction && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg flex items-start gap-2 ${
            lastAction.type === 'success' 
              ? 'bg-green-500/10 border border-green-500/30' 
              : 'bg-red-500/10 border border-red-500/30'
          }`}
        >
          {lastAction.type === 'success' && (
            <CheckCircle className="text-green-400 flex-shrink-0" size={18} />
          )}
          <div>
            <p className={`text-sm ${
              lastAction.type === 'success' ? 'text-green-300' : 'text-red-300'
            }`}>
              {lastAction.message}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Check the dashboard to see the real-time update!
            </p>
          </div>
        </motion.div>
      )}

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Total Complaints</span>
          <span className="text-white font-semibold">{complaints.length}</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-2">
          <span className="text-gray-400">User</span>
          <span className="text-white font-semibold">{user?.name || 'Guest'}</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-white/5 rounded-lg">
        <p className="text-xs text-gray-400">
          💡 <strong className="text-white">Pro Tip:</strong> Open this page in multiple browser tabs
          to see real-time synchronization in action. Changes in one tab will instantly appear in others!
        </p>
      </div>
    </motion.div>
  );
};

export default FirestoreTestPanel;

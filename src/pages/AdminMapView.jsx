import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import MapView from '../components/MapView';
import ComplaintCard from '../components/ComplaintCard';
import { X, MapPin, List } from 'lucide-react';

const AdminMapView = () => {
  const { complaints, updateComplaintStatus } = useApp();
  const { isDark } = useTheme();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areaComplaints, setAreaComplaints] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'area'

  // Filter complaints - exclude resolved by default unless specifically selected
  const filteredComplaints = complaints.filter(c => {
    const isNotResolved = c.status.toLowerCase() !== 'resolved';
    if (filterStatus === 'all') {
      return isNotResolved;
    }
    return c.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const handleMarkerClick = (complaint) => {
    setSelectedComplaint(complaint);
    setViewMode('single');
    setAreaComplaints([]);
    setSelectedArea(null);
  };

  const handleAreaClick = (complaints, location) => {
    setAreaComplaints(complaints);
    setSelectedArea(location);
    setViewMode('area');
    setSelectedComplaint(null);
  };

  const handleClose = () => {
    setSelectedComplaint(null);
    setAreaComplaints([]);
    setSelectedArea(null);
    setViewMode('single');
  };

  const handleStatusUpdate = (id, status) => {
    updateComplaintStatus(id, status);
    
    // If marked as resolved, remove from view
    if (status.toLowerCase() === 'resolved') {
      // Clear selection if this complaint was selected
      if (selectedComplaint?.id === id) {
        setSelectedComplaint(null);
      }
      // Remove from area complaints
      setAreaComplaints(areaComplaints.filter(c => c.id !== id));
      
      // Clear view if no more complaints in area
      if (areaComplaints.length === 1 && areaComplaints[0].id === id) {
        handleClose();
      }
    } else {
      // Update status for non-resolved complaints
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status });
      }
      // Update in area complaints if present
      if (areaComplaints.some(c => c.id === id)) {
        setAreaComplaints(areaComplaints.map(c => 
          c.id === id ? { ...c, status } : c
        ));
      }
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="mb-4">
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>Interactive Complaint Map</h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-700'}>View and manage all complaints on the map</p>
      </div>

      <div className="glass-card mb-4 flex items-center gap-4">
        <label className={`font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Active (Non-Resolved)</option>
          <option value="submitted">Submitted</option>
          <option value="in review">In Review</option>
          <option value="assigned">Assigned</option>
          <option value="resolved">Show Resolved Only</option>
        </select>
        <div className="ml-auto flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Escalated</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>High Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Medium Severity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Low Severity</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex gap-4">
        <div className="flex-1 glass-card p-0 overflow-hidden">
          <MapView
            complaints={filteredComplaints}
            onMarkerClick={handleMarkerClick}
            selectedComplaint={selectedComplaint}
            enableClustering={true}
            onAreaClick={handleAreaClick}
          />
        </div>

        {/* Single Complaint Sidebar */}
        {viewMode === 'single' && selectedComplaint && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 glass-card relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>

            <h3 className={`text-xl font-semibold mb-4 ${
              isDark ? 'text-white' : 'text-gray-800'
            }`}>Complaint Details</h3>
            
            <ComplaintCard
              complaint={selectedComplaint}
              showActions={true}
              onStatusUpdate={handleStatusUpdate}
            />

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Citizen:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{selectedComplaint.citizenName}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Citizen ID:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{selectedComplaint.citizenId}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Department:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>{selectedComplaint.assignedDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Location:</span>
                <span className={isDark ? 'text-white' : 'text-gray-800'}>
                  {selectedComplaint.latitude.toFixed(4)}, {selectedComplaint.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Area Complaints Sidebar */}
        {viewMode === 'area' && areaComplaints.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-96 glass-card relative max-h-full flex flex-col"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="text-cyan-400" size={20} />
                <h3 className={`text-xl font-semibold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Area Complaints
                </h3>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full bg-cyan-500/20 ${
                  isDark ? 'text-cyan-400' : 'text-cyan-600'
                }`}>
                  {areaComplaints.length} complaints found
                </span>
                {selectedArea && (
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {selectedArea.lat.toFixed(4)}, {selectedArea.lng.toFixed(4)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              <AnimatePresence>
                {areaComplaints.map((complaint, index) => (
                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="cursor-pointer"
                    onClick={() => {
                      setSelectedComplaint(complaint);
                      setViewMode('single');
                    }}
                  >
                    <ComplaintCard
                      complaint={complaint}
                      showActions={true}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className={`mt-4 pt-4 border-t ${
              isDark ? 'border-white/10' : 'border-gray-200'
            }`}>
              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <List size={16} />
                <span className={isDark ? 'text-white' : 'text-gray-800'}>Clear Selection</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminMapView;

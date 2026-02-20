import { createContext, useContext, useState, useEffect } from 'react';
import { mockComplaints, mockUsers } from '../data/mockData';
import { checkEscalation } from '../utils/calculations';
import { findNearbyComplaint } from '../utils/calculations';
import { 
  subscribeToComplaints, 
  subscribeToUserComplaints,
  addComplaint as addComplaintFirestore,
  updateComplaintStatus as updateComplaintStatusFirestore,
  updateComplaint as updateComplaintFirestore
} from '../utils/firestoreService';

const AppContext = createContext();

// Toggle between Firestore and mock data
// Set to true to use Firebase Firestore (requires valid Firebase config)
// Set to false to use mock data (for development/testing)
const USE_FIRESTORE = true;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Real-time Firestore listener for all complaints
  useEffect(() => {
    if (!USE_FIRESTORE) {
      // Use mock data with escalation check
      const updatedComplaints = complaints.map(complaint => ({
        ...complaint,
        isEscalated: checkEscalation(complaint)
      }));
      
      if (JSON.stringify(updatedComplaints) !== JSON.stringify(complaints)) {
        setComplaints(updatedComplaints);
      }
      return;
    }

    // Subscribe to Firestore real-time updates
    setLoading(true);
    const unsubscribe = subscribeToComplaints((firestoreComplaints) => {
      setComplaints(firestoreComplaints);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [USE_FIRESTORE]);

  // Periodic escalation check - runs every minute to update escalation status
  useEffect(() => {
    const updateEscalationStatus = () => {
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => ({
          ...complaint,
          isEscalated: checkEscalation(complaint)
        }))
      );
    };

    // Run immediately on mount
    updateEscalationStatus();

    // Then run every 60 seconds (1 minute)
    const interval = setInterval(updateEscalationStatus, 60000);

    return () => clearInterval(interval);
  }, []);

  const login = (email, password) => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const addComplaint = async (complaint) => {
    // Check for nearby complaint within 100m
    const nearbyComplaint = findNearbyComplaint(complaint, complaints, 100);
    
    if (nearbyComplaint) {
      // Instead of creating new complaint, upvote the existing one
      const citizenId = user?.citizenId || 'GUEST';
      const updatedComplaint = await upvoteComplaint(nearbyComplaint.id, citizenId);
      
      // Return the updated complaint with new upvote count
      if (updatedComplaint) {
        return { ...updatedComplaint, upvoted: true };
      }
      // If already upvoted by this user, return original
      return { ...nearbyComplaint, upvoted: true, alreadyUpvoted: true };
    }

    // No nearby complaint found, create new one
    if (USE_FIRESTORE) {
      // Add to Firestore (real-time listener will update state automatically)
      try {
        const newComplaint = await addComplaintFirestore({
          ...complaint,
          citizenName: user?.name || 'Anonymous',
          citizenId: user?.citizenId || 'GUEST',
          upvotes: 1,
          upvotedBy: [user?.citizenId || 'GUEST']
        });
        return { ...newComplaint, upvoted: false };
      } catch (error) {
        console.error('Error adding complaint to Firestore:', error);
        throw error;
      }
    } else {
      // Add to local state (mock mode)
      const newComplaint = {
        ...complaint,
        id: complaints.length + 1,
        status: 'Submitted',
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        citizenName: user?.name || 'Anonymous',
        citizenId: user?.citizenId || 'GUEST',
        duplicateCount: 0,
        isEscalated: false,
        upvotes: 1,
        upvotedBy: [user?.citizenId || 'GUEST']
      };
      setComplaints([...complaints, newComplaint]);
      return { ...newComplaint, upvoted: false };
    }
  };

  const upvoteComplaint = async (complaintId, citizenId) => {
    if (USE_FIRESTORE) {
      try {
        const complaint = complaints.find(c => c.id === complaintId);
        if (!complaint) return null;

        // Check if user already upvoted
        if (complaint.upvotedBy?.includes(citizenId)) {
          return null; // Already upvoted
        }

        const newUpvotedBy = [...(complaint.upvotedBy || []), citizenId];
        const newUpvotes = (complaint.upvotes || 0) + 1;

        await updateComplaintFirestore(complaintId, {
          upvotes: newUpvotes,
          upvotedBy: newUpvotedBy,
          duplicateCount: newUpvotes - 1
        });

        // Return updated complaint data
        const updatedComplaint = {
          ...complaint,
          upvotes: newUpvotes,
          upvotedBy: newUpvotedBy,
          duplicateCount: newUpvotes - 1
        };
        return updatedComplaint;
      } catch (error) {
        console.error('Error upvoting complaint in Firestore:', error);
        throw error;
      }
    } else {
      // Update local state (mock mode)
      let updatedComplaint = null;
      setComplaints(complaints.map(complaint => {
        if (complaint.id === complaintId) {
          // Check if user already upvoted
          if (complaint.upvotedBy?.includes(citizenId)) {
            return complaint;
          }

          const newUpvotedBy = [...(complaint.upvotedBy || []), citizenId];
          const newUpvotes = (complaint.upvotes || 0) + 1;

          updatedComplaint = {
            ...complaint,
            upvotes: newUpvotes,
            upvotedBy: newUpvotedBy,
            duplicateCount: newUpvotes - 1
          };
          return updatedComplaint;
        }
        return complaint;
      }));
      return updatedComplaint;
    }
  };

  const updateComplaintStatus = async (id, status, assignedDepartment = null) => {
    if (USE_FIRESTORE) {
      // Update in Firestore (real-time listener will update state automatically)
      try {
        await updateComplaintStatusFirestore(id, status, assignedDepartment);
      } catch (error) {
        console.error('Error updating complaint in Firestore:', error);
        throw error;
      }
    } else {
      // Update local state (mock mode)
      setComplaints(complaints.map(complaint => {
        if (complaint.id === id) {
          const updated = {
            ...complaint,
            status,
            ...(assignedDepartment && { assignedDepartment }),
            ...(status === 'Resolved' && { resolvedAt: new Date().toISOString() })
          };
          return updated;
        }
        return complaint;
      }));
    }
  };

  const getComplaintById = (id) => {
    return complaints.find(c => c.id === parseInt(id));
  };

  const getUserComplaints = () => {
    if (!user || user.role !== 'citizen') return [];
    return complaints.filter(c => c.citizenId === user.citizenId);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        complaints,
        loading,
        useFirestore: USE_FIRESTORE,
        login,
        logout,
        addComplaint,
        upvoteComplaint,
        updateComplaintStatus,
        getComplaintById,
        getUserComplaints
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

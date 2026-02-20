import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { checkEscalation } from './calculations';

// Collection references
const complaintsCollection = collection(db, 'complaints');
const usersCollection = collection(db, 'users');

/**
 * COMPLAINTS OPERATIONS
 */

// Add a new complaint
export const addComplaint = async (complaintData) => {
  try {
    const newComplaint = {
      ...complaintData,
      status: 'Submitted',
      createdAt: serverTimestamp(),
      resolvedAt: null,
      duplicateCount: 0,
      isEscalated: false
    };
    
    const docRef = await addDoc(complaintsCollection, newComplaint);
    return { id: docRef.id, ...newComplaint };
  } catch (error) {
    console.error('Error adding complaint:', error);
    throw error;
  }
};

// Update complaint status
export const updateComplaintStatus = async (complaintId, status, assignedDepartment = null) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    const updateData = {
      status,
      ...(assignedDepartment && { assignedDepartment }),
      ...(status === 'Resolved' && { resolvedAt: serverTimestamp() })
    };
    
    await updateDoc(complaintRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

// Update complaint details
export const updateComplaint = async (complaintId, updateData) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

// Delete complaint
export const deleteComplaint = async (complaintId) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    await deleteDoc(complaintRef);
    return true;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};

// Get single complaint by ID
export const getComplaintById = async (complaintId) => {
  try {
    const complaintRef = doc(db, 'complaints', complaintId);
    const complaintDoc = await getDoc(complaintRef);
    
    if (complaintDoc.exists()) {
      return { id: complaintDoc.id, ...complaintDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting complaint:', error);
    throw error;
  }
};

// Get all complaints
export const getAllComplaints = async () => {
  try {
    const querySnapshot = await getDocs(complaintsCollection);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting complaints:', error);
    throw error;
  }
};

// Get complaints by citizen ID
export const getComplaintsByCitizen = async (citizenId) => {
  try {
    const q = query(complaintsCollection, where('citizenId', '==', citizenId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user complaints:', error);
    throw error;
  }
};

// Get complaints by status
export const getComplaintsByStatus = async (status) => {
  try {
    const q = query(complaintsCollection, where('status', '==', status));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting complaints by status:', error);
    throw error;
  }
};

/**
 * REAL-TIME LISTENERS
 */

// Listen to all complaints in real-time
export const subscribeToComplaints = (callback) => {
  const q = query(complaintsCollection, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const complaints = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamps to ISO strings
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() || data.resolvedAt,
        // Check escalation status
        isEscalated: checkEscalation({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        })
      };
    });
    
    callback(complaints);
  }, (error) => {
    console.error('Error in complaints listener:', error);
  });
};

// Listen to user's complaints in real-time
export const subscribeToUserComplaints = (citizenId, callback) => {
  const q = query(
    complaintsCollection, 
    where('citizenId', '==', citizenId),
    orderBy('createdAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const complaints = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() || data.resolvedAt,
        isEscalated: checkEscalation({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt
        })
      };
    });
    
    callback(complaints);
  }, (error) => {
    console.error('Error in user complaints listener:', error);
  });
};

// Listen to specific complaint in real-time
export const subscribeToComplaint = (complaintId, callback) => {
  const complaintRef = doc(db, 'complaints', complaintId);
  
  return onSnapshot(complaintRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        resolvedAt: data.resolvedAt?.toDate?.()?.toISOString() || data.resolvedAt
      });
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in complaint listener:', error);
  });
};

/**
 * USER OPERATIONS
 */

// Add or update user
export const saveUser = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    return true;
  } catch (error) {
    // If doc doesn't exist, create it
    const userRef = doc(db, 'users', userId);
    await addDoc(usersCollection, { id: userId, ...userData });
    return true;
  }
};

// Get user by ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Get user by email
export const getUserByEmail = async (email) => {
  try {
    const q = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
};

/**
 * UTILITY FUNCTIONS
 */

// Convert Firestore timestamp to ISO string
export const timestampToISO = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Batch update complaints
export const batchUpdateComplaints = async (updates) => {
  try {
    const promises = updates.map(({ id, data }) => {
      const complaintRef = doc(db, 'complaints', id);
      return updateDoc(complaintRef, data);
    });
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error in batch update:', error);
    throw error;
  }
};

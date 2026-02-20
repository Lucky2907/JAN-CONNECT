/**
 * Seed Script for Firestore
 * 
 * This script populates your Firestore database with initial mock data.
 * Run this ONCE after setting up Firebase to populate the database.
 * 
 * Usage:
 * 1. Ensure Firebase is configured in src/config/firebase.js
 * 2. Uncomment the seedData() call at the bottom
 * 3. Run the app: npm run dev
 * 4. Open browser console to see seeding progress
 * 5. Comment out seedData() call after successful seeding
 */

import { mockComplaints, mockUsers } from '../data/mockData';
import { addComplaint } from './firestoreService';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Seed complaints data
 */
export const seedComplaints = async () => {
  console.log('🌱 Starting to seed complaints...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (const complaint of mockComplaints) {
      try {
        // Remove the id field as Firestore will generate it
        const { id, ...complaintData } = complaint;
        
        const result = await addComplaint(complaintData);
        console.log(`✅ Added complaint: ${result.id} - ${complaint.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add complaint: ${complaint.title}`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 Seeding complete!`);
    console.log(`   ✅ Success: ${successCount} complaints`);
    console.log(`   ❌ Failed: ${errorCount} complaints`);
    
    return { successCount, errorCount };
  } catch (error) {
    console.error('❌ Error seeding complaints:', error);
    throw error;
  }
};

/**
 * Seed users data
 */
export const seedUsers = async () => {
  console.log('🌱 Starting to seed users...');
  
  try {
    let successCount = 0;
    let errorCount = 0;
    
    const usersCollection = collection(db, 'users');
    
    for (const user of mockUsers) {
      try {
        const docRef = await addDoc(usersCollection, user);
        console.log(`✅ Added user: ${docRef.id} - ${user.name}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to add user: ${user.name}`, error);
        errorCount++;
      }
    }
    
    console.log(`\n🎉 User seeding complete!`);
    console.log(`   ✅ Success: ${successCount} users`);
    console.log(`   ❌ Failed: ${errorCount} users`);
    
    return { successCount, errorCount };
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

/**
 * Seed all data (complaints and users)
 */
export const seedAllData = async () => {
  console.log('🚀 Starting database seeding...\n');
  
  try {
    // Seed users first
    const userResults = await seedUsers();
    console.log('\n---\n');
    
    // Then seed complaints
    const complaintResults = await seedComplaints();
    
    console.log('\n======================');
    console.log('📊 FINAL REPORT');
    console.log('======================');
    console.log(`Users: ${userResults.successCount} success, ${userResults.errorCount} failed`);
    console.log(`Complaints: ${complaintResults.successCount} success, ${complaintResults.errorCount} failed`);
    console.log('======================\n');
    
    return {
      users: userResults,
      complaints: complaintResults
    };
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error);
    throw error;
  }
};

/**
 * Clear all data from Firestore (USE WITH CAUTION!)
 */
export const clearAllData = async () => {
  console.warn('⚠️  This will delete ALL data from Firestore!');
  console.log('Not implemented for safety. Use Firebase Console to delete data manually.');
};

// Uncomment the line below to run seeding when app starts
// Make sure to comment it out again after successful seeding!
// seedAllData();

export default {
  seedComplaints,
  seedUsers,
  seedAllData,
  clearAllData
};

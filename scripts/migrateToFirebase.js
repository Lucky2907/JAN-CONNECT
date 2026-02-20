// Firebase Data Migration Script
// Run this script to populate Firebase Firestore with mock data

import { db } from './config/firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { mockComplaints } from './data/mockData.js';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.magenta}▶${colors.reset} ${msg}`)
};

// Function to clear existing complaints
async function clearExistingComplaints() {
  log.step('Clearing existing complaints from Firestore...');
  try {
    const complaintsRef = collection(db, 'complaints');
    const snapshot = await getDocs(complaintsRef);
    
    if (snapshot.empty) {
      log.info('No existing complaints found.');
      return;
    }

    const batch = writeBatch(db);
    snapshot.docs.forEach((document) => {
      batch.delete(doc(db, 'complaints', document.id));
    });

    await batch.commit();
    log.success(`Deleted ${snapshot.size} existing complaints.`);
  } catch (error) {
    log.error(`Error clearing complaints: ${error.message}`);
    throw error;
  }
}

// Function to migrate mock complaints to Firestore
async function migrateComplaintsToFirestore() {
  log.step('Starting data migration to Firebase Firestore...');
  log.info(`Total complaints to migrate: ${mockComplaints.length}`);
  
  try {
    const complaintsRef = collection(db, 'complaints');
    let successCount = 0;
    let errorCount = 0;

    for (const complaint of mockComplaints) {
      try {
        // Remove the 'id' field as Firestore auto-generates IDs
        const { id, ...complaintData } = complaint;
        
        // Ensure all required fields are present
        const complaintToAdd = {
          ...complaintData,
          isEscalated: complaintData.isEscalated || false,
          upvotes: complaintData.upvotes || 0,
          upvotedBy: complaintData.upvotedBy || [],
          duplicateCount: complaintData.duplicateCount || 0,
          createdAt: complaintData.createdAt || new Date().toISOString(),
          imageUrl: complaintData.imageUrl || null
        };

        await addDoc(complaintsRef, complaintToAdd);
        successCount++;
        log.success(`Migrated: ${complaint.title} (${successCount}/${mockComplaints.length})`);
      } catch (error) {
        errorCount++;
        log.error(`Failed to migrate complaint #${complaint.id}: ${error.message}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    log.success(`Migration completed: ${successCount} successful, ${errorCount} failed`);
    console.log('='.repeat(60) + '\n');

    return { successCount, errorCount };
  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    throw error;
  }
}

// Function to verify migrated data
async function verifyMigration() {
  log.step('Verifying migrated data...');
  try {
    const complaintsRef = collection(db, 'complaints');
    const snapshot = await getDocs(complaintsRef);
    
    log.info(`Total complaints in Firestore: ${snapshot.size}`);
    
    if (snapshot.size === mockComplaints.length) {
      log.success('✓ All complaints migrated successfully!');
    } else {
      log.warning(`⚠ Expected ${mockComplaints.length} complaints, found ${snapshot.size}`);
    }

    // Show sample data
    if (!snapshot.empty) {
      log.info('\nSample complaint data:');
      const firstDoc = snapshot.docs[0];
      console.log(JSON.stringify(firstDoc.data(), null, 2));
    }

    return snapshot.size;
  } catch (error) {
    log.error(`Verification failed: ${error.message}`);
    throw error;
  }
}

// Main migration function
export async function runMigration(options = {}) {
  const { clearExisting = false } = options;

  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('  🚀 FIREBASE FIRESTORE DATA MIGRATION');
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Clear existing data if requested
    if (clearExisting) {
      await clearExistingComplaints();
      console.log('');
    }

    // Step 2: Migrate mock data
    await migrateComplaintsToFirestore();

    // Step 3: Verify migration
    console.log('');
    await verifyMigration();

    console.log('\n' + '='.repeat(60));
    log.success('🎉 Migration completed successfully!');
    console.log('='.repeat(60) + '\n');

    log.info('Next steps:');
    console.log('  1. Check your Firebase Console to verify the data');
    console.log('  2. Ensure USE_FIRESTORE is set to true in AppContext.jsx');
    console.log('  3. Restart your development server if needed\n');

  } catch (error) {
    console.log('\n' + '='.repeat(60));
    log.error('❌ Migration failed!');
    console.log('='.repeat(60) + '\n');
    console.error(error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);
  const clearExisting = args.includes('--clear') || args.includes('-c');

  if (clearExisting) {
    log.warning('⚠️  WARNING: This will delete all existing complaints in Firestore!');
    log.info('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');
    
    setTimeout(() => {
      runMigration({ clearExisting: true });
    }, 3000);
  } else {
    runMigration({ clearExisting: false });
  }
}

export default runMigration;

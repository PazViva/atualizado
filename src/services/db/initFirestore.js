import { enableIndexedDbPersistence } from 'firebase/firestore';
import { db } from '../../firebase/config';

// Initialize persistence once at app startup
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence enabled in first tab only');
  } else if (err.code === 'unimplemented') {
    console.log('Browser doesn\'t support persistence');
  }
}

export { db };
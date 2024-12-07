import { 
  collection, 
  query, 
  where, 
  limit 
} from 'firebase/firestore';
import { db } from '../../firebase/config';

const GRATITUDE_COLLECTION = 'gratitude';

export const createRecentGratitudesQuery = (userId) => {
  return query(
    collection(db, GRATITUDE_COLLECTION),
    where('userId', '==', userId),
    limit(5)
  );
};

export const createAllGratitudesQuery = (userId) => {
  return query(
    collection(db, GRATITUDE_COLLECTION),
    where('userId', '==', userId)
  );
};
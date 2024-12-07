import { collection, query, where, orderBy, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import localforage from 'localforage';

const GRATITUDE_COLLECTION = 'gratitude';
const OFFLINE_STORE = 'gratitude-offline-store';

const formatGratitudeDoc = (doc) => ({
  id: doc.id,
  ...doc.data(),
  createdAt: doc.data().createdAt?.toDate() || new Date(),
  favorite: doc.data().favorite || false
});

export const getRecentGratitudes = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  // First try to get cached data
  localforage.getItem(OFFLINE_STORE).then((cachedData) => {
    if (cachedData) {
      callback(cachedData);
    }
  });

  const q = query(
    collection(db, GRATITUDE_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q,
    {
      next: (snapshot) => {
        const gratitudes = snapshot.docs
          .map(formatGratitudeDoc)
          .sort((a, b) => b.createdAt - a.createdAt);
        
        // Update cache
        localforage.setItem(OFFLINE_STORE, gratitudes);
        callback(gratitudes);
      },
      error: (error) => {
        console.error('Error fetching gratitudes:', error);
        // On error, try to serve cached data
        localforage.getItem(OFFLINE_STORE).then((cachedData) => {
          if (cachedData) {
            callback(cachedData);
          } else {
            callback([]);
          }
        });
      }
    }
  );
};

export const getAllGratitudes = async (userId) => {
  if (!userId) return [];

  try {
    const q = query(
      collection(db, GRATITUDE_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const gratitudes = snapshot.docs
      .map(formatGratitudeDoc)
      .sort((a, b) => b.createdAt - a.createdAt);
    
    // Update cache
    await localforage.setItem(OFFLINE_STORE, gratitudes);
    return gratitudes;
  } catch (error) {
    console.error('Error fetching all gratitudes:', error);
    
    // Try to get cached data
    const cachedData = await localforage.getItem(OFFLINE_STORE);
    return cachedData || [];
  }
};
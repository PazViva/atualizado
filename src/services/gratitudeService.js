import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDocs,
  onSnapshot,
  limit,
  enableIndexedDbPersistence
} from 'firebase/firestore';
import { db } from '../firebase/config';

const GRATITUDE_COLLECTION = 'gratitude';

// Initialize Firestore persistence
try {
  enableIndexedDbPersistence(db);
} catch (err) {
  console.log('Persistence already enabled or browser unsupported');
}

export const addGratitude = async (userId, text) => {
  if (!userId || !text.trim()) {
    throw new Error('Dados inválidos para adicionar gratidão');
  }

  try {
    return await addDoc(collection(db, GRATITUDE_COLLECTION), {
      userId,
      text: text.trim(),
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erro ao adicionar gratidão:', error);
    throw new Error('Não foi possível salvar sua gratidão. Por favor, tente novamente.');
  }
};

export const getRecentGratitudes = (userId, callback) => {
  if (!userId) {
    callback([]);
    return () => {};
  }

  try {
    // Simplified query to avoid index requirements
    const q = query(
      collection(db, GRATITUDE_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    return onSnapshot(q, 
      (snapshot) => {
        const gratitudes = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date()
          }))
          .sort((a, b) => b.createdAt - a.createdAt);
        
        callback(gratitudes);
      },
      (error) => {
        console.error('Erro ao buscar gratidões recentes:', error);
        if (error.code === 'failed-precondition') {
          // Fallback to simple query without ordering
          const simpleQuery = query(
            collection(db, GRATITUDE_COLLECTION),
            where('userId', '==', userId),
            limit(5)
          );
          
          onSnapshot(simpleQuery, 
            (snapshot) => {
              const gratitudes = snapshot.docs
                .map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                  createdAt: doc.data().createdAt?.toDate() || new Date()
                }))
                .sort((a, b) => b.createdAt - a.createdAt);
              
              callback(gratitudes);
            },
            (fallbackError) => {
              console.error('Erro no fallback:', fallbackError);
              callback([]);
            }
          );
        } else {
          callback([]);
        }
      }
    );
  } catch (error) {
    console.error('Erro ao configurar listener:', error);
    callback([]);
    return () => {};
  }
};

export const getAllGratitudes = async (userId) => {
  if (!userId) return [];

  try {
    // Simplified query to avoid index requirements
    const q = query(
      collection(db, GRATITUDE_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
      .sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error('Erro ao buscar todas as gratidões:', error);
    return [];
  }
};
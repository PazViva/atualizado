import { collection, addDoc, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { motivationalPhrases } from './motivationalPhrases';

const NOTIFICATIONS_COLLECTION = 'notifications';
const USER_PREFERENCES_COLLECTION = 'userPreferences';

export const scheduleNotification = async (userId, timeSlot) => {
  const phraseGroup = motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)];
  const message = phraseGroup.messages[Math.floor(Math.random() * phraseGroup.messages.length)];

  try {
    await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
      userId,
      title: phraseGroup.title,
      message,
      timeSlot,
      timestamp: new Date(),
      read: false
    });
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
  }
};

export const getNotificationHistory = async (userId) => {
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date()
    })).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error('Erro ao buscar histórico de notificações:', error);
    return [];
  }
};

export const updateNotificationPreference = async (userId, enabled) => {
  try {
    const userPrefsRef = doc(db, USER_PREFERENCES_COLLECTION, userId);
    await updateDoc(userPrefsRef, {
      notificationsEnabled: enabled
    });
  } catch (error) {
    console.error('Erro ao atualizar preferência de notificações:', error);
    throw error;
  }
};
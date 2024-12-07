import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { getMessaging } from 'firebase/messaging';

const NOTIFICATION_INTERVALS = [
  { hour: 9, minute: 0 },   // Manhã
  { hour: 15, minute: 0 },  // Tarde
  { hour: 20, minute: 0 }   // Noite
];

export const scheduleNotifications = async (userId, gratitudeList) => {
  if (!gratitudeList || gratitudeList.length === 0) return;

  const now = new Date();
  const messaging = getMessaging();

  NOTIFICATION_INTERVALS.forEach(async (interval) => {
    const scheduledTime = new Date(now);
    scheduledTime.setHours(interval.hour, interval.minute, 0);

    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const randomGratitude = gratitudeList[Math.floor(Math.random() * gratitudeList.length)];

    try {
      await addDoc(collection(db, 'scheduledNotifications'), {
        userId,
        gratitudeId: randomGratitude.id,
        gratitudeText: randomGratitude.text,
        scheduledFor: scheduledTime.toISOString(),
        createdAt: serverTimestamp(),
        sent: false
      });
    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  });
};
import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../firebase/messaging';
import { scheduleNotification, updateNotificationPreference } from '../services/notifications/notificationService';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const NOTIFICATION_TIMES = [
  { hour: 9, minute: 0, slot: 'morning' },
  { hour: 15, minute: 0, slot: 'afternoon' },
  { hour: 20, minute: 0, slot: 'evening' }
];

export function useNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const setupNotifications = async () => {
      if (!user) return;
      
      try {
        const token = await requestNotificationPermission();
        if (token) {
          console.log('Notificações configuradas com sucesso');
          
          // Schedule notifications for each time slot
          NOTIFICATION_TIMES.forEach(time => {
            const now = new Date();
            const scheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), time.hour, time.minute);
            
            if (scheduledTime > now) {
              const delay = scheduledTime.getTime() - now.getTime();
              setTimeout(() => {
                if (notificationsEnabled) {
                  scheduleNotification(user.uid, time.slot);
                }
              }, delay);
            }
          });

          onMessageListener()
            .then((payload) => {
              if (notificationsEnabled) {
                toast.info(payload.notification.body, {
                  icon: '🙏',
                  position: 'top-right',
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }
            })
            .catch((err) => console.error('Erro ao receber mensagem:', err));
        }
      } catch (error) {
        console.error('Erro ao configurar notificações:', error);
      }
    };

    if ('Notification' in window) {
      setupNotifications();
    }
  }, [user, notificationsEnabled]);

  const toggleNotifications = async (enabled) => {
    if (!user) return;
    
    try {
      await updateNotificationPreference(user.uid, enabled);
      setNotificationsEnabled(enabled);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar preferência de notificações:', error);
      throw error;
    }
  };

  return { notificationsEnabled, toggleNotifications };
}
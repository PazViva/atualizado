import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getNotificationHistory } from '../services/notifications/notificationService';
import { Container, Typography, Paper, List, ListItem, ListItemText, Divider, Box, CircularProgress } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function NotificationHistory() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadNotifications = async () => {
      if (user) {
        try {
          const history = await getNotificationHistory(user.uid);
          setNotifications(history);
        } catch (error) {
          console.error('Erro ao carregar notificações:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadNotifications();
  }, [user]);

  const formatDate = (date) => {
    return format(date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, textAlign: 'center' }}>
        Histórico de Notificações
      </Typography>
      <Paper elevation={3} sx={{ bgcolor: '#FAEBD7', borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {notifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="Nenhuma notificação ainda"
                  secondary="As notificações aparecerão aqui ao longo do dia"
                  primaryTypographyProps={{ 
                    align: 'center',
                    color: 'primary',
                    sx: { fontWeight: 500 }
                  }}
                  secondaryTypographyProps={{ 
                    align: 'center',
                    color: 'text.secondary'
                  }}
                />
              </ListItem>
            ) : (
              notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem sx={{ 
                    py: 2,
                    px: 3,
                    bgcolor: index % 2 === 0 ? '#F5F5DC' : '#FAEBD7'
                  }}>
                    <ListItemText
                      primary={notification.title}
                      secondary={
                        <>
                          <Typography component="p" variant="body2" color="text.primary">
                            {notification.message}
                          </Typography>
                          <Typography component="span" variant="caption" color="text.secondary">
                            {formatDate(notification.timestamp)}
                          </Typography>
                        </>
                      }
                      primaryTypographyProps={{ 
                        color: 'primary',
                        sx: { fontWeight: 500 }
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
}
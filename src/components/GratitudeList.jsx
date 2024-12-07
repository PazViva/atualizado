import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  IconButton,
  Divider,
  CircularProgress,
  Box,
  Switch,
  FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getAllGratitudes, deleteGratitude, toggleFavorite } from '../services/gratitude';
import { toast } from 'react-toastify';
import { useNotifications } from '../hooks/useNotifications';

export default function GratitudeList() {
  const [gratitudes, setGratitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { user } = useAuth();
  const { toggleNotifications } = useNotifications();

  useEffect(() => {
    let mounted = true;

    const loadGratitudes = async () => {
      if (!user) return;
      
      try {
        const loadedGratitudes = await getAllGratitudes(user.uid);
        if (mounted) {
          setGratitudes(loadedGratitudes);
        }
      } catch (error) {
        console.error('Erro ao carregar lista de gratidões:', error);
        toast.error('Não foi possível carregar suas gratidões');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGratitudes();

    return () => {
      mounted = false;
    };
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await deleteGratitude(user.uid, id);
      setGratitudes(prev => prev.filter(g => g.id !== id));
      toast.success('Gratidão removida com sucesso');
    } catch (error) {
      toast.error('Erro ao remover gratidão');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const gratitude = gratitudes.find(g => g.id === id);
      const currentFavorites = gratitudes.filter(g => g.favorite).length;
      
      if (!gratitude.favorite && currentFavorites >= 3) {
        toast.warning('Você já tem 3 gratidões favoritas');
        return;
      }

      await toggleFavorite(user.uid, id, !gratitude.favorite);
      setGratitudes(prev => prev.map(g => 
        g.id === id ? { ...g, favorite: !g.favorite } : g
      ));
    } catch (error) {
      toast.error('Erro ao atualizar favorito');
    }
  };

  const handleToggleNotifications = async () => {
    try {
      await toggleNotifications(!notificationsEnabled);
      setNotificationsEnabled(!notificationsEnabled);
      toast.success(`Notificações ${!notificationsEnabled ? 'ativadas' : 'desativadas'}`);
    } catch (error) {
      toast.error('Erro ao alterar configuração de notificações');
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(date, "EEEE, d 'de' MMMM 'de' yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom color="primary" sx={{ mb: 4, textAlign: 'center' }}>
        Seu Histórico de Gratidão
      </Typography>

      <Paper elevation={3} sx={{ mb: 3, p: 2, bgcolor: '#FAEBD7' }}>
        <FormControlLabel
          control={
            <Switch
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <NotificationsIcon sx={{ mr: 1 }} />
              Receber notificações diárias
            </Box>
          }
        />
      </Paper>

      <Paper elevation={3} sx={{ bgcolor: '#FAEBD7', borderRadius: 2, overflow: 'hidden' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {gratitudes.length === 0 ? (
              <ListItem>
                <ListItemText 
                  primary="Comece sua jornada de gratidão hoje!"
                  secondary="Registre sua primeira gratidão no Dashboard"
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
              gratitudes.map((item, index) => (
                <Box key={item.id}>
                  <ListItem 
                    sx={{ 
                      py: 3,
                      px: 4,
                      bgcolor: item.favorite ? '#FFF3E0' : index % 2 === 0 ? '#F5F5DC' : '#FAEBD7'
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      secondary={formatDate(item.createdAt)}
                      primaryTypographyProps={{ 
                        color: 'text.primary',
                        sx: { 
                          mb: 1,
                          fontSize: '1.1rem',
                          fontWeight: item.favorite ? 600 : 500
                        }
                      }}
                      secondaryTypographyProps={{ 
                        color: 'text.secondary',
                        sx: { 
                          fontStyle: 'italic',
                          fontSize: '0.9rem'
                        }
                      }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        aria-label="favorite"
                        onClick={() => handleToggleFavorite(item.id)}
                        sx={{ mr: 1 }}
                      >
                        {item.favorite ? (
                          <StarIcon sx={{ color: '#FFB74D' }} />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < gratitudes.length - 1 && (
                    <Divider sx={{ opacity: 0.5 }} />
                  )}
                </Box>
              ))
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
}
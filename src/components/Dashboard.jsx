import { Container, Grid, Typography, Paper, Box, CircularProgress } from '@mui/material';
import GratitudeForm from './GratitudeForm';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import { getRecentGratitudes } from '../services/gratitude';

export default function Dashboard() {
  const [recentGratitudes, setRecentGratitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useNotifications();

  useEffect(() => {
    let unsubscribe = () => {};

    if (user) {
      unsubscribe = getRecentGratitudes(user.uid, (gratitudes) => {
        setRecentGratitudes(gratitudes);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, [user]);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom color="primary" align="center">
            Bem-vindo ao seu Diário de Gratidão
          </Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <GratitudeForm />
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, bgcolor: '#FAEBD7', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" align="center">
              Gratidões Recentes
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {recentGratitudes.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" align="center">
                    Nenhuma gratidão registrada ainda. Comece agora mesmo!
                  </Typography>
                ) : (
                  recentGratitudes.map((gratitude) => (
                    <Paper 
                      key={gratitude.id} 
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        bgcolor: '#F5F5DC',
                        borderRadius: 1
                      }}
                    >
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        {gratitude.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {gratitude.createdAt?.toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Typography>
                    </Paper>
                  ))
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
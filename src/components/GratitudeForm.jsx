import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Paper, Box, Typography, CircularProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { addGratitude } from '../services/gratitudeService';

export default function GratitudeForm() {
  const [gratitude, setGratitude] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gratitude.trim()) {
      toast.warning('Por favor, escreva sua gratidão');
      return;
    }

    setLoading(true);
    try {
      await addGratitude(user.uid, gratitude.trim());
      setGratitude('');
      toast.success('Gratidão registrada com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao salvar sua gratidão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: '#FAEBD7', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom color="primary" align="center" sx={{ mb: 3 }}>
        Registre sua Gratidão de Hoje
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={gratitude}
          onChange={(e) => setGratitude(e.target.value)}
          placeholder="Por que você é grato hoje?"
          sx={{ 
            mb: 3,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#F5F5DC',
              '& fieldset': {
                borderColor: '#8B4513',
              },
              '&:hover fieldset': {
                borderColor: '#4A235A',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#4A235A',
              }
            }
          }}
          disabled={loading}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={loading}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 500,
            bgcolor: '#4A235A',
            '&:hover': {
              bgcolor: '#8B4513'
            }
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Registrar Gratidão'
          )}
        </Button>
      </Box>
    </Paper>
  );
}
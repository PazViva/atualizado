import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper, Grid } from '@mui/material';
import { toast } from 'react-toastify';
import FavoriteIcon from '@mui/icons-material/Favorite';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
      toast.success('Bem-vindo ao seu diário de gratidão!');
    } catch (error) {
      toast.error('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FavoriteIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Cultive Gratidão',
      description: 'Registre diariamente suas gratidões e transforme sua perspectiva de vida'
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Lembretes Personalizados',
      description: 'Receba notificações gentis para manter sua prática de gratidão'
    },
    {
      icon: <AutoStoriesIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Seu Diário Pessoal',
      description: 'Acompanhe sua jornada de gratidão e veja seu progresso ao longo do tempo'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h3" component="h1" gutterBottom color="primary" 
                sx={{ fontWeight: 'bold', mb: 3 }}>
                Gratidão Diária
              </Typography>
              <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
                Transforme sua vida através da prática diária da gratidão
              </Typography>
              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} key={index}>
                    <Paper elevation={0} 
                      sx={{ 
                        p: 3, 
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        {feature.icon}
                        <Typography variant="h6" sx={{ ml: 2 }} color="primary">
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body1" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                bgcolor: 'background.paper',
                maxWidth: 400,
                mx: 'auto'
              }}>
              <Typography variant="h5" align="center" gutterBottom color="primary" 
                sx={{ mb: 3, fontWeight: 500 }}>
                Acesse sua conta
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    mb: 2,
                    fontSize: '1.1rem',
                    fontWeight: 500
                  }}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
                <Box sx={{ textAlign: 'center' }}>
                  <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <Typography color="primary" sx={{ 
                      '&:hover': { textDecoration: 'underline' }
                    }}>
                      Não tem uma conta? Cadastre-se gratuitamente
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
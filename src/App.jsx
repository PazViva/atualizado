import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider, createTheme } from '@mui/material';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import GratitudeList from './components/GratitudeList';
import NotificationHistory from './components/NotificationHistory';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4A235A',
      light: '#6B3074',
      dark: '#2E1437',
    },
    secondary: {
      main: '#D2B48C',
      light: '#DEB887',
      dark: '#BC8F8F',
    },
    background: {
      default: '#F5F5DC',
      paper: '#FAEBD7',
    },
    text: {
      primary: '#4A235A',
      secondary: '#8B4513',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#4A235A',
    },
    h5: {
      fontWeight: 500,
      color: '#8B4513',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 20px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider>
          <Navigation />
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            theme="colored"
            hideProgressBar={false}
            newestOnTop
          />
          <Routes>
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/gratitude-list" element={
              <PrivateRoute>
                <GratitudeList />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute>
                <NotificationHistory />
              </PrivateRoute>
            } />
            <Route path="/" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from '@mui/material';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import BackToHome from '@/components/BackToHome';

const Register = () => {
  const navigate = useNavigate();
  const { setUserAndToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirm: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/register/`,
        formData
      );
      
      if (response.status === 201) {
        setUserAndToken(response.data.user, response.data.token);
        navigate('/approval');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'An error occurred during registration. Please try again.'
      );
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <BackToHome />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password_confirm"
              label="Confirm Password"
              type="password"
              id="password_confirm"
              autoComplete="new-password"
              value={formData.password_confirm}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign in
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 
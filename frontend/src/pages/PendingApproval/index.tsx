import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Alert,
  AlertTitle,
  Button,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Account Not Approved
          </Typography>
          <Alert severity="info" sx={{ mt: 3 }}>
            <AlertTitle>Your account is pending approval</AlertTitle>
            <Typography variant="body2" component="div">
              • Please wait while an administrator reviews your account
              <br />
              • You will receive an email once your account is approved
              <br />
              • Once approved, you'll have full access to the platform
            </Typography>
          </Alert>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PendingApproval; 
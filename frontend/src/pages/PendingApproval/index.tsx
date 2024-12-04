import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Alert,
  AlertTitle,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import PendingIcon from '@mui/icons-material/AccessTime';

const PendingApproval: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <PendingIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Account Pending Approval
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Hi {user?.username}, your account is currently pending approval from an administrator.
          </Typography>
          <Alert severity="info" sx={{ mt: 2, textAlign: 'left' }}>
            <AlertTitle>What happens next?</AlertTitle>
            <Typography variant="body2">
              • An administrator will review your account<br />
              • You'll receive an email when your account is approved<br />
              • Once approved, you'll have full access to the platform
            </Typography>
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

export default PendingApproval; 
import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar />
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          pt: 10,
          pb: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout; 
import React, { ReactNode } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState } from 'react';
import PageTransition from '../PageTransition';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 'bold',
              color: 'primary.main'
            }}
          >
            DevClub
          </Typography>
          {user && (
            <>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/')}
                  sx={{ color: 'text.primary' }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/projects')}
                  sx={{ color: 'text.primary' }}
                >
                  Projects
                </Button>
                <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                <IconButton
                  onClick={handleMenu}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  {user.profile_picture ? (
                    <Avatar 
                      src={user.profile_picture}
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/settings'); handleClose(); }}>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <PageTransition>
          {children}
        </PageTransition>
      </Container>
    </Box>
  );
};

export default Layout; 
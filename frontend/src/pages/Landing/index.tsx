import { Box, Container, Typography, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import StarField from '@/components/StarField';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'transparent',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <StarField />

      {/* Animated orbs */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(100, 255, 218, 0.1), transparent)',
          filter: 'blur(60px)',
          top: '-20%',
          right: '-10%',
          zIndex: 1,
        }}
      />

      {/* Header */}
      <AppBar 
        position="fixed" 
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              background: 'linear-gradient(45deg, #64FFDA, #7B89F4)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            DevSpace
          </Typography>
          <Box>
            <Button
              variant="text"
              onClick={() => navigate('/login')}
              sx={{ 
                mr: 2,
                color: 'text.primary',
                '&:hover': {
                  background: 'rgba(100, 255, 218, 0.1)',
                }
              }}
            >
              Sign In
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate('/register')}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: 'linear-gradient(45deg, #64FFDA, #7B89F4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DevSpace
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                color: 'text.secondary',
                mb: 4,
                maxWidth: '600px',
                lineHeight: 1.4,
              }}
            >
              Where developers evolve through collaborative learning
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Box
              component={motion.div}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  fontSize: '1.2rem',
                  py: 1.5,
                  px: 4,
                  background: 'linear-gradient(45deg, #64FFDA, #7B89F4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5A6AD4, #A5B4FF)',
                  },
                  boxShadow: '0 4px 14px 0 rgba(100, 255, 218, 0.3)',
                }}
              >
                Join the Club
              </Button>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 
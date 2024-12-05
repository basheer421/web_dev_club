import { Box, Container, Typography, Button, alpha } from '@mui/material';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

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
        background: `linear-gradient(135deg, 
          ${alpha('#2A9D8F', 0.1)} 0%, 
          ${alpha('#264653', 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
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
          background: `linear-gradient(45deg, ${alpha('#2A9D8F', 0.1)}, ${alpha('#264653', 0.1)})`,
          filter: 'blur(60px)',
          top: '-20%',
          right: '-10%',
          zIndex: 0,
        }}
      />

      <Box
        component={motion.div}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        sx={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: `linear-gradient(45deg, ${alpha('#264653', 0.1)}, ${alpha('#2A9D8F', 0.1)})`,
          filter: 'blur(40px)',
          bottom: '-10%',
          left: '-5%',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 2,
              background: 'linear-gradient(45deg, #2A9D8F, #264653)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            DevClub
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
            }}
          >
            Where developers evolve through collaborative learning
          </Typography>

          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{
                fontSize: '1.2rem',
                py: 1.5,
                px: 4,
                background: 'linear-gradient(45deg, #2A9D8F, #264653)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1F7A6E, #1A2F38)',
                },
              }}
            >
              Join the Club
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing; 
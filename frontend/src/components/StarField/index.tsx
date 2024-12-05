import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

interface Star {
  size: number;
  x: number;
  y: number;
  opacity: number;
}

const StarField: React.FC = () => {
  const stars = useMemo(() => {
    const starCount = 50 + Math.floor(screen.width * screen.height / 100000); // Adjust number of stars based on screen size
    console.log(starCount);
    return Array.from({ length: starCount }, (): Star => ({
      size: Math.random() * 5 + 2, // Random size between 1-4px
      x: Math.random() * 100, // Random position X (0-100%)
      y: Math.random() * 100, // Random position Y (0-100%)
      opacity: Math.random() * 0.5 + 0.3, // Random opacity between 0.3-0.8
    }));
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        background: '#0A192F',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(100, 255, 218, 0.15) 0%, rgba(10, 25, 47, 0) 50%)',
        },
      }}
    >
      <motion.div
        animate={{
          transform: [
            'translate(0, 0) rotate(0deg)',
            'translate(-25%, -25%) rotate(0.5deg)',
            'translate(0, 0) rotate(0deg)',
          ],
        }}
        transition={{
          duration: 240,
          ease: "linear",
          repeat: Infinity,
        }}
        style={{
          position: 'absolute',
          width: '200%',
          height: '200%',
          top: '-50%',
          left: '-50%',
        }}
      >
        {stars.map((star, index) => (
          <Box
            key={index}
            component={motion.div}
            animate={{
              opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "linear",
            }}
            sx={{
              position: 'absolute',
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: '50%',
              backgroundColor: 'white',
              left: `${star.x}%`,
              top: `${star.y}%`,
              boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.opacity})`,
            }}
          />
        ))}
      </motion.div>
    </Box>
  );
};

export default StarField; 
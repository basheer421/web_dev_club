import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackToHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Back to Home">
      <IconButton
        onClick={() => navigate('/')}
        sx={{
          position: 'absolute',
          top: 20,
          left: 20,
          color: 'text.primary',
          '&:hover': {
            background: 'rgba(100, 255, 218, 0.1)',
          },
        }}
      >
        <ArrowBackIcon />
      </IconButton>
    </Tooltip>
  );
};

export default BackToHome; 
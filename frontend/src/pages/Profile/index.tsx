import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  TextField,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import api from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const Profile: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [usernameError, setUsernameError] = useState<string | null>(null);

  if (!user) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      setOpenDialog(true);
    }
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile_picture', file);

      await api.patch('/users/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await checkAuth();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleUsernameUpdate = async () => {
    if (!newUsername.trim() || newUsername === user?.username) {
      setIsEditingUsername(false);
      setNewUsername(user?.username || '');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', newUsername);

      await api.patch('/users/profile/', formData);
      await checkAuth();
      setIsEditingUsername(false);
      setUsernameError(null);
    } catch (error: any) {
      setUsernameError(error.response?.data?.error || 'Failed to update username');
    }
  };

  return (
    <>
      <Grid container spacing={4} sx={{ height: '100%' }}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 4, 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box sx={{ 
              position: 'relative', 
              display: 'inline-block',
              mb: 2,
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    size="small"
                    sx={{
                      bgcolor: 'primary.main',
                      '&:hover': { bgcolor: 'primary.dark' },
                    }}
                    component="label"
                  >
                    <input
                      hidden
                      accept="image/*"
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                    />
                    <CameraAltIcon sx={{ fontSize: 20, color: 'background.default' }} />
                  </IconButton>
                }
              >
                <Avatar
                  src={user?.profile_picture || undefined}
                  sx={{ 
                    width: 180, 
                    height: 180,
                    border: '4px solid',
                    borderColor: 'rgba(100, 255, 218, 0.2)',
                  }}
                />
              </Badge>
            </Box>

            {isEditingUsername ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  error={Boolean(usernameError)}
                  helperText={usernameError}
                  size="small"
                  sx={{ width: '200px' }}
                />
                <IconButton size="small" color="primary" onClick={handleUsernameUpdate}>
                  <CheckIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  color="error"
                  onClick={() => {
                    setIsEditingUsername(false);
                    setNewUsername(user?.username || '');
                    setUsernameError(null);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4">
                  {user?.username}
                </Typography>
                <Tooltip title="Edit username">
                  <IconButton size="small" onClick={() => setIsEditingUsername(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {user?.email}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
              <Chip
                icon={<StarIcon />}
                label={`Level ${user?.level}`}
                color="primary"
                sx={{ 
                  width: '100%', 
                  py: 3,
                  background: 'rgba(100, 255, 218, 0.1)',
                  '& .MuiChip-icon': { fontSize: '1.5rem' }
                }}
              />
              <Chip
                icon={<EmojiEventsIcon />}
                label={`${user?.points} Points`}
                color="secondary"
                sx={{ 
                  width: '100%', 
                  py: 3,
                  background: 'rgba(123, 137, 244, 0.1)',
                  '& .MuiChip-icon': { fontSize: '1.5rem' }
                }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3} sx={{ height: '100%' }}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', background: 'rgba(100, 255, 218, 0.05)' }}>
                <CardContent sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <EmojiEventsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                  <Typography variant="h3" sx={{ color: 'primary.main' }}>
                    {user?.level}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Current Level
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', background: 'rgba(123, 137, 244, 0.05)' }}>
                <CardContent sx={{ 
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}>
                  <AssignmentIcon sx={{ fontSize: 60, color: 'secondary.main' }} />
                  <Typography variant="h3" sx={{ color: 'secondary.main' }}>
                    {user?.points}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    Total Points
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Image Upload Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          {previewUrl && (
            <Box sx={{ mt: 2 }}>
              <img
                src={previewUrl}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="primary"
            disabled={uploading}
            startIcon={uploading ? <CircularProgress size={20} /> : null}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile; 
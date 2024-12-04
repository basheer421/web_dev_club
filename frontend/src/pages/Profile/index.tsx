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
} from '@mui/material';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import api from '../../services/api';

const Profile: React.FC = () => {
  const { user, checkAuth } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      // Refresh user data to get new avatar
      await checkAuth();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <Grid container spacing={3}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <IconButton
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': { bgcolor: 'primary.dark' },
                      width: 32,
                      height: 32,
                    }}
                  >
                    <CameraAltIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                }
              >
                <Avatar
                  src={user.profile_picture}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: '4px solid',
                    borderColor: 'primary.main',
                  }}
                />
              </Badge>
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Chip
                  icon={<StarIcon />}
                  label={`Level ${user.level}`}
                  color="primary"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<EmojiEventsIcon />}
                  label={`${user.points} Points`}
                  color="secondary"
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Stats and Progress */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {/* Stats Cards */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <EmojiEventsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                          <Typography variant="h4">{user.level}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Current Level
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <StarIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                        <Box>
                          <Typography variant="h4">{user.points}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Available Points
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center">
                        <AssignmentIcon sx={{ fontSize: 40, mr: 2, color: 'success.main' }} />
                        <Box>
                          <Typography variant="h4">0</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Completed Projects
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>

            {/* Progress Section */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Level Progress
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Next level requirements:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label="Complete 2 more projects"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Earn 5 more points"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        label="Evaluate 3 more submissions"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Recent Activity */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No recent activity to display.
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Avatar Upload Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogContent>
            {previewUrl && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Avatar
                  src={previewUrl}
                  sx={{ width: 200, height: 200 }}
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
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : null}
            >
              {uploading ? 'Uploading...' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Layout>
  );
};

export default Profile; 
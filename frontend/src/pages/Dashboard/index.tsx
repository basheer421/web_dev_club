import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
} from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import api from '../../services/api';
import { Project } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface ProjectInPool {
  id: number;
  project: Project;
  status: string;
  created_at: string;
  submitted_by: {
    id: number;
    username: string;
  };
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();
  const [projects, setProjects] = useState<ProjectInPool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const projects = await api.get<Project[]>('/projects/');
      const response = await api.get<ProjectInPool[]>('/projects/pool/');
      for (const project of response.data) {
        project.project = projects.data.find(p => p.id === project.id) || project.project;
      }
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (projectId: number) => {
    try {
      navigate(`/evaluation/${projectId}`);
    } catch (error) {
      console.error('Error starting evaluation:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* User Stats Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(123, 137, 244, 0.15))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Welcome back, {user?.username}!
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <EmojiEventsIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Current Level
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'text.primary' }}>
                    {user?.level}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(123, 137, 244, 0.15), rgba(100, 255, 218, 0.15))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(123, 137, 244, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Available Points
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <AssignmentIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
                <Typography variant="h4" sx={{ color: 'text.primary' }}>
                  {user?.points}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, rgba(100, 255, 218, 0.15), rgba(100, 255, 218, 0.05))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(100, 255, 218, 0.2)',
          }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                Projects to Evaluate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <AssignmentIcon sx={{ fontSize: 40, mr: 2, color: 'success.light' }} />
                <Typography variant="h4" sx={{ color: 'text.primary' }}>
                  {projects.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate('/projects')}
          startIcon={<AssignmentIcon />}
          sx={{
            py: 2,
            px: 4,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #64FFDA, #7B89F4)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5A6AD4, #A5B4FF)',
            },
            boxShadow: '0 4px 14px 0 rgba(100, 255, 218, 0.3)',
          }}
        >
          View All Projects
        </Button>
      </Box>

      {/* Evaluation Pool Section */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Evaluation Pool
          </Typography>
          <Chip 
            label={`${projects.length} Projects Available`}
            color="primary"
            variant="outlined"
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List>
          {projects.map((project, index) => (
            <React.Fragment key={project.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  py: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {project.project.title}
                    </Typography>
                  }
                  secondaryTypographyProps={{ component: 'div' }}
                  secondary={
                    <>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        component="div"
                        sx={{ mb: 1 }}
                      >
                        {project.project.description}
                      </Typography>
                      <Box 
                        component="div" 
                        sx={{ 
                          display: 'flex', 
                          gap: 1, 
                          alignItems: 'center' 
                        }}
                      >
                        <Chip 
                          label={`${project.project.points_required} Points Required`}
                          size="small"
                          color="secondary"
                        />
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          component="span"
                        >
                          Submitted: {new Date(project.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </>
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleEvaluate(project.id)}
                  disabled={project.submitted_by.id === user?.id}
                  sx={{ ml: 2, minWidth: 120 }}
                >
                  {project.submitted_by.id === user?.id ? 'Your Submission' : 'Evaluate'}
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
          {projects.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Box component="div" sx={{ color: 'text.secondary', typography: 'body1', textAlign: 'center' }}>
                    No projects available for evaluation
                  </Box>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </>
  );
};

export default Dashboard; 
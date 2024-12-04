import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Tabs,
  Tab,
  Paper,
  Chip,
  Link,
  CircularProgress,
} from '@mui/material';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Project, ProjectSubmission } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GitHubIcon from '@mui/icons-material/GitHub';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mySubmissions, setMySubmissions] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, submissionsRes] = await Promise.all([
        api.get<Project[]>('/projects/'),
        api.get<ProjectSubmission[]>('/projects/my-submissions/')
      ]);
      setProjects(projectsRes.data);
      setMySubmissions(submissionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: ProjectSubmission['status']) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'in_evaluation':
        return 'info';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Available Projects" />
            <Tab label="My Submissions" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} md={6} lg={4} key={project.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {project.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      component="div"
                      sx={{ mb: 2 }}
                    >
                      {project.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={`${project.points_required} Points Required`}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        startIcon={<PictureAsPdfIcon />}
                        component={Link}
                        href={project.pdf_file}
                        target="_blank"
                        rel="noopener"
                      >
                        View PDF
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/submit-project/${project.id}`)}
                        disabled={user?.points ? user.points < project.points_required : true}
                      >
                        Submit Project
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {mySubmissions.map((submission) => (
              <Grid item xs={12} md={6} lg={4} key={submission.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {submission.project.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Chip 
                        label={submission.status} 
                        color={getStatusColor(submission.status)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        component={Link}
                        href={submission.github_repo}
                        target="_blank"
                        rel="noopener"
                        size="small"
                      >
                        View Code
                      </Button>
                    </Box>
                    <Typography variant="caption" color="text.secondary" component="div">
                      Submitted: {new Date(submission.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {mySubmissions.length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body1" color="text.secondary" align="center">
                  You haven't submitted any projects yet.
                </Typography>
              </Grid>
            )}
          </Grid>
        </TabPanel>
      </Paper>
    </Layout>
  );
};

export default Projects; 
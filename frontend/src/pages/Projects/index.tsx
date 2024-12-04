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
  Link,
  Chip,
} from '@mui/material';
import Layout from '../../components/Layout';
import api from '../../services/api';
import { Project, ProjectSubmission } from '../../types';

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
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
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <Box sx={{ width: '100%' }}>
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
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {project.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Points Required: {project.points_required}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Link href={project.pdf_file} target="_blank" rel="noopener">
                        <Button variant="outlined" sx={{ mr: 1 }}>
                          View PDF
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/submit-project/${project.id}`)}
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
                    <Typography variant="body2" color="text.secondary">
                      GitHub: <Link href={submission.github_repo} target="_blank" rel="noopener">
                        Repository
                      </Link>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Submitted: {new Date(submission.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Box>
    </Layout>
  );
};

export default Projects; 
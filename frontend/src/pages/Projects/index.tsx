import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { Project, ProjectSubmission } from '@/types';
import api from '@/services/api';
import ProjectView from '@/components/ProjectView';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Projects: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mySubmissions, setMySubmissions] = useState<ProjectSubmission[]>([]);
  const [tabValue, setTabValue] = useState(0);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Available Projects" />
          <Tab label="My Submissions" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {projects.map((project) => {
            const submission = mySubmissions.find(s => s.project.id === project.id);
            return (
              <Grid item xs={12} key={project.id}>
                <Paper sx={{ p: 3 }}>
                  <ProjectView 
                    project={project}
                    onSubmit={fetchData}
                    submissionStatus={submission?.status}
                  />
                </Paper>
              </Grid>
            );
          })}
          {projects.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No projects available.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {mySubmissions.map((submission) => (
            <Grid item xs={12} key={submission.id}>
              <Paper sx={{ p: 3 }}>
                <ProjectView 
                  project={submission.project}
                  submissionStatus={submission.status}
                />
              </Paper>
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
  );
};

export default Projects; 
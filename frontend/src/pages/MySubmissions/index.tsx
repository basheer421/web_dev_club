import React, { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Button,
} from "@mui/material";
import { ProjectSubmission } from "@/types";
import api from "@/services/api";

const MySubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get<ProjectSubmission[]>(
        "/projects/my-submissions/"
      );
      setSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_evaluation":
        return "info";
      case "completed":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusMessage = (submission: ProjectSubmission) => {
    if (submission.status === 'failed') {
      return (
        <Typography variant="body2" color="error" sx={{ mt: 1 }}>
          This submission was rejected. You can submit this project again after gaining a point.
        </Typography>
      );
    }
    return null;
  };

  const handleViewPdf = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        My Submissions
      </Typography>
      <List>
        {submissions.map((submission) => (
          <ListItem key={submission.id} divider>
            <ListItemText
              primary={
                <Typography variant="h6" color="primary.main">
                  {submission.project.title}
                </Typography>
              }
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Chip
                      label={`Level ${submission.project.level_required} Required`}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={`${submission.project.points_required} Points Required`}
                      color="secondary"
                      variant="outlined"
                      size="small"
                    />
                    <Chip
                      label={submission.status}
                      color={getStatusColor(submission.status)}
                      size="small"
                    />
                  </Box>
                  {getStatusMessage(submission)}
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewPdf(submission.project.pdf_file)}
                    >
                      View PDF
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      href={submission.github_repo}
                      target="_blank"
                    >
                      View Code
                    </Button>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
        {submissions.length === 0 && (
          <ListItem>
            <ListItemText
              primary={
                <Typography color="text.secondary" align="center">
                  You haven't submitted any projects yet.
                </Typography>
              }
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default MySubmissions;

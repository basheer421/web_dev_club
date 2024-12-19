import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Link,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import api from "../../services/api";
import { ProjectSubmission } from "../../types";
import GitHubIcon from "@mui/icons-material/GitHub";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactMarkdown from "react-markdown";

const EvaluationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<ProjectSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState({
    comments: "",
    is_approved: false,
  });

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const response = await api.get(`/projects/evaluation/${id}/`);
      setSubmission(response.data.submission);
    } catch (error) {
      setError("Failed to load submission");
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (approved: boolean) => {
    if (!evaluation.comments.trim()) {
      setError("Please provide evaluation comments");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/projects/evaluate/${id}/`, {
        comments: evaluation.comments.trim(),
        is_approved: approved,
      });

      navigate("/dashboard");
    } catch (error: any) {
      setError(error.response?.data?.detail || "Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </>
    );
  }

  if (!submission) {
    return (
      <>
        <Alert severity="error">Submission not found</Alert>
      </>
    );
  }

  return (
    <>
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Project Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Project Details
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {submission.project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {submission.project.description}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<PictureAsPdfIcon />}
                    component={Link}
                    href={submission.project.pdf_file}
                    target="_blank"
                  >
                    View Project Requirements
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Evaluation Guidelines */}
          <Grid item xs={12}>
            {submission.project.evaluation_markdown && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Evaluation Guidelines
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "background.paper",
                      borderRadius: 1,
                      "& pre": {
                        bgcolor: "background.default",
                        p: 1,
                        borderRadius: 1,
                        overflow: "auto",
                      },
                    }}
                  >
                    <ReactMarkdown>
                      {submission.project.evaluation_markdown}
                    </ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Submission Details */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Submission by {submission.submitted_by.username}
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<GitHubIcon />}
                  component={Link}
                  href={submission.github_repo}
                  target="_blank"
                  sx={{ mt: 1 }}
                >
                  View Code Repository
                </Button>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={6}
                label="Evaluation Comments"
                value={evaluation.comments}
                onChange={(e) =>
                  setEvaluation({ ...evaluation, comments: e.target.value })
                }
                error={Boolean(error && !evaluation.comments.trim())}
                helperText={error && !evaluation.comments.trim() ? error : ""}
                sx={{ mb: 3 }}
              />

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                >
                  Reject
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleSubmit(true)}
                  disabled={submitting}
                >
                  Approve
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default EvaluationPage;

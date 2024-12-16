import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Alert,
} from "@mui/material";
import { Project } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";

interface ProjectViewProps {
  project: Project;
  onSubmit?: () => void;
  submissionStatus?: string;
  onSubmitSuccess?: () => Promise<void>;
}

const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  onSubmit,
  submissionStatus,
  onSubmitSuccess,
}) => {
  const { user } = useAuth();
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [githubRepo, setGithubRepo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    
    // Validate GitHub URL
    if (!githubRepo.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    // Simple URL validation
    try {
      new URL(githubRepo);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    // Validate GitHub URL format
    if (!githubRepo.match(/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+$/)) {
      setError("Please enter a valid GitHub repository URL");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/projects/submit/", {
        project_id: project.id,
        github_repo: githubRepo,
      });
      setOpenSubmitDialog(false);
      setGithubRepo("");
      if (onSubmit) onSubmit();
      
      if (onSubmitSuccess) {
        await onSubmitSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message ||
                          "Failed to submit project";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewPdf = () => {
    window.open(project.pdf_file, "_blank");
  };

  const isDisabled = user?.level ? user.level < project.level_required : true;
  const notEnoughPoints = user?.points ? user.points < project.points_required : true;

  return (
    <Box>
      <Typography variant="h6" color="primary.main" gutterBottom>
        {project.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {project.description}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
        <Chip
          label={`Level ${project.level_required} Required`}
          color={isDisabled ? "error" : "success"}
          variant="outlined"
        />
        <Chip
          label={`${project.points_required} Points Required`}
          color={notEnoughPoints ? "error" : "success"}
          variant="outlined"
        />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleViewPdf}>
          View PDF
        </Button>
        {submissionStatus ? (
          <Chip
            label={`Status: ${submissionStatus}`}
            color={
              submissionStatus === "pending"
                ? "warning"
                : submissionStatus === "in_evaluation"
                ? "info"
                : "success"
            }
          />
        ) : (
          <Button
            variant="contained"
            onClick={() => setOpenSubmitDialog(true)}
            disabled={isDisabled || notEnoughPoints}
            sx={{
              background: "linear-gradient(45deg, #64FFDA, #7B89F4)",
              "&:hover": {
                background: "linear-gradient(45deg, #5A6AD4, #A5B4FF)",
              },
            }}
          >
            Submit Project
          </Button>
        )}
      </Box>

      <Dialog 
        open={openSubmitDialog} 
        onClose={() => {
          if (!submitting) {
            setOpenSubmitDialog(false);
            setError(null);
            setGithubRepo("");
          }
        }}
      >
        <DialogTitle>Submit Project</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="GitHub Repository URL"
            type="url"
            fullWidth
            value={githubRepo}
            onChange={(e) => {
              setGithubRepo(e.target.value);
              setError(null);
            }}
            error={Boolean(error)}
            disabled={submitting}
            placeholder="https://github.com/username/repository"
            helperText="Example: https://github.com/username/repository"
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenSubmitDialog(false);
              setError(null);
              setGithubRepo("");
            }}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectView;

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
}

const ProjectView: React.FC<ProjectViewProps> = ({
  project,
  onSubmit,
  submissionStatus,
}) => {
  const { user } = useAuth();
  const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
  const [githubRepo, setGithubRepo] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!githubRepo.trim()) {
      setError("Please enter a GitHub repository URL");
      return;
    }

    try {
      await api.post("/projects/submit/", {
        project: project.id,
        github_repo: githubRepo,
      });
      setOpenSubmitDialog(false);
      if (onSubmit) onSubmit();
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to submit project");
    }
  };

  const handleViewPdf = () => {
    window.open(project.pdf_file, "_blank");
  };

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
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`${project.points_required} Points Required`}
          color="secondary"
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
            disabled={user?.level ? user.level < project.level_required : true}
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

      {/* Submit Dialog */}
      <Dialog
        open={openSubmitDialog}
        onClose={() => setOpenSubmitDialog(false)}
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
            onChange={(e) => setGithubRepo(e.target.value)}
            error={Boolean(error)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubmitDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectView;

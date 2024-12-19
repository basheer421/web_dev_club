export interface User {
  id: number;
  username: string;
  email: string;
  points: number;
  level: number;
  profile_picture?: string;
  is_approved: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  pdf_file: string;
  evaluation_markdown: string | null;
  points_required: number;
  level_required: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectSubmission {
  id: number;
  project: Project;
  submitted_by: User;
  github_repo: string;
  status: 'pending' | 'in_evaluation' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: number;
  submission: ProjectSubmission;
  evaluator: User;
  comments: string;
  is_approved: boolean;
  created_at: string;
}

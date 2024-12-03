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
  github_repo: string;
  submitted_by: User;
  evaluator?: User;
  status: 'pending' | 'in_evaluation' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: number;
  project: Project;
  evaluator: User;
  comments: string;
  is_approved: boolean;
  created_at: string;
} 
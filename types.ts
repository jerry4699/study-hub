export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  problemStatement?: string; 
  techStack?: string[]; 
  category: string; 
  branch?: string; 
  semester?: string; 
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  author: string;
  date: string;
  imageUrl: string;
  type: string; 
  downloads: number;
  rating?: number;
  reviews?: number;
  reviewsList?: Review[]; // List of specific reviews
  fullContent?: string; // Simulates the parsed text from the PDF/ZIP for AI Context
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earned: boolean;
  color: string;
}

export interface LeaderboardUser {
    rank: number;
    name: string;
    points: number;
    avatar: string;
}

export interface UserStats {
  uploads: number;
  downloads: number;
  points: number;
  badges: Badge[];
}

export type UserRole = 'Student' | 'Faculty' | 'Admin' | 'General' | 'Alumni';
export type VerificationStatus = 'Unverified' | 'Pending' | 'Verified';
export type AuthProvider = 'email' | 'phone' | 'google';

export interface College {
    id: string;
    name: string;
    domain?: string; // e.g. ves.ac.in
    location: string;
}

export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    authProvider: AuthProvider;
    role: UserRole;
    verificationStatus: VerificationStatus;
    isOfficialEmail: boolean;
    
    // Academic Info (Optional for General/Alumni)
    collegeId?: string;
    collegeName?: string;
    branch?: string;
    year?: string;
    division?: string;
    
    avatar?: string;
}

// New Types for Ecosystem
export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    category: 'Exam' | 'Event' | 'Placement' | 'Hackathon';
    branch: 'Common' | 'CSE' | 'IT' | 'EXTC' | 'AI/DS';
    collegeId?: string; // News specific to a college
    date: string;
    author: string; // e.g., "Exam Cell", "CSI Council"
    important: boolean;
}

export interface Council {
    id: string;
    name: string;
    type: 'Council' | 'Society' | 'Cell';
    description: string;
    logo: string;
    secretary: string;
    nextEvent?: string;
    memberCount: number;
}

export interface BranchDetails {
    id: string; // CSE, IT, EXTC
    name: string;
    description: string;
    hod: string;
    topSkills: string[];
    placementStats: string;
}

// Skill Arena Types
export interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number; // index
    topic: string; // 'DSA', 'Aptitude', 'General'
}

export interface Hackathon {
    id: string;
    title: string;
    organizer: string;
    date: string;
    mode: 'Online' | 'Offline';
    tags: string[];
    description: string;
}

// Exam Mode Types
export interface ExamQuestion {
    id: number;
    question: string;
    type: 'MCQ' | 'Short';
    options?: string[]; // For MCQ
    correctAnswer?: string; // For self-check later
}

// University Style Exam Types
export interface TheoryQuestion {
    id: number;
    question: string;
    marks: 2 | 5 | 10;
    type: 'Definition' | 'Short' | 'Long';
}

export interface ExamSection {
    title: string;
    questions: TheoryQuestion[];
}

export interface UniversityExam {
    title: string;
    sections: ExamSection[];
}

export interface ExamEvaluation {
    questionId: number;
    modelAnswer: string;
    feedback: string;
    score: number;
}

export enum ViewState {
  HOME = 'HOME',
  NEWS = 'NEWS',
  BRANCH_HUB = 'BRANCH_HUB',
  COUNCILS = 'COUNCILS', // Renamed from CLUBS
  PROJECTS = 'PROJECTS',
  PROJECT_DETAIL = 'PROJECT_DETAIL',
  DASHBOARD = 'DASHBOARD',
  UPLOAD = 'UPLOAD',
  NOTEBOOK = 'NOTEBOOK',
  SKILL_ARENA = 'SKILL_ARENA', 
  FOCUS_ZONE = 'FOCUS_ZONE', // New View
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet?: string;
}
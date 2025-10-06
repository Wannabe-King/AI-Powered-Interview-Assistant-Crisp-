export interface UserData {
  name: string;
  email: string;
  mobile: string;
  marks?: string;
}

export interface Question {
  id: number;
  question: string;
  time: number;
  maxMarks: number;
}

export interface QuizData {
  userData: UserData;
  questions: Question[];
}

export interface Answer {
  question: Question;
  answer: string;
  timeSpent: number;
}

export interface InterviewSession {
  id: string;
  user_name: string;
  user_email: string;
  user_mobile: string;
  resume_text: string;
  questions: Question[];
  answers: Record<number, string>;
  time_spent: number;
  completed_at: string;
  created_at: string;
}

export interface InterviewStats {
  totalSessions: number;
  totalUsers: number;
  averageTimeSpent: number;
  recentSessions: InterviewSession[];
}

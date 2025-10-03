export interface UserData {
  name: string;
  email: string;
  mobile: string;
  marks?: string;
}

export interface Question {
  id: number;
  question: string;
  maxMarks: number;
}

export interface QuizData {
  userData: UserData;
  questions: Question[];
}

export interface Answer {
  questionId: number;
  answer: string;
  timeSpent: number;
}

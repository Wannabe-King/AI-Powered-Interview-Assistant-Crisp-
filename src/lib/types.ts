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

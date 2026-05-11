export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  concept: string;
  chapterHint?: string;
};

export type QuizPayload = {
  sessionId: string;
  userName: string;
  bookName: string;
  questions: QuizQuestion[];
};

export type UserAnswer = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  concept: string;
  chapterHint?: string;
};

export type EvaluationResult = {
  score: number;
  percentage: number;
  strengths: string[];
  weakConcepts: string[];
  feedback: string;
  rereadSuggestions: string[];
  chapterSuggestions: string[];
};

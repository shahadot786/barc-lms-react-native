import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  answer: string;
}

interface QuizState {
  currentQuiz: QuizQuestion[];
  currentQuestionIndex: number;
  selectedAnswers: { [key: number]: string };
  score: number;
  isQuizActive: boolean;
  category: string;
}

const initialState: QuizState = {
  currentQuiz: [],
  currentQuestionIndex: 0,
  selectedAnswers: {},
  score: 0,
  isQuizActive: false,
  category: '',
};

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<{ questions: QuizQuestion[]; category: string }>) => {
      state.currentQuiz = action.payload.questions;
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.score = 0;
      state.isQuizActive = true;
      state.category = action.payload.category;
    },
    selectAnswer: (state, action: PayloadAction<{ questionId: number; answer: string }>) => {
      state.selectedAnswers[action.payload.questionId] = action.payload.answer;
    },
    nextQuestion: (state) => {
      if (state.currentQuestionIndex < state.currentQuiz.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    submitQuiz: (state) => {
      let score = 0;
      state.currentQuiz.forEach((question) => {
        if (state.selectedAnswers[question.id] === question.answer) {
          score += 1;
        }
      });
      state.score = score;
      state.isQuizActive = false;
    },
    resetQuiz: (state) => {
      state.currentQuiz = [];
      state.currentQuestionIndex = 0;
      state.selectedAnswers = {};
      state.score = 0;
      state.isQuizActive = false;
      state.category = '';
    },
  },
});

export const { startQuiz, selectAnswer, nextQuestion, previousQuestion, submitQuiz, resetQuiz } = quizSlice.actions;
export default quizSlice.reducer;
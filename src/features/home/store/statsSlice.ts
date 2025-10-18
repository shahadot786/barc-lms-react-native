import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StatsState {
  quizzesCompleted: number;
  coursesEnrolled: number;
  averageScore: number;
  totalStudyTime: number;
}

const initialState: StatsState = {
  quizzesCompleted: 0,
  coursesEnrolled: 0,
  averageScore: 0,
  totalStudyTime: 0,
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    incrementQuizzesCompleted: (state) => {
      state.quizzesCompleted += 1;
    },
    incrementCoursesEnrolled: (state) => {
      state.coursesEnrolled += 1;
    },
    updateAverageScore: (state, action: PayloadAction<number>) => {
      const totalQuizzes = state.quizzesCompleted;
      if (totalQuizzes === 0) {
        state.averageScore = action.payload;
      } else {
        state.averageScore = ((state.averageScore * (totalQuizzes - 1)) + action.payload) / totalQuizzes;
      }
    },
    addStudyTime: (state, action: PayloadAction<number>) => {
      state.totalStudyTime += action.payload;
    },
  },
});

export const { incrementQuizzesCompleted, incrementCoursesEnrolled, updateAverageScore, addStudyTime } = statsSlice.actions;
export default statsSlice.reducer;
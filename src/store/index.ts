import { configureStore } from '@reduxjs/toolkit';
import quizReducer from '../features/quiz/store/quizSlice';
import coursesReducer from '../features/courses/store/coursesSlice';
import statsReducer from '../features/home/store/statsSlice';

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
    courses: coursesReducer,
    stats: statsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  level: string;
  content: string;
  category: string;
}

interface CoursesState {
  courses: Course[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
}

const initialState: CoursesState = {
  courses: [],
  loading: false,
  error: null,
  isOffline: false,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
      state.loading = false;
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setOfflineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOffline = action.payload;
    },
  },
});

export const { setLoading, setCourses, setError, setOfflineStatus } = coursesSlice.actions;
export default coursesSlice.reducer;
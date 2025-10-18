import AsyncStorage from "@react-native-async-storage/async-storage";
import { Course } from "../store/coursesSlice";

const COURSES_CACHE_KEY = "@lms_courses_cache";
const COURSE_DETAILS_PREFIX = "@lms_course_details_";

export const coursesService = {
  async cacheCourses(courses: Course[]): Promise<void> {
    try {
      await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(courses));
    } catch (error) {}
  },

  async getCachedCourses(): Promise<Course[] | null> {
    try {
      const cachedData = await AsyncStorage.getItem(COURSES_CACHE_KEY);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      return null;
    }
  },

  async cacheCourseDetails(courseId: string, course: Course): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${COURSE_DETAILS_PREFIX}${courseId}`,
        JSON.stringify(course)
      );
    } catch (error) {}
  },

  async getCachedCourseDetails(courseId: string): Promise<Course | null> {
    try {
      const cachedData = await AsyncStorage.getItem(
        `${COURSE_DETAILS_PREFIX}${courseId}`
      );
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      return null;
    }
  },

  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith("@lms_"));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {}
  },
};

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store';
import { setCourses, setLoading, setOfflineStatus } from '../../src/features/courses/store/coursesSlice';
import { CourseCard } from '../../src/features/courses/components/CourseCard';
import { coursesService } from '../../src/features/courses/services/coursesService';
import { coursesData } from '../../src/features/courses/data/coursesData';
import { colors } from '../../src/shared/theme/colors';
import { router } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

export default function CoursesScreen() {
  const dispatch = useDispatch();
  const { courses, loading, isOffline } = useSelector((state: RootState) => state.courses);
  const [refreshing, setRefreshing] = useState(false);

  const loadCourses = async (forceRefresh = false) => {
    try {
      dispatch(setLoading(true));

      // Check network status
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected ?? false;
      dispatch(setOfflineStatus(!isConnected));

      if (isConnected || forceRefresh) {
        // Simulate API call - in real app, this would be an API request
        await new Promise((resolve) => setTimeout(resolve, 500));
        dispatch(setCourses(coursesData));
        
        // Cache the courses
        await coursesService.cacheCourses(coursesData);
        
        // Cache individual course details
        for (const course of coursesData) {
          await coursesService.cacheCourseDetails(course.id, course);
        }
      } else {
        // Load from cache when offline
        const cachedCourses = await coursesService.getCachedCourses();
        if (cachedCourses) {
          dispatch(setCourses(cachedCourses));
        } else {
          dispatch(setCourses(coursesData));
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Try loading from cache on error
      const cachedCourses = await coursesService.getCachedCourses();
      if (cachedCourses) {
        dispatch(setCourses(cachedCourses));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses(true);
    setRefreshing(false);
  };

  useEffect(() => {
    loadCourses();

    // Subscribe to network status changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      dispatch(setOfflineStatus(!state.isConnected));
    });

    return () => unsubscribe();
  }, []);

  if (loading && courses.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline" size={20} color="#fff" />
            <Text style={styles.offlineText}>Offline Mode - Showing cached content</Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Available Courses</Text>
          <Text style={styles.headerSubtitle}>
            {courses.length} courses available • Pull to refresh
          </Text>
        </View>

        <View style={styles.coursesContainer}>
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => router.push(`/courses/${course.id}`)}
            />
          ))}
        </View>

        {courses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyText}>No courses available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 8,
  },
  offlineText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  coursesContainer: {
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 12,
  },
});
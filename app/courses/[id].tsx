/* eslint-disable react-hooks/exhaustive-deps */
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { coursesData } from "../../src/features/courses/data/coursesData";
import { coursesService } from "../../src/features/courses/services/coursesService";
import { Course } from "../../src/features/courses/store/coursesSlice";
import { colors } from "../../src/shared/theme/colors";

export default function CourseDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const insets = useSafeAreaInsets(); // ✅ Safe area for status bar

  useEffect(() => {
    loadCourseDetails();
    checkNetworkStatus();
  }, [id]);

  const checkNetworkStatus = async () => {
    const netInfo = await NetInfo.fetch();
    setIsOffline(!netInfo.isConnected);
  };

  const loadCourseDetails = async () => {
    try {
      setLoading(true);
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected ?? false;

      if (isConnected) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        const foundCourse = coursesData.find((c) => c.id === id);
        if (foundCourse) {
          setCourse(foundCourse);
          await coursesService.cacheCourseDetails(id as string, foundCourse);
        }
      } else {
        const cachedCourse = await coursesService.getCachedCourseDetails(
          id as string
        );
        if (cachedCourse) {
          setCourse(cachedCourse);
        } else {
          const foundCourse = coursesData.find((c) => c.id === id);
          if (foundCourse) setCourse(foundCourse);
        }
      }
    } catch (error) {
      const foundCourse = coursesData.find((c) => c.id === id);
      if (foundCourse) setCourse(foundCourse);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={styles.errorText}>Course not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={[styles.customHeader, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {isOffline && (
          <View style={styles.offlineBanner}>
            <Ionicons name="cloud-offline" size={18} color="#fff" />
            <Text style={styles.offlineText}>Viewing offline content</Text>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.metaContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{course.level}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.metaText}>{course.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="bookmark" size={16} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.primary }]}>
                {course.category}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Course Content</Text>
          <View style={styles.contentCard}>
            <Text style={styles.contentText}>{course.content}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.enrollButton}>
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.enrollButtonText}>Start Learning</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  /** ✅ Custom Header */
  customHeader: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backIcon: { padding: 6 },
  headerTitle: {
    flex: 1,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 8,
  },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 32,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: colors.textSecondary },
  errorText: {
    fontSize: 18,
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.warning,
    padding: 10,
  },
  offlineText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  header: { padding: 20, backgroundColor: colors.card },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
    lineHeight: 32,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  badge: {
    backgroundColor: colors.primary + "20",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    marginRight: 12,
    marginBottom: 8,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: colors.primary },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  metaText: { fontSize: 13, color: colors.textSecondary, marginLeft: 4 },
  descriptionSection: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  contentSection: { padding: 20, paddingTop: 0 },
  contentCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
  buttonContainer: { padding: 20, paddingTop: 8, paddingBottom: 32 },
  enrollButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  enrollButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
});

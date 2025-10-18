import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { StatCard } from "../../src/features/home/components/StatCard";
import { colors } from "../../src/shared/theme/colors";
import { RootState } from "../../src/store";

export default function HomeScreen() {
  const stats = useSelector((state: RootState) => state.stats);
  const courses = useSelector((state: RootState) => state.courses.courses);

  const quickActions = [
    {
      id: 1,
      title: "Take a Quiz",
      icon: "help-circle-outline" as const,
      color: colors.primary,
      action: () => router.push("/quiz"),
    },
    {
      id: 2,
      title: "Browse Courses",
      icon: "book-outline" as const,
      color: colors.secondary,
      action: () => router.push("/courses"),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome to BARC LMS!</Text>
            <Text style={styles.subtitle}>Track your learning progress</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={28} color={colors.primary} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <StatCard
                title="Quizzes Completed"
                value={stats.quizzesCompleted}
                icon="checkmark-circle"
                color={colors.success}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Courses Enrolled"
                value={courses.length}
                icon="book"
                color={colors.primary}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Average Score"
                value={`${Math.round(stats.averageScore)}%`}
                icon="trophy"
                color={colors.warning}
              />
            </View>
            <View style={styles.statItem}>
              <StatCard
                title="Study Time (hrs)"
                value={Math.round(stats.totalStudyTime / 60)}
                icon="time"
                color={colors.secondary}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={action.action}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: action.color + "20" },
                  ]}
                >
                  <Ionicons name={action.icon} size={32} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>About BARC</Text>
          <View style={styles.infoCard}>
            <Ionicons
              name="information-circle"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              British American Resource Center - Your trusted partner in English
              learning and IELTS preparation.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    // marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
  },
  statItem: {
    width: "50%",
    padding: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
  },
  actionCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 20,
    margin: 8,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
});

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../src/shared/theme/colors';
import { quizCategories, quizQuestions } from '../../src/features/quiz/data/quizData';
import { startQuiz } from '../../src/features/quiz/store/quizSlice';

export default function QuizCategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const dispatch = useDispatch();

  const categoryData = quizCategories.find((c) => c.id === category);
  const questions = quizQuestions[category as keyof typeof quizQuestions] || [];

  if (!categoryData) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={styles.errorText}>Category not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleStartQuiz = () => {
    dispatch(startQuiz({ questions, category: categoryData.title }));
    router.push('/quiz/test');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: categoryData.title,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: '#fff',
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { backgroundColor: categoryData.color + '20' }]}>
          <View style={[styles.iconCircle, { backgroundColor: categoryData.color }]}>
            <Ionicons name={categoryData.icon as any} size={48} color="#fff" />
          </View>
          <Text style={styles.categoryTitle}>{categoryData.title}</Text>
          <Text style={styles.categoryDescription}>{categoryData.description}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Quiz Information</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="help-circle-outline" size={24} color={colors.primary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Questions</Text>
                  <Text style={styles.infoValue}>{questions.length}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={24} color={colors.secondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Duration</Text>
                  <Text style={styles.infoValue}>~{questions.length * 1} min</Text>
                </View>
              </View>
            </View>
            <View style={styles.horizontalDivider} />
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Ionicons name="trophy-outline" size={24} color={colors.warning} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Difficulty</Text>
                  <Text style={styles.infoValue}>Medium</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Ionicons name="school-outline" size={24} color={colors.error} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Pass Mark</Text>
                  <Text style={styles.infoValue}>60%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.instructionsSection}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          <View style={styles.instructionsCard}>
            <Text style={styles.instructionText}>• Read each question carefully</Text>
            <Text style={styles.instructionText}>• Select the best answer from the options</Text>
            <Text style={styles.instructionText}>• You can review your answers before submitting</Text>
            <Text style={styles.instructionText}>• Your score will be shown after submission</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: categoryData.color }]}
            onPress={handleStartQuiz}
            activeOpacity={0.8}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
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
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  categoryDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },
  horizontalDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  instructionsSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  instructionsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
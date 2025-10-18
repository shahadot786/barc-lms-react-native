import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QuizCategoryCard } from '../../src/features/quiz/components/QuizCategoryCard';
import { quizCategories } from '../../src/features/quiz/data/quizData';
import { colors } from '../../src/shared/theme/colors';
import { router } from 'expo-router';

export default function QuizScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose a Quiz Category</Text>
          <Text style={styles.headerSubtitle}>Test your knowledge and track your progress</Text>
        </View>

        <View style={styles.categoriesContainer}>
          {quizCategories.map((category) => (
            <QuizCategoryCard
              key={category.id}
              title={category.title}
              description={category.description}
              icon={category.icon as any}
              color={category.color}
              onPress={() => router.push(`/quiz/${category.id}`)}
            />
          ))}
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
    padding: 16,
    paddingTop: 8,
    paddingBottom: 20,
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
  categoriesContainer: {
    paddingBottom: 16,
  },
});
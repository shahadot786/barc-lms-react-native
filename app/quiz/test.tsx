import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import {
  addStudyTime,
  incrementQuizzesCompleted,
  updateAverageScore,
} from "../../src/features/home/store/statsSlice";
import {
  nextQuestion,
  previousQuestion,
  resetQuiz,
  selectAnswer,
  submitQuiz,
} from "../../src/features/quiz/store/quizSlice";
import { colors } from "../../src/shared/theme/colors";
import { RootState } from "../../src/store";

export default function QuizTestScreen() {
  const dispatch = useDispatch();
  const {
    currentQuiz,
    currentQuestionIndex,
    selectedAnswers,
    score,
    category,
  } = useSelector((state: RootState) => state.quiz);
  const [showResults, setShowResults] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (currentQuiz.length === 0) {
      router.replace("/quiz");
    }
  }, [currentQuiz]);

  if (currentQuiz.length === 0) {
    return null; // Render nothing while redirecting
  }

  const currentQuestion = currentQuiz[currentQuestionIndex];
  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;

  const handleSelectAnswer = (answer: string) => {
    dispatch(selectAnswer({ questionId: currentQuestion.id, answer }));
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      Alert.alert(
        "Please select an answer",
        "You must select an answer before proceeding."
      );
      return;
    }
    if (currentQuestionIndex < currentQuiz.length - 1) {
      dispatch(nextQuestion());
    }
  };

  const handlePrevious = () => {
    dispatch(previousQuestion());
  };

  const handleSubmit = () => {
    if (!selectedAnswer) {
      Alert.alert(
        "Please select an answer",
        "You must select an answer for the current question."
      );
      return;
    }

    // Check if all questions are answered
    const unansweredCount =
      currentQuiz.length - Object.keys(selectedAnswers).length;
    if (unansweredCount > 0) {
      Alert.alert(
        "Incomplete Quiz",
        `You have ${unansweredCount} unanswered question(s). Do you want to submit anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Submit", style: "default", onPress: finishQuiz },
        ]
      );
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    dispatch(submitQuiz());
    const timeTaken = Math.round((Date.now() - startTime) / (1000 * 60)); // in minutes
    dispatch(addStudyTime(timeTaken));
    dispatch(incrementQuizzesCompleted());

    // Calculate percentage score
    let calculatedScore = 0;
    currentQuiz.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        calculatedScore += 1;
      }
    });
    const percentage = (calculatedScore / currentQuiz.length) * 100;
    dispatch(updateAverageScore(percentage));

    setShowResults(true);
  };

  const handleFinish = () => {
    dispatch(resetQuiz());
    router.back();
    router.back();
  };

  if (showResults) {
    const percentage = (score / currentQuiz.length) * 100;
    const passed = percentage >= 60;

    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.resultsContainer}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: passed ? colors.success : colors.error },
            ]}
          >
            <Ionicons
              name={passed ? "checkmark-circle" : "close-circle"}
              size={64}
              color={passed ? colors.success : colors.error}
            />
            <Text style={styles.scorePercentage}>
              {Math.round(percentage)}%
            </Text>
          </View>
          <Text style={styles.resultTitle}>
            {passed ? "Congratulations!" : "Keep Practicing!"}
          </Text>
          <Text style={styles.resultSubtitle}>
            You scored {score} out of {currentQuiz.length}
          </Text>

          <View style={styles.resultsCard}>
            <View style={styles.resultRow}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.success}
              />
              <Text style={styles.resultLabel}>Correct Answers</Text>
              <Text style={styles.resultValue}>{score}</Text>
            </View>
            <View style={styles.resultsDivider} />
            <View style={styles.resultRow}>
              <Ionicons name="close-circle" size={20} color={colors.error} />
              <Text style={styles.resultLabel}>Incorrect Answers</Text>
              <Text style={styles.resultValue}>
                {currentQuiz.length - score}
              </Text>
            </View>
            <View style={styles.resultsDivider} />
            <View style={styles.resultRow}>
              <Ionicons name="school" size={20} color={colors.primary} />
              <Text style={styles.resultLabel}>Accuracy</Text>
              <Text style={styles.resultValue}>{Math.round(percentage)}%</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.finishButton} onPress={handleFinish}>
            <Text style={styles.finishButtonText}>Back to Quizzes</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: category,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "#fff",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Exit Quiz",
                  "Are you sure you want to exit? Your progress will be lost.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Exit",
                      style: "destructive",
                      onPress: () => {
                        dispatch(resetQuiz());
                        router.back();
                      },
                    },
                  ]
                );
              }}
              style={{ marginLeft: 8 }}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {currentQuiz.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionCard}>
          <View style={styles.questionNumberBadge}>
            <Text style={styles.questionNumberText}>
              Q{currentQuestionIndex + 1}
            </Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
        </View>

        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => handleSelectAnswer(option)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.optionRadio,
                    isSelected && styles.optionRadioSelected,
                  ]}
                >
                  {isSelected && <View style={styles.optionRadioInner} />}
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.prevButton,
            currentQuestionIndex === 0 && styles.navButtonDisabled,
          ]}
          onPress={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={
              currentQuestionIndex === 0 ? colors.textLight : colors.primary
            }
          />
          <Text
            style={[
              styles.navButtonText,
              currentQuestionIndex === 0 && styles.navButtonTextDisabled,
            ]}
          >
            Previous
          </Text>
        </TouchableOpacity>

        {currentQuestionIndex < currentQuiz.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Submit Quiz</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  progressContainer: {
    padding: 16,
    backgroundColor: colors.card,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.primary,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionNumberBadge: {
    backgroundColor: colors.primary,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 12,
  },
  questionNumberText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  questionText: {
    fontSize: 18,
    color: colors.textPrimary,
    lineHeight: 26,
    fontWeight: "500",
  },
  optionsContainer: {
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionRadioSelected: {
    borderColor: colors.primary,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  optionTextSelected: {
    fontWeight: "600",
    color: colors.primary,
  },
  navigationButtons: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginHorizontal: 6,
  },
  prevButton: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nextButton: {
    backgroundColor: colors.primary,
  },
  submitButton: {
    backgroundColor: colors.success,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
    marginLeft: 4,
  },
  navButtonTextDisabled: {
    color: colors.textLight,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginRight: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginRight: 4,
  },
  resultsContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 4,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: colors.card,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginTop: 8,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  resultsCard: {
    backgroundColor: colors.card,
    width: "100%",
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 12,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  resultsDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  finishButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  finishButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

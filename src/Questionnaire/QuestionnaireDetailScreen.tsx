import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper'; // Import RadioButton from React Native Paper
import { Questionnaire } from '../../src/types/QuestionnaireTypes'; 
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigation';

type QuestionnaireDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'QuestionnaireDetailScreen'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'QuestionnaireDetailScreen'>;
};

const QuestionnaireDetailScreen: React.FC<QuestionnaireDetailScreenProps> = ({ route }) => {
  const { questionnaire } = route.params;

  // State to store selected answers for each question
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId, // Update the selected answer for the question
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{questionnaire.title}</Text>
      <Text style={styles.description}>{questionnaire.description}</Text>

      {questionnaire.sections.map((section) => (
        <View key={section._id} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.questions.map((question) => (
            <View key={question._id} style={styles.question}>
              <Text style={styles.questionContent}>{question.content}</Text>
              <Text style={styles.observation}>{question.observation}</Text>

              <RadioButton.Group
                onValueChange={(newValue) => handleAnswerSelect(question._id, newValue)} // Handle selection
                value={selectedAnswers[question._id] || ''} // Current selected value
              >
                {question.answers.map((answer) => (
                  <View key={answer._id} style={styles.radioItem}>
                    <RadioButton value={answer._id} />
                    <Text style={styles.answerContent}>{answer.content}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  question: {
    marginBottom: 15,
  },
  questionContent: {
    fontSize: 16,
    color: '#333',
  },
  observation: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  answerContent: {
    fontSize: 14,
    color: '#666',
  },
});

export default QuestionnaireDetailScreen;

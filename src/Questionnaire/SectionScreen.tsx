import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import { saveAnswer, loadQuestionnaireFromStorage } from '../stores/QuestionnaireStorage'; // Asegúrate de que has exportado `loadQuestionnaireFromStorage`
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigation';
import { RouteProp } from '@react-navigation/native';

type SectionScreenProps = {
  route: RouteProp<RootStackParamList, 'SectionScreen'>;
  navigation: NativeStackNavigationProp<RootStackParamList, 'SectionScreen'>;
};

const { width } = Dimensions.get('window');

const SectionScreen: React.FC<SectionScreenProps> = ({ route }) => {
  const { section } = route.params;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});

  // Cargar las respuestas seleccionadas del almacenamiento
  useEffect(() => {
    const loadSelectedAnswers = async () => {
      const questionnaire = await loadQuestionnaireFromStorage();
      if (questionnaire) {
        const answers = questionnaire.sections.reduce((acc: any, sec: any) => {
          sec.questions.forEach((q: any) => {
            if (q.userAnswer && q.userAnswer.length > 0) {
              acc[q._id] = q.userAnswer[0].content; // Asumiendo que `userAnswer` contiene el contenido
            }
          });
          return acc;
        }, {});
        setSelectedAnswers(answers);
      }
    };

    loadSelectedAnswers();
  }, []);

  const handleAnswerSelect = async (questionId: string, answerId: string) => {
    // Encuentra el contenido de la respuesta seleccionada
    const selectedAnswerContent = section.questions[currentQuestionIndex].answers.find(
      (answer: any) => answer._id === answerId
    )?.content;

    // Actualiza el estado local para reflejar la respuesta seleccionada
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerId, // Guarda el contenido en el estado
    }));

    // Guarda el contenido de la respuesta en AsyncStorage
    if (selectedAnswerContent) {
      await saveAnswer(section._id, questionId, selectedAnswerContent);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const question = section.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{question.content}</Text>
        <Text style={styles.observationText}>{question.observation}</Text>
        <RadioButton.Group
          onValueChange={(newValue) => handleAnswerSelect(question._id, newValue)}
          value={selectedAnswers[question._id] || ''} // Usa el contenido guardado como valor
        >
          {question.answers.map((answer) => (
            <View key={answer._id} style={styles.radioItem}>
              <RadioButton value={answer._id} color="#4CAF50" />
              <Text style={styles.answerContent}>{answer.content}</Text>
            </View>
          ))}
        </RadioButton.Group>
      </View>
      <View style={styles.navButtons}>
        <TouchableOpacity onPress={handlePrevious} disabled={currentQuestionIndex === 0}>
          <AntDesign name="leftcircle" size={40} color={currentQuestionIndex === 0 ? '#CCC' : '#333'} />
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          {currentQuestionIndex + 1} / {section.questions.length}
        </Text>
        <TouchableOpacity onPress={handleNext} disabled={currentQuestionIndex === section.questions.length - 1}>
          <AntDesign name="rightcircle" size={40} color={currentQuestionIndex === section.questions.length - 1 ? '#CCC' : '#333'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  questionContainer: {
    width: width * 0.9,
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  observationText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 20,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  answerContent: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.9,
  },
  pageIndicator: {
    fontSize: 16,
    color: '#333',
  },
});

export default SectionScreen;

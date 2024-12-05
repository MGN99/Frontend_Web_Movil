import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/rootStackNavigation";
import {
  saveQuestionnaireToStorage,
  loadQuestionnaireFromStorage,
  isQuestionnaireComplete,
} from "../stores/QuestionnaireStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

type QuestionnaireDetailScreenProps = {
  route: RouteProp<RootStackParamList, "QuestionnaireDetailScreen">;
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    "QuestionnaireDetailScreen"
  >;
};

const QuestionnaireDetailScreen: React.FC<QuestionnaireDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { questionnaire } = route.params;

  useEffect(() => {
    const updateQuestionnaireStorage = async () => {
      // Eliminar el almacenamiento anterior
      await AsyncStorage.removeItem("questionnaire_storage");
      // Guardar el nuevo cuestionario
      await saveQuestionnaireToStorage(questionnaire);
    };

    updateQuestionnaireStorage();
  }, [questionnaire]); // Se ejecuta cada vez que 'questionnaire' cambia

  const handleSectionPress = async (section: any) => {
    navigation.navigate("SectionScreen", { section });
  };

  const checkCompletion = async () => {
    const complete = await isQuestionnaireComplete();
    if (complete) {
      alert("Cuestionario completado!");
      navigation.navigate("Maquinas");
    } else {
      alert("Hay preguntas sin responder");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{questionnaire.title}</Text>
      <Text style={styles.description}>{questionnaire.description}</Text>

      {questionnaire.sections.map((section) => (
        <TouchableOpacity
          key={section._id}
          style={styles.section}
          onPress={() => handleSectionPress(section)}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.checkButton} onPress={checkCompletion}>
        <Text style={styles.checkButtonText}>Completar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkButton: {
    marginTop: 20,
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuestionnaireDetailScreen;

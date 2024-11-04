import AsyncStorage from '@react-native-async-storage/async-storage';
import { Section } from 'react-native-paper/lib/typescript/components/List/List';

const QUESTIONNAIRE_KEY = 'questionnaire_storage';

// Guardar cuestionario con respuestas iniciales vacías
const saveQuestionnaireToStorage = async (questionnaire: any) => {
    const initialState = {
      ...questionnaire,
      sections: questionnaire.sections.map((section: any) => ({
        ...section,
        questions: section.questions.map((question: any) => {
          // Log para cada pregunta que se está copiando
          console.log("Coping Question:", question);
          return {
            ...question,
            answer: null, // No hay respuesta seleccionada inicialmente
          };
        }),
      })),
    };
  
    console.log("QOriginal:", questionnaire);
    console.log("QCopy:", initialState);
    await AsyncStorage.setItem(QUESTIONNAIRE_KEY, JSON.stringify(initialState));
  };
// Cargar cuestionario del almacenamiento
const loadQuestionnaireFromStorage = async () => {
  const data = await AsyncStorage.getItem(QUESTIONNAIRE_KEY);
  return data ? JSON.parse(data) : null;
};

// Guardar una respuesta para una pregunta específica
// Guardar una respuesta para una pregunta específica
const saveAnswer = async (sectionId: string, questionId: string, answer: string) => {
    const questionnaire = await loadQuestionnaireFromStorage();
    if (!questionnaire) {
        console.log('No questionnaire found in storage.'); // Log if no questionnaire found
        return;
    }
  
    console.log('Saving answer:', { sectionId, questionId, answer }); // Debugging log
  
    // Encuentra la sección y pregunta específicas
    const updatedSections = questionnaire.sections.map((section: any) => {
      if (section._id !== sectionId) return section;
      
      console.log('Updating section:', section); // Debugging log for the section
      
      return {
        ...section,
        questions: section.questions.map((question: any) => {
          if (question._id === questionId) {
            console.log('Updating question:', question); // Log the question before updating
            return { ...question, answer }; // Update answer
          }
          return question;
        }),
      };
    });
  
    const updatedQuestionnaire = { ...questionnaire, sections: updatedSections };
    
    // Log the updated questionnaire
    console.log("Updated Questionnaire:", JSON.stringify(updatedQuestionnaire, null, 2));

    // Guardar el cuestionario actualizado en AsyncStorage
    await AsyncStorage.setItem(QUESTIONNAIRE_KEY, JSON.stringify(updatedQuestionnaire));
};

// Asegúrate de que estás llamando a saveAnswer con los IDs correctos y el valor de respuesta.


// Verificar si todas las preguntas han sido respondidas
const isQuestionnaireComplete = async () => {
    const questionnaire = await loadQuestionnaireFromStorage();
  
    // Verificar si el cuestionario está disponible
    if (!questionnaire) return false;
  
    // Imprimir las preguntas de cada sección
    questionnaire.sections.forEach((section: any) => {
      console.log(section.questions);
    });
  
    // Comprobar si todas las preguntas han sido respondidas
    return questionnaire.sections.every((section: any) =>
      section.questions.every((question: any) => question.answer !== null)
    );
  };
  

export {
  saveQuestionnaireToStorage,
  loadQuestionnaireFromStorage,
  saveAnswer,
  isQuestionnaireComplete,
};

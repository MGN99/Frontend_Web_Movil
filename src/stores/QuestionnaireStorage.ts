import AsyncStorage from '@react-native-async-storage/async-storage';

const QUESTIONNAIRE_KEY = 'questionnaire_storage';

// Guardar cuestionario con respuestas iniciales vacías
const saveQuestionnaireToStorage = async (questionnaire: any) => {
  const initialState = {
    ...questionnaire,
    sections: questionnaire.sections.map((section: any) => ({
      
      ...section,
      questions: section.questions.map((question: any) => ({
        ...question,
        answers: question.answers.map((answer: any) => ({ ...answer })),
        userAnswer: [] // inicializado vacío
      })),
    })),
    isCompleted: false, // inicializa el cuestionario como incompleto
    photos: []
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


const saveAnswer = async (sectionId: string, questionId: string, answerContent: string) => {
  const questionnaire = await loadQuestionnaireFromStorage();

  if (!questionnaire) {
      console.log('No questionnaire found in storage.');
      return;
  }

  console.log('Saving answer:', { sectionId, questionId, answerContent });

  // Encuentra la sección y pregunta específicas
  const updatedSections = questionnaire.sections.map((section: any) => {
      if (section._id !== sectionId) return section;

      console.log('Updating section:', section);

      return {
          ...section,
          questions: section.questions.map((question: any) => {
              if (question._id === questionId) {
                  console.log('Updating question:', question);

                  // Agrega el `answerId` seleccionado al array `userAnswer`
                  const updatedUserAnswer = [...question.userAnswer, { content: answerContent }];
                  return {
                      ...question,
                      userAnswer: updatedUserAnswer,
                  };
              }
              return question;
          }),
      };
  });
  
  const updatedQuestionnaire = { ...questionnaire, sections: updatedSections };

  // Log para verificar el cuestionario actualizado
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

  const updateQuestionnaireWithDetails = async (userId:string, machineId:string, photoIds:string[]) => {
    const questionnaire = await loadQuestionnaireFromStorage();
    if (!questionnaire) {
        console.log('No questionnaire found in storage.');
        return;
    }
      const updatedQuestionnaire ={
        title: questionnaire.title,
        sections: questionnaire.sections.map((section: any) => ({
          title: section.title,
          questions: section.questions.map((question: any) => ({
            type: question.type,
            content: question.content,
            observation: question.observation,
            answers: question.answers.map((answer: any) => ({ content: answer.content })),
            userAnswer: question.userAnswer,
          })),
        })),
        isCompleted: true, // inicializa el cuestionario como incompleto
        photos: photoIds,
        userId,
        machineId,
      };
    /*
    const updatedQuestionnaire = {

        ...questionnaire,
        userId,
        machineId,
        photos: photoIds,
        isCompleted:true,

    };
*/
    console.log("Updated Questionnaire with User ID, Machine ID, and Photos:", JSON.stringify(updatedQuestionnaire, null, 2));

    await AsyncStorage.setItem(QUESTIONNAIRE_KEY, JSON.stringify(updatedQuestionnaire));
};
  

export {
  saveQuestionnaireToStorage,
  loadQuestionnaireFromStorage,
  saveAnswer,
  isQuestionnaireComplete,
  updateQuestionnaireWithDetails,

};

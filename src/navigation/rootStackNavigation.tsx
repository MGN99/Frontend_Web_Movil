import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/Auth/LoginScreen";
import HomeScreen from "../screens/Common/HomeScreen";
import InitialScreen from "../screens/InitialScreen";
import QuestionnaireListScreen from "../Questionnaire/QuestionnaireListScreen";
import Profile from "../screens/Common/Profile";
import QuestionnaireDetailScreen from "../Questionnaire/QuestionnaireDetailScreen";
import { Questionnaire, Section } from "../types/QuestionnaireTypes";
import SectionScreen from "../Questionnaire/SectionScreen";
import MachineListScreen from "../Questionnaire/MachineListScreen";
import HistoryUserScreen from "../Questionnaire/HistoryUserScreen";

export type RootStackParamList = {
  Initial: undefined; // Aquí se especifica que no hay parámetros
  Login: undefined;
  Home: undefined;
  QuestionnaireList: undefined; // Asegúrate de que esté aquí
  Profile: undefined;
  QuestionnaireDetailScreen: { questionnaire: Questionnaire };
  SectionScreen: { section: Section };
  MachineList: undefined;
  HistoryUser: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial">
        <Stack.Screen
          name="Initial"
          component={InitialScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestionnaireList"
          component={QuestionnaireListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="QuestionnaireDetailScreen"
          component={QuestionnaireDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="SectionScreen" component={SectionScreen} />
        <Stack.Screen name="MachineList" component={MachineListScreen} />
        <Stack.Screen name="HistoryUser" component={HistoryUserScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;

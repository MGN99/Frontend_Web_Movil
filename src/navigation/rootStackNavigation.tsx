import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

export type RootStackParamList = {
  Login: Record<string, string> | undefined;
  Home: Record<string, string> | undefined;
};

const AuthStack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigation = () => {
  return (
    <NavigationContainer>
      <AuthStack.Navigator
        id="Auth"
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Home" component={HomeScreen} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

export default RootStackNavigation;

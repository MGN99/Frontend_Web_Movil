import { NavigationContainer } from '@react-navigation/native';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStackNavigation from './navigation/rootStackNavigation';

const theme = createTheme({
  lightColors: {
    primary: '#e7e7e8',
    background: '#fff',
  },
  darkColors: {
    primary: '#000',
    background: '#121212',
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <RootStackNavigation />
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

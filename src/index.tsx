import { createTheme, ThemeProvider } from '@rneui/themed';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootStackNavigation from './navigation/rootStackNavigation';

const theme = createTheme({
  lightColors: {
    primary: 'red',
    background: '#fff',
  },
  darkColors: {
    primary: 'blue',
    background: '#121212',
  },
  components: {
    Button: {
      color: 'primary',
    },
  },
});

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <RootStackNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, useTheme, useThemeMode } from '@rneui/themed';
import { View } from 'react-native';
import { RootStackParamList } from '../navigation/rootStackNavigation';

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login', 'Auth'>) => {
  const { theme } = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <Text>Login Screen</Text>
      <Button
        onPress={() => {
          setMode(mode === 'light' ? 'dark' : 'light');
          navigation.navigate('Home');
        }}
      >
        Button
      </Button>
    </View>
  );
};

export default LoginScreen;

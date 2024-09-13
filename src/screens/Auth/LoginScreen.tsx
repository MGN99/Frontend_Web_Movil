import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, useTheme } from '@rneui/themed';
import { View } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';

const LoginScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { theme } = useTheme();

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
      <Button onPress={() => navigation.navigate('Initial')}>GO INITIAL</Button>
      <Button onPress={() => navigation.navigate('Home')}>GO HOME</Button>
    </View>
  );
};

export default LoginScreen;

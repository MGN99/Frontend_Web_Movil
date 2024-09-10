import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { Text, View } from 'react-native';
import { RootStackParamList } from '../navigation/rootStackNavigation';

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Login', 'Auth'>) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Login')}>Click me!</Button>
    </View>
  );
};

export default HomeScreen;

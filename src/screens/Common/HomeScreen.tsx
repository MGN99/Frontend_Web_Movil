import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button } from '@rneui/themed';
import { Text, View } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Login')}>GO LOGIN</Button>
      <Button onPress={() => navigation.navigate('Initial')}>GO INITIAL</Button>
    </View>
  );
};

export default HomeScreen;

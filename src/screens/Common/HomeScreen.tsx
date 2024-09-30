import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import { View, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';
import useUserStore from '../../stores/useUserStore'; // Asegúrate de ajustar la ruta
import useSessionStore from '../../stores/useSessionStore'; // Asegúrate de ajustar la ruta

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  // Obtener el email del userStore y los tokens del sessionStore
  const { email } = useUserStore();
  const { accessToken, refreshToken } = useSessionStore();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>
      <Text style={styles.subtitle}>Choose an option to continue</Text>

      {/* Mostrar el email, accessToken y refreshToken */}
      <View style={styles.credentialsContainer}>
        <Text style={styles.credentialsTitle}>Tus Credenciales:</Text>
        <Text style={styles.credentialsText}>Email: {email}</Text>
        <Text style={styles.credentialsText}>Access Token: {accessToken}</Text>
        <Text style={styles.credentialsText}>Refresh Token: {refreshToken}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button
          title="Initial"
          onPress={() => navigation.navigate('Initial')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // Fondo suave
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333', // Color suave y elegante
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  credentialsContainer: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  credentialsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  credentialsText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Botones con colores suaves y atractivos
    borderRadius: 30,
    paddingVertical: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default HomeScreen;

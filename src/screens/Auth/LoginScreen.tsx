import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Input, Text, useTheme } from '@rneui/themed';
import { View, StyleSheet, Alert } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';
import axios from 'axios';
import useUserStore from '../../stores/useUserStore'; // Asegúrate de ajustar la ruta
import useSessionStore from '../../stores/useSessionStore'; // Asegúrate de ajustar la ruta

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { email, password, setEmail, setPassword } = useUserStore();
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese email y contraseña');
      return;
    }

    setLoading(true); // Muestra el estado de carga mientras se realiza la petición

    try {
      const response = await axios.post('http://192.168.1.89:3000/auth/signin', {
        email,
        password,
      });

      // Almacenar los tokens en el store
      const { accessToken, refreshToken } = response.data;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      // Configura Axios para incluir el access token en las solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Si el login es exitoso, realiza la navegación
      console.log('Login exitoso:', response.data);
      navigation.navigate("Home");
    } catch (error: any) {
      // Manejo de errores
      const errorMessage = error.response?.data?.message || 'Credenciales incorrectas, vuelva a intentarlo';
      Alert.alert('Error', errorMessage);
      console.error('Error en la petición de login:', error);
    } finally {
      setLoading(false); // Termina el estado de carga
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text h2 style={styles.title}>
        Bienvenido a
      </Text>
      <Text h1 style={styles.appName}>
        SIGKILL Question
      </Text>

      {/* Input para email */}
      <Input
        placeholder="Email"
        leftIcon={{ type: 'font-awesome', name: 'envelope' }}
        value={email}
        onChangeText={(text) => setEmail(text)}
        autoCapitalize="none"
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
      />
      {/* Mostrar el valor de email ingresado */}
      <Text style={styles.textValue}>Email ingresado: {email}</Text>

      {/* Input para contraseña */}
      <Input
        placeholder="Contraseña"
        leftIcon={{ type: 'font-awesome', name: 'lock' }}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        containerStyle={styles.input}
        inputContainerStyle={styles.inputContainer}
      />
      {/* Mostrar el valor de password ingresado */}
      <Text style={styles.textValue}>Contraseña ingresada: {password}</Text>

      {/* Botón de Login */}
      <Button
        title="Iniciar Sesión"
        onPress={handleLogin}
        loading={loading} // Muestra un spinner cuando está cargando
        containerStyle={styles.buttonContainer}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 10,
    color: '#007bff', // Color del texto del título
    textAlign: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007bff', // Color del texto de QuestionApp
    textAlign: 'center',
    textShadowColor: 'rgba(0, 123, 255, 0.5)', // Color de la sombra
    textShadowOffset: { width: 1, height: 1 }, // Desplazamiento de la sombra
    textShadowRadius: 5, // Difuminado de la sombra
    marginBottom: 40,
  },
  input: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 25,
  },
  textValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
});

export default LoginScreen;
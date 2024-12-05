import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View, StyleSheet, Text, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/rootStackNavigation';

import useSessionStore from '../stores/useSessionStore'; // Ajusta la ruta del store
import { checkService, refreshTokenService } from '../services/checkServices'; // Servicio para verificar y refrescar tokens

type Props = NativeStackScreenProps<RootStackParamList, 'Initial'>;

const InitialScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { accessToken, refreshToken, setAccessToken, setRefreshToken } = useSessionStore(); // Obtener tokens del store

  useEffect(() => {
      
    // Animación de desvanecimiento para el texto
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, // 2 segundos para completar la animación
      useNativeDriver: true,
    }).start();

    const validateToken = async () => {
      if (!accessToken) {
          
        // Si no hay accessToken, redirigir al Login
        navigation.replace('Login');
        return;
      }

      const isValid = await checkService(accessToken);
      if(isValid){
          navigation.replace('Home');
          return;
      }

      if (!isValid && refreshToken) {
        // Intentar refrescar el token si accessToken es inválido y hay refreshToken
        try {
          const newTokens = await refreshTokenService(refreshToken);
          if (newTokens) {
            
            setAccessToken(newTokens.accessToken);

            navigation.replace('Home');
            return;
          }
        } catch (error) {
          console.error('Error al refrescar tokens:', error);
        }
      }
      // Si no se puede refrescar, redirigir al Login
      navigation.replace('Login');

    };

    validateToken(); // Ejecutar validación del token al iniciar la pantalla
  }, [fadeAnim, accessToken, refreshToken, setAccessToken, setRefreshToken, navigation]);

  return (
    <View style={styles.container}>
      {/* Texto con animación de desvanecimiento */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        Bienvenido a SIGKILL Cuestionarios
      </Animated.Text>

      {/* Spinner de carga */}
      <ActivityIndicator size="large" color="#007bff" style={styles.spinner} />

      {/* Texto opcional */}
      <Text style={styles.loadingText}>Cargando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4', // Color de fondo neutro
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff', // Color del texto principal
    marginBottom: 20,
  },
  spinner: {
    marginTop: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default InitialScreen;

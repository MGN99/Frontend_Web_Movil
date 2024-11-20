import React, { useState, useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from '@rneui/themed';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { RootStackParamList } from '../../navigation/rootStackNavigation';
import useUserStore from '../../stores/useUserStore';
import useSessionStore from '../../stores/useSessionStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserInfo } from '../../services/UserService'; // Import the service
import QuestionnaireListScreen from '../../Questionnaire/QuestionnaireListScreen';

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<RootStackParamList>) => {
  const { setAccessToken, setRefreshToken } = useSessionStore();
  const { email } = useUserStore();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoadingUser(false);
      }
    };

    if (isSidebarVisible) {
      fetchUserInfo();
    }
  }, [isSidebarVisible]); // Fetch user info when sidebar is toggled

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('sessionStore'); // Borra el almacenamiento de AsyncStorage
      setAccessToken(''); // Limpia el estado de los tokens en el store
      setRefreshToken('');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }], // Resetea el stack de navegación
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const navigateToOption = (option: string) => {
    if (option === 'Opción 1') {
      // Replace with the correct screen name
    } else if (option === 'Opción 2') {
      navigation.navigate('QuestionnaireList'); 
    } else if (option === 'Opción 3') {
      navigation.navigate('Profile');
    }
    else if (option === 'Opción 4') {
      navigation.navigate('HistoryUser');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
        <Icon name="menu" size={30} color="#000" />
      </TouchableOpacity>
      
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Icon name="logout" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to Home</Text>
      <Text style={styles.subtitle}>Choose an option to continue</Text>

      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <Text style={styles.welcomeText}>Bienvenido,</Text>
          <Text style={styles.email}>{loadingUser ? "Loading..." : user?.name  }</Text>
          <Text style={styles.email}>{loadingUser ? "Loading..." : user?.email }</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={() => navigateToOption('Opción 1')}>
              <Text style={styles.optionText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToOption('Opción 2')}>
              <Text style={styles.optionText}>Questionnaire List</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToOption('Opción 3')}>
              <Text style={styles.optionText}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateToOption('Opción 4')}>
              <Text style={styles.optionText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  logoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: '#f0f0f0',
    padding: 20,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  email: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;

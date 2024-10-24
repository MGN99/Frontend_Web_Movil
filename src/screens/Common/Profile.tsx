import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import { getUserInfo } from "../../services/UserService";
import { MaterialIcons } from "@expo/vector-icons"; // Importa los iconos de Material Icons

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUser(userInfo);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>No user info available</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="person" size={80} color="#FFF" />
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.profileCard}>
        <Image
          source={{ uri: "https://via.placeholder.com/150" }} // Aquí podrías usar un avatar real
          style={styles.profileAvatar}
        />
        <Text style={styles.name}>
          {user.name} {user.lastName}
        </Text>
        <View style={styles.profileDetails}>
          <Text style={styles.detailsText}>Email: {user.email}</Text>
          <Text style={styles.detailsText}>Phone: {user.phone || "N/A"}</Text>
          <Text style={styles.detailsText}>
            Address: {user.address || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#F0F4F8", // Fondo suave
    padding: 20,
  },
  header: {
    width: "100%",
    padding: 20,
    backgroundColor: "#4A90E2", // Color de fondo del encabezado
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000", // Sombra para el encabezado
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, // Para Android
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 10,
  },
  profileCard: {
    width: "100%",
    maxWidth: 400, // Ancho máximo del card
    backgroundColor: "#FFF", // Fondo blanco para el card
    borderRadius: 15, // Esquinas redondeadas
    padding: 20, // Espaciado interno
    alignItems: "center", // Centra el contenido
    shadowColor: "#000", // Sombra
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5, // Para Android
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50, // Avatar redondo
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4A90E2", // Borde azul
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  profileDetails: {
    width: "100%",
    alignItems: "flex-start", // Alinea los textos a la izquierda
    marginTop: 10,
  },
  detailsText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    borderBottomWidth: 1, // Línea debajo de cada detalle
    borderBottomColor: "#E0E0E0",
    paddingBottom: 5,
    width: "100%", // Asegura que ocupe el ancho completo
  },
});

export default Profile;
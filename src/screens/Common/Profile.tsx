import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getUserInfo } from "../../services/UserService";
import { MaterialIcons } from "@expo/vector-icons";

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
    return <ActivityIndicator size="large" color="#888888" />;
  }

  if (!user) {
    return <Text>Información no disponible</Text>;
  }

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="person"
        size={100}
        color="#888888"
        style={styles.icon}
      />
      <Text style={styles.name}>
        {user.name} {user.lastName}
      </Text>
      <View style={styles.emailContainer}>
        <MaterialIcons name="email" size={24} color="#4CAF50" />
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  icon: {
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  email: {
    fontSize: 18,
    color: "#555",
    marginLeft: 8,
  },
  divider: {
    height: 2,
    backgroundColor: "#4CAF50",
    width: "60%",
    marginTop: 10,
  },
});

export default Profile;

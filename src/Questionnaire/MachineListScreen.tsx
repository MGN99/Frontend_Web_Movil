import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { getUserInfo } from "../services/UserService"; // Ajusta la ruta si es necesario
import useSessionStore from "../stores/useSessionStore"; // Ajusta la ruta si es necesario
import axios from "axios";

const MachineListScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]); // Estado para almacenar las máquinas
  const { accessToken } = useSessionStore((state) => state); // Obtener el token del store

  useEffect(() => {
    const fetchUserAreaId = async () => {
      try {
        const userInfo = await getUserInfo(); // Obtén la información del usuario
        if (userInfo && userInfo.areaId) {
          setAreaId(userInfo.areaId); // Almacena el areaId en el estado
          console.log("Fetched Area ID:", userInfo.areaId); // Imprime el areaId en consola
          console.log(accessToken);
          await fetchMachinesByAreaId(); // Llama a la función para obtener máquinas
        } else {
          console.error("No areaId found in user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false); // Cambia el estado de loading al final
      }
    };

    fetchUserAreaId();
  }, []);

  const fetchMachinesByAreaId = async () => {
    try {
      const response = await axios.get(
        "http://192.168.208.1:3001/machine/machines/area",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setMachines(response.data);
      console.log("Fetched Machines:", response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Machine List</Text>
      {areaId ? (
        <Text style={styles.areaIdText}>Area ID: {areaId}</Text>
      ) : (
        <Text>No Area ID available</Text>
      )}
      {machines.length > 0 ? (
        machines.map((machine) => (
          <Text key={machine.patente} style={styles.machineText}>
            {machine.name} - {machine.modelo} - {machine.patente}
          </Text>
        ))
      ) : (
        <Text>No machines available for this area.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  areaIdText: {
    fontSize: 18,
    marginTop: 10,
  },
  machineText: {
    fontSize: 16,
    marginTop: 5,
  },
});

export default MachineListScreen;
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getUserInfo } from "../services/UserService"; // Ajusta la ruta si es necesario
import useSessionStore from "../stores/useSessionStore"; // Ajusta la ruta si es necesario
import axios from "axios";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/rootStackNavigation"; // Ajusta la ruta según tu estructura de carpetas

const MachineListScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const { accessToken } = useSessionStore((state) => state);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserAreaId = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo.areaId) {
          setAreaId(userInfo.areaId);
          console.log("Fetched Area ID:", userInfo.areaId);
          await fetchMachinesByAreaId();
        } else {
          console.error("No areaId found in user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAreaId();
  }, []);

  const fetchMachinesByAreaId = async () => {
    try {
      const response = await axios.get(
        "http://192.168.1.142:3001/machine/machines/area",
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

  const handleSelectMachine = (machinePatente: string) => {
    setSelectedMachines((prevSelected) =>
      prevSelected.includes(machinePatente)
        ? prevSelected.filter((patente) => patente !== machinePatente)
        : [...prevSelected, machinePatente]
    );
  };

  const handleCompleteQuestionnaire = () => {
    if (selectedMachines.length > 0) {
      navigation.navigate("QuestionnaireList");
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
        <FlatList
          data={machines}
          keyExtractor={(machine) => machine.patente}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectMachine(item.patente)}
              style={[
                styles.machineItem,
                selectedMachines.includes(item.patente) &&
                  styles.selectedMachineItem,
              ]}
            >
              <Text
                style={[
                  styles.machineText,
                  selectedMachines.includes(item.patente) &&
                    styles.selectedMachineText,
                ]}
              >
                <Text style={styles.attributeLabel}>Name: </Text>
                {item.name}
              </Text>
              <Text
                style={[
                  styles.machineText,
                  selectedMachines.includes(item.patente) &&
                    styles.selectedMachineText,
                ]}
              >
                <Text style={styles.attributeLabel}>Model: </Text>
                {item.modelo}
              </Text>
              <Text
                style={[
                  styles.machineText,
                  selectedMachines.includes(item.patente) &&
                    styles.selectedMachineText,
                ]}
              >
                <Text style={styles.attributeLabel}>Patente: </Text>
                {item.patente}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text>No machines available for this area.</Text>
      )}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: selectedMachines.length > 0 ? "#388e3c" : "#ccc" },
        ]}
        onPress={handleCompleteQuestionnaire}
        disabled={selectedMachines.length === 0} // Deshabilitar si no hay máquinas seleccionadas
      >
        <Text style={styles.buttonText}>Completar Cuestionario</Text>
      </TouchableOpacity>
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
  machineItem: {
    padding: 10,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  selectedMachineItem: {
    backgroundColor: "#c8e6c9", // Color de fondo verde para máquinas seleccionadas
  },
  machineText: {
    fontSize: 16,
  },
  selectedMachineText: {
    fontWeight: "bold",
    color: "#388e3c", // Color verde para el texto de las máquinas seleccionadas
  },
  attributeLabel: {
    fontWeight: "bold", // Hacer que las etiquetas sean más prominentes
  },
  button: {
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default MachineListScreen;

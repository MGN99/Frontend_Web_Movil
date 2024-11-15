import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { getUserInfo } from "../services/UserService";
import useSessionStore from "../stores/useSessionStore";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { RootStackParamList } from "../navigation/rootStackNavigation";
import {
  MACHINES_AREA_ENDPOINT,
  MS_QUESTIONNAIRE_URL,
  URL_MSIAM,
} from "../types/constants";
import {
  loadQuestionnaireFromStorage,
  updateQuestionnaireWithDetails,
} from "../stores/QuestionnaireStorage";

const MachineListScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [areaId, setAreaId] = useState<string | null>(null);
  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [images, setImages] = useState<any[]>([]);
  const [uploadedImageIds, setUploadedImageIds] = useState<string[]>([]);
  const { accessToken } = useSessionStore((state) => state);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchUserAreaId = async () => {
      try {
        const userInfo = await getUserInfo();
        if (userInfo && userInfo.areaId) {
          setAreaId(userInfo.areaId);
          await fetchMachinesByAreaId();
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
      const response = await axios.get(URL_MSIAM + MACHINES_AREA_ENDPOINT, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setMachines(response.data);
    } catch (error) {
      console.error("Error fetching machines:", error);
    }
  };

  const handleSelectMachine = (machinePatente: string) => {
    setSelectedMachine((prevSelected) =>
      prevSelected === machinePatente ? null : machinePatente
    );
  };

  const createQuestionnaire = async () => {
    try {
      const questionnaire = await loadQuestionnaireFromStorage();
      if (!questionnaire) {
        console.error("No questionnaire data found in storage.");
        return;
      }
      console.log("Cuestionario completo:", JSON.stringify(questionnaire, null, 2));

      // Post request to create a new questionnaire
      const response = await axios.post(
        `${MS_QUESTIONNAIRE_URL}/questionnaire`,
        questionnaire,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Cuestionario Creado", "El cuestionario ha sido enviado correctamente.");
        navigation.navigate("QuestionnaireList");
      }
    } catch (error) {
      console.error("Error creating questionnaire:", error);
      Alert.alert("Error", "Ocurrió un problema al crear el cuestionario.");
    }
  };

  const handleCompleteQuestionnaire = async () => {
    if (selectedMachine && images.length > 0) {
      try {
        const imageIds: string[] = [];

        await Promise.all(
          images.map(async (image) => {
            const createPhotoUploadDto = {
              base64Photo: image.base64,
              filenameOriginal: image.fileName + ".png",
              mimeType: image.mimeType,
            };

            const response = await axios.post(
              `${MS_QUESTIONNAIRE_URL}/photo-upload`,
              createPhotoUploadDto,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log(response.status);
            if (response.status === 201) {
              const imageId = response.data._id;

              
              imageIds.push(imageId);

            }
          })
        );
        console.log("iamgesids",imageIds);
        setUploadedImageIds(imageIds);

        const userInfo = await getUserInfo();
        const userId = userInfo ? userInfo._id : null;

        if (!userId) {
          console.error("User ID not available.");
          return;
        }

        await updateQuestionnaireWithDetails(userId, selectedMachine, imageIds);
        
        // Now that the questionnaire is complete, create it on the server
        await createQuestionnaire();
        
      } catch (error) {
        console.error("Error completing questionnaire:", error);
        Alert.alert("Error", "Ocurrió un problema al completar el cuestionario.");
      }
    } else {
      Alert.alert("Error", "Por favor, selecciona una máquina y añade imágenes.");
    }
  };

  const handleImagePick = async () => {
    Alert.alert("Seleccionar Imagen", "Elige una opción:", [
      {
        text: "Cámara",
        onPress: openCamera,
      },
      {
        text: "Galería",
        onPress: openGallery,
      },
      {
        text: "Cancelar",
        style: "cancel",
      },
    ]);
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso para acceder a la cámara es necesario!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages((prevImages) => [...prevImages, result.assets[0]]);
      Alert.alert("Imagen tomada", "La imagen ha sido seleccionada.");
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso para acceder a los archivos es necesario!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      quality: 1,
      selectionLimit: 0,
    });

    if (!result.canceled) {
      const imagesWithBase64 = await Promise.all(
        result.assets.map(async (asset) => {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return {
            ...asset,
            base64,
          };
        })
      );

      setImages((prevImages) => [...prevImages, ...imagesWithBase64]);
      Alert.alert(
        "Imágenes seleccionadas",
        `${result.assets.length} imágenes han sido seleccionadas.`
      );
    }
  };

  const removeImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Máquinas</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={machines}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleSelectMachine(item._id)}
              style={[
                styles.machineItem,
                selectedMachine === item._id && styles.selectedMachine,
              ]}
            >
              <Text style={styles.machineText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
        <Text style={styles.imageButtonText}>Seleccionar Imagen(es)</Text>
      </TouchableOpacity>
      {images.length > 0 && (
        <View style={styles.imagePreviewContainer}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image.uri }} style={styles.imagePreview} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <AntDesign name="closecircle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity
        style={styles.completeButton}
        onPress={handleCompleteQuestionnaire}
        disabled={!selectedMachine}
      >
        <Text style={styles.completeButtonText}>Completar Cuestionario</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  machineItem: {
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedMachine: {
    backgroundColor: "#4CAF50",
  },
  machineText: {
    fontSize: 18,
  },
  imageButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  imageButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 8,
    marginBottom: 8,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 4,
  },
  completeButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
  },
  completeButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MachineListScreen;

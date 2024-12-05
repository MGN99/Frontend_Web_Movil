import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import useSessionStore from "../stores/useSessionStore";
import axios from "axios";
import { URL_MSIAM } from "../types/constants";
import { getUserInfo } from "../services/UserService";
import MapView, { Marker } from "react-native-maps";

const MS_QUESTIONNAIRE_URL = "http://192.168.1.88:3002";
const QUESTIONNAIRE_ENDPOINT = "questionnaire";
const PHOTO_UPLOAD_ENDPOINT = "photo-upload";
const USER_QUESTIONNAIRES_ENDPOINT = "user/questionnaires";

interface Questionnaire {
  _id: string;
  title: string;
  isCompleted: boolean;
  userId: string;
  machineId: string;
  photos: string[];
  sections: Section[];
  createdAt: string;
  machineDetails: {
    patente: string;
    name: string;
    modelo: string;
  };
  location:{latitude:string,longitude:string};
}

interface Section {
  _id: string;
  title: string;
  questions: Question[];
}

interface Question {
  _id: string;
  content: string;
  observation: string;
  type: string;
  answers: Answer[];
  userAnswer: Answer[];
}

interface Answer {
  _id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Photo {
  base64Photo: string;
  mimeType: string;
}

const HistoryUserScreen = () => {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [photoCache, setPhotoCache] = useState<Record<string, string>>({});
  const { accessToken } = useSessionStore((state) => state);
  const [userInfo, setUserInfo] = useState<any | null>(null);

  const fetchMachineDetails = async (machineId: string) => {
    try {
      const response = await axios.get(`${URL_MSIAM}/machine/${machineId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const machine = response.data;

      return {
        patente: machine.patente || "Desconocida",
        name: machine.name || "Desconocido",
        modelo: machine.modelo || "Desconocido",
      };
    } catch (error) {
      console.error(
        `Error fetching machine details for ID: ${machineId}`,
        error
      );
      return {
        patente: "Desconocida",
        name: "Desconocido",
        modelo: "Desconocido",
      };
    }
  };

  const fetchUserInfo = async () => {
    try {
      const user = await getUserInfo(); // Obtener la información del usuario
      setUserInfo(user); // Almacenar la información del usuario en el estado
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const response = await axios.get(
        `${MS_QUESTIONNAIRE_URL}/${QUESTIONNAIRE_ENDPOINT}/${USER_QUESTIONNAIRES_ENDPOINT}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = response.data;

      if (!Array.isArray(data)) {
        console.error("La respuesta no es una lista de cuestionarios.");
        return;
      }

      const mappedQuestionnaires = await Promise.all(
        data.map(async (item: any): Promise<Questionnaire> => {
          const machineDetails = await fetchMachineDetails(item.machineId);

          return {
            _id: item._id || "",
            title: item.title || "Sin título",
            isCompleted: item.isCompleted || false,
            userId: item.userId || "Desconocido",
            machineId: `${machineDetails.name} ${machineDetails.modelo} ${machineDetails.patente}`,
            photos: Array.isArray(item.photos) ? item.photos : [],
            sections: Array.isArray(item.sections) ? item.sections : [],
            createdAt: item.createdAt || "",
            machineDetails,
            location:item.location,
          };
        })
      );

      const sortedQuestionnaires = mappedQuestionnaires.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      });

      setQuestionnaires(sortedQuestionnaires);

      const photoIds = sortedQuestionnaires.flatMap((q) => q.photos);
      
      if (photoIds.length > 0) {

        await fetchPhotos(photoIds);
      }
    } catch (error) {
      console.error("Error fetching user history:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (photoIds: string[]) => {
    try {
      const photoPromises = photoIds.map(async (photoId) => {
        const response = await axios.get<Photo>(
          `${MS_QUESTIONNAIRE_URL}/${PHOTO_UPLOAD_ENDPOINT}/${photoId}`
        );

        return {
          id: photoId,
          base64: `data:${response.data.mimeType};base64,${response.data.base64Photo}`,
        };
      });

      const photoResults = await Promise.all(photoPromises);
      const newPhotoCache = photoResults.reduce(
        (acc, { id, base64 }) => ({ ...acc, [id]: base64 }),
        {}
      );
      setPhotoCache(newPhotoCache);
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  

  useEffect(() => {
    fetchUserInfo();
    fetchUserHistory();
  }, []);

  const renderQuestionnaire = ({ item }: { item: Questionnaire }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.status}>
        Estado: {item.isCompleted ? "Completado" : "En progreso"}
      </Text>
      <Text style={styles.detail}>
        Fecha de creación:{" "}
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A"}
      </Text>
      <Text style={styles.detail}>Usuario: {userInfo.name}</Text>
      <Text style={styles.detail}>Máquina: {item.machineId}</Text>
      {item.location && (
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:Number(item.location.latitude) ,
          longitude: Number(item.location.longitude),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{
            latitude:Number(item.location.latitude),
            longitude: Number(item.location.longitude),
          }}
          title="Ubicación"
        />
      </MapView>
    )}
      <View style={styles.photoContainer}>
        {item.photos?.map((photoId) => {
          const base64Image = photoCache[photoId];
          return base64Image ? (
            <Image
              key={photoId}
              source={{ uri: base64Image }}
              style={styles.photo}
            />
          ) : (
            <Text key={photoId} style={styles.loadingPhoto}>
              Cargando foto...
            </Text>
          );
        })}
      </View>
      <View>
        {item.sections?.map((section) => (
          <View key={section._id} style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.questions?.map((question) => (
              <View key={question._id} style={styles.questionContainer}>
                <Text style={styles.questionContent}>{question.content}</Text>
                <Text style={styles.observation}>{question.observation}</Text>
                <Text style={styles.userAnswer}>
                  Respuesta seleccionada:{" "}
                  {question.userAnswer?.length > 0
                    ? question.userAnswer.map((answer) => answer.content) // Muestra las respuestas seleccionadas
                    : "Sin respuesta"}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando historial...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {questionnaires.length > 0 ? (
        <FlatList
          data={questionnaires}
          renderItem={renderQuestionnaire}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text style={styles.emptyMessage}>
          No se encontraron cuestionarios en el historial.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  map: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  status: {
    marginTop: 4,
    fontSize: 14,
    color: "#555",
  },
  detail: {
    marginTop: 2,
    fontSize: 12,
    color: "#777",
  },
  photoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  photo: {
    width: 100,
    height: 100,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  loadingPhoto: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  emptyMessage: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#999",
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  questionContainer: {
    marginTop: 8,
  },
  questionContent: {
    fontSize: 14,
  },
  observation: {
    fontSize: 12,
    color: "#666",
  },
  userAnswer: {
    fontSize: 12,
    color: "green",
    fontWeight: "bold",
  },
});

export default HistoryUserScreen;

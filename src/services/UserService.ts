import axios from "axios";
import useUserStore from "../stores/useUserStore";

const API_URL = "http://10.39.53.30:3000/user"; // Asegúrate de poner la URL correcta de tu backend

export const getUserInfo = async () => {
  const { email } = useUserStore.getState(); // Obtenemos el email almacenado en el store
  try {
    const response = await axios.get(`${API_URL}/email/${email}`);
    return response.data; // Aquí devolverá la información del usuario
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

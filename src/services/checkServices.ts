import { BaseRouter } from "@react-navigation/native";
import axios from "axios";
import { EXPO_PUBLIC_MS_AUTH } from "@env";
import { Alert } from "react-native";

export type CheckResponseT = boolean;

export const checkService = async (
  accessToken?: string
): Promise<CheckResponseT> => {
  try {
    console.debug(accessToken);
    const url = `http://192.168.1.142:3000/auth/check-access-token`;
    console.debug(url);

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    console.log("Payload: ", response.data);

    return true;
  } catch (e) {
    console.debug("entro al error");
    return false;
  }
};

export const refreshTokenService = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      "http://192.168.1.142:3000/auth/renew-access-token",
      { refreshToken }
    );
    return response.data; // Devuelve los nuevos tokens { accessToken, refreshToken }
  } catch (error) {
    Alert.alert("Sesión expirada!");

    return null;
  }
};

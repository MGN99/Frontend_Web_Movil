import { BaseRouter } from "@react-navigation/native";
import axios from "axios";
import { EXPO_PUBLIC_MS_AUTH, IP_ADDRESS } from "@env";
import { Alert } from "react-native";
import { CHECK_ACCES_TOKEN_ENDPOINT, RENEW_ACCESS_TOKEN_ENDPOINT, URL_AUTH } from "../types/constants";

export type CheckResponseT = boolean;
//const URL_AUTH=`http://${IP_ADDRESS}:${PORT_MS_AUTH}`

export const checkService = async (
  accessToken?: string
): Promise<CheckResponseT> => {
  try {
    console.debug(accessToken);
    //const URL = `http://10.39.53.30:3000/auth/check-access-token`;
    
    const response = await axios.get(
      URL_AUTH + CHECK_ACCES_TOKEN_ENDPOINT, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    

    return true;
  } catch (e) {
    console.debug("entro al error");
    return false;
  }
};

 

export const refreshTokenService = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      URL_AUTH + RENEW_ACCESS_TOKEN_ENDPOINT,
      { refreshToken }
    );
    return response.data; // Devuelve los nuevos tokens { accessToken, refreshToken }
  } catch (error) {
    Alert.alert("Sesión expirada!");

    return null;
  }
};

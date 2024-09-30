import { BaseRouter } from "@react-navigation/native";
import axios from "axios";
import { EXPO_PUBLIC_MS_AUTH } from '@env';


export type CheckResponseT = boolean;

export const checkService = async(
    accessToken?:string
):Promise<CheckResponseT> =>{
    try {
        console.debug(accessToken)
        const url = `${EXPO_PUBLIC_MS_AUTH}/check-access-token`;
        console.debug(url);
        await axios.get(
            url,
            {
                headers: {Authorization: `Bearer ${accessToken}` },

            }
        );

        return true;
        }catch (e){
            console.debug("entro al error")
            return false;
        }

};

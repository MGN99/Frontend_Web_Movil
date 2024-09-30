import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";


interface UserStateT {
    accessToken?: string;
    refreshToken?: string;
    setAccessToken:(email: string) => void;
    setRefreshToken:(password: string) => void;
}

const useSessionStore = create<UserStateT>()(
    devtools(
        persist(
            (set, get)=>({
                accessToken:undefined,
                refreshToken:undefined,
                setAccessToken:(accessToken:string) => set(()=> ({accessToken})),
                setRefreshToken :(refreshToken:string) => set(()=> ({refreshToken})),

            }),
            {
                name: "userStore",
                storage: createJSONStorage(()=> AsyncStorage),
            }
        )
    )
);

export default useSessionStore;
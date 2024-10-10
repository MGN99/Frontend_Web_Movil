import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";

interface UserStateT {
  accessToken?: string;
  refreshToken?: string;
  setAccessToken: (accessToken: string) => void;
  setRefreshToken: (refreshToken: string) => void;
}

const useSessionStore = create<UserStateT>()(
  devtools(
    persist(
      (set) => ({
        accessToken: undefined,
        refreshToken: undefined,
        setAccessToken: (accessToken: string) => set(() => ({ accessToken })),
        setRefreshToken: (refreshToken: string) => set(() => ({ refreshToken })),
      }),
      {
        name: "sessionStore", // Cambiado a sessionStore
        storage: createJSONStorage(() => AsyncStorage),
      }
    )
  )
);

export default useSessionStore;

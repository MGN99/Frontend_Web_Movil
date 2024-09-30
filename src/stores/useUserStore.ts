import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";

interface UserStateT{
    email?: string;
    password?: string;
    setEmail: (email:string) => void;
    setPassword: (password:string) => void;
}

const useUserStore = create<UserStateT>()(
    devtools(
        persist(
            (set, get)=>({
                email:undefined,
                password:undefined,
                setEmail :(email:string) => set(()=> ({email})),
                setPassword :(password:string) => set(()=> ({password})),

            }),
            {
                name: "userStore",
                storage: createJSONStorage(()=> AsyncStorage),
            }
        )
    )
);

export default useUserStore;
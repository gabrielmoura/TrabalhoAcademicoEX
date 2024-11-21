import {create} from "zustand";
import {createJSONStorage, devtools, persist} from "zustand/middleware";

import {ConfigStore, createConfigSlice} from "@app/store/slice/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const useSessionStore = create<ConfigStore>()(
    devtools(
        persist(
            (...a) => ({
                ...createConfigSlice(...a),
            }),
            {
                name: "session-storage",
                storage: createJSONStorage(() => AsyncStorage),
            },
        ),
        {
            name: "sessionStore",
            trace: true,
            enabled: process.env.NODE_ENV !== "production",
        },
    ),
);

export default useSessionStore;
import {StateCreator} from "zustand";

interface TaxUnit {
    base: number;
    kmPrice: number;
    waitingTime: number;
}

export interface TaxToCalc {
    Am: TaxUnit;
    Pm: TaxUnit;
    Location?: object
}

interface ConfigState {
    model?: string;
    year?: number;
    color?: string;
    Tax?: TaxToCalc;
    ApiKey?: string;
    language?: string;
}

interface ConfigActions {
    setModel: (model: string) => void;
    setYear: (year: number) => void;
    setColor: (color: string) => void;

    setBaseAm: (base: number) => void;
    setBasePm: (base: number) => void;

    setKmPriceAm: (base: number) => void;
    setKmPricePm: (base: number) => void;

    setApiKey: (apiKey: string) => void;

    resetToDefault: () => void;
    setLanguage: (language: string) => void;
}


const defaultConfig: ConfigState = {
    Tax: {
        Am: {
            base: 6.0,
            kmPrice: 2.65,
            waitingTime: 33.39,
        },
        Pm: {
            base: 6.0,
            kmPrice: 3.18,
            waitingTime: 33.39,
        }
    },
    ApiKey: "352d85cecc514447aab8a2941b473f52",
    language: "pt",
}

export type ConfigStore = ConfigState & ConfigActions;
export const createConfigSlice: StateCreator<
    ConfigState & ConfigActions,
    [["zustand/devtools", never]],
    []
> = (set, get) => ({
    ...defaultConfig,
    setModel: (model) => set({model}, false, "setModel"),
    setYear: (year) => set({year}, false, "setYear"),
    setColor: (color) => set({color}, false, "setColor"),

    setBaseAm: (base) => set({Tax: {Am: {base: base}}}, false, "setBaseAm"),
    setBasePm: (base) => set({Tax: {Pm: {base: base}}}, false, "setBasePm"),

    setKmPriceAm: (kmPrice) => set({Tax: {Am: {kmPrice: kmPrice}}}, false, "setKmPriceAm"),
    setKmPricePm: (kmPrice) => set({Tax: {Pm: {kmPrice: kmPrice}}}, false, "setKmPricePm"),
    setApiKey: (apiKey) => set({ApiKey: apiKey}, false, "setApiKey"),
    resetToDefault: () => set(defaultConfig, false, "resetToDefault"),
    setLanguage: (language) => set({language}, false, "setLanguage"),
});
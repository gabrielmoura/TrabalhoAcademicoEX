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
}

export type ConfigStore = ConfigState & ConfigActions;
export const createConfigSlice: StateCreator<
    ConfigState & ConfigActions,
    [["zustand/devtools", never]],
    []
> = (set, get) => ({
    ...defaultConfig,
    setModel: (model) => set({model}),
    setYear: (year) => set({year}),
    setColor: (color) => set({color}),

    setBaseAm: (base) => set({Tax: {Am: {base: base}}}),
    setBasePm: (base) => set({Tax: {Pm: {base: base}}}),

    setKmPriceAm: (kmPrice) => set({Tax: {Am: {kmPrice: kmPrice}}}),
    setKmPricePm: (kmPrice) => set({Tax: {Pm: {kmPrice: kmPrice}}}),
    setApiKey: (apiKey) => set({ApiKey: apiKey}),
    resetToDefault: () => set(defaultConfig),
});
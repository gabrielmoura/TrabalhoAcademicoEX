import {StateCreator} from "zustand";
import {GeoLocation} from "@app/services/geolocation";

interface Flow {
    normalFlow: boolean;
    searchText?: string;
    modalVisible: boolean;
}

interface CalcPriceState {
    origin?: GeoLocation;
    destination?: GeoLocation;
    distance: number;
    estimatedTime: string;
    flow: Flow;
}

interface CalcPriceActions {
    setDistance: (distance: number) => void;
    setEstimatedTime: (time: string) => void;
    setOrigin: (origin: GeoLocation) => void;
    setDestination: (destination: GeoLocation) => void;
    setNormalFlow: (normalFlow: boolean) => void;
    setSearchText: (searchText: string) => void;
    setModalVisible: (modalVisible: boolean) => void;
    reset: () => void;
    closeWithoutSelection: () => void;
}

export type CalcPriceStore = CalcPriceState & CalcPriceActions;
const defaultValues: CalcPriceState = {
    distance: 0,
    estimatedTime: "",
    flow: {
        normalFlow: true,
        modalVisible: true,
    },
}

export const createCalcPriceSlice: StateCreator<
    CalcPriceStore,
    [["zustand/devtools", never]],
    []
> = (set, get) => ({
    ...defaultValues,
    setDistance: (distance) => set({distance},false,"setDistance"),
    setEstimatedTime: (estimatedTime) => set({estimatedTime},false,"setEstimatedTime"),
    setOrigin: (origin) => set({origin},false,"setOrigin"),
    setDestination: (destination) => set({destination},false,"setDestination"),
    setNormalFlow: (normalFlow) =>
        set((state) => ({flow: {...state.flow, normalFlow}}),false,"setNormalFlow"),
    setSearchText: (searchText) =>
        set((state) => ({flow: {...state.flow, searchText}}),false,"setSearchText"),
    setModalVisible: (modalVisible) =>
        set((state) => ({flow: {...state.flow, modalVisible}}),false,"setModalVisible"),
    reset: () => set(defaultValues,false,"reset"),
    closeWithoutSelection: () => {
        set({flow: {...get().flow, normalFlow: false, modalVisible: false}},false,"closeWithoutSelection");
    },
});

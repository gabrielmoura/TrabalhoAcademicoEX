import {create} from "zustand/index";
import {devtools} from "zustand/middleware";
import {CalcPriceStore, createCalcPriceSlice} from "@app/store/slice/calcPrice";

const useCalcPriceStore = create<CalcPriceStore>()(
    devtools(
        (...a) => ({
            ...createCalcPriceSlice(...a),
        }),
        {
            name: "calcPriceStore",
            trace: true,
            enabled: process.env.NODE_ENV !== "production",
        },
    ),
);
export default useCalcPriceStore;
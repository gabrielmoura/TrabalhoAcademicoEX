import taxiA from "@assets/taxi.json";
import LottieComponent from "@components/LottieComponent/LottieComponent";

import { Platform } from "react-native";

export function LogoIcon() {
  return (
    <LottieComponent
      autoPlay={true}
      loop={true}
      style={{
        width: Platform.OS === "web" ? "45.3rem" : 300,
        height: Platform.OS === "web" ? "15rem" : 150,
        backgroundColor: "#eee",
      }}
      source={taxiA}
    />
  );
}

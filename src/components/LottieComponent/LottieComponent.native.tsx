import LottieView from "lottie-react-native";
import { LottieComponentProps } from "./LottieComponentProps";
export default function LottieComponent(props: LottieComponentProps) {
  return <LottieView {...props} />;
}

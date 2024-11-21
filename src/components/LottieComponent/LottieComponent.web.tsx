import LottieView from "lottie-react";
import { LottieComponentProps } from "./LottieComponentProps";

export default function LottieComponent(props: LottieComponentProps) {
  return <LottieView {...props} animationData={props.source} />;
}

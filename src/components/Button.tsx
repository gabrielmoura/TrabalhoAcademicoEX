import {css} from "@emotion/native";
import {Text, TouchableOpacity} from "react-native";
import {ReactNode} from "react";

export interface ButtonProps {
    title?: string;
    onPress?: () => void;
    size?: "small" | "medium" | "large";
    children?: ReactNode;
    disabled?: boolean;
}

export function Button(props: ButtonProps) {

    const style = css`
        background-color: ${props.disabled ? "#e6b800" : "#ffcc00"}; /* Tom mais suave para desabilitado */
        color: black;
        padding: ${props.size === "small" ? "5px" : props.size === "large" ? "20px" : "10px"};
        border-radius: ${props.size === "small" ? "3px" : props.size === "large" ? "10px" : "5px"};
        opacity: ${props.disabled ? 0.7 : 1};

        text-shadow: 1px 1px 1px #000;
        box-shadow: 2px 2px 2px #000;
    `

    return (
        <TouchableOpacity style={style} onPress={props.onPress}>
            {props.title ? <Text>{props.title}</Text> : props.children}
        </TouchableOpacity>
    );
}
export function ButtonDanger(props: ButtonProps) {

    const style = css`
        background-color: #ff0000;
        color: white;
        padding: ${props.size === "small" ? "5px" : props.size === "large" ? "20px" : "10px"};
        border-radius: ${props.size === "small" ? "3px" : props.size === "large" ? "10px" : "5px"};
        opacity: ${props.disabled ? 0.7 : 1};

        text-shadow: 1px 1px 1px #000;
        box-shadow: 2px 2px 2px #000;
    `

    return (
        <TouchableOpacity style={style} onPress={props.onPress}>
            {props.title ? <Text>{props.title}</Text> : props.children}
        </TouchableOpacity>
    );
}
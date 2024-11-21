import {css} from "@emotion/native";
import {ActivityIndicator, Text, TouchableOpacity} from "react-native";
import {ReactNode} from "react";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export interface ButtonProps {
    title?: string;
    onPress?: () => void;
    size?: "small" | "medium" | "large";
    children?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    onLongPress?: () => void;
}

export function Button(props: ButtonProps) {

    const style = css`
        background-color: ${props.disabled ? "rgba(255,204,0,0.51)" : "#ffcc00"}; /* Tom mais suave para desabilitado */
        color: black;
        padding: ${props.size === "small" ? "5px" : props.size === "large" ? "20px" : "10px"};
        border-radius: ${props.size === "small" ? "3px" : props.size === "large" ? "10px" : "5px"};
        opacity: ${props.disabled ? 0.7 : 1};

        text-shadow: 1px 1px 1px #000;
        box-shadow: 2px 2px 2px #000;
    `

    return (
        <TouchableOpacity style={style} onPress={props.onPress} disabled={props.disabled || props.loading}
                          onLongPress={props.onLongPress}>
            {props.title ? <Text>{props.disabled ?
                <FontAwesome name={'close'} size={20} color="red"/> : props.loading &&
                <ActivityIndicator color={'black'}/>} {props.title}</Text> : props.children}
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
        <TouchableOpacity style={style} onPress={props.onPress} disabled={props.disabled || props.loading}
                          onLongPress={props.onLongPress}>
            {props.title ? <Text>{props.title}</Text> : props.children}
        </TouchableOpacity>
    );
}
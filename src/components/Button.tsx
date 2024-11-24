import styled from "@emotion/native";
import {ActivityIndicator} from "react-native";
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
    textAlign?: "center" | "left" | "right";
    variant?: "primary" | "secondary" | "warning";
}

interface TextButtonProps extends Pick<ButtonProps, "size" | "disabled" | "loading" | "textAlign" | "variant"> {
}


const StyledButton = styled.TouchableOpacity<{
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    variant?: "primary" | "secondary" | "warning";
}>`
    // background-color: será o valor de props.theme.color.primary ou props.theme.color.secondary, caso disabled seja true (o padrão é false), aplicar opacidade 0.7

    background-color: ${(props) =>
            props.variant === "warning"
                    ? props.theme.color.warning
                    : props.variant === "secondary"
                            ? props.theme.color.secondary
                            : props.theme.color.primary};
    padding: ${(props) =>
            props.size === "small" ? "5px" : props.size === "large" ? "20px" : "10px"};
    border-radius: ${(props) =>
            props.size === "small" ? "3px" : props.size === "large" ? "10px" : "5px"};
    opacity: ${(props) => (props.disabled ? 0.7 : 1)};
    text-shadow: 1px 1px 1px #000;
    box-shadow: 2px 2px 2px #000;
    //align-items: center;
    justify-content: center;
`;

const StyledText = styled.Text<TextButtonProps>`
    color: ${(props) => (props.variant === "warning" ? "white" : "black")};
    font-size: ${(props) => (props.size === "small" ? "16px" : props.size === "large" ? "24px" : "20px")};
    text-align: ${(props) => props.textAlign || "left"};
`;

export function Button({
                           title,
                           onPress,
                           size = "medium",
                           children,
                           disabled = false,
                           loading = false,
                           onLongPress,
                           textAlign = "left",
                           variant = "primary",
                       }: ButtonProps) {
    return (
        <StyledButton
            onPress={onPress}
            onLongPress={onLongPress}
            disabled={disabled || loading}
            size={size}
            variant={variant}
        >
            {title ? (
                <StyledText textAlign={textAlign} variant={variant}>
                    {disabled ? (
                        <FontAwesome name={"close"} size={20} color="red"/>
                    ) : (
                        loading && <ActivityIndicator color={"black"}/>
                    )}{" "}
                    {title}
                </StyledText>
            ) : (
                children
            )}
        </StyledButton>
    );
}
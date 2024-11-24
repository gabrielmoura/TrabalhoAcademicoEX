import styled from "@emotion/native";

export const Flex = styled.View<{
    direction?: "row" | "column";
    justify?: "space-between" | "center" | "flex-start" | "flex-end";
    align?: "center" | "flex-start" | "flex-end";
    gap?: number;
}>`
    display: flex;
    flex-direction: ${(props) => props.direction || "column"};
    justify-content: ${(props) => props.justify || "center"};
    align-items: ${(props) => props.align || "center"};
    gap: ${(props) => props.gap || 0}px;
`;

export const ScrollView = styled.ScrollView`
    width: 100%;
    height: 100%;
`;

export const Input = styled.TextInput`
    height: 40px;
    width: 80%;
    margin: 12px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;
export const Label = styled.Text`
    margin: 12px;
    font-size: 16px;
    font-weight: bold;
`;
export const ControlForm = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 80%;
    gap: 5px;
`;
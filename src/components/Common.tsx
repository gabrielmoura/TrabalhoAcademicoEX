import styled from "@emotion/native";

export const FlexCol = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;
export const FlexRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
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
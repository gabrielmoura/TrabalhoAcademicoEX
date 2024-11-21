import styled from "@emotion/native";
import {useNavigation} from "@react-navigation/native";
import {LogoIcon} from "@components/LogoIcon";
import {Button} from "@components/Button";

const Container = styled.View`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50px;
    border-radius: 10px;
`;

const Description = styled.Text`
    color: black;
    font-size: 45px;
    font-weight: bold;
    text-align: center;
`;

const ButtonContainer = styled.View`
    margin-top: 20px;
    width: 80%;
    display: flex;
    gap: 20px;
`;

const Flex = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
`;

export default function HomeScreen() {
    const navigation = useNavigation();
    return (
        <Flex>
            <Container>
                <Description>Taxi Calc</Description>
                <LogoIcon/>
            </Container>
            <ButtonContainer>
                <Button
                    title="Configurações"
                    onPress={() => navigation.navigate("Config")}
                />
                <Button
                    title="Calcular Preço"
                    onPress={() => navigation.navigate("CalcPrice")}
                />
                <Button
                    title="Histórico de Corridas"
                    onPress={() => navigation.navigate("RaceRecord")}
                />
            </ButtonContainer>
        </Flex>
    );
}

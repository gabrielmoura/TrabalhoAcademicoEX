/** @jsxImportSource @emotion/react */
import styled, {css} from "@emotion/native";
import {FlatList, Text, TouchableOpacity} from "react-native";
import {useSQLiteContext} from "expo-sqlite";
import {useNavigation} from "@react-navigation/native";
import {getRaceRecords} from "@app/services/raceRecord";
import {useQuery} from "@tanstack/react-query";
import {RaceRecord} from "@app/types/RaceRecordType";

const Title = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #FFD700;
    margin-bottom: 16px;
`
const Container = styled.View`
    flex: 1;
    padding: 16px;
`
const EmptyMessage = styled.Text`
    font-size: 16px;
    color: #FFD700;
    text-align: center;
    margin-top: 20px;
`

export function RaceRecordPage() {
    const db = useSQLiteContext();

    const {data} = useQuery({
        queryKey: ["raceRecords"],
        queryFn: async () => getRaceRecords(db),
    })

    return (
        <Container>
            <Title>Histórico de Corridas</Title>
            <FlatList
                data={data}
                initialNumToRender={6}
                renderItem={({item}) => <CardRecord item={item}/>}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={<EmptyMessage>Nenhum registro encontrado</EmptyMessage>}
            />
            <FloatingButton/>
        </Container>
    );
}

function CardRecord({item}: { item: RaceRecord }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onLongPress={() => navigation.navigate("Modal", {screen: 'EditRace', params: {id: 1}})}
        >
            <Card>
                <CardText>ID: {item.id}</CardText>
                <CardText>Distância: {item.distance} m</CardText>
                <CardText>Tempo: {item.time} s</CardText>
                <CardText>Data: {item.createdAt?.toString()}</CardText>
                <CardText>Preço: R${item.price}</CardText>
                <CardText>Nota: {item.note}</CardText>
            </Card>
        </TouchableOpacity>
    );
}

function FloatingButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={css({
                position: "absolute",
                bottom: 24,
                right: 24,
                width: 56,
                height: 56,
                backgroundColor: "#FFD700", // Amarelo
                borderRadius: 28, // Torna o botão redondo
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 4},
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 8, // Para Android
            })}
            onPress={() => navigation.navigate("Modal", {screen: 'NewRace'})}
        >
            <Text
                style={css({
                    fontSize: 32,
                    color: "#000", // Preto
                    fontWeight: "bold",
                    textAlign: "center",
                })}
            >+</Text>
        </TouchableOpacity>
    );
}

const Card = styled.View`
    background-color: rgba(26, 26, 26, 0.61);
    padding: 16px;
    border-radius: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
`
const CardText = styled.Text`
    color: #FFD700;
    font-size: 14px;
`


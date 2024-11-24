import {useNavigation, useRoute} from "@react-navigation/native";
import {useSQLiteContext} from "expo-sqlite";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteRaceRecord, getRaceRecord, updateRaceRecord} from "@app/services/raceRecord";
import React, {useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {Button} from "@components/Button";
import {NumberInput, TextArea, TextInput} from "@components/CommonInput";

export function EditRaceModal() {
    const db = useSQLiteContext();
    const {params: {id}} = useRoute();

    const {data, isLoading} = useQuery({
        queryKey: ["raceRecord", {id}],
        queryFn: async () => getRaceRecord(db, id),
    })

    if (isLoading) {
        return <ActivityIndicator color="#000"/>
    }

    return <FormRace data={data} id={id}/>
}

function FormRace({data, id}) {
    if (data?.id !== id) {
        return <Text style={styles.textError}>Registro não encontrado</Text>
    }
    const clientQuery = useQueryClient()
    const db = useSQLiteContext();
    const navigator = useNavigation();

    const [price, setPrice] = useState<number>(data.price);
    const [time, setTime] = useState<number>(data.time);
    const [distance, setDistance] = useState<number>(data.distance);
    const [notes, setNotes] = useState<string>(data.note);
    const [origin, setOrigin] = useState<string>(data.origin);
    const [destination, setDestination] = useState<string>(data.destination);


    const mut = useMutation({
        mutationFn: async () => updateRaceRecord(db, {
            id,
            origin: origin!,
            destination: destination!,
            note: notes!,
            price: price!,
            time: time!,
            distance: distance!

        }),
        onSuccess: async () => {
            await clientQuery.invalidateQueries({queryKey: ['raceRecords']});
            return navigator.goBack();
        },
        mutationKey: ["updateRaceRecord", {id}]
    })
    const deleteMutation = useMutation({
        mutationFn: async () => deleteRaceRecord(db, id),
        mutationKey: ["deleteRaceRecord", {id}],
        onSuccess: async () => {
            await clientQuery.invalidateQueries({queryKey: ['raceRecords']})
            return navigator.goBack()
        },
    })
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar registro de corrida</Text>
            {mut.isError && <Text style={styles.textError}>{mut.error?.toString()}</Text>}

            <NumberInput onValueChange={setDistance} placeholder="Distância (metros)" prefix='Distância'
                         defaultValue={distance}/>

            <NumberInput onValueChange={setTime} placeholder="Tempo (segundos)" prefix='Tempo' defaultValue={time}/>

            <NumberInput onValueChange={setPrice} prefix='R$' defaultValue={price}/>

            <TextInput
                placeholder="Origem"
                onValueChange={setOrigin}
                defaultValue={origin}
            />

            <TextInput
                placeholder="Destino"
                onValueChange={setDestination}
                defaultValue={destination}
            />

            <TextArea numberOfLines={4} placeholder='Notas' onValueChange={setNotes} defaultValue={notes}/>

            <View style={styles.containerButtons}>
                {mut?.isPending ? <ActivityIndicator color="#000"/> : (<>
                    <Button title="Salvar"
                            onPress={() => mut.mutate()}/>
                    <Button title="Cancelar"
                            onPress={() => navigator.goBack()} style={styles.cancelButton}/>
                    <Button title="Deletar"
                            variant='warning'
                            onPress={() => deleteMutation.mutate()}/>
                </>)}
            </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 100,
        textAlignVertical: "top",
    },
    cancelButton: {
        marginTop: 10,
        backgroundColor: "red",
    },
    containerButtons: {
        display: "flex",
        flexDirection: "row",
        gap: 10,
    },
    textError: {
        color: "red",
    },
});

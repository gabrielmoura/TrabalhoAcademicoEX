import {useNavigation, useRoute} from "@react-navigation/native";
import {useSQLiteContext} from "expo-sqlite";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {deleteRaceRecord, getRaceRecord, RaceRecord, updateRaceRecord} from "@app/services/raceRecord";
import React, {useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {Button, ButtonDanger} from "@components/Button";
import {RaceRecordContext} from "@app/context/RaceRecordContext";

export function EditRaceModal() {
    return (
        <RaceRecordContext>
            <EditRace/>
        </RaceRecordContext>
    )
}

export function EditRace() {
    const db = useSQLiteContext();
    const navigator = useNavigation();
    const {params: {id}} = useRoute();
    const clientQuery = useQueryClient()

    const {data, isLoading} = useQuery({
        queryKey: ["raceRecord", {id}],
        queryFn: async () => getRaceRecord(db, id),
    })
    const [raceRecord, setRaceRecord] = useState<RaceRecord>(data!)

    const mut = useMutation({
        mutationFn: async () => updateRaceRecord(db, raceRecord!),
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

    if (isLoading) {
        return <ActivityIndicator color="#000"/>
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Race Record</Text>
            {mut.isError && <Text style={styles.textError}>{mut.error?.toString()}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Distance (meters)"
                keyboardType="numeric"

                value={raceRecord?.distance?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({
                    ...prev,
                    distance: parseFloat(value)
                }))}
            />

            <TextInput
                style={styles.input}
                placeholder="Time (seconds)"
                keyboardType="numeric"
                value={raceRecord?.time?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({...prev, time: parseFloat(value)}))}
            />

            <TextInput
                style={styles.input}
                placeholder="Price ($)"
                keyboardType="numeric"
                value={raceRecord?.price?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({...prev, price: parseFloat(value)}))}
            />

            <TextInput
                style={styles.input}
                placeholder="Origin"
                value={raceRecord?.origin?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({...prev, origin: value}))}
            />

            <TextInput
                style={styles.input}
                placeholder="Destination"
                value={raceRecord?.destination?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({...prev, destination: value}))}
            />

            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes"
                multiline
                numberOfLines={4}
                value={raceRecord?.note?.toString()}
                onChangeText={(value) => setRaceRecord((prev: RaceRecord) => ({...prev, note: value}))}
            />

            <View style={styles.containerButtons}>
                {mut?.isPending ? <ActivityIndicator color="#000"/> : (<>
                    <Button title="Save"
                            onPress={() => mut.mutate()}/>
                    <Button title="Cancel"
                            onPress={() => navigator.goBack()} style={styles.cancelButton}/>
                    <ButtonDanger title="Delete"
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

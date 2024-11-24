import React, {useState} from "react";
import {ActivityIndicator, ScrollView, StyleSheet, Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@components/Button";
import {useSQLiteContext} from "expo-sqlite";
import {insertRaceRecord} from "@app/services/raceRecord";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {RaceRecord} from "@app/types/RaceRecordType";
import {NumberInput, TextArea, TextInput} from "@components/CommonInput";
import {useTranslation} from "react-i18next";


export function NewRaceModal() {
    const navigator = useNavigation();
    const db = useSQLiteContext();
    const clientQuery = useQueryClient();
    const {t} = useTranslation();


    // Estados para armazenar os valores dos campos
    const [raceRecord, setRaceRecord] = useState<RaceRecord>();
    const [price, setPrice] = useState<number>();
    const [time, setTime] = useState<number>();
    const [distance, setDistance] = useState<number>();
    const [notes, setNotes] = useState<string>();
    const [origin, setOrigin] = useState<string>();
    const [destination, setDestination] = useState<string>();


    // Função para enviar o formulário

    const mut = useMutation({
        mutationFn: async () => insertRaceRecord(db, {
            origin: origin!,
            destination: destination!,
            note: notes!,
            price: price!,
            time: time!,
            distance: distance!
        }),
        onSuccess: async () => {
            await clientQuery.invalidateQueries({queryKey: ['raceRecords']})
            return navigator.goBack()
        },
        mutationKey: ["insertRaceRecord"]
    })

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{t('new_record_race')}</Text>
            {mut.isError && <Text style={styles.textError}>{mut.error?.toString()}</Text>}


            <NumberInput onValueChange={setDistance} placeholder={t('distance_meters')} prefix={t('distance')}/>

            <NumberInput onValueChange={setTime} placeholder={t('time_seconds')} prefix={t('time_label')}/>

            <NumberInput onValueChange={setPrice} prefix={t('currency')}/>

            <TextInput
                placeholder={t('origin')}
                onValueChange={setOrigin}

            />

            <TextInput
                placeholder={t('destination')}
                onValueChange={setDestination}

            />

            <TextArea numberOfLines={4} placeholder={t('note_label')} onValueChange={setNotes}/>

            <View style={styles.containerButtons}>
                {mut?.isPending ? <ActivityIndicator color="#000"/> : (<>
                    <Button title={t('save')}
                            onPress={() => mut.mutate()}/>
                    <Button title={t('cancel')}
                            onPress={() => navigator.goBack()} style={styles.cancelButton}/>
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

import {Alert, Text} from "react-native";
import useSessionStore from "@app/store/sessionStore";
import {Modal, Portal} from 'react-native-paper';


import {ControlForm, Flex, Input, Label, ScrollView} from "@components/Common";
import {ConfigStore, TaxToCalc} from "@app/store/slice/config";
import {Button} from "@components/Button";
import styled from "@emotion/native";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {flushDb} from "@app/services/raceRecord";
import {useSQLiteContext} from "expo-sqlite";
import {useTranslation} from "react-i18next";
import {Dispatch, useState} from "react";

const ContainerButton = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    padding-top: 10%;
    padding-bottom: 10%;
`;

export function ConfigPage() {
    const db = useSQLiteContext();
    const clientQuery = useQueryClient();
    const [showLanguage, setShowLanguage] = useState(false);
    const setModel = useSessionStore((state: ConfigStore) => state.setModel);
    const model = useSessionStore((state: ConfigStore) => state.model);
    const setYear = useSessionStore((state: ConfigStore) => state.setYear);
    const year = useSessionStore((state: ConfigStore) => state.year);

    const setBaseAm = useSessionStore((state: ConfigStore) => state.setBaseAm);
    const setBasePm = useSessionStore((state: ConfigStore) => state.setBasePm);

    const setKmPriceAm = useSessionStore((state: ConfigStore) => state.setKmPriceAm);
    const setKmPricePm = useSessionStore((state: ConfigStore) => state.setKmPricePm);

    const setApiKey = useSessionStore((state: ConfigStore) => state.setApiKey);
    const apiKey = useSessionStore((state: ConfigStore) => state.ApiKey);

    const tax: TaxToCalc = useSessionStore((state: ConfigStore) => state.Tax!);
    const resetToDefault = useSessionStore((state: ConfigStore) => state.resetToDefault);
    const {t, i18n} = useTranslation();


    const flushDB = useMutation({
        mutationKey: ['flushDb'],
        onMutate: async () => flushDb(db),
        onSuccess: async () => {
            await clientQuery.invalidateQueries({queryKey: ['raceRecords']});
            await clientQuery.invalidateQueries({queryKey: ['raceRecord']});
        }
    })

    function handleFlushDB() {
        flushDB.mutate()
        Alert.alert(t("success"), t('success_content_1'))
    }

    return (
        <ScrollView>
            <Flex direction='column' justify='space-between'>
                <Text>Config Page</Text>
                <Text>Modelo: {model}</Text>
                <Text>Ano: {year}</Text>


                <ControlForm>
                    <Label>Modelo</Label>
                    <Input
                        onChangeText={text => setModel(text)}
                        value={model}
                        placeholder={"Model"}
                    />
                    <Label>Ano</Label>
                    <Input placeholder={"Year"} keyboardType={'numeric'}
                           onChangeText={text => setYear(Number(text.replace(/[^0-9]/g, '')))}
                           value={year?.toString()}
                    />
                    <Label>Cor</Label>
                    <Input placeholder={"Color"}/>
                </ControlForm>
                <ControlForm>
                    <Label>Chave de acesso</Label>
                    <Input placeholder={"Chave de acesso"}
                           onChangeText={text => setApiKey(text)}
                           value={apiKey}
                    />
                </ControlForm>
                <ControlForm>
                    <Label>Taxa base de Dia</Label>
                    <Input placeholder={"Taxa base de Dia"} keyboardType={'decimal-pad'}
                           onChangeText={text => setBaseAm(Number(text))}
                           value={tax?.Am?.base?.toFixed(2)}
                    />

                    <Label>Taxa base de Noite</Label>
                    <Input placeholder={"Taxa base de Noite"} keyboardType={'decimal-pad'}
                           onChangeText={text => setBasePm(Number(text))}
                           value={tax?.Pm?.base?.toFixed(2)}
                    />


                    {/*Space*/}

                    <Label>Preço por Km de Dia</Label>
                    <Input placeholder={"Taxa base de Dia"} keyboardType={'decimal-pad'}
                           onChangeText={text => setKmPriceAm(Number(text))}
                           value={tax?.Am?.kmPrice?.toFixed(2)}
                    />

                    <Label>Preço por Km de Noite</Label>
                    <Input placeholder={"Taxa base de Dia"} keyboardType={'decimal-pad'}
                           onChangeText={text => setKmPricePm(Number(text))}
                           value={tax?.Pm?.kmPrice?.toFixed(2)}
                    />

                </ControlForm>

                <SelectLanguage visible={showLanguage} onDismiss={setShowLanguage}/>
                <Button title={t('change_language')} onPress={() => setShowLanguage(old => !old)}/>


                <ContainerButton>
                    <Button title={t('restore_default')} onPress={() => resetToDefault()}/>
                    <Button variant="warning" title={t('delete_db')} onLongPress={() => handleFlushDB()}
                            onPress={() => Alert.alert(t('notice'), t('notice_content_1'))}
                    />
                </ContainerButton>

            </Flex>
        </ScrollView>
    );
}

interface SelectLanguageProps {
    visible: boolean;
    onDismiss?: Dispatch<any>
}

function SelectLanguage({visible = false, onDismiss}: SelectLanguageProps) {
    const {t} = useTranslation();
    const setLanguage = useSessionStore((state: ConfigStore) => state.setLanguage);

    const languages = [
        {label: "Português", value: "pt"},
        {label: "English", value: "en"},
        {label: "Español", value: "es"},
    ];
    return (
        <Portal>
            <Modal visible={visible} contentContainerStyle={{backgroundColor: 'white', padding: 20}}
                   onDismiss={() => onDismiss && onDismiss(false)}>
                <TitleModal>{t('select_language')}</TitleModal>
                <ModalList data={languages} renderItem={({item}) => (
                    <ModalListItem>
                        <Button title={item.label} onPress={() => setLanguage(item.value)}/>
                    </ModalListItem>
                )}
                           keyExtractor={(item) => item.value}
                />
            </Modal>
        </Portal>
    )
}

const TitleModal = styled.Text`
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
`;
const ModalList = styled.FlatList`
    width: 100%;
`;
const ModalListItem = styled.View`
    margin-bottom: 10px;
`;
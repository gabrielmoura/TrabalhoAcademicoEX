import {Alert, Text} from "react-native";
import useSessionStore from "@app/store/sessionStore";
import {Modal, Portal} from 'react-native-paper';


import {ControlForm, Flex, Label, ScrollView} from "@components/Common";
import {ConfigStore, TaxToCalc} from "@app/store/slice/config";
import {Button} from "@components/Button";
import styled from "@emotion/native";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {flushDb} from "@app/services/raceRecord";
import {useSQLiteContext} from "expo-sqlite";
import {useTranslation} from "react-i18next";
import {Dispatch, useState} from "react";
import {languages} from "@app/util/languages";
import {NumberInput, TextInput} from "@components/CommonInput";

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


                <ControlForm>
                    <Label>{t('access_key')}</Label>
                    <TextInput
                        placeholder={t('access_key')}
                        defaultValue={apiKey}
                        onValueChange={setApiKey}
                    />
                </ControlForm>

                <ControlForm>
                    <Label>{t('day_base_rate')}</Label>
                    <NumberInput
                        language='en'
                        defaultValue={tax?.Am?.base}
                        onValueChange={setBaseAm}
                        placeholder={t('day_base_rate')}
                    />


                    <Label>{t('night_base_rate')}</Label>
                    <NumberInput
                        language='en'
                        defaultValue={tax?.Pm?.base}
                        onValueChange={setBasePm}
                        placeholder={t('night_base_rate')}
                    />


                    {/*Space*/}

                    <Label>{t('day_km_rate')}</Label>
                    <NumberInput
                        language='en'
                        defaultValue={tax?.Am?.kmPrice}
                        onValueChange={setKmPriceAm}
                        placeholder={t('day_km_rate')}
                    />

                    <Label>{t('night_km_rate')}</Label>
                    <NumberInput
                        language='en'
                        defaultValue={tax?.Pm?.kmPrice}
                        onValueChange={setKmPricePm}
                        placeholder={t('night_km_rate')}
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
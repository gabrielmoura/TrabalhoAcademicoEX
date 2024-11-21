import {Alert, Text} from "react-native";
import useSessionStore from "@app/store/sessionStore";

import {ControlForm, FlexCol, Input, Label, ScrollView} from "@components/Common";
import {ConfigStore, TaxToCalc} from "@app/store/slice/config";
import {Button, ButtonDanger} from "@components/Button";
import styled from "@emotion/native";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {flushDb} from "@app/services/raceRecord";
import {useSQLiteContext} from "expo-sqlite";

const ContainerButton = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 12px;
    padding-top: 10%;
    padding-bottom: 10%;
`;

export function ConfigPage() {
    const db = useSQLiteContext();
    const clientQuery = useQueryClient();
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
        Alert.alert("Sucesso", 'Banco de dados deletado com sucesso')
    }

    return (
        <ScrollView>
            <FlexCol>
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

                <ContainerButton>
                    <Button title={"Restaurar Padrão"} onPress={() => resetToDefault()}/>
                    <ButtonDanger title={"Deletar Banco"} onLongPress={() => handleFlushDB()}
                                  onPress={() => Alert.alert("Aviso", "Segure o botão para deletar o banco de dados.\nEsta ação não pode ser desfeita.")}
                    />
                </ContainerButton>

            </FlexCol>
        </ScrollView>
    );
}

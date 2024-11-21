import {Text} from "react-native";
import useSessionStore from "@app/store/sessionStore";

import {ControlForm, FlexCol, Input, Label, ScrollView} from "@components/Common";
import {ConfigStore, TaxToCalc} from "@app/store/slice/config";
import {Button} from "@components/Button";

export function ConfigPage() {
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

    return (
        <ScrollView>
            <FlexCol>
                <Text>Config Page</Text>
                <Text>Modelo: {model}</Text>
                <Text>Ano: {year}</Text>

                <Button title={"Restaurar Padrão"} onPress={() => resetToDefault()}/>

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
            </FlexCol>
        </ScrollView>
    );
}

import {useMutation} from "@tanstack/react-query";
import {calculatePrice, DistanceResponse, getDistance} from "@app/services/geolocation";
import useSessionStore from "@app/store/sessionStore";
import {ConfigStore} from "@app/store/slice/config";
import {formatTime} from "@app/util/helper";
import styled from "@emotion/native";
import {GetGeoAutoComplete} from "@components/GetGeoAutoComplete";
import {Button} from "@components/Button";
import {Alert} from "react-native";
import useCalcPriceStore from "@app/store/calcPriceFlow";


// Layout Components
const Container = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: #f9f9f9;
    //height: 100%;
`;

const Title = styled.Text`
    font-size: 28px;
    font-weight: bold;
    color: #333;
    margin-bottom: 16px;
`;

const Subtitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #555;
    margin: 8px 0;
    text-align: start;
`;

const Form = styled.View`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 90%;
    gap: 12px;
`;

const InputLabel = styled.Text`
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
`;

const ButtonText = styled.Text`
    color: black;
    font-size: 18px;
`;

const Result = styled.Text`
    font-size: 16px;
    color: #444;
    margin-top: 12px;
`;

// Main Component
export function PriceCalculator() {
    // State variables
    // const [origin, setOrigin] = useState<GeoLocation | null>(null);
    // const [destination, setDestination] = useState<GeoLocation | null>(null);
    const origin = useCalcPriceStore((state) => state.origin);
    const setOrigin = useCalcPriceStore((state) => state.setOrigin);
    const destination = useCalcPriceStore((state) => state.destination);
    const setDestination = useCalcPriceStore((state) => state.setDestination);


    const apiKey = useSessionStore((state: ConfigStore) => state.ApiKey);
    const taxConfig = useSessionStore((state: ConfigStore) => state.Tax!);
    const distance = useCalcPriceStore((state) => state.distance);
    const setDistance = useCalcPriceStore((state) => state.setDistance);
    const estimatedTime = useCalcPriceStore((state) => state.estimatedTime);
    const setEstimatedTime = useCalcPriceStore((state) => state.setEstimatedTime);
    // const [distance, setDistance] = useState<number>(0);
    // const [estimatedTime, setEstimatedTime] = useState<string>("");


    // Mutation to calculate distance and time
    const calculateRoute = useMutation({
        mutationKey: ["calculate-price", origin, destination],
        mutationFn: async () =>
            getDistance({
                origin: {lon: origin!.lon, lat: origin!.lat},
                destination: {lon: destination!.lon, lat: destination!.lat},
                apiKey: apiKey!,
            }),
        onSuccess: (data: DistanceResponse) => {
            setDistance(data.features[0].properties.distance);
            setEstimatedTime(formatTime(data.features[0].properties.time));
        },
    });

    function processDistance() {
        if (!origin || !destination) {
            return Alert.alert('Selecione um endereço de origem e destino');
        }

        calculateRoute.mutate();
    }

    return (
        <Container>
            <Title>Calculadora de Preços</Title>

            {/* Show selected locations */}
            <Subtitle>Origem: {origin?.formatted?.trim() || "Não selecionada"}</Subtitle>
            <Subtitle>Destino: {destination?.formatted?.trim() || "Não selecionado"}</Subtitle>

            <Form>
                {/* Input for origin */}
                {!origin && (
                    <>
                        <InputLabel>Endereço de Origem</InputLabel>
                        <GetGeoAutoComplete
                            placeholder="Digite o endereço de origem"
                            onSelectResult={setOrigin}
                        />
                    </>
                )}

                {/* Input for destination */}
                {!destination && (
                    <>
                        <InputLabel>Endereço de Destino</InputLabel>
                        <GetGeoAutoComplete
                            placeholder="Digite o endereço de destino"
                            onSelectResult={setDestination}
                        />
                    </>
                )}

                {/* Button to calculate price */}
                <Button onPress={() => processDistance()} size={'large'}>
                    <ButtonText>Calcular</ButtonText>
                </Button>

                {/* Display results */}
                {calculateRoute.isSuccess && (
                    <>
                        <Result>Preço Estimado: R$ {calculatePrice(distance, taxConfig)?.toFixed(2)}</Result>
                        <Result>Tempo Estimado: {estimatedTime}</Result>
                    </>
                )}
            </Form>
        </Container>
    );
}

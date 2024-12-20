import {useMutation} from "@tanstack/react-query";
import {calculatePrice, getDistance} from "@app/services/geolocation";
import useSessionStore from "@app/store/sessionStore";
import {ConfigStore} from "@app/store/slice/config";
import {formatTime} from "@app/util/helper";
import styled from "@emotion/native";
import {GetGeoAutoComplete} from "@components/GetGeoAutoComplete";
import {Button} from "@components/Button";
import {Alert} from "react-native";
import useCalcPriceStore from "@app/store/calcPriceFlow";
import {DistanceResponse} from "@app/types/distanceResponseType";
import {useTranslation} from "react-i18next";


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
const ResultError = styled.Text`
    font-size: 16px;
    color: red;
    margin-top: 12px;
`;
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

// Main Component
export function PriceCalculator() {
    // State variables
    // const [origin, setOrigin] = useState<GeoLocation | null>(null);
    // const [destination, setDestination] = useState<GeoLocation | null>(null);
    const origin = useCalcPriceStore((state) => state.origin!);
    const setOrigin = useCalcPriceStore((state) => state.setOrigin);
    const destination = useCalcPriceStore((state) => state.destination!);
    const setDestination = useCalcPriceStore((state) => state.setDestination);


    const apiKey = useSessionStore((state: ConfigStore) => state.ApiKey!);
    const taxConfig = useSessionStore((state: ConfigStore) => state.Tax!);
    const distance = useCalcPriceStore((state) => state.distance);
    const setDistance = useCalcPriceStore((state) => state.setDistance);
    const estimatedTime = useCalcPriceStore((state) => state.estimatedTime);
    const setEstimatedTime = useCalcPriceStore((state) => state.setEstimatedTime);
    const resetFlow = useCalcPriceStore((state) => state.resetFlow);
    const {t} = useTranslation();
    // const [distance, setDistance] = useState<number>(0);
    // const [estimatedTime, setEstimatedTime] = useState<string>("");


    // Mutation to calculate distance and time
    const calculateRoute = useMutation({
        mutationKey: ["calculate-price", {origin}, {destination}],
        mutationFn: async () =>
            getDistance({
                origin: {lon: origin.lon, lat: origin.lat},
                destination: {lon: destination.lon, lat: destination.lat},
                apiKey: apiKey,
            }),
        onSuccess: (data: DistanceResponse) => {
            setDistance(data.results[0].distance);
            setEstimatedTime(formatTime(data.results[0].time));
        },
    });

    function processDistance() {
        if (!origin || !destination) {
            return Alert.alert('Selecione um endereço de origem e destino');
        }

        return calculateRoute.mutate();
    }

    return (
        <Container>
            <Title>{t('price_calculator')}</Title>

            {/* Show selected locations */}
            <Subtitle>{t('origin')}: {origin?.formatted?.trim() || t('not_selected')}</Subtitle>
            <Subtitle>{t('destination')}: {destination?.formatted?.trim() || t('not_selected')}</Subtitle>

            <Form>
                {/* Input for origin */}
                {!origin && (
                    <>
                        <InputLabel>{t('origin_address')}</InputLabel>
                        <GetGeoAutoComplete
                            placeholder={t('enter_origin_address')}
                            onSelectResult={setOrigin}
                        />
                    </>
                )}

                {/* Input for destination */}
                {!destination && (
                    <>
                        <InputLabel>{t('destination_address')}</InputLabel>
                        <GetGeoAutoComplete
                            placeholder={t('enter_destination_address')}
                            onSelectResult={setDestination}
                        />
                    </>
                )}

                <ContainerButton>
                    <Button onPress={() => processDistance()} size={'large'}
                            title={t('calculate')}
                            loading={calculateRoute.isPending}
                            disabled={!origin || !destination}>
                    </Button>
                    <Button onPress={() => resetFlow()} size={'large'}
                            title={t('clear')} variant={'warning'}
                    >
                    </Button>
                </ContainerButton>

                {/* Display results */}
                {calculateRoute.isSuccess && (
                    <>
                        <Result>{t('estimated_price')}: {t('currency')} {calculatePrice(distance, taxConfig)?.toFixed(2)}</Result>
                        <Result>{t('estimated_time')}: {estimatedTime}</Result>
                        <Result>{t('distance')}: {distance}m</Result>
                    </>
                )}
                {calculateRoute.isError && (
                    <ResultError>{t('calculation_error')}: {calculateRoute.error.toString()}</ResultError>
                )}
            </Form>
        </Container>
    );
}
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Dispatch, useState} from 'react';
import styled from '@emotion/native';
import useSessionStore from '@app/store/sessionStore';
import {useMutation} from '@tanstack/react-query';
import {getAutoComplete} from '@app/services/geolocation';
import {Input} from '@components/Common';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {ConfigStore} from "@app/store/slice/config";
import useCalcPriceStore from "@app/store/calcPriceFlow";
import {GeoSelectionModal} from "@screens/GeoSelectModal";


// Props para o componente de auto-complete de geolocalização
interface GeoAutoCompleteProps {
    placeholder?: string;
    onSelectResult: Dispatch<any>;
}

// Componente principal de busca de localização
export function GetGeoAutoComplete({placeholder, onSelectResult}: GeoAutoCompleteProps) {
    const apiKey = useSessionStore((state: ConfigStore) => state.ApiKey); // Obter chave da API do store
    const [searchText, setSearchText] = useState<string>(''); // Texto de entrada do usuário


    // const [normalFlow, setNormalFlow] = useState<boolean>(true); // Fluxo normal de busca
    const normalFlow = useCalcPriceStore((state) => state.flow.normalFlow);
    const setNormalFlow = useCalcPriceStore((state) => state.setNormalFlow);

    // Configuração da mutação para buscar sugestões de endereço
    const fetchSuggestions = useMutation({
        mutationKey: ['geo-autocomplete', searchText],
        mutationFn: async () => getAutoComplete(searchText!, apiKey!),
    });

    // Renderiza o modal com os resultados ao obter sucesso na busca
    if (fetchSuggestions.isSuccess && fetchSuggestions.data.results.length > 0 && normalFlow) {
        return (
            <GeoSelectionModal
                results={fetchSuggestions.data.results}
                onSelectResult={onSelectResult}
            />
        );
    }

    return (
        <SearchInputContainer>
            <Input
                onChangeText={text => setSearchText(text)}
                value={searchText}
                placeholder={placeholder || 'Digite o endereço'}
                textContentType="streetAddressLine1"
            />
            <TouchableOpacity onPress={() => {
                if (searchText!.length <= 3) return
                fetchSuggestions.mutate()
                setNormalFlow(true)
            }}>
                {fetchSuggestions.isPending ? (
                    <ActivityIndicator color="#000" size={35}/>
                ) : (
                    <FontAwesome name="search" size={35} color="#000"/>
                )}
            </TouchableOpacity>
        </SearchInputContainer>
    );
}

// Container estilizado para a barra de pesquisa
const SearchInputContainer = styled.View`
    flex-direction: row;
    align-items: center;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
`;




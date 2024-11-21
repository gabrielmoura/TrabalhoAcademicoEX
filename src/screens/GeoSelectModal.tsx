// Componente de modal para seleção de endereço
import useCalcPriceStore from "@app/store/calcPriceFlow";
import {GeoLocation} from "@app/services/geolocation";
import styled from "@emotion/native";
import {Dispatch} from "react";
import {Modal, Text, VirtualizedList} from "react-native";

export function GeoSelectionModal({results, onSelectResult}: GeoSelectionModalProps) {
    // const [isModalVisible, setModalVisible] = useState(true);
    const isModalVisible = useCalcPriceStore((state) => state.flow.modalVisible);
    const setModalVisible = useCalcPriceStore((state) => state.setModalVisible);
    const closeWithoutSelection = useCalcPriceStore((state) => state.closeWithoutSelection);
    // Define o item selecionado e fecha o modal
    const handleSelectItem = (item: GeoLocation) => {
        onSelectResult(item);
        setModalVisible(false);
    };

    // Função para obter o item na lista
    const getItem = (data: GeoLocation[], index: number) => data[index];

    // Calcula o número total de itens
    const getItemCount = (data: GeoLocation[]) => data.length;

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                closeWithoutSelection();
            }}
        >
            <ModalContainer>
                <ModalTitle>Selecione um endereço:</ModalTitle>
                <VirtualizedList
                    data={results}
                    initialNumToRender={6}
                    renderItem={({item}) => (
                        <AddressItem onPress={() => handleSelectItem(item)}>
                            <Text>{item?.formatted?.trim()}</Text>
                        </AddressItem>
                    )}
                    keyExtractor={(item, index) => `${item?.plus_code}-${index}`}
                    getItem={getItem}
                    getItemCount={getItemCount}
                />
            </ModalContainer>
        </Modal>
    );
}

// Props para o modal de seleção
interface GeoSelectionModalProps {
    results: GeoLocation[];
    onSelectResult: Dispatch<any>;
}


const ModalTitle = styled.Text`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
`;

// Estilo para o container principal do modal
const ModalContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    //padding: 20px;
    padding: 60% 10%;
`;

// Item estilizado dentro da lista
const AddressItem = styled.TouchableOpacity`
    padding: 10px;
    margin: 5px 0;
    background-color: #f9f9f9;
    border-radius: 5px;
    border: 1px solid #ddd;
    align-items: center;
`;

// Componente de modal para seleção de endereço
import useCalcPriceStore from "@app/store/calcPriceFlow";

import styled from "@emotion/native";
import {Dispatch} from "react";
import {Text, VirtualizedList} from "react-native";
import {GeoLocation} from "@app/types/geoResponseType";
import {Modal, Portal} from 'react-native-paper';

export function GeoSelectionModal({results, onSelectResult}: GeoSelectionModalProps) {
    const isModalVisible = useCalcPriceStore((state) => state.flow.modalVisible);
    const setModalVisible = useCalcPriceStore((state) => state.setModalVisible);
    const closeWithoutSelection = useCalcPriceStore((state) => state.closeWithoutSelection);
    // Define o item selecionado e fecha o modal
    const handleSelectItem = (item: GeoLocation) => {
        onSelectResult(item);
        // setModalVisible(false);

    };

    // Função para obter o item na lista
    const getItem = (data: GeoLocation[], index: number) => data[index];

    // Calcula o número total de itens
    const getItemCount = (data: GeoLocation[]) => data.length;

    return (
        <Portal>
            <Modal
                contentContainerStyle={{backgroundColor: 'white', padding: 20, maxHeight: '80%', borderRadius: 10}}
                visible={isModalVisible}
                onDismiss={() => {
                    closeWithoutSelection();
                }}
            >
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
            </Modal>
        </Portal>
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

// Item estilizado dentro da lista
const AddressItem = styled.TouchableOpacity`
    padding: 10px;
    margin: 5px 0;
    background-color: #f9f9f9;
    border-radius: 5px;
    border: 1px solid #ddd;
    align-items: center;
`;

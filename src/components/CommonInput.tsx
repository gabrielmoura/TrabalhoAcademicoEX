import {Dispatch, useState} from 'react';
import styled from '@emotion/native';
import {StyleSheet, TextInput as TextInputDefault} from "react-native";


interface NumberInputProps {
    onValueChange?: Dispatch<number>;
    language?: 'en' | 'pt';
    prefix?: string;
    placeholder?: string;
    defaultValue?: number;
}

interface TextInputProps extends Pick<NumberInputProps, 'prefix' | 'placeholder'> {
    onValueChange?: Dispatch<string>;
    defaultValue?: string;
}

interface TextAreaProps extends Pick<TextInputProps, 'onValueChange' | 'placeholder' | 'defaultValue'> {
    numberOfLines?: number;
}

export const NumberInput = ({onValueChange, language = 'pt', prefix, placeholder, defaultValue}: NumberInputProps) => {
    const [value, setValue] = useState<string>(defaultValue?.toString() || '');

    const handleInputChange = (text: string) => {
        // Remove caracteres não numéricos com base no idioma
        const cleanedValue =
            language === 'en' ? text.replace(/[^0-9.]/g, '') : text.replace(/[^0-9,]/g, '');

        setValue(cleanedValue);

        // Converte para float considerando o idioma
        const normalizedValue = language === 'pt' ? cleanedValue.replace(',', '.') : cleanedValue;
        const floatValue = parseFloat(normalizedValue) || 0;

        // Chama o callback apenas se o valor for diferente
        if (onValueChange && !isNaN(floatValue)) {
            onValueChange(floatValue);
        }
    };

    return (
        <Container>
            {prefix && <Prefix>{prefix}</Prefix>}
            <StyledTextInput
                keyboardType="numeric"
                defaultValue={value}
                onChangeText={handleInputChange}
                placeholder={placeholder ? placeholder : language === 'en' ? '0.00' : '0,00'}
                placeholderTextColor="#999"
            />
        </Container>
    );
};

export const TextInput = ({prefix, placeholder, onValueChange, defaultValue}: TextInputProps) => {
    const [value, setValue] = useState<string>(defaultValue || '');

    const handleInputChange = (text: string) => {
        setValue(text);
        if (onValueChange) {
            onValueChange(text);
        }
    };

    return (
        <Container>
            {prefix && <Prefix>{prefix}</Prefix>}
            <StyledTextInput
                defaultValue={value}
                onChangeText={handleInputChange}
                placeholder={placeholder}
                placeholderTextColor="#999"
            />
        </Container>
    );
}
export const TextArea = ({placeholder, onValueChange, numberOfLines = 4, defaultValue}: TextAreaProps) => {
    const [value, setValue] = useState(defaultValue || '');
    const styles = StyleSheet.create({
        input: {
            width: "100%",
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            marginBottom: 15,
            fontSize: 16,
            backgroundColor: '#fff',

        },
        textArea: {
            height: 100,
            textAlignVertical: "top",
        },
    });

    const handleInputChange = (text: string) => {
        setValue(text);
        if (onValueChange) {
            onValueChange(text);
        }
    };

    return (
        <TextInputDefault
            style={[styles.input, styles.textArea]}
            placeholder={placeholder}
            multiline
            numberOfLines={numberOfLines}
            defaultValue={value}

            onChangeText={handleInputChange}

        />
    );
}


const Container = styled.View({
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
    marginBottom: 15,
});

const Prefix = styled.Text({
    fontSize: 16,
    marginRight: 5,
    color: '#000',
});

const StyledTextInput = styled.TextInput({
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0, // Remove padding extra no iOS/Android
});





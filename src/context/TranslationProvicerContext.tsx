import React, {createContext, useContext, useEffect} from 'react';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import PropTypes from 'prop-types';
import useSessionStore from "@app/store/sessionStore";
import {ConfigStore} from "@app/store/slice/config";
import {languageResources} from "@app/util/languages";

// Inicializa o i18next
i18n.use(initReactI18next).init({
    resources: languageResources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});

// Criação do Context
const TranslationContext = createContext({});

// TranslationProvider para encapsular a lógica de idioma
export const TranslationProvider = ({children}) => {
    const language = useSessionStore((state: ConfigStore) => state.language);
    useEffect(() => {
        i18n.changeLanguage(language);
    }, [language]);

    return (
        <TranslationContext.Provider value={{i18n}}>
            {children}
        </TranslationContext.Provider>
    );
};

// Hook para usar o contexto
export const useTranslationContext = () => {
    return useContext(TranslationContext);
};

TranslationProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

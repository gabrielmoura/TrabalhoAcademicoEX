import {ThemeProvider} from "@emotion/react";
import {PaperProvider} from 'react-native-paper';
import {StatusBar} from "react-native";


const theme = {
    color: {
        primary: "#ffcc00",
        secondary: "rgba(255,204,0,0.51)",
        warning: "#ff0000",
    },
    backgroundColor: "#000",
};

export function StyledComponent({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <PaperProvider>
                <StatusBar barStyle="light-content" backgroundColor={theme.backgroundColor}/>
                {children}
            </PaperProvider>
        </ThemeProvider>
    );
}

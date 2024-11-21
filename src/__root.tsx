// In App.js in a new project

import * as React from "react";

import {StyledComponent} from "@app/__style";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import Navigation from "@app/_navigation";
import {RaceRecordContext} from "@app/context/RaceRecordContext";


export default function App() {
    const queryClient = new QueryClient()
    return (
        <QueryClientProvider client={queryClient}>
            <StyledComponent>
                <RaceRecordContext>
                    <Navigation/>
                </RaceRecordContext>
            </StyledComponent>
        </QueryClientProvider>
    );
}

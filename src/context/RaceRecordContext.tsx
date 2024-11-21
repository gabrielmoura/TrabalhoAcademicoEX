import {SQLiteProvider, useSQLiteContext} from "expo-sqlite";
import {Suspense, useEffect, useState} from "react";
import {Text, View} from "react-native";
import {migrateDbIfNeeded} from "@app/services/raceRecord";

export function RaceRecordContext({children}) {
    return (
        <Suspense fallback={<Text>Erro ao processar</Text>}>
            <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} useSuspense>
                <Header/>
                {children}
            </SQLiteProvider>
        </Suspense>
    )
}


export function Header() {
    const db = useSQLiteContext();
    const [version, setVersion] = useState('');

    // Função para obter a versão do SQLite
    const fetchSQLiteVersion = async () => {
        try {
            const {user_version} = await db.getFirstAsync<{ 'sqlite_version()': string }>(
                'PRAGMA user_version'
            );

            setVersion(user_version);
        } catch (error) {
            setVersion('Erro');
        }
    };

    useEffect(() => {
        fetchSQLiteVersion();
    }, []);

    return (
        <View>
            <Text>User version: {version}</Text>
        </View>
    );
}

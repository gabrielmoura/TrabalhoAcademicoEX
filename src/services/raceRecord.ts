import {SQLiteDatabase} from "expo-sqlite";
import {RaceRecord} from "@app/types/RaceRecordType";

const TABLE_NAME = "race_records";

export async function getRaceRecords(db: SQLiteDatabase) {
    return db.getAllAsync<RaceRecord[]>(`SELECT *
                                         FROM ${TABLE_NAME}
                                         order by created_at desc`);
}

export async function getRaceRecord(db: SQLiteDatabase, id: number) {
    return db.getFirstAsync<RaceRecord>(`SELECT *
                                         FROM ${TABLE_NAME}
                                         WHERE id = ?`, [id]);
}

export async function insertRaceRecord(db: SQLiteDatabase, raceRecord: RaceRecord) {
    const query = `
        INSERT INTO ${TABLE_NAME} (distance, time, price, origin, destination, note, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        raceRecord.distance,
        raceRecord.time,
        raceRecord.price,
        raceRecord.origin ?? null,
        raceRecord.destination ?? null,
        raceRecord.note ?? null,
        new Date().toISOString()
    ];
    const statement = await db.prepareAsync(query);
    return statement.executeAsync(params);
}

export async function updateRaceRecord(db: SQLiteDatabase, raceRecord: RaceRecord) {
    if (!raceRecord.id) {
        throw new Error("RaceRecord ID is required for update.");
    }

    const query = `
        UPDATE ${TABLE_NAME}
        SET distance    = ?,
            time        = ?,
            price       = ?,
            origin      = ?,
            destination = ?,
            note        = ?
        WHERE id = ?
    `;
    const params = [
        raceRecord.distance,
        raceRecord.time,
        raceRecord.price,
        raceRecord.origin ?? null,
        raceRecord.destination ?? null,
        raceRecord.note ?? null,
        raceRecord.id
    ];
    const statement = await db.prepareAsync(query);
    return statement.executeAsync(params);
}

export async function deleteRaceRecord(db: SQLiteDatabase, id: number) {
    const query = `DELETE
                   FROM ${TABLE_NAME}
                   WHERE id = ?`;
    const statement = await db.prepareAsync(query);
    return statement.executeAsync([id]);
}


export async function migrateDbIfNeeded(db: SQLiteDatabase) {
    const DATABASE_VERSION = 1;

    // Obtém a versão atual do banco de dados
    const {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        'PRAGMA user_version'
    );

    // Se a versão do banco de dados já estiver atualizada, encerra a função
    if (currentDbVersion >= DATABASE_VERSION) {
        return;
    }

    // Se a versão atual for 0 ou não existir, realiza a migração inicial
    if (!currentDbVersion || currentDbVersion == 0) {
        new Promise.all([
            await db.execAsync(`
            PRAGMA journal_mode = 'wal';
            CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
                id INTEGER PRIMARY KEY NOT NULL,
                distance REAL,
                time INTEGER,
                price REAL NOT NULL,
                origin TEXT,
                destination TEXT,
                note TEXT,
                created_at TEXT NOT NULL
            );
        `),
            await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`)
        ])
    }
}


export async function incrUserVersion(db: SQLiteDatabase) {
    const {user_version: currentDbVersion} = await db.getFirstAsync<{ user_version: number }>(
        "PRAGMA user_version"
    );

    await db.execAsync(`PRAGMA user_version = ${currentDbVersion + 1}`);
}

export async function flushDb(db: SQLiteDatabase) {
    await db.execAsync(`DROP TABLE IF EXISTS ${TABLE_NAME}`);
    await db.execAsync(`PRAGMA user_version = 0`);
}
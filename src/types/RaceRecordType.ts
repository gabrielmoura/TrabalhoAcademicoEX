export interface RaceRecord {
    id?: number;
    distance: number;
    time: number;
    price: number;
    origin?: string;
    destination?: string;
    note?: string;
    createdAt?: string;
    created_at?: Date;
}
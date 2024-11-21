export interface DistanceResponse {
    results: Result[];
    properties: Properties;
}

interface Properties {
    mode: string;
    waypoints: GeometryElement[];
    units: string;
}

interface GeometryElement {
    lon: number;
    lat: number;
}

interface Result {
    mode: string;
    waypoints: PurpleWaypoint[];
    units: string;
    distance: number;
    distance_units: string;
    time: number;
    legs: Leg[];
    geometry: Array<GeometryElement[]>;
}

interface Leg {
    distance: number;
    time: number;
    steps: Step[];
}

interface Step {
    from_index: number;
    to_index: number;
    distance: number;
    time: number;
    instruction: Instruction;
}

interface Instruction {
    text: string;
}

interface PurpleWaypoint {
    location: number[];
    original_index: number;
}

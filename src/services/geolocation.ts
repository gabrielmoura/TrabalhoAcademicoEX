import {TaxToCalc} from "@app/store/slice/config";

export interface GeoResponse {
    results: GeoLocation[]
    query: Query
}

export interface GeoLocation {
    country: string
    country_code: string
    region: string
    state: string
    city: string
    municipality: string
    postcode: string
    district: string
    suburb?: string
    street: string
    datasource: Datasource
    state_code: string
    lon: number
    lat: number
    result_type: string
    formatted: string
    address_line1: string
    address_line2: string
    timezone: Timezone
    plus_code: string
    plus_code_short: string
    rank: Rank
    place_id: string
    bbox: Bbox
    county?: string
    quarter?: string
}

export interface Datasource {
    sourcename: string
    attribution: string
    license: string
    url: string
}

export interface Timezone {
    name: string
    offset_STD: string
    offset_STD_seconds: number
    offset_DST: string
    offset_DST_seconds: number
}

export interface Rank {
    confidence: number
    confidence_street_level?: number
    match_type: string
}

export interface Bbox {
    lon1: number
    lat1: number
    lon2: number
    lat2: number
}

export interface Query {
    text: string
    parsed: Parsed
}

export interface Parsed {
    street: string
    expected_type: string
}

export function getAutoComplete(text: string, apiKey: string): Promise<GeoResponse> {
    const params = new URLSearchParams
    params.append('apiKey', apiKey)
    params.append('text', text)
    params.append('lang', 'pt')
    params.append('format', 'json')
    params.append('limit', '15')

    const url = `https://api.geoapify.com/v1/geocode/autocomplete?${params.toString()}`
    return fetch(url).then(response => response.json());
}

export interface RoutingRequest {
    origin: {
        lat: number;
        lon: number;
    }
    destination: {
        lat: number;
        lon: number;
    }
    apiKey: string;
}

export interface DistanceResponse {
    features: Feature[]
    properties: Properties2
    type: string
}

export interface Feature {
    type: string
    properties: Properties
    geometry: Geometry
}

export interface Properties {
    mode: string
    waypoints: Waypoint[]
    units: string
    distance: number
    distance_units: string
    time: number
    legs: Leg[]
}

export interface Waypoint {
    location: number[]
    original_index: number
}

export interface Leg {
    distance: number
    time: number
    steps: Step[]
}

export interface Step {
    from_index: number
    to_index: number
    distance: number
    time: number
    instruction: Instruction
}

export interface Instruction {
    text: string
}

export interface Geometry {
    type: string
    coordinates: number[][][]
}

export interface Properties2 {
    mode: string
    waypoints: Waypoint2[]
    units: string
}

export interface Waypoint2 {
    lat: number
    lon: number
}


export function getDistance({origin, destination, apiKey}: RoutingRequest): Promise<DistanceResponse> {
    // const url = `https://api.geoapify.com/v1/routing?waypoints=${origin.lat},${origin.lon}|${destination.lat},${destination.lon}&mode=drive&lang=pt-BR&apiKey=${apiKey}`;
    const params = new URLSearchParams
    params.append('apiKey', apiKey)
    params.append('waypoints', `${origin.lat},${origin.lon}|${destination.lat},${destination.lon}`)
    params.append('mode', 'drive')
    params.append('lang', 'pt-BR')
    params.append('format', 'json')

    const url = `https://api.geoapify.com/v1/routing?${params.toString()}`
    return fetch(url).then(response => response.json());
}

// export function calculatePrice(distance: number, tax: TaxToCalc): number {
//     const now = new Date();
//     const isNight = now.getHours() < 6 || now.getHours() > 18;
//
//     const { base, kmPrice } = isNight ? tax.Pm : tax.Am;
//
//     const distanceInKm = distance / 1000;
//     return base + distanceInKm * kmPrice;
// }
export function calculatePrice(distance: number, tax: TaxToCalc): number {
    if (isNaN(distance) || distance < 0) {
        throw new Error("Invalid distance value");
    }
    if (!tax || !tax.Pm || !tax.Am || isNaN(tax.Pm.base) || isNaN(tax.Pm.kmPrice) || isNaN(tax.Am.base) || isNaN(tax.Am.kmPrice)) {
        throw new Error("Invalid tax configuration");
    }

    const now = new Date();
    const isNight = now.getHours() < 6 || now.getHours() > 18;

    const {base, kmPrice} = isNight ? tax.Pm : tax.Am;

    const distanceInKm = distance / 1000;
    return base + distanceInKm * kmPrice;
}

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
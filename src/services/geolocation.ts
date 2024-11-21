import {TaxToCalc} from "@app/store/slice/config";
import {GeoResponse} from "@app/types/geoResponseType";
import {DistanceResponse} from "@app/types/distanceResponseType";


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


export function getDistance({origin, destination, apiKey}: RoutingRequest): Promise<DistanceResponse> {
    // const url = `https://api.geoapify.com/v1/routing?waypoints=${origin.lat},${origin.lon}|${destination.lat},${destination.lon}&mode=drive&lang=pt-BR&apiKey=${apiKey}`;
    const params = new URLSearchParams
    params.append('apiKey', apiKey)
    params.append('waypoints', `${origin.lat},${origin.lon}|${destination.lat},${destination.lon}`)
    params.append('mode', 'drive')
    params.append('lang', 'pt')
    params.append('format', 'json')

    const url = `https://api.geoapify.com/v1/routing?${params.toString()}`
    return fetch(url).then(response => response.json());
}

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

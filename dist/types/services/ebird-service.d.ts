/**
 * eBird API service.
 * Docs: https://documenter.getpostman.com/view/664302/S1ENwy59
 *
 * TODO: replace mock returns with real fetch() calls using a valid eBird API key.
 */
import { Entity } from '../types';
declare const EBIRD_BASE = "https://api.ebird.org/v2";
export interface EbirdSighting {
  speciesCode: string;
  comName: string;
  sciName: string;
  howMany?: number;
  obsDt: string;
  subId: string;
}
/**
 * Fetch recent nearby bird sightings.
 * Endpoint: GET /data/obs/geo/recent?lat=&lng=&dist=&maxResults=50
 * TODO: add Authorization: `Bearer ${apiKey}` header.
 */
export declare function fetchNearbyBirds(_lat: number, _lng: number, _dist?: number): Promise<EbirdSighting[]>;
/**
 * Fetch hourly activity distribution for a species at a location.
 * eBird does not expose hourly histograms directly; use iNat time-of-day histogram instead.
 * This stub returns a flat 24-element array.
 */
export declare function fetchHourlyActivity(_speciesCode: string, _regionCode: string): Promise<number[]>;
/**
 * Convert eBird sighting list to Entity array.
 */
export declare function eBirdToEntities(sightings: EbirdSighting[]): Entity[];
export { EBIRD_BASE };

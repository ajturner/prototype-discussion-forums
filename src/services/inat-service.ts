/**
 * iNaturalist API service.
 * Docs: https://api.inaturalist.org/v1/docs/
 *
 * TODO: replace mock returns with real fetch() calls to the iNat API.
 */
import { Entity, StrataLayerKey } from '../types';

const INAT_BASE = 'https://api.inaturalist.org/v1';

export interface InatObservation {
  id: number;
  taxon?: { id: number; name: string; preferred_common_name?: string };
  photos?: Array<{ url: string }>;
  observed_on?: string;
  place_guess?: string;
}

/**
 * Fetch recent observations for a location and optional stratum layer.
 * TODO: call `${INAT_BASE}/observations?lat=${lat}&lng=${lng}&radius=${radiusKm}&per_page=20`
 */
export async function fetchObservations(
  _lat: number,
  _lng: number,
  _strataLayer?: StrataLayerKey,
): Promise<InatObservation[]> {
  // TODO: integrate real API call
  return [];
}

/**
 * Fetch phenology histogram for a taxon at a place.
 * Endpoint: GET /v2/observations/histogram?taxon_id=&place_id=&date_field=observed
 * TODO: call the real endpoint and map week buckets.
 */
export async function fetchPhenologyHistogram(
  _taxonId: string,
  _placeId: string,
): Promise<number[]> {
  // Returns an array of 52 values (observation counts per week of year)
  // TODO: integrate real API call
  return new Array(52).fill(0);
}

/**
 * Fetch species list for a geographic bounding box.
 * TODO: call `${INAT_BASE}/observations/species_counts?nelat=…&nelng=…&swlat=…&swlng=…`
 */
export async function fetchSpeciesList(
  _lat: number,
  _lng: number,
  _radiusKm: number = 5,
): Promise<Entity[]> {
  // TODO: integrate real API call
  return [];
}

export { INAT_BASE };

const INAT_BASE = 'https://api.inaturalist.org/v1';
/**
 * Fetch recent observations for a location and optional stratum layer.
 * TODO: call `${INAT_BASE}/observations?lat=${lat}&lng=${lng}&radius=${radiusKm}&per_page=20`
 */
export async function fetchObservations(_lat, _lng, _strataLayer) {
  // TODO: integrate real API call
  return [];
}
/**
 * Fetch phenology histogram for a taxon at a place.
 * Endpoint: GET /v2/observations/histogram?taxon_id=&place_id=&date_field=observed
 * TODO: call the real endpoint and map week buckets.
 */
export async function fetchPhenologyHistogram(_taxonId, _placeId) {
  // Returns an array of 52 values (observation counts per week of year)
  // TODO: integrate real API call
  return new Array(52).fill(0);
}
/**
 * Fetch species list for a geographic bounding box.
 * TODO: call `${INAT_BASE}/observations/species_counts?nelat=…&nelng=…&swlat=…&swlng=…`
 */
export async function fetchSpeciesList(_lat, _lng, _radiusKm = 5) {
  // TODO: integrate real API call
  return [];
}
export { INAT_BASE };
//# sourceMappingURL=inat-service.js.map

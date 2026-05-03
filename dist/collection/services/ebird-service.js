const EBIRD_BASE = 'https://api.ebird.org/v2';
/**
 * Fetch recent nearby bird sightings.
 * Endpoint: GET /data/obs/geo/recent?lat=&lng=&dist=&maxResults=50
 * TODO: add Authorization: `Bearer ${apiKey}` header.
 */
export async function fetchNearbyBirds(_lat, _lng, _dist = 10) {
  // TODO: integrate real API call
  return [];
}
/**
 * Fetch hourly activity distribution for a species at a location.
 * eBird does not expose hourly histograms directly; use iNat time-of-day histogram instead.
 * This stub returns a flat 24-element array.
 */
export async function fetchHourlyActivity(_speciesCode, _regionCode) {
  // TODO: integrate real API call
  return new Array(24).fill(0);
}
/**
 * Convert eBird sighting list to Entity array.
 */
export function eBirdToEntities(sightings) {
  return sightings.map(s => ({
    id: s.speciesCode,
    commonName: s.comName,
    scientificName: s.sciName,
    status: `Observed ${s.obsDt}`,
  }));
}
export { EBIRD_BASE };
//# sourceMappingURL=ebird-service.js.map

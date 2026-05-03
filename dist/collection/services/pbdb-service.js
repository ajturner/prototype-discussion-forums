const PBDB_BASE = 'https://paleobiodb.org/api/v1';
/**
 * Fetch fossil occurrences within a bounding box and age range.
 * Endpoint: GET /occs/list.json?lngmin=&lngmax=&latmin=&latmax=&max_ma=&min_ma=&show=coords,taxa
 */
export async function fetchFossilOccurrences(_latMin, _latMax, _lngMin, _lngMax, _maxMa, _minMa) {
  // TODO: integrate real API call
  return [];
}
/**
 * Convert PBDB occurrences to FossilOccurrence display objects.
 */
export function pbdbToFossils(occs) {
  return occs.map(o => ({
    name: o.identified_name || o.taxon_name,
    taxon: o.taxon_name,
    ageDisplay: `${o.late_age}–${o.early_age} Ma`,
  }));
}
export { PBDB_BASE };
//# sourceMappingURL=pbdb-service.js.map

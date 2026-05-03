/**
 * Macrostrat API service.
 * Docs: https://macrostrat.org/api/v2
 *
 * TODO: replace mock returns with real fetch() calls.
 */
const MACROSTRAT_BASE = 'https://macrostrat.org/api/v2';
/**
 * Fetch the nearest stratigraphic column for a coordinate.
 * Endpoint: GET /columns?lat=&lng=&format=json
 */
export async function fetchColumn(_lat, _lng) {
  // TODO: integrate real API call
  return null;
}
/**
 * Fetch stratigraphic units for a column.
 * Endpoint: GET /units?col_id=&format=json
 */
export async function fetchUnits(_colId) {
  // TODO: integrate real API call
  return [];
}
/**
 * Reconstruct paleogeographic coordinates for a modern coordinate at a given age (Ma).
 * Endpoint: GET /paleogeography?lat=&lng=&age=
 */
export async function fetchPaleocoordinates(_lat, _lng, _ageMa) {
  // TODO: integrate real API call
  return null;
}
export { MACROSTRAT_BASE };
//# sourceMappingURL=macrostrat-service.js.map

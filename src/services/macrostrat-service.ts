/**
 * Macrostrat API service.
 * Docs: https://macrostrat.org/api/v2
 *
 * TODO: replace mock returns with real fetch() calls.
 */

const MACROSTRAT_BASE = 'https://macrostrat.org/api/v2';

export interface MacrostratColumn {
  col_id: number;
  col_name: string;
  lat: number;
  lng: number;
  t_units: number;
}

export interface MacrostratUnit {
  unit_id: number;
  unit_name: string;
  strat_name: string;
  age_top: number;
  age_bottom: number;
  lith: string;
  environ: string;
  color?: string;
}

export interface PaleogeographyPoint {
  age: number;
  lat: number;
  lng: number;
  plate_id?: number;
}

/**
 * Fetch the nearest stratigraphic column for a coordinate.
 * Endpoint: GET /columns?lat=&lng=&format=json
 */
export async function fetchColumn(_lat: number, _lng: number): Promise<MacrostratColumn | null> {
  // TODO: integrate real API call
  return null;
}

/**
 * Fetch stratigraphic units for a column.
 * Endpoint: GET /units?col_id=&format=json
 */
export async function fetchUnits(_colId: number): Promise<MacrostratUnit[]> {
  // TODO: integrate real API call
  return [];
}

/**
 * Reconstruct paleogeographic coordinates for a modern coordinate at a given age (Ma).
 * Endpoint: GET /paleogeography?lat=&lng=&age=
 */
export async function fetchPaleocoordinates(
  _lat: number,
  _lng: number,
  _ageMa: number,
): Promise<PaleogeographyPoint | null> {
  // TODO: integrate real API call
  return null;
}

export { MACROSTRAT_BASE };

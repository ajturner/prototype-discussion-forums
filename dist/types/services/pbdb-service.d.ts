/**
 * Paleobiology Database (PBDB) API service.
 * Docs: https://paleobiodb.org/data1.2/
 *
 * TODO: replace mock returns with real fetch() calls.
 */
import { FossilOccurrence } from '../types';
declare const PBDB_BASE = "https://paleobiodb.org/api/v1";
export interface PBDBOccurrence {
  occurrence_no: number;
  taxon_name: string;
  identified_name: string;
  early_age: number;
  late_age: number;
  lng: number;
  lat: number;
}
/**
 * Fetch fossil occurrences within a bounding box and age range.
 * Endpoint: GET /occs/list.json?lngmin=&lngmax=&latmin=&latmax=&max_ma=&min_ma=&show=coords,taxa
 */
export declare function fetchFossilOccurrences(_latMin: number, _latMax: number, _lngMin: number, _lngMax: number, _maxMa: number, _minMa: number): Promise<PBDBOccurrence[]>;
/**
 * Convert PBDB occurrences to FossilOccurrence display objects.
 */
export declare function pbdbToFossils(occs: PBDBOccurrence[]): FossilOccurrence[];
export { PBDB_BASE };

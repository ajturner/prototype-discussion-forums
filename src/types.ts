export type ExploreMode = 'strata' | 'day' | 'phenology' | 'deep-time';

export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
  placeName?: string;
}

export interface WeatherConditions {
  tempC: number;
  description: string;
  icon: string;
}

export interface LocationContext {
  location: GeoLocation;
  weather?: WeatherConditions;
  localTime: Date;
  weekOfYear: number;
}

export type StrataLayerKey =
  | 'atmosphere'
  | 'canopy'
  | 'understory'
  | 'ground'
  | 'soil-surface'
  | 'upper-soil'
  | 'mycorrhizal'
  | 'bedrock';

export type PhenologyCategory =
  | 'bloom'
  | 'migration'
  | 'breed'
  | 'fruit'
  | 'hibernate'
  | 'emerge';

export interface Entity {
  id: string;
  commonName: string;
  scientificName: string;
  taxonId?: string;
  photoUrl?: string;
  iNatUrl?: string;
  status?: string;
  /** Which strata layer this entity belongs to */
  strataLayer?: StrataLayerKey;
  /** Hour of day (0-23) when activity peaks */
  dayPeakHour?: number;
  /** Number of hours active around peak */
  dayDurationHours?: number;
  /** Phenology classification */
  phenologyCategory?: PhenologyCategory;
  /** Week of year (1-52) when activity peaks */
  phenologyPeakWeek?: number;
  /** Week of year (1-52) when activity starts */
  phenologyStartWeek?: number;
  /** Week of year (1-52) when activity ends */
  phenologyEndWeek?: number;
}

export interface StrataLayer {
  key: StrataLayerKey;
  label: string;
  depthLabel: string;
  /** Depth in metres relative to ground (negative = below) */
  depthM: number;
  color: string;
  textColor: string;
  entities: Entity[];
  description: string;
}

export interface DeepTimeEra {
  label: string;
  yearsAgo: number;
  yearsAgoDisplay: string;
  environment: string;
  narrative: string;
  color: string;
  fossils: FossilOccurrence[];
}

export interface FossilOccurrence {
  name: string;
  taxon: string;
  ageDisplay: string;
}

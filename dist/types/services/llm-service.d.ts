/**
 * LLM narrative service using the Anthropic Claude API.
 *
 * SECURITY: This service must only be called from a server-side context or
 * a Chrome extension background service worker — NEVER from a content script
 * or any page-accessible context. The ANTHROPIC_API_KEY must never be exposed
 * to untrusted page content.
 *
 * TODO: wire up to actual Anthropic SDK / proxy endpoint.
 */
import { DeepTimeEra } from '../types';
export interface NarrativeRequest {
  era: DeepTimeEra;
  lat: number;
  lng: number;
  locationName: string;
}
export interface NarrativeResponse {
  narrative: string;
  /** Optional brief label for illustrations */
  imagePrompt?: string;
}
/**
 * Generate a deep-time narrative paragraph for a specific era and location.
 *
 * In production, POST to a secure server endpoint that holds the API key:
 *   POST /api/narrative  { era, lat, lng, locationName }
 *
 * Example prompt pattern:
 *   "Describe what the landscape at [lat, lng] near [locationName] looked like
 *   [yearsAgoDisplay] in the [environment]. Write 3–4 sentences, vivid and scientific."
 */
export declare function generateDeepTimeNarrative(request: NarrativeRequest): Promise<NarrativeResponse>;
/**
 * Generate an entity summary (for entity cards) from iNat data.
 * TODO: connect to Claude API via secure proxy.
 */
export declare function generateEntitySummary(commonName: string, scientificName: string, _locationName: string): Promise<string>;
/**
 * Moderate a user-submitted discussion post for policy compliance.
 * Returns approved=true and a reason.
 * TODO: connect to Claude API via secure proxy.
 */
export declare function moderatePost(_body: string): Promise<{
  approved: boolean;
  reason: string;
}>;

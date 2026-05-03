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
export async function generateDeepTimeNarrative(
  request: NarrativeRequest,
): Promise<NarrativeResponse> {
  // TODO: replace with real Claude API call via secure proxy
  // const client = new Anthropic(); // reads ANTHROPIC_API_KEY server-side
  // const msg = await client.messages.create({
  //   model: 'claude-sonnet-4-6',
  //   max_tokens: 256,
  //   messages: [{
  //     role: 'user',
  //     content: buildPrompt(request),
  //   }],
  // });
  // return { narrative: (msg.content[0] as any).text };

  // Return the pre-written narrative from the era object as fallback
  return { narrative: request.era.narrative };
}

/**
 * Generate an entity summary (for entity cards) from iNat data.
 * TODO: connect to Claude API via secure proxy.
 */
export async function generateEntitySummary(
  commonName: string,
  scientificName: string,
  _locationName: string,
): Promise<string> {
  // TODO: replace with real Claude API call
  return `${commonName} (${scientificName}) is found at this location.`;
}

/**
 * Moderate a user-submitted discussion post for policy compliance.
 * Returns approved=true and a reason.
 * TODO: connect to Claude API via secure proxy.
 */
export async function moderatePost(
  _body: string,
): Promise<{ approved: boolean; reason: string }> {
  // TODO: replace with real Claude API call
  return { approved: true, reason: 'Auto-approved (moderation not yet configured)' };
}

import { Component, State, h } from '@stencil/core';
import { ExploreMode, LocationContext } from '../../types';
import {
  MOCK_LOCATION,
  MOCK_STRATA_LAYERS,
  MOCK_DAY_ENTITIES,
  MOCK_PHENOLOGY_ENTITIES,
  MOCK_DEEP_TIME_ERAS,
} from '../../mock-data';

@Component({
  tag: 'here-view',
  styleUrl: 'here-view.scss',
  shadow: true,
})
export class HereView {
  @State() activeMode: ExploreMode = 'strata';
  @State() locationContext: LocationContext = null;
  @State() loading: boolean = true;

  async componentWillLoad() {
    // Attempt Geolocation API; fall back to mock data
    await this.initLocation();
    // Refresh clock every minute
    setInterval(() => {
      if (this.locationContext) {
        this.locationContext = {
          ...this.locationContext,
          localTime: new Date(),
        };
      }
    }, 60_000);
  }

  private async initLocation() {
    try {
      if (typeof window !== 'undefined' && 'geolocation' in navigator) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
        });
        // TODO: reverse-geocode position to get a place name (e.g., via Nominatim or Esri geocoder)
        const now = new Date();
        this.locationContext = {
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Your Location',
          },
          localTime: now,
          weekOfYear: this.getWeekOfYear(now),
        };
      } else {
        this.locationContext = { ...MOCK_LOCATION, localTime: new Date() };
      }
    } catch {
      // Geolocation denied or unavailable — use mock data
      this.locationContext = { ...MOCK_LOCATION, localTime: new Date() };
    }
    this.loading = false;
  }

  private getWeekOfYear(d: Date): number {
    const start = new Date(d.getFullYear(), 0, 1);
    return Math.ceil((d.getTime() - start.getTime()) / (7 * 24 * 60 * 60 * 1000));
  }

  private handleModeChange(e: CustomEvent<ExploreMode>) {
    this.activeMode = e.detail;
  }

  private renderModePanel() {
    switch (this.activeMode) {
      case 'strata':
        return (
          <here-strata
            layers={MOCK_STRATA_LAYERS}
          />
        );

      case 'day':
        return (
          <here-day-wheel
            entities={MOCK_DAY_ENTITIES}
            localTime={this.locationContext?.localTime}
          />
        );

      case 'phenology':
        return (
          <here-phenology-wheel
            entities={MOCK_PHENOLOGY_ENTITIES}
            currentWeek={this.locationContext?.weekOfYear || 1}
          />
        );

      case 'deep-time':
        return (
          <here-deep-time
            eras={MOCK_DEEP_TIME_ERAS}
          />
        );

      default:
        return null;
    }
  }

  render() {
    if (this.loading) {
      return (
        <div class="loading">
          <div class="loading__spinner" aria-label="Loading…"></div>
          <p>Finding your place in the world…</p>
        </div>
      );
    }

    return (
      <div class="here-shell">
        {/* Persistent location header */}
        <location-bar context={this.locationContext} />

        {/* Persistent mode switcher */}
        <here-mode-switcher
          activeMode={this.activeMode}
          onModeChange={this.handleModeChange.bind(this)}
        />

        {/* Mode panel — swaps based on active mode */}
        <main class={`mode-panel mode-panel--${this.activeMode}`} aria-live="polite">
          {this.renderModePanel()}
        </main>
      </div>
    );
  }
}

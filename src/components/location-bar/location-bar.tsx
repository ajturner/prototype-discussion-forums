import { Component, Prop, h } from '@stencil/core';
import { LocationContext } from '../../types';

@Component({
  tag: 'location-bar',
  styleUrl: 'location-bar.scss',
  shadow: true,
})
export class LocationBar {
  /** Full location context including weather and time */
  @Prop() context: LocationContext;

  render() {
    if (!this.context) return null;
    const { location, weather, localTime, weekOfYear } = this.context;
    const timeStr = (localTime || new Date()).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div class="location-bar">
        <div class="place">
          <span class="pin" aria-hidden="true">📍</span>
          <span class="name">{location.name}</span>
          {location.placeName && (
            <span class="subname">&nbsp;·&nbsp;{location.placeName}</span>
          )}
        </div>
        <div class="meta">
          {weather && (
            <span class="weather-item">
              <span aria-hidden="true">{weather.icon}</span>
              <span>{weather.tempC}°C</span>
              <span class="desc">{weather.description}</span>
            </span>
          )}
          <span class="meta-item">
            <span aria-hidden="true">🕐</span>
            <span>{timeStr}</span>
          </span>
          <span class="meta-item">
            <span aria-hidden="true">📅</span>
            <span>Week {weekOfYear}</span>
          </span>
          <span class="coords">
            {location.lat.toFixed(4)}°N, {Math.abs(location.lng).toFixed(4)}°W
          </span>
        </div>
      </div>
    );
  }
}

import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { ExploreMode } from '../../types';

interface ModeOption {
  key: ExploreMode;
  icon: string;
  label: string;
  ariaLabel: string;
}

const MODES: ModeOption[] = [
  { key: 'strata', icon: '≡', label: 'Strata', ariaLabel: 'View by vertical strata layers' },
  { key: 'day', icon: '☉', label: 'Day', ariaLabel: 'View time-of-day activity' },
  { key: 'phenology', icon: '⟳', label: 'Season', ariaLabel: 'View seasonal phenology calendar' },
  { key: 'deep-time', icon: '⏳', label: 'Deep Time', ariaLabel: 'Explore geological deep time' },
];

@Component({
  tag: 'here-mode-switcher',
  styleUrl: 'here-mode-switcher.scss',
  shadow: true,
})
export class HereModeSwitcher {
  /** Currently active mode */
  @Prop() activeMode: ExploreMode = 'strata';

  /** Fired when user selects a different mode */
  @Event() modeChange: EventEmitter<ExploreMode>;

  private handleModeClick(mode: ExploreMode) {
    if (mode !== this.activeMode) {
      this.modeChange.emit(mode);
    }
  }

  render() {
    return (
      <nav class="mode-switcher" role="tablist" aria-label="Exploration modes">
        {MODES.map(m => (
          <button
            key={m.key}
            role="tab"
            class={`mode-btn ${this.activeMode === m.key ? 'mode-btn--active' : ''}`}
            aria-selected={String(this.activeMode === m.key)}
            aria-label={m.ariaLabel}
            onClick={() => this.handleModeClick(m.key)}
          >
            <span class="mode-btn__icon" aria-hidden="true">{m.icon}</span>
            <span class="mode-btn__label">{m.label}</span>
          </button>
        ))}
      </nav>
    );
  }
}

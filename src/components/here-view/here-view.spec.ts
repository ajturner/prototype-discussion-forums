import { newSpecPage } from '@stencil/core/testing';
import { HereView } from './here-view';
import { LocationBar } from '../location-bar/location-bar';
import { HereModeSwitcher } from '../here-mode-switcher/here-mode-switcher';
import { HereStrata } from '../here-strata/here-strata';
import { HereDayWheel } from '../here-day-wheel/here-day-wheel';
import { HerePhenologyWheel } from '../here-phenology-wheel/here-phenology-wheel';
import { HereDeepTime } from '../here-deep-time/here-deep-time';

describe('here-view', () => {
  it('renders the here-view element', async () => {
    const page = await newSpecPage({
      components: [
        HereView,
        LocationBar,
        HereModeSwitcher,
        HereStrata,
        HereDayWheel,
        HerePhenologyWheel,
        HereDeepTime,
      ],
      html: `<here-view></here-view>`,
    });
    expect(page.root).toBeDefined();
  });

  it('contains a location-bar after loading', async () => {
    const page = await newSpecPage({
      components: [
        HereView,
        LocationBar,
        HereModeSwitcher,
        HereStrata,
        HereDayWheel,
        HerePhenologyWheel,
        HereDeepTime,
      ],
      html: `<here-view></here-view>`,
    });
    await page.waitForChanges();
    const locationBar = page.root.shadowRoot.querySelector('location-bar');
    expect(locationBar).not.toBeNull();
  });

  it('contains a mode-switcher after loading', async () => {
    const page = await newSpecPage({
      components: [
        HereView,
        LocationBar,
        HereModeSwitcher,
        HereStrata,
        HereDayWheel,
        HerePhenologyWheel,
        HereDeepTime,
      ],
      html: `<here-view></here-view>`,
    });
    await page.waitForChanges();
    const switcher = page.root.shadowRoot.querySelector('here-mode-switcher');
    expect(switcher).not.toBeNull();
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { HereDayWheel } from './here-day-wheel';
import { Entity } from '../../types';

const mockEntities: Entity[] = [
  {
    id: 'owl',
    commonName: 'Great Horned Owl',
    scientificName: 'Bubo virginianus',
    dayPeakHour: 22,
    dayDurationHours: 6,
  },
  {
    id: 'quail',
    commonName: 'California Quail',
    scientificName: 'Callipepla californica',
    dayPeakHour: 7,
    dayDurationHours: 4,
  },
];

describe('here-day-wheel', () => {
  it('renders without entities', async () => {
    const page = await newSpecPage({
      components: [HereDayWheel],
      html: `<here-day-wheel></here-day-wheel>`,
    });
    expect(page.root).toBeDefined();
  });

  it('renders an SVG element', async () => {
    const page = await newSpecPage({
      components: [HereDayWheel],
      html: `<here-day-wheel></here-day-wheel>`,
    });
    const svg = page.root.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('renders entity rows in the list', async () => {
    const page = await newSpecPage({
      components: [HereDayWheel],
      html: `<here-day-wheel></here-day-wheel>`,
    });
    page.root.entities = mockEntities;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Great Horned Owl');
    expect(page.root.shadowRoot.textContent).toContain('California Quail');
  });
});

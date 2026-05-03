import { newSpecPage } from '@stencil/core/testing';
import { HerePhenologyWheel } from './here-phenology-wheel';
import { Entity } from '../../types';

const mockEntities: Entity[] = [
  {
    id: 'poppy',
    commonName: 'California Poppy',
    scientificName: 'Eschscholzia californica',
    phenologyCategory: 'bloom',
    phenologyPeakWeek: 12,
    phenologyStartWeek: 6,
    phenologyEndWeek: 22,
  },
  {
    id: 'sparrow',
    commonName: 'White-crowned Sparrow',
    scientificName: 'Zonotrichia leucophrys',
    phenologyCategory: 'migration',
    phenologyPeakWeek: 42,
    phenologyStartWeek: 38,
    phenologyEndWeek: 52,
  },
];

describe('here-phenology-wheel', () => {
  it('renders without entities', async () => {
    const page = await newSpecPage({
      components: [HerePhenologyWheel],
      html: `<here-phenology-wheel></here-phenology-wheel>`,
    });
    expect(page.root).toBeDefined();
  });

  it('renders an SVG element', async () => {
    const page = await newSpecPage({
      components: [HerePhenologyWheel],
      html: `<here-phenology-wheel></here-phenology-wheel>`,
    });
    const svg = page.root.shadowRoot.querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('renders category filter pills', async () => {
    const page = await newSpecPage({
      components: [HerePhenologyWheel],
      html: `<here-phenology-wheel></here-phenology-wheel>`,
    });
    const pills = page.root.shadowRoot.querySelectorAll('.filter-pill');
    expect(pills.length).toBe(6);
  });

  it('shows active entities for the current week', async () => {
    const page = await newSpecPage({
      components: [HerePhenologyWheel],
      html: `<here-phenology-wheel></here-phenology-wheel>`,
    });
    page.root.entities = mockEntities;
    page.root.currentWeek = 12;
    await page.waitForChanges();
    // Week 12 is within poppy bloom (6-22)
    expect(page.root.shadowRoot.textContent).toContain('California Poppy');
  });
});

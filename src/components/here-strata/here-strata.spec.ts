import { newSpecPage } from '@stencil/core/testing';
import { HereStrata } from './here-strata';
import { StrataLayer } from '../../types';

const mockLayers: StrataLayer[] = [
  {
    key: 'atmosphere',
    label: 'Atmosphere',
    depthLabel: 'Sky',
    depthM: 100,
    color: '#cce8f4',
    textColor: '#1a3a5c',
    description: 'Sky layer',
    entities: [
      { id: 'hawk', commonName: 'Red-tailed Hawk', scientificName: 'Buteo jamaicensis' },
    ],
  },
  {
    key: 'ground',
    label: 'Ground',
    depthLabel: '0 m',
    depthM: 0,
    color: '#7cb342',
    textColor: '#1b5e20',
    description: 'Ground layer',
    entities: [
      { id: 'poppy', commonName: 'California Poppy', scientificName: 'Eschscholzia californica' },
    ],
  },
];

describe('here-strata', () => {
  it('renders without layers', async () => {
    const page = await newSpecPage({
      components: [HereStrata],
      html: `<here-strata></here-strata>`,
    });
    expect(page.root).toBeDefined();
    expect(page.root.shadowRoot.textContent).toContain('No strata data');
  });

  it('renders layer labels', async () => {
    const page = await newSpecPage({
      components: [HereStrata],
      html: `<here-strata></here-strata>`,
    });
    page.root.layers = mockLayers;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Atmosphere');
    expect(page.root.shadowRoot.textContent).toContain('Ground');
  });

  it('renders entity chips within a layer', async () => {
    const page = await newSpecPage({
      components: [HereStrata],
      html: `<here-strata></here-strata>`,
    });
    page.root.layers = mockLayers;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Red-tailed Hawk');
  });
});

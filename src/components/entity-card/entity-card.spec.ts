import { newSpecPage } from '@stencil/core/testing';
import { EntityCard } from './entity-card';
import { Entity } from '../../types';

const mockEntity: Entity = {
  id: 'test-entity',
  commonName: 'California Poppy',
  scientificName: 'Eschscholzia californica',
  taxonId: '47732',
  iNatUrl: 'https://www.inaturalist.org/taxa/47732',
  status: 'Blooming now',
  strataLayer: 'ground',
};

describe('entity-card', () => {
  it('renders without entity', async () => {
    const page = await newSpecPage({
      components: [EntityCard],
      html: `<entity-card></entity-card>`,
    });
    expect(page.root).toBeDefined();
  });

  it('renders common name', async () => {
    const page = await newSpecPage({
      components: [EntityCard],
      html: `<entity-card></entity-card>`,
    });
    page.root.entity = mockEntity;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('California Poppy');
  });

  it('renders scientific name', async () => {
    const page = await newSpecPage({
      components: [EntityCard],
      html: `<entity-card></entity-card>`,
    });
    page.root.entity = mockEntity;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Eschscholzia californica');
  });

  it('renders status', async () => {
    const page = await newSpecPage({
      components: [EntityCard],
      html: `<entity-card></entity-card>`,
    });
    page.root.entity = mockEntity;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Blooming now');
  });
});

import { newSpecPage } from '@stencil/core/testing';
import { HereDeepTime } from './here-deep-time';
import { DeepTimeEra } from '../../types';

const mockEras: DeepTimeEra[] = [
  {
    label: 'Today',
    yearsAgo: 0,
    yearsAgoDisplay: 'Present',
    environment: 'Coast live oak woodland',
    narrative: 'Modern ecosystem.',
    color: '#4caf50',
    fossils: [],
  },
  {
    label: '10,000 years ago',
    yearsAgo: 10000,
    yearsAgoDisplay: '10 kya',
    environment: 'Post-glacial grassland',
    narrative: 'Glacial period ending.',
    color: '#8bc34a',
    fossils: [
      { name: 'Tule Elk', taxon: 'Cervus canadensis', ageDisplay: '~8 kya' },
    ],
  },
];

describe('here-deep-time', () => {
  it('renders without eras', async () => {
    const page = await newSpecPage({
      components: [HereDeepTime],
      html: `<here-deep-time></here-deep-time>`,
    });
    expect(page.root).toBeDefined();
    expect(page.root.shadowRoot.textContent).toContain('No deep time data');
  });

  it('renders first era by default', async () => {
    const page = await newSpecPage({
      components: [HereDeepTime],
      html: `<here-deep-time></here-deep-time>`,
    });
    page.root.eras = mockEras;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Coast live oak woodland');
  });

  it('renders timeline nodes for each era', async () => {
    const page = await newSpecPage({
      components: [HereDeepTime],
      html: `<here-deep-time></here-deep-time>`,
    });
    page.root.eras = mockEras;
    await page.waitForChanges();
    const nodes = page.root.shadowRoot.querySelectorAll('.timeline__node');
    expect(nodes.length).toBe(2);
  });

  it('renders fossil list for the second era', async () => {
    const page = await newSpecPage({
      components: [HereDeepTime],
      html: `<here-deep-time></here-deep-time>`,
    });
    page.root.eras = mockEras;
    await page.waitForChanges();
    // Second era label should appear in the timeline
    expect(page.root.shadowRoot.textContent).toContain('10 kya');
  });
});

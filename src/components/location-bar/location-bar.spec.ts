import { newSpecPage } from '@stencil/core/testing';
import { LocationBar } from './location-bar';
import { LocationContext } from '../../types';

const mockContext: LocationContext = {
  location: { lat: 37.56, lng: -122.06, name: 'Test Park', placeName: 'Test City, CA' },
  weather: { tempC: 16, description: 'Sunny', icon: '☀️' },
  localTime: new Date('2024-05-01T14:00:00'),
  weekOfYear: 18,
};

describe('location-bar', () => {
  it('renders without context', async () => {
    const page = await newSpecPage({
      components: [LocationBar],
      html: `<location-bar></location-bar>`,
    });
    expect(page.root).toBeDefined();
  });

  it('renders location name when context provided', async () => {
    const page = await newSpecPage({
      components: [LocationBar],
      html: `<location-bar></location-bar>`,
    });
    page.root.context = mockContext;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Test Park');
  });

  it('renders week number', async () => {
    const page = await newSpecPage({
      components: [LocationBar],
      html: `<location-bar></location-bar>`,
    });
    page.root.context = mockContext;
    await page.waitForChanges();
    expect(page.root.shadowRoot.textContent).toContain('Week 18');
  });
});

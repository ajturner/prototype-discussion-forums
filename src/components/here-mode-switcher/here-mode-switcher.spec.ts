import { newSpecPage } from '@stencil/core/testing';
import { HereModeSwitcher } from './here-mode-switcher';

describe('here-mode-switcher', () => {
  it('renders all four mode buttons', async () => {
    const page = await newSpecPage({
      components: [HereModeSwitcher],
      html: `<here-mode-switcher></here-mode-switcher>`,
    });
    const buttons = page.root.shadowRoot.querySelectorAll('.mode-btn');
    expect(buttons.length).toBe(4);
  });

  it('marks the active mode', async () => {
    const page = await newSpecPage({
      components: [HereModeSwitcher],
      html: `<here-mode-switcher active-mode="day"></here-mode-switcher>`,
    });
    const active = page.root.shadowRoot.querySelector('.mode-btn--active');
    expect(active).toBeDefined();
    expect(active.textContent).toContain('Day');
  });

  it('defaults to strata mode', async () => {
    const page = await newSpecPage({
      components: [HereModeSwitcher],
      html: `<here-mode-switcher></here-mode-switcher>`,
    });
    const active = page.root.shadowRoot.querySelector('.mode-btn--active');
    expect(active.textContent).toContain('Strata');
  });
});

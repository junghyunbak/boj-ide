import App from '@/renderer/App';
import { render } from '@testing-library/react';

beforeEach(() => {
  const tourPortalRoot = document.createElement('div');
  tourPortalRoot.id = 'tour';
  document.body.appendChild(tourPortalRoot);

  const afterImagePortalRoot = document.createElement('div');
  afterImagePortalRoot.id = 'after-image';
  document.body.appendChild(afterImagePortalRoot);

  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  window.getComputedStyle = jest.fn();

  window.electron = {
    ipcRenderer: {
      once(channel, func) {},
      on(channel, listener) {
        return () => {};
      },
      sendMessage(channel, message) {},
      invoke(channel, message) {
        return Promise.resolve(null);
      },
    },
  };
});

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });
});

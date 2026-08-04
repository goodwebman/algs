import '@testing-library/jest-dom/vitest';

// jsdom не реализует matchMedia, а на него завязаны хуки, уважающие
// prefers-reduced-motion. Без заглушки падает любой рендер плеера.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

// jsdom не реализует scrollIntoView — на нём завязана синхронизация листинга
// с текущим шагом плеера.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

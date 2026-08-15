// Jest setup: mock native AsyncStorage for tests
jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(() => Promise.resolve(null)),
      setItem: jest.fn(() => Promise.resolve()),
      removeItem: jest.fn(() => Promise.resolve()),
      multiGet: jest.fn(() => Promise.resolve([])),
      multiSet: jest.fn(() => Promise.resolve()),
      clear: jest.fn(() => Promise.resolve()),
    },
  };
});

// Provide a minimal global.fetch mock so tests can override it per-suite
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({}) }));
}

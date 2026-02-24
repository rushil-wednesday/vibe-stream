jest.doMock('ioredis', () =>
  jest.fn().mockImplementation(() => ({
    publish: () => ({}),
    set: (msg) => JSON.stringify({ msg }),
    get: (msg) => JSON.stringify({ msg })
  }))
);

process.env.ENVIRONMENT_NAME = 'test';
process.env.GRAPHQL_INTERNAL_SECRET = 'test-secret';

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.resetModules();
});

module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'tests/coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'ts', 'vue'],
  roots: ['<rootDir>/src/', '<rootDir>/tests/'],
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/*.spec.ts'],
}

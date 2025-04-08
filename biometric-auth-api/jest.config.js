module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/backup/'], // Ignore unnecessary directories
  transform: {
    '^.+\\.ts$': 'ts-jest', // Use ts-jest to transform TypeScript files
  },
};
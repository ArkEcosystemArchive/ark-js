module.exports = {
  verbose: true,
  testMatch: [
    '**/__tests__/api/**/*.spec.js',
    '**/__tests__/builder/**/*.spec.js',
    '**/__tests__/crypto/integration/**/*.spec.js',
    '**/__tests__/crypto/crypto.spec.js',
    '**/__tests__/crypto/ecdsa.spec.js',
    '**/__tests__/crypto/ecpair.spec.js',
    '**/__tests__/crypto/ecsignature.spec.js',
    '**/__tests__/crypto/hdnode.spec.js',
    '**/__tests__/crypto/slots.spec.js',
    '**/__tests__/managers/**/*.spec.js',
    '**/__tests__/models/**/*.spec.js',
    '**/__tests__/utils/**/*.spec.js',
    '**/__tests__/*.spec.js'
  ],
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
  },
  coverageDirectory: '<rootDir>/.coverage',
  collectCoverageFrom: [
    'src/**/*.js}',
    '!**/node_modules/**'
  ],
  watchman: false,
  setupFiles: ['<rootDir>/node_modules/regenerator-runtime/runtime'],
  setupTestFrameworkScriptFile: 'jest-extended'
}

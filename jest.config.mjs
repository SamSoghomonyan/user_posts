// export default {
//     preset: 'ts-jest/presets/default-esm',
//     testEnvironment: 'node',
//     extensionsToTreatAsEsm: ['.ts'],
//     transform: {
//         '^.+\\.ts$': ['ts-jest', {}],
//     },
//     moduleNameMapper: {
//         '^(\\.{1,2}/.*)\\.js$': '$1',
//     },
// };

// jest.config.js
export default {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/dist/tests/**/*.js'],
    transform: {}, // No transform for JS
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // Fix .js path issues
    },
};

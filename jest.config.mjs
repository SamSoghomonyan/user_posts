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

export default {
    testEnvironment: 'node',
    testMatch:['**/*.test.js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // fix for relative imports
    },
};

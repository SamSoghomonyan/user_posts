export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {}], // ✅ modern way to pass config
    },
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1', // ✅ fix .js import issue
    },
};

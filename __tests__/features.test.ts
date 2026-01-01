import { getFeature, features } from '../src/features';

describe('Features', () => {
    test('has available features', () => {
        const featureList = Object.values(features);
        expect(featureList.length).toBeGreaterThan(0);
    });

    test('gets feature by name', () => {
        const authFeature = getFeature('auth');
        expect(authFeature).toBeDefined();
        expect(authFeature?.name).toBe('auth');
    });

    test('returns undefined for non-existent feature', () => {
        const feature = getFeature('non-existent-feature');
        expect(feature).toBeUndefined();
    });

    test('all features have required properties', () => {
        const featureList = Object.values(features);

        featureList.forEach(feature => {
            expect(feature.name).toBeDefined();
            expect(feature.displayName).toBeDefined();
            expect(feature.description).toBeDefined();
            expect(Array.isArray(feature.dependencies)).toBe(true);
            expect(Array.isArray(feature.files)).toBe(true);
        });
    });

    test('feature names match object keys', () => {
        Object.entries(features).forEach(([key, feature]) => {
            expect(feature.name).toBe(key);
        });
    });
});

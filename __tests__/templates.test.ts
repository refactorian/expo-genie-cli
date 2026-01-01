import { discoverTemplates, getTemplate, getTemplatesByCategory } from '../src/templates';

describe('Template Discovery', () => {
    test('discovers all templates', () => {
        const templates = discoverTemplates();
        expect(templates.length).toBeGreaterThan(0);
    });

    test('finds official templates', () => {
        const officialTemplates = getTemplatesByCategory('official');
        expect(officialTemplates.length).toBeGreaterThan(0);

        const templateNames = officialTemplates.map(t => t.name);
        expect(templateNames).toContain('default');
        expect(templateNames).toContain('tabs');
        expect(templateNames).toContain('blank');
        expect(templateNames).toContain('blank-typescript');
        expect(templateNames).toContain('bare-minimum');
    });

    test('gets template by name', () => {
        const defaultTemplate = getTemplate('default');
        expect(defaultTemplate).toBeDefined();
        expect(defaultTemplate?.name).toBe('default');
        expect(defaultTemplate?.category).toBe('official');
    });

    test('returns undefined for non-existent template', () => {
        const template = getTemplate('non-existent-template');
        expect(template).toBeUndefined();
    });

    test('all templates have required properties', () => {
        const templates = discoverTemplates();

        templates.forEach(template => {
            expect(template.name).toBeDefined();
            expect(template.displayName).toBeDefined();
            expect(template.description).toBeDefined();
            expect(template.category).toBeDefined();
            expect(template.features).toBeDefined();
            expect(template.complexity).toBeDefined();
            expect(['beginner', 'intermediate', 'advanced']).toContain(template.complexity);
        });
    });
});

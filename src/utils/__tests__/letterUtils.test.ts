import { HebrewLetterGenerator, WeightedNikud } from '../letterUtils';

describe('getNextChar', () => {
    test('returns a valid Hebrew character with Nikud', () => {
        const result = HebrewLetterGenerator.generateNextCharacter();
        expect(result.charector.length).toBeGreaterThan(1); // At least one character + one nikud
        expect(/[\u0590-\u05FF]+/.test(result.charector)).toBeTruthy(); // Contains Hebrew characters
    });

    test('respects weighted Nikud distribution', () => {
        const weights = {
            "Hiriq": 1,
        };

        // Run multiple times to check distribution
        const samples = 100;
        const results = Array.from({ length: samples }, () => HebrewLetterGenerator.generateNextCharacter(weights));
        
        // Count Hiriq and Patah occurrences
        const hiriqCount = results.filter(char => char.charector.includes('ִ')).length;

        // Hiriq should appear more frequently than Patah
        expect(hiriqCount).toEqual(results.length);
    });

    test('respects weighted Nikud distribution', () => {
        const weights = {
            "Hiriq": 3,
            "Patah": 1
        };

        // Run multiple times to check distribution
        const samples = 100;
        const results = Array.from({ length: samples }, () => HebrewLetterGenerator.generateNextCharacter(weights));
        
        // Count Hiriq and Patah occurrences
        const hiriqCount = results.filter(char => char.charector.includes('ִ')).length;
        const patahCount = results.filter(char => char.charector.includes('ַ')).length;

        // Hiriq should appear more frequently than Patah
        expect(hiriqCount).toBeGreaterThan(patahCount);
    });

    test('handles special cases - Shin/Sin', () => {
        // Run multiple times to ensure we get both variations
        const samples = 100;
        const results = Array.from({ length: samples }, () => HebrewLetterGenerator.generateNextCharacter());
        
        const hasShin = results.some(char => char.charector.includes('שׁ'));
        const hasSin = results.some(char => char.charector.includes('שׂ'));

        expect(hasShin || hasSin).toBeTruthy();
    });

    test('handles special cases - Dagesh', () => {
        const samples = 100;
        const results = Array.from({ length: samples }, () => HebrewLetterGenerator.generateNextCharacter());
        
        // Check for characters with dagesh
        const hasDagesh = results.some(char => 
            char.charector.includes('בּ') || char.charector.includes('כּ') || 
            char.charector.includes('פּ') || char.charector.includes('תּ')
        );

        expect(hasDagesh).toBeTruthy();
    });

    test('handles special cases - Full Holam and Shuruk', () => {
        const samples = 100;
        const results = Array.from({ length: samples }, () => HebrewLetterGenerator.generateNextCharacter());
        
        const hasFullHolam = results.some(char => char.charector.includes('וֹ'));
        const hasShuruk = results.some(char => char.charector.includes('וּ'));

        expect(hasFullHolam || hasShuruk).toBeTruthy();
    });
});
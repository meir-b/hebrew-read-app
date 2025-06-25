export interface Letter {
    character: string;
    nikud: string;
}

export interface Nikud {
    name: string;
    symbol: string;
} 

export interface AssessmentResult {
    letter: Letter;
    pronunciationCorrect: boolean;
    timestamp: Date;
}

export interface GameLevel {
    id: string;
    name: string;
    description: string;
    icon: string;
    letters: string[];
    nikudTypes: string[];
    orderedNikudTypes?: string[][]; // For levels requiring specific nikud order per position
    syllableTypes: 'single' | 'double' | 'triple' | 'mixed';
    isUnlocked: boolean;
    completionRequirement: number; // number of correct answers needed to complete
    completed: boolean;
    isRandomOrder?: boolean; // true for random nikud order, false for specific order
    fixedFirstChar?: string; // For levels with a fixed first character
    generateAllCombinations?: boolean; // For levels that generate all possible combinations
}

export interface LevelProgress {
    levelId: string;
    correctAnswers: number;
    totalAnswers: number;
    isCompleted: boolean;
    unlocked: boolean;
    completedCombinations?: Set<string>; // For tracking completed combinations in generateAllCombinations levels
    currentCombinationIndex?: number; // For cycling through all combinations systematically
}

export interface SyllableConfig {
    vowelCount: number;
    allowedVowels: string[];
    orderedVowels?: string[][]; // For specific ordering: [[first_char_vowels], [second_char_vowels], ...]
    letterRange: string[];
    includeSheva: boolean;
    includeDagesh: boolean;
    isRandomOrder: boolean; // true for random nikud selection, false for ordered
    fixedFirstChar?: string; // For levels with a fixed first character
    generateAllCombinations?: boolean; // For levels that generate all possible combinations
}

export interface CombinationSpec {
    letter1: string;
    letter2: string;
    nikud1: string;
    nikud2: string;
}

export interface CombinationGenerator {
    getAllCombinations(config: SyllableConfig): CombinationSpec[];
    getNextCombination(config: SyllableConfig, currentIndex: number): CombinationSpec | null;
}
import { GameLevel, LevelProgress, SyllableConfig } from '../types/index.js';



export const livelyEmojis: string[] = [
  "😄", // grinning face with smiling eyes
  "🎉", // party popper
  "🤩", // star-struck
  "🥳", // partying face
  "🙌", // raising hands
  "💃", // dancing woman
  "🕺", // dancing man
  "✨", // sparkles
  "🚀", // rocket
  "🍕", // pizza
  "🎈", // balloon
  "🎵", // musical note
  "😂", // face with tears of joy
  "🌈", // rainbow
  "🔥", // fire
  "⚡", // high voltage
  "🐱", // cat face
  "🎮", // video game
  "🏖️", // beach with umbrella
  "🍦"  // soft ice cream
];


// Input should be:
//  1. id
//  2. nikudTypes
//  3. nikudOrder
// From this input, generate the proper name ( 'שתי תנועות פתוחות עם ...')
// From this input, generate the proper description ( 'תרגול ממוקד עם ...',)
function GenerateStractureForOrderedNikudTypes(id: string, nikudTypes: string[], nikudOrder:  string[][]): GameLevel {
           const hebrewNikudNames = nikudTypes.map(getNikudHebrewName);
           return {
            id: id,
            name: 'שתי תנועות פתוחות עם ' + hebrewNikudNames.join(' ו'),
            description: 'תרגול ממוקד עם ' + hebrewNikudNames.join(' ו'),
            icon: livelyEmojis[Math.floor(Math.random() * livelyEmojis.length)], // choose random emoji from livelyEmojis
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: nikudTypes,
            orderedNikudTypes: nikudOrder, // First char must be Qamats, second must be Patah
            syllableTypes: 'double',
            isUnlocked: true,
            completionRequirement: 15,
            completed: false,
            isRandomOrder: false
        };
}

function GenerateStractureForRandomNikudTypes(
    id: string, 
    nikudTypes: string[], 
    nikudOrder: string[][], 
    repetitions: number,
    options?: {
        fixedFirstChar?: string,      // Optional: specify a fixed first character (e.g., 'א')
        generateAllCombinations?: boolean  // Optional: if true, generate all possible combinations instead of random
    }
): GameLevel {
    const hebrewNikudNames = nikudTypes.map(getNikudHebrewName);
    
    // Calculate completion requirement based on whether we're generating all combinations
    let completionRequirement = repetitions;
    if (options?.generateAllCombinations) {
        // If generating all combinations, calculate the total number of possible combinations
        const firstCharOptions = options.fixedFirstChar ? 1 : 23; // 23 Hebrew letters if not fixed
        const secondCharOptions = 23; // Always 23 for second char
        const firstNikudOptions = nikudTypes.length;
        const secondNikudOptions = nikudTypes.length;
        completionRequirement = firstCharOptions * secondCharOptions * firstNikudOptions * secondNikudOptions;
    }
    
    return {
        id: id,
        name: 'שתי תנועות פתוחות עם ' + hebrewNikudNames.join(' ו'),
        description: 'תרגול ממוקד עם ' + hebrewNikudNames.join(' ו') + 
                    (options?.fixedFirstChar ? ` (תמיד מתחיל ב-${options.fixedFirstChar})` : '') +
                    (options?.generateAllCombinations ? ' (כל השילובים)' : ''),
        icon: livelyEmojis[Math.floor(Math.random() * livelyEmojis.length)], // choose random emoji from livelyEmojis
        letters: options?.fixedFirstChar ? 
                [options.fixedFirstChar] : 
                ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
        nikudTypes: nikudTypes,
        orderedNikudTypes: nikudOrder,
        syllableTypes: 'double',
        isUnlocked: true,
        completionRequirement: completionRequirement,
        completed: false,
        isRandomOrder: !options?.generateAllCombinations, // If generating all combinations, it's not random
        // Add custom properties for the enhanced functionality
        ...(options?.fixedFirstChar && { fixedFirstChar: options.fixedFirstChar }),
        ...(options?.generateAllCombinations && { generateAllCombinations: true })
    };
}

// Helper function to convert nikud type names to Hebrew display names
function getNikudHebrewName(nikudType: string): string {
    const nikudHebrewNames: { [key: string]: string } = {
        'Qamats': 'קמץ',
        'Patah': 'פתח',
        'Tsere': 'צירה',
        'Segol': 'סגול',
        'Hiriq': 'חיריק',
        'Holam': 'חולם',
        'FullHolam': 'חולם מלא',
        'Kubutz': 'קובוץ',
        'Sheva': 'שווא',
        'FullShuruk': 'שורוק',
        'Shuruk': 'שורוק'
    };
    
    return nikudHebrewNames[nikudType] || nikudType;
}

export class LevelManager {
    private currentLevel: string = 'level-1';
    private levelProgress: Map<string, LevelProgress> = new Map();
    
    private readonly levels: GameLevel[] = [
        {
            id: 'level-1',
            name: 'קריאה עם אותיות א-ב ודגש',
            description: 'הבחנה בין ניקוד (ניקוד) באמצעות אותיות א-ב',
            icon: '🅰️',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Qamats', 'Patah', 'Tsere', 'Segol', 'FullHolam', 'Holam', 'Hiriq', 'Kubutz', 'FullShuruk'],
            syllableTypes: 'single',
            isUnlocked: true,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },

        // Current learning path:
        GenerateStractureForOrderedNikudTypes('level-2-qamats-qamats', ['Qamats'], [['Qamats'], ['Qamats']]),
        GenerateStractureForOrderedNikudTypes('level-2-qamats-patah', ['Qamats', 'Patah'], [['Qamats'], ['Patah']]),
        GenerateStractureForOrderedNikudTypes('level-2-patah-tsere', ['Patah', 'Tsere'], [['Patah'], ['Tsere']]),
        GenerateStractureForOrderedNikudTypes('level-2-qamats-segol', ['Qamats', 'Segol'], [['Qamats'], ['Segol']]),
        GenerateStractureForOrderedNikudTypes('level-2-patah-holam', ['Patah', 'FullHolam'], [['Patah'], ['FullHolam']]),
        GenerateStractureForOrderedNikudTypes('level-2-patah-hiriq', ['Patah', 'Hiriq'], [['Patah'], ['Hiriq']]),
        GenerateStractureForOrderedNikudTypes('level-2-segol-hiriq', ['Segol', 'Hiriq'], [['Segol'], ['Hiriq']]),
        GenerateStractureForOrderedNikudTypes('level-2-patah-kubutz', ['Patah', 'Kubutz'], [['Patah'], ['Kubutz']]),
        GenerateStractureForOrderedNikudTypes('level-2-holam-kubutz', ['FullHolam', 'Kubutz'], [['FullHolam'], ['Kubutz']]),
        GenerateStractureForOrderedNikudTypes('level-2-patah-shuruk', ['Patah', 'FullShuruk'], [['Patah'], ['FullShuruk']]),

        // hazara
        GenerateStractureForRandomNikudTypes('level-2-hazara-qamats-patah-tsere', ['Qamats', 'Patah', 'Tsere'], [['Qamats', 'Patah', 'Tsere'], ['Qamats', 'Patah', 'Tsere'], ['Qamats', 'Patah', 'Tsere']], 80),
        GenerateStractureForRandomNikudTypes('level-2-hazara-patah-segol-holam', ['Patah', 'Segol', 'FullHolam'], [['Patah', 'Segol', 'FullHolam'], ['Patah', 'Segol', 'FullHolam'], ['Patah', 'Segol', 'FullHolam']], 80),
        GenerateStractureForRandomNikudTypes('level-2-hazara-tsere-hiriq-kubutz', ['Tsere', 'Hiriq', 'Kubutz'], [['Tsere', 'Hiriq', 'Kubutz'], ['Tsere', 'Hiriq', 'Kubutz'], ['Tsere', 'Hiriq', 'Kubutz']], 80),
        GenerateStractureForRandomNikudTypes('level-2-hazara-segol-holam-hiriq-kubutz-shuruk', ['Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], [['Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], ['Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], ['Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk']], 80),
        GenerateStractureForRandomNikudTypes('level-2-hazara-all-nikud', ['Qamats', 'Patah', 'Tsere', 'Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], [['Qamats', 'Patah', 'Tsere', 'Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], ['Qamats', 'Patah', 'Tsere', 'Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk'], ['Qamats', 'Patah', 'Tsere', 'Segol', 'FullHolam', 'Hiriq', 'Kubutz', 'FullShuruk']], 80),


        /*


        {
            id: 'level-1-combined',
            name: 'שילוב ניקוד פתוח ושקט',
            description: 'התחלת שילוב ניקוד פתוח ושקט עם א-ב',
            icon: '🔗',
            letters: ['א', 'ב'],
            nikudTypes: ['Patah', 'Qamats', 'Hiriq', 'Tsere', 'Segol', 'Sheva'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 25,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-basic',
            name: 'קריאת כל האותיות עם ניקוד פתוח',
            description: 'בניית הברות משני ניקודים פתוחים',
            icon: '📖',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'Qamats', 'Hiriq', 'Tsere', 'Segol'],
            syllableTypes: 'single',
            isUnlocked: false,
            completionRequirement: 30,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-double-qamats',
            name: 'שני ניקודים פתוחים - קמץ',
            description: 'שני ניקודים פתוחים עם קמץ',
            icon: '🎯',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Qamats'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-qamats-patah',
            name: 'קמץ ופתח',
            description: 'שני ניקודים פתוחים עם קמץ ראשון ופתח שני',
            icon: '🎨',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Qamats', 'Patah'],
            orderedNikudTypes: [['Qamats'], ['Patah']], // First position: Qamats, Second position: Patah
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: false
        },
        {
            id: 'level-2-qamats-patah-random',
            name: 'קמץ ופתח - חופשי',
            description: 'שני ניקודים פתוחים עם קמץ ופתח בסדר אקראי',
            icon: '🎲',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Qamats', 'Patah'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-patah-tsere',
            name: 'פתח וצירה',
            description: 'שני ניקודים פתוחים עם פתח וצירה',
            icon: '🌟',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'Tsere'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-qamats-segol',
            name: 'קמץ וסגול',
            description: 'שני ניקודים פתוחים עם קמץ וסגול',
            icon: '💜',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Qamats', 'Segol'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-patah-holam',
            name: 'פתח וחולם',
            description: 'שני ניקודים פתוחים עם פתח וחולם',
            icon: '🔵',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'FullHolam'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-patah-hiriq',
            name: 'פתח וחיריק',
            description: 'שני ניקודים פתוחים עם פתח וחיריק',
            icon: '🟡',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'Hiriq'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-segol-hiriq',
            name: 'סגול וחיריק',
            description: 'שני ניקודים פתוחים עם סגול וחיריק',
            icon: '🟢',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Segol', 'Hiriq'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-patah-kubutz',
            name: 'פתח וקובוץ',
            description: 'שני ניקודים פתוחים עם פתח וקובוץ',
            icon: '🔴',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'Kubutz'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-holam-kubutz',
            name: 'חולם וקובוץ',
            description: 'שני ניקודים פתוחים עם חולם וקובוץ',
            icon: '🟣',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Holam', 'Kubutz'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-patah-shuruk',
            name: 'פתח ושורוק',
            description: 'שני ניקודים פתוחים עם פתח ושורוק',
            icon: '🌈',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'FullShuruk'],
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-2-review',
            name: 'חזרה על ניקוד פתוח',
            description: 'חזרה על ניקוד פתוח מאותיות א עד ת עם שילובים שונים',
            icon: '📚',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
            nikudTypes: ['Patah', 'Qamats', 'Hiriq', 'Tsere', 'Segol', 'Holam', 'Kubutz', 'FullShuruk'],
            syllableTypes: 'mixed',
            isUnlocked: false,
            completionRequirement: 50,
            completed: false,
            isRandomOrder: true
        },
        {
            id: 'level-3-ordered-pattern-1',
            name: 'דפוס מוגדר - קמץ ואחר כן פתח',
            description: 'תרגול דפוס קבוע: תמיד קמץ ראשון ופתח שני',
            icon: '🎯',
            letters: ['א', 'ב', 'ג', 'ד', 'ה'],
            nikudTypes: ['Qamats', 'Patah'],
            orderedNikudTypes: [['Qamats'], ['Patah']], // Position 1: always Qamats, Position 2: always Patah
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 15,
            completed: false,
            isRandomOrder: false
        },
        {
            id: 'level-3-ordered-pattern-2',
            name: 'דפוס מוגדר - צירה ואחר כן סגול או חיריק',
            description: 'תרגול דפוס: תמיד צירה ראשון, במקום השני סגול או חיריק',
            icon: '🎪',
            letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו'],
            nikudTypes: ['Tsere', 'Segol', 'Hiriq'],
            orderedNikudTypes: [['Tsere'], ['Segol', 'Hiriq']], // Position 1: always Tsere, Position 2: Segol or Hiriq
            syllableTypes: 'double',
            isUnlocked: false,
            completionRequirement: 20,
            completed: false,
            isRandomOrder: false
        },
        {
            id: 'level-3-triple-ordered',
            name: 'שלושה ניקודים - דפוס מוגדר',
            description: 'שלושה ניקודים בדפוס: קמץ-פתח-חיריק',
            icon: '🎭',
            letters: ['א', 'ב', 'ג', 'ד'],
            nikudTypes: ['Qamats', 'Patah', 'Hiriq'],
            orderedNikudTypes: [['Qamats'], ['Patah'], ['Hiriq']], // Fixed pattern: Qamats-Patah-Hiriq
            syllableTypes: 'triple',
            isUnlocked: false,
            completionRequirement: 25,
            completed: false,
            isRandomOrder: false
        }*/
    ];

    constructor() {
        this.loadProgress();
        this.initializeLevelProgress();
    }

    private initializeLevelProgress(): void {
        this.levels.forEach(level => {
            if (!this.levelProgress.has(level.id)) {
                this.levelProgress.set(level.id, {
                    levelId: level.id,
                    correctAnswers: 0,
                    totalAnswers: 0,
                    isCompleted: false,
                    unlocked: level.isUnlocked
                });
            }
        });
    }

    public getCurrentLevel(): GameLevel | null {
        return this.levels.find(level => level.id === this.currentLevel) || null;
    }

    public getLevelById(levelId: string): GameLevel | null {
        return this.levels.find(level => level.id === levelId) || null;
    }

    public getAllLevels(): GameLevel[] {
        return [...this.levels];
    }

    public getUnlockedLevels(): GameLevel[] {
        return this.levels.filter(level => {
            const progress = this.levelProgress.get(level.id);
            return progress?.unlocked || level.isUnlocked;
        });
    }

    public setCurrentLevel(levelId: string): boolean {
        const level = this.getLevelById(levelId);
        const progress = this.levelProgress.get(levelId);
        
        if (level && (progress?.unlocked || level.isUnlocked)) {
            this.currentLevel = levelId;
            this.saveProgress();
            return true;
        }
        return false;
    }

    public recordAnswer(isCorrect: boolean): { levelCompleted: boolean; autoAdvanced: boolean } {
        const progress = this.levelProgress.get(this.currentLevel);
        if (!progress) return { levelCompleted: false, autoAdvanced: false };

        progress.totalAnswers++;
        if (isCorrect) {
            progress.correctAnswers++;
        }

        const level = this.getLevelById(this.currentLevel);
        if (level && progress.correctAnswers >= level.completionRequirement) {
            progress.isCompleted = true;
            this.unlockNextLevel();
            
            // Automatic level progression
            const autoAdvanced = this.autoAdvanceToNextLevel();
            this.saveProgress();
            
            return { levelCompleted: true, autoAdvanced };
        }

        this.saveProgress();
        return { levelCompleted: false, autoAdvanced: false };
    }

    private autoAdvanceToNextLevel(): boolean {
        const currentIndex = this.levels.findIndex(level => level.id === this.currentLevel);
        if (currentIndex !== -1 && currentIndex < this.levels.length - 1) {
            const nextLevel = this.levels[currentIndex + 1];
            const nextProgress = this.levelProgress.get(nextLevel.id);
            if (nextProgress && nextProgress.unlocked) {
                this.currentLevel = nextLevel.id;
                return true;
            }
        }
        return false;
    }

    private unlockNextLevel(): void {
        const currentIndex = this.levels.findIndex(level => level.id === this.currentLevel);
        if (currentIndex !== -1 && currentIndex < this.levels.length - 1) {
            const nextLevel = this.levels[currentIndex + 1];
            const nextProgress = this.levelProgress.get(nextLevel.id);
            if (nextProgress) {
                nextProgress.unlocked = true;
            }
        }
    }

    public getLevelProgress(levelId: string): LevelProgress | null {
        return this.levelProgress.get(levelId) || null;
    }

    public getCurrentLevelProgress(): LevelProgress | null {
        return this.levelProgress.get(this.currentLevel) || null;
    }

    public getLevelConfig(): SyllableConfig {
        const level = this.getCurrentLevel();
        if (!level) {
            return {
                vowelCount: 1,
                allowedVowels: ['Patah', 'Qamats', 'Hiriq'],
                letterRange: ['א', 'ב'],
                includeSheva: false,
                includeDagesh: false,
                isRandomOrder: true
            };
        }

        return {
            vowelCount: level.syllableTypes === 'single' ? 1 : 
                       level.syllableTypes === 'double' ? 2 : 
                       level.syllableTypes === 'triple' ? 3 : Math.floor(Math.random() * 3) + 1,
            allowedVowels: level.nikudTypes,
            orderedVowels: level.orderedNikudTypes,
            letterRange: level.letters,
            includeSheva: level.nikudTypes.includes('Sheva'),
            includeDagesh: level.letters.includes('ב') || level.letters.includes('כ') || level.letters.includes('פ') || level.letters.includes('ת'),
            isRandomOrder: level.isRandomOrder ?? true, // Default to random if not specified
            fixedFirstChar: level.fixedFirstChar, // Pass the fixed first character if specified
            generateAllCombinations: level.generateAllCombinations // Pass the all combinations flag
        };
    }

    private saveProgress(): void {
        const progressData = Object.fromEntries(this.levelProgress);
        localStorage.setItem('hebrewGameLevelProgress', JSON.stringify({
            currentLevel: this.currentLevel,
            progress: progressData
        }));
    }

    private loadProgress(): void {
        try {
            const saved = localStorage.getItem('hebrewGameLevelProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLevel = data.currentLevel || 'level-1';
                
                if (data.progress) {
                    Object.entries(data.progress).forEach(([levelId, progress]) => {
                        this.levelProgress.set(levelId, progress as LevelProgress);
                    });
                }
            }
        } catch (error) {
            console.error('Failed to load level progress:', error);
        }
    }

    public resetProgress(): void {
        this.levelProgress.clear();
        this.currentLevel = 'level-1';
        this.initializeLevelProgress();
        this.saveProgress();
    }

    public clearCurrentLevelProgress(): void {
        const progress = this.levelProgress.get(this.currentLevel);
        if (progress) {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
            this.saveProgress();
        }
    }

    public clearLevelProgress(levelId: string): void {
        const progress = this.levelProgress.get(levelId);
        if (progress) {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
            this.saveProgress();
        }
    }

    public clearAllLevelsProgress(): void {
        this.levelProgress.forEach(progress => {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
        });
        this.saveProgress();
    }

    public getCompletionPercentage(levelId: string): number {
        const progress = this.levelProgress.get(levelId);
        const level = this.getLevelById(levelId);
        
        if (!progress || !level) return 0;
        
        return Math.min(100, (progress.correctAnswers / level.completionRequirement) * 100);
    }

    public getTotalProgress(): { completed: number; total: number; percentage: number } {
        const completed = Array.from(this.levelProgress.values()).filter(p => p.isCompleted).length;
        const total = this.levels.length;
        return {
            completed,
            total,
            percentage: total > 0 ? (completed / total) * 100 : 0
        };
    }
}

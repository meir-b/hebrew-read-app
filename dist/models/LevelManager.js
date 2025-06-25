export const livelyEmojis = [
    "😄",
    "🎉",
    "🤩",
    "🥳",
    "🙌",
    "💃",
    "🕺",
    "✨",
    "🚀",
    "🍕",
    "🎈",
    "🎵",
    "😂",
    "🌈",
    "🔥",
    "⚡",
    "🐱",
    "🎮",
    "🏖️",
    "🍦" // soft ice cream
];
// Input should be:
//  1. id
//  2. nikudTypes
//  3. nikudOrder
// From this input, generate the proper name ( 'שתי תנועות פתוחות עם ...')
// From this input, generate the proper description ( 'תרגול ממוקד עם ...',)
function GenerateStractureForOrderedNikudTypes(id, nikudTypes, nikudOrder) {
    const hebrewNikudNames = nikudTypes.map(getNikudHebrewName);
    return {
        id: id,
        name: 'שתי תנועות פתוחות עם ' + hebrewNikudNames.join(' ו'),
        description: 'תרגול ממוקד עם ' + hebrewNikudNames.join(' ו'),
        icon: livelyEmojis[Math.floor(Math.random() * livelyEmojis.length)],
        letters: ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'],
        nikudTypes: nikudTypes,
        orderedNikudTypes: nikudOrder,
        syllableTypes: 'double',
        isUnlocked: true,
        completionRequirement: 15,
        completed: false,
        isRandomOrder: false
    };
}
function GenerateStractureForRandomNikudTypes(id, nikudTypes, nikudOrder, repetitions, options) {
    const hebrewNikudNames = nikudTypes.map(getNikudHebrewName);
    // Calculate completion requirement based on whether we're generating all combinations
    let completionRequirement = repetitions;
    if (options === null || options === void 0 ? void 0 : options.generateAllCombinations) {
        // If generating all combinations, calculate the total number of possible combinations
        const firstCharOptions = options.fixedFirstChar ? 1 : 23; // 23 Hebrew letters if not fixed
        const secondCharOptions = 23; // Always 23 for second char
        const firstNikudOptions = nikudTypes.length;
        const secondNikudOptions = nikudTypes.length;
        completionRequirement = firstCharOptions * secondCharOptions * firstNikudOptions * secondNikudOptions;
    }
    return Object.assign(Object.assign({ id: id, name: 'שתי תנועות פתוחות עם ' + hebrewNikudNames.join(' ו'), description: 'תרגול ממוקד עם ' + hebrewNikudNames.join(' ו') +
            ((options === null || options === void 0 ? void 0 : options.fixedFirstChar) ? ` (תמיד מתחיל ב-${options.fixedFirstChar})` : '') +
            ((options === null || options === void 0 ? void 0 : options.generateAllCombinations) ? ' (כל השילובים)' : ''), icon: livelyEmojis[Math.floor(Math.random() * livelyEmojis.length)], letters: (options === null || options === void 0 ? void 0 : options.fixedFirstChar) ?
            [options.fixedFirstChar] :
            ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'], nikudTypes: nikudTypes, orderedNikudTypes: nikudOrder, syllableTypes: 'double', isUnlocked: true, completionRequirement: completionRequirement, completed: false, isRandomOrder: !(options === null || options === void 0 ? void 0 : options.generateAllCombinations) }, ((options === null || options === void 0 ? void 0 : options.fixedFirstChar) && { fixedFirstChar: options.fixedFirstChar })), ((options === null || options === void 0 ? void 0 : options.generateAllCombinations) && { generateAllCombinations: true }));
}
// Helper function to convert nikud type names to Hebrew display names
function getNikudHebrewName(nikudType) {
    const nikudHebrewNames = {
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
    constructor() {
        this.currentLevel = 'level-1';
        this.levelProgress = new Map();
        this.levels = [
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
        this.loadProgress();
        this.initializeLevelProgress();
    }
    initializeLevelProgress() {
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
    getCurrentLevel() {
        return this.levels.find(level => level.id === this.currentLevel) || null;
    }
    getLevelById(levelId) {
        return this.levels.find(level => level.id === levelId) || null;
    }
    getAllLevels() {
        return [...this.levels];
    }
    getUnlockedLevels() {
        return this.levels.filter(level => {
            const progress = this.levelProgress.get(level.id);
            return (progress === null || progress === void 0 ? void 0 : progress.unlocked) || level.isUnlocked;
        });
    }
    setCurrentLevel(levelId) {
        const level = this.getLevelById(levelId);
        const progress = this.levelProgress.get(levelId);
        if (level && ((progress === null || progress === void 0 ? void 0 : progress.unlocked) || level.isUnlocked)) {
            this.currentLevel = levelId;
            this.saveProgress();
            return true;
        }
        return false;
    }
    recordAnswer(isCorrect) {
        const progress = this.levelProgress.get(this.currentLevel);
        if (!progress)
            return { levelCompleted: false, autoAdvanced: false };
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
    autoAdvanceToNextLevel() {
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
    unlockNextLevel() {
        const currentIndex = this.levels.findIndex(level => level.id === this.currentLevel);
        if (currentIndex !== -1 && currentIndex < this.levels.length - 1) {
            const nextLevel = this.levels[currentIndex + 1];
            const nextProgress = this.levelProgress.get(nextLevel.id);
            if (nextProgress) {
                nextProgress.unlocked = true;
            }
        }
    }
    getLevelProgress(levelId) {
        return this.levelProgress.get(levelId) || null;
    }
    getCurrentLevelProgress() {
        return this.levelProgress.get(this.currentLevel) || null;
    }
    getLevelConfig() {
        var _a;
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
            isRandomOrder: (_a = level.isRandomOrder) !== null && _a !== void 0 ? _a : true,
            fixedFirstChar: level.fixedFirstChar,
            generateAllCombinations: level.generateAllCombinations // Pass the all combinations flag
        };
    }
    saveProgress() {
        const progressData = Object.fromEntries(this.levelProgress);
        localStorage.setItem('hebrewGameLevelProgress', JSON.stringify({
            currentLevel: this.currentLevel,
            progress: progressData
        }));
    }
    loadProgress() {
        try {
            const saved = localStorage.getItem('hebrewGameLevelProgress');
            if (saved) {
                const data = JSON.parse(saved);
                this.currentLevel = data.currentLevel || 'level-1';
                if (data.progress) {
                    Object.entries(data.progress).forEach(([levelId, progress]) => {
                        this.levelProgress.set(levelId, progress);
                    });
                }
            }
        }
        catch (error) {
            console.error('Failed to load level progress:', error);
        }
    }
    resetProgress() {
        this.levelProgress.clear();
        this.currentLevel = 'level-1';
        this.initializeLevelProgress();
        this.saveProgress();
    }
    clearCurrentLevelProgress() {
        const progress = this.levelProgress.get(this.currentLevel);
        if (progress) {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
            this.saveProgress();
        }
    }
    clearLevelProgress(levelId) {
        const progress = this.levelProgress.get(levelId);
        if (progress) {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
            this.saveProgress();
        }
    }
    clearAllLevelsProgress() {
        this.levelProgress.forEach(progress => {
            progress.correctAnswers = 0;
            progress.totalAnswers = 0;
            progress.isCompleted = false;
        });
        this.saveProgress();
    }
    getCompletionPercentage(levelId) {
        const progress = this.levelProgress.get(levelId);
        const level = this.getLevelById(levelId);
        if (!progress || !level)
            return 0;
        return Math.min(100, (progress.correctAnswers / level.completionRequirement) * 100);
    }
    getTotalProgress() {
        const completed = Array.from(this.levelProgress.values()).filter(p => p.isCompleted).length;
        const total = this.levels.length;
        return {
            completed,
            total,
            percentage: total > 0 ? (completed / total) * 100 : 0
        };
    }
}

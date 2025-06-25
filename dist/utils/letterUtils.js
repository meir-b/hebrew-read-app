// Constants
let HEBREW_SETTINGS = {
    "Sheva": true,
    "Hiriq": true,
    "Tsere": true,
    "Segol": true,
    "Patah": true,
    "Qamats": true,
    "Holam": true,
    "FullShuruk": true,
    "FullHolam": true,
    "Kubutz": true
};
const SHIN_SIN_DOTS = [0x05C1, 0x05C2];
const DAGESH_CODE = 0x05BC;
const VAV_CODE = 0x05D5;
const NIKUD_CODES = {
    "Sheva": 0x05B0,
    "Hiriq": 0x05B4,
    "Tsere": 0x05B5,
    "Segol": 0x05B6,
    "Patah": 0x05B7,
    "Qamats": 0x05B8,
    "Holam": 0x05B9,
    "Kubutz": 0x05BB,
};
const HEBREW_LETTERS = {
    'א': 1488, 'ב': 1489, 'ג': 1490, 'ד': 1491,
    'ה': 1492, 'ו': 1493, 'ז': 1494, 'ח': 1495,
    'ט': 1496, 'י': 1497, 'כ': 1499, 'ל': 1500,
    'מ': 1502, 'נ': 1504, 'ס': 1505, 'ע': 1506,
    'פ': 1508, 'צ': 1510, 'ק': 1511, 'ר': 1512,
    'ש': 1513, 'ת': 1514
};
const DAGESH_LETTERS = [
    HEBREW_LETTERS['ב'],
    HEBREW_LETTERS['כ'],
    HEBREW_LETTERS['פ'],
    HEBREW_LETTERS['ת']
];
function getNikudNameToStr(name) {
    if (name === "Sheva") {
        return String.fromCodePoint(NIKUD_CODES["Sheva"]);
    }
    else if (name === "Kubutz") {
        return String.fromCodePoint(NIKUD_CODES["Kubutz"]);
    }
    else if (name === "Hiriq") {
        return String.fromCodePoint(NIKUD_CODES["Hiriq"]);
    }
    else if (name === "Tsere") {
        return String.fromCodePoint(NIKUD_CODES["Tsere"]);
    }
    else if (name === "Segol") {
        return String.fromCodePoint(NIKUD_CODES["Segol"]);
    }
    else if (name === "Patah") {
        return String.fromCodePoint(NIKUD_CODES["Patah"]);
    }
    else if (name === "Qamats") {
        return String.fromCodePoint(NIKUD_CODES["Qamats"]);
    }
    else if (name === "Holam") {
        return String.fromCodePoint(NIKUD_CODES["Holam"]);
    }
    const vav = String.fromCodePoint(VAV_CODE);
    if (name === "FullShuruk") {
        return vav + String.fromCodePoint(DAGESH_CODE);
    }
    else if (name === "FullHolam") {
        return vav + String.fromCodePoint(NIKUD_CODES["Holam"]);
    }
    console.error("Invalid nikud name");
    return "";
}
const NIKUD_LIST = [
    { nikud: getNikudNameToStr("Kubutz"), name: "Kubutz" },
    { nikud: getNikudNameToStr("Sheva"), name: "Sheva" },
    { nikud: getNikudNameToStr("Hiriq"), name: "Hiriq" },
    { nikud: getNikudNameToStr("Tsere"), name: "Tsere" },
    { nikud: getNikudNameToStr("Segol"), name: "Segol" },
    { nikud: getNikudNameToStr("Patah"), name: "Patah" },
    { nikud: getNikudNameToStr("Qamats"), name: "Qamats" },
    { nikud: getNikudNameToStr("Holam"), name: "Holam" },
    { nikud: getNikudNameToStr("FullShuruk"), name: "Shuruk" },
    { nikud: getNikudNameToStr("FullHolam"), name: "Holam Malei" }
];
class HebrewLetterGenerator {
    static generateRandomLetter() {
        const letters = Object.keys(HEBREW_LETTERS);
        let randomLetter;
        // Try to get a letter that wasn't used recently
        do {
            const randomIndex = Math.floor(Math.random() * letters.length);
            randomLetter = letters[randomIndex];
        } while (this.recentLetters.includes(randomLetter) && this.recentLetters.length < letters.length);
        // Update recent letters
        this.recentLetters.push(randomLetter);
        if (this.recentLetters.length > this.MAX_RECENT) {
            this.recentLetters.shift();
        }
        return this.addDiacritics(randomLetter);
    }
    static addDiacritics(letter) {
        if (letter === 'ש') {
            return this.addShinSinDot(letter);
        }
        if (this.hasDagesh(letter)) {
            return this.addRandomDagesh(letter);
        }
        return letter;
    }
    static addShinSinDot(letter) {
        const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
        return letter + String.fromCodePoint(randomDot);
    }
    static hasDagesh(letter) {
        return DAGESH_LETTERS.includes(HEBREW_LETTERS[letter]);
    }
    static addRandomDagesh(letter) {
        return Math.random() < 0.5 ? letter : letter + String.fromCodePoint(DAGESH_CODE);
    }
    static generateNikud(weights = {}) {
        if (Object.keys(weights).length > 0) {
            return this.generateWeightedNikud(weights);
        }
        return this.generateUnweightedNikud();
    }
    static generateWeightedNikud(weights) {
        const nikudOptions = [];
        const usedNikud = new Set(this.recentNikud);
        // First try to use non-recent nikud
        Object.entries(weights).forEach(([key, weight]) => {
            if (HEBREW_SETTINGS[key]) {
                const nikud = getNikudNameToStr(key);
                if (nikud && !usedNikud.has(nikud)) {
                    for (let i = 0; i < weight; i++) {
                        nikudOptions.push(nikud);
                    }
                }
            }
        });
        // If no non-recent options available, use all weighted options
        if (nikudOptions.length === 0) {
            Object.entries(weights).forEach(([key, weight]) => {
                if (HEBREW_SETTINGS[key]) {
                    const nikud = getNikudNameToStr(key);
                    if (nikud) {
                        for (let i = 0; i < weight; i++) {
                            nikudOptions.push(nikud);
                        }
                    }
                }
            });
        }
        const selectedNikud = nikudOptions[Math.floor(Math.random() * nikudOptions.length)];
        // Update recent nikud
        this.recentNikud.push(selectedNikud);
        if (this.recentNikud.length > this.MAX_RECENT) {
            this.recentNikud.shift();
        }
        return selectedNikud;
    }
    static generateUnweightedNikud() {
        const availableNikud = [];
        // Get all enabled nikud options
        Object.entries(HEBREW_SETTINGS).forEach(([nikudName, isEnabled]) => {
            if (isEnabled) {
                const nikud = getNikudNameToStr(nikudName);
                if (nikud && !this.recentNikud.includes(nikud)) {
                    availableNikud.push(nikud);
                }
            }
        });
        // If all recent nikud were used or none available, reset and use all enabled
        if (availableNikud.length === 0) {
            Object.entries(HEBREW_SETTINGS).forEach(([nikudName, isEnabled]) => {
                if (isEnabled) {
                    const nikud = getNikudNameToStr(nikudName);
                    if (nikud)
                        availableNikud.push(nikud);
                }
            });
            this.recentNikud = [];
        }
        // Select random nikud from available options
        const randomIndex = Math.floor(Math.random() * availableNikud.length);
        const selectedNikud = availableNikud[randomIndex];
        // Update recent nikud
        this.recentNikud.push(selectedNikud);
        if (this.recentNikud.length > this.MAX_RECENT) {
            this.recentNikud.shift();
        }
        return selectedNikud;
    }
    static generateNextCharacter(weights = {}) {
        const letter = this.generateRandomLetter();
        const nikud = this.generateNikud(weights);
        return {
            charector: letter + nikud,
            nikud: nikud
        };
    }
}
HebrewLetterGenerator.recentLetters = [];
HebrewLetterGenerator.recentNikud = [];
HebrewLetterGenerator.MAX_RECENT = 4; // Keep track of last 4 to avoid repetition
// Combination generator for systematic generation of all possible combinations
class SystematicCombinationGenerator {
    getAllCombinations(config) {
        var _a, _b;
        const combinations = [];
        // Determine letter options
        const letter1Options = config.fixedFirstChar ? [config.fixedFirstChar] : config.letterRange;
        const letter2Options = config.letterRange;
        // Determine nikud options
        let nikud1Options;
        let nikud2Options;
        if (config.isRandomOrder) {
            // Random order: filter out Sheva for first position
            nikud1Options = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
            nikud2Options = config.allowedVowels;
        }
        else {
            // Ordered: use specific positions
            nikud1Options = ((_a = config.orderedVowels) === null || _a === void 0 ? void 0 : _a[0]) || config.allowedVowels;
            nikud2Options = ((_b = config.orderedVowels) === null || _b === void 0 ? void 0 : _b[1]) || config.allowedVowels;
        }
        // Generate all combinations
        for (const letter1 of letter1Options) {
            for (const letter2 of letter2Options) {
                for (const nikud1 of nikud1Options) {
                    for (const nikud2 of nikud2Options) {
                        combinations.push({ letter1, letter2, nikud1, nikud2 });
                    }
                }
            }
        }
        return combinations;
    }
    getNextCombination(config, currentIndex) {
        const allCombinations = this.getAllCombinations(config);
        if (currentIndex >= 0 && currentIndex < allCombinations.length) {
            return allCombinations[currentIndex];
        }
        return null;
    }
}
class LevelAwareGenerator {
    static generateForLevel(config, levelId) {
        if (config.vowelCount === 1) {
            return this.generateSingleVowelSyllable(config);
        }
        else if (config.vowelCount === 2) {
            return this.generateDoubleVowelSyllable(config, levelId);
        }
        else if (config.vowelCount === 3) {
            return this.generateTripleVowelSyllable(config);
        }
        else {
            // Mixed - randomly choose between 1, 2, or 3 vowels
            const vowelCount = Math.floor(Math.random() * 3) + 1;
            return this.generateForLevel(Object.assign(Object.assign({}, config), { vowelCount }), levelId);
        }
    }
    static generateSingleVowelSyllable(config) {
        const letter = this.getRandomLetter(config.letterRange);
        const nikud = this.getRandomNikud(config.allowedVowels);
        let result = letter;
        // Add dagesh if appropriate
        if (config.includeDagesh && this.shouldAddDagesh(letter)) {
            result += String.fromCodePoint(DAGESH_CODE);
        }
        // Add shin/sin dot
        if (letter === 'ש') {
            const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
            result += String.fromCodePoint(randomDot);
        }
        result += nikud;
        return {
            charector: result,
            nikud: nikud
        };
    }
    static generateDoubleVowelSyllable(config, levelId) {
        // Handle fixed first character - if fixedFirstChar is set, use it for first letter, otherwise random
        const letter1 = config.fixedFirstChar || this.getRandomLetter(config.letterRange);
        // Second letter is always random from the letter range
        const letter2 = this.getRandomLetter(config.letterRange);
        let nikud1, nikud2;
        // Handle all combinations generation vs random generation
        if (config.generateAllCombinations) {
            // For all combinations mode, we need to track which combination to generate
            // This is a simplified implementation - in a real scenario, you'd want 
            // to track the current combination index and cycle through all possibilities
            if (config.isRandomOrder) {
                const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
                nikud1 = this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels);
                nikud2 = this.getRandomNikud(config.allowedVowels);
            }
            else {
                if (config.orderedVowels && config.orderedVowels.length >= 2) {
                    nikud1 = this.getRandomNikudFromList(config.orderedVowels[0]);
                    nikud2 = this.getRandomNikudFromList(config.orderedVowels[1]);
                }
                else {
                    const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
                    nikud1 = this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels);
                    nikud2 = this.getRandomNikud(config.allowedVowels);
                }
            }
        }
        else {
            // Standard random/ordered generation
            if (config.isRandomOrder) {
                // Random order: Hebrew linguistic rule - Sheva cannot be the first vowel in multi-character syllables
                // as it represents a silent or very reduced vowel that typically appears in the middle or end of words
                const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
                nikud1 = this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels);
                nikud2 = this.getRandomNikud(config.allowedVowels);
            }
            else {
                // Ordered placement: use specific nikud for each position
                if (config.orderedVowels && config.orderedVowels.length >= 2) {
                    nikud1 = this.getRandomNikudFromList(config.orderedVowels[0]);
                    nikud2 = this.getRandomNikudFromList(config.orderedVowels[1]);
                }
                else {
                    // Fallback to random if orderedVowels not properly configured
                    const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
                    nikud1 = this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels);
                    nikud2 = this.getRandomNikud(config.allowedVowels);
                }
            }
        }
        let syllable = '';
        // First letter with nikud
        syllable += letter1;
        if (config.includeDagesh && this.shouldAddDagesh(letter1)) {
            syllable += String.fromCodePoint(DAGESH_CODE);
        }
        if (letter1 === 'ש') {
            const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
            syllable += String.fromCodePoint(randomDot);
        }
        syllable += nikud1;
        // Second letter with nikud
        syllable += letter2;
        if (config.includeDagesh && this.shouldAddDagesh(letter2)) {
            syllable += String.fromCodePoint(DAGESH_CODE);
        }
        if (letter2 === 'ש') {
            const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
            syllable += String.fromCodePoint(randomDot);
        }
        syllable += nikud2;
        return {
            charector: syllable,
            nikud: nikud1 + ', ' + nikud2
        };
    }
    static generateTripleVowelSyllable(config) {
        const letters = [
            this.getRandomLetter(config.letterRange),
            this.getRandomLetter(config.letterRange),
            this.getRandomLetter(config.letterRange)
        ];
        let nikuds;
        if (config.isRandomOrder) {
            // Random order: Hebrew linguistic rule - Sheva cannot be the first vowel in multi-character syllables
            const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
            nikuds = [
                this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels),
                this.getRandomNikud(config.allowedVowels),
                this.getRandomNikud(config.allowedVowels)
            ];
        }
        else {
            // Ordered placement: use specific nikud for each position
            if (config.orderedVowels && config.orderedVowels.length >= 3) {
                nikuds = [
                    this.getRandomNikudFromList(config.orderedVowels[0]),
                    this.getRandomNikudFromList(config.orderedVowels[1]),
                    this.getRandomNikudFromList(config.orderedVowels[2])
                ];
            }
            else {
                // Fallback to random if orderedVowels not properly configured
                const firstVowelOptions = config.allowedVowels.filter(vowel => vowel !== 'Sheva');
                nikuds = [
                    this.getRandomNikudFromList(firstVowelOptions.length > 0 ? firstVowelOptions : config.allowedVowels),
                    this.getRandomNikud(config.allowedVowels),
                    this.getRandomNikud(config.allowedVowels)
                ];
            }
        }
        let syllable = '';
        for (let i = 0; i < 3; i++) {
            const letter = letters[i];
            const nikud = nikuds[i];
            syllable += letter;
            if (config.includeDagesh && this.shouldAddDagesh(letter)) {
                syllable += String.fromCodePoint(DAGESH_CODE);
            }
            if (letter === 'ש') {
                const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
                syllable += String.fromCodePoint(randomDot);
            }
            syllable += nikud;
        }
        return {
            charector: syllable,
            nikud: nikuds.join(', ')
        };
    }
    static getRandomNikudFromList(allowedVowels) {
        const randomIndex = Math.floor(Math.random() * allowedVowels.length);
        const nikudName = allowedVowels[randomIndex];
        return getNikudNameToStr(nikudName);
    }
    static getRandomLetter(letterRange) {
        const randomIndex = Math.floor(Math.random() * letterRange.length);
        return letterRange[randomIndex];
    }
    static getRandomNikud(allowedVowels) {
        const randomIndex = Math.floor(Math.random() * allowedVowels.length);
        const nikudName = allowedVowels[randomIndex];
        return getNikudNameToStr(nikudName);
    }
    static shouldAddDagesh(letter) {
        const isDageshLetter = DAGESH_LETTERS.includes(HEBREW_LETTERS[letter]);
        return isDageshLetter && Math.random() < 0.3; // 30% chance for dagesh
    }
}
LevelAwareGenerator.recentSyllables = [];
LevelAwareGenerator.MAX_RECENT_SYLLABLES = 3;
LevelAwareGenerator.combinationGenerator = new SystematicCombinationGenerator();
LevelAwareGenerator.combinationIndexes = new Map(); // Track combination index per level
// Add a function to update settings
export function updateNikudSettings(nikud, enabled) {
    if (nikud in HEBREW_SETTINGS) {
        HEBREW_SETTINGS[nikud] = enabled;
        console.log(`Updated ${nikud} to ${enabled}`);
        console.log('Current settings:', HEBREW_SETTINGS);
    }
}
export { HebrewLetterGenerator, LevelAwareGenerator, getNikudNameToStr, NIKUD_LIST, SystematicCombinationGenerator };

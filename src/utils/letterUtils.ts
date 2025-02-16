// Types and Interfaces
interface HebrewCharacterMap {
    [key: string]: number;
}

interface NikudCodeMap {
    [key: string]: number;
}

interface NikudSettings {
    [key: string]: boolean;
}

interface WeightedNikud {
    [key: string]: number;
}

interface CharectorNikud {
    charector: string;
    nikud: string;
}

// Constants
const HEBREW_SETTINGS: NikudSettings = {
    "Sheva": true,
    "Hiriq": true,
    "Tsere": true,
    "Segol": true,
    "Patah": true,
    "Qamats": true,
    "Holam": true,
    "FullShuruk": true,
    "FullHolam": true
};



const SHIN_SIN_DOTS: [number, number] = [0x05C1, 0x05C2];
const DAGESH_CODE: number = 0x05BC;
const VAV_CODE: number = 0x05D5;

const NIKUD_CODES: NikudCodeMap = {
    "Sheva": 0x05B0,
    "Hiriq": 0x05B4,
    "Tsere": 0x05B5,
    "Segol": 0x05B6,
    "Patah": 0x05B7,
    "Qamats": 0x05B8,
    "Holam": 0x05B9
};

const HEBREW_LETTERS: HebrewCharacterMap = {
    'א': 1488, 'ב': 1489, 'ג': 1490, 'ד': 1491,
    'ה': 1492, 'ו': 1493, 'ז': 1494, 'ח': 1495,
    'ט': 1496, 'י': 1497, 'כ': 1499, 'ל': 1500,
    'מ': 1502, 'נ': 1504, 'ס': 1505, 'ע': 1506,
    'פ': 1508, 'צ': 1510, 'ק': 1511, 'ר': 1512,
    'ש': 1513, 'ת': 1514
};

const DAGESH_LETTERS: number[] = [
    HEBREW_LETTERS['ב'],
    HEBREW_LETTERS['כ'],
    HEBREW_LETTERS['פ'],
    HEBREW_LETTERS['ת']
];

const NIKUD_LIST  = [
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

// Cache for Hebrew combinations
let hebrewCombinationsCache: string[] = [];


function getNikudNameToStr(name: string): string {
    if (name === "Sheva")
    {
        return String.fromCodePoint(NIKUD_CODES["Sheva"]);
    }
    else if (name === "Hiriq")
    {
        return String.fromCodePoint(NIKUD_CODES["Hiriq"]);
    }
    else if (name === "Tsere")
    {
        return String.fromCodePoint(NIKUD_CODES["Tsere"]);
    }
    else if (name === "Segol")
    {
        return String.fromCodePoint(NIKUD_CODES["Segol"]);
    }   
    else if (name === "Patah")
    {
        return String.fromCodePoint(NIKUD_CODES["Patah"]);
    }
    else if (name === "Qamats")
    {
        return String.fromCodePoint(NIKUD_CODES["Qamats"]);
    }
    else if (name === "Holam")
    {
        return String.fromCodePoint(NIKUD_CODES["Holam"]);
    }

    const vav = String.fromCodePoint(VAV_CODE);
    if (name === "FullShuruk")
    {
        return vav + String.fromCodePoint(DAGESH_CODE);
    }
    else if (name === "FullHolam")
    {
        return vav + String.fromCodePoint(NIKUD_CODES["Holam"]);
    }

    console.error("Invalid nikud name");
    return "";
}


class HebrewLetterGenerator {
    private static generateRandomLetter(): string {
        const letters = Object.keys(HEBREW_LETTERS);
        const randomLetter = letters[Math.floor(Math.random() * letters.length)];
        
        return this.addDiacritics(randomLetter);
    }

    private static addDiacritics(letter: string): string {
        if (letter === 'ש') {
            return this.addShinSinDot(letter);
        }
        
        if (this.hasDagesh(letter)) {
            return this.addRandomDagesh(letter);
        }

        return letter;
    }

    private static addShinSinDot(letter: string): string {
        const randomDot = Math.random() < 0.5 ? SHIN_SIN_DOTS[0] : SHIN_SIN_DOTS[1];
        return letter + String.fromCodePoint(randomDot);
    }

    private static hasDagesh(letter: string): boolean {
        return DAGESH_LETTERS.includes(HEBREW_LETTERS[letter]);
    }

    private static addRandomDagesh(letter: string): string {
        return Math.random() < 0.5 ? letter : letter + String.fromCodePoint(DAGESH_CODE);
    }

    static generateNikud(weights: WeightedNikud = {}): string {
        if (Object.keys(weights).length > 0) {
            return this.generateWeightedNikud(weights);
        }
        
        return this.generateUnweightedNikud();
    }

    private static generateWeightedNikud(weights: WeightedNikud): string {
        const nikudOptions: string[] = [];

        Object.entries(weights).forEach(([key, weight]) => {
            for (let i = 0; i < weight; i++) {
                nikudOptions.push(getNikudNameToStr(key));
            }
        });

        // Add regular nikud options
        Object.keys(HEBREW_SETTINGS).forEach(nikudName => {
            if (HEBREW_SETTINGS[nikudName]) {
                nikudOptions.push(getNikudNameToStr(nikudName));
            }
        });

        return nikudOptions[Math.floor(Math.random() * nikudOptions.length)];
    }

    private static generateUnweightedNikud(): string {
        const nikudOptions: string[] = [];

        // Add regular nikud options
        Object.keys(HEBREW_SETTINGS).forEach(nikudName => {
            if (HEBREW_SETTINGS[nikudName]) {
                nikudOptions.push(getNikudNameToStr(nikudName));
            }
        });

        return nikudOptions[Math.floor(Math.random() * nikudOptions.length)];
    }

    static generateNextCharacter(weights: WeightedNikud = {}): CharectorNikud {
        const letter = this.generateRandomLetter();
        const nikud = this.generateNikud(weights);
        return {
            charector:  letter + nikud,
            nikud: nikud
        };
    }
}

export {
    HebrewLetterGenerator,
    CharectorNikud,
    WeightedNikud,
    getNikudNameToStr,
    NIKUD_LIST
};
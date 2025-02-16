export const hebrewLetters = [
    { letter: 'א', nikud: 'ַ' },
    { letter: 'ב', nikud: 'ּ' },
    { letter: 'ג', nikud: 'ָ' },
    { letter: 'ד', nikud: 'ַ' },
    { letter: 'ה', nikud: 'ֱ' },
    { letter: 'ו', nikud: 'ֻ' },
    { letter: 'ז', nikud: 'ַ' },
    { letter: 'ח', nikud: 'ַ' },
    { letter: 'ט', nikud: 'ּ' },
    { letter: 'י', nikud: 'ִ' },
    { letter: 'כ', nikud: 'ּ' },
    { letter: 'ל', nikud: 'ָ' },
    { letter: 'מ', nikud: 'ַ' },
    { letter: 'נ', nikud: 'ּ' },
    { letter: 'ס', nikud: 'ַ' },
    { letter: 'ע', nikud: 'ַ' },
    { letter: 'פ', nikud: 'ּ' },
    { letter: 'צ', nikud: 'ּ' },
    { letter: 'ק', nikud: 'ָ' },
    { letter: 'ר', nikud: 'ַ' },
    { letter: 'ש', nikud: 'ּ' },
    { letter: 'ת', nikud: 'ּ' },
];
export function getRandomHebrewLetter() {
    const randomIndex = Math.floor(Math.random() * hebrewLetters.length);
    return hebrewLetters[randomIndex];
}
export function getNikudForLetter(letter) {
    const foundLetter = hebrewLetters.find(l => l.letter === letter);
    return foundLetter ? foundLetter.nikud : null;
}

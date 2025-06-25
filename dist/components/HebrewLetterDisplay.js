import { LevelAwareGenerator, NIKUD_LIST } from '../utils/letterUtils.js';
class HebrewLetterDisplay {
    constructor(statistics, levelManager) {
        this.statistics = statistics;
        this.levelManager = levelManager;
        this.currentLetter = this.generateLevelAwareLetter();
    }
    getNikudList() {
        return NIKUD_LIST;
    }
    getCurrentLetter() {
        return Object.assign({}, this.currentLetter); // Return a copy to prevent external modification
    }
    getNikudName(nikud) {
        const found = NIKUD_LIST.find(item => item.nikud === nikud);
        return found ? found.name : "Unknown Nikud";
    }
    generateLevelAwareLetter() {
        const config = this.levelManager.getLevelConfig();
        return LevelAwareGenerator.generateForLevel(config);
    }
    updateDisplayedLetter() {
        this.currentLetter = this.generateLevelAwareLetter();
        this.render();
    }
    render() {
        const letterElement = document.querySelector('.letter-display');
        if (!letterElement) {
            console.error('Letter display element not found');
            return;
        }
        letterElement.textContent = this.currentLetter.charector;
    }
}
// Constants
HebrewLetterDisplay.DIFFICULTY_THRESHOLD = 0.6;
HebrewLetterDisplay.MIN_EXPOSURE_COUNT = 5;
export default HebrewLetterDisplay;

import { HebrewLetterGenerator, NIKUD_LIST } from '../utils/letterUtils.js';
class HebrewLetterDisplay {
    constructor(statistics) {
        this.statistics = statistics;
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter();
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
    updateDisplayedLetter() {
        const weights = this.calculateNikudWeights();
        console.log("weights:", weights);
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter(weights);
        this.render();
    }
    calculateNikudWeights() {
        const performance = this.statistics.calculateOverallPerformance();
        console.log("performance:", performance);
        const weights = {};
        const leastPracticedNikud = this.findLeastPracticedNikud();
        console.log("leastPracticedNikud:", leastPracticedNikud);
        return weights;
    }
    findLeastPracticedNikud() {
        var _a;
        const nikudCounts = NIKUD_LIST.map(n => {
            var _a, _b;
            return ({
                nikud: n.nikud,
                total: (_b = (_a = this.statistics.getStatistics(n.nikud)) === null || _a === void 0 ? void 0 : _a.total) !== null && _b !== void 0 ? _b : 0
            });
        });
        const leastPracticed = nikudCounts
            .filter(n => n.total < HebrewLetterDisplay.MIN_EXPOSURE_COUNT)
            .sort((a, b) => a.total - b.total)[0];
        return (_a = leastPracticed === null || leastPracticed === void 0 ? void 0 : leastPracticed.nikud) !== null && _a !== void 0 ? _a : null;
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

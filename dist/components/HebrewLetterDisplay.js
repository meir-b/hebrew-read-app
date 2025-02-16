import { HebrewLetterGenerator, NIKUD_LIST } from '../utils/letterUtils.js';

class HebrewLetterDisplay {
    constructor(statistics) {
        this.nikudList = NIKUD_LIST;
        this.statistics = statistics;
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter();
    }

    static getNikudName(nikud) {
        return this.nikudList.get(nikud) ?? "Unknown Nikud";
    }

    getNikudList() {
        return this.nikudList;
    }

    getCurrentLetter() {
        const { charector, nikud } = this.currentLetter;
        return { charector, nikud: getNikudName(nikud)}; // Return a copy to prevent external modification 
    }

    updateDisplayedLetter() {
        const weights = this.calculateNikudWeights();
        console.log("weights:", weights);
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter(); //weights);
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
        const nikudCounts = this.nikudList.map(n => {
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

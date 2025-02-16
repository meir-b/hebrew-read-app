export class AssessmentController {
    constructor() {
        this.assessments = {};
    }
    assess(userPronunciation, expectedNikud) {
        const isCorrect = userPronunciation.trim() === expectedNikud;
        this.recordAssessment(expectedNikud, isCorrect);
        return { nikud: expectedNikud, isCorrect };
    }
    recordAssessment(letter, isCorrect) {
        if (!this.assessments[letter]) {
            this.assessments[letter] = 0;
        }
        this.assessments[letter] += isCorrect ? 1 : 0;
    }
    getAssessmentResults() {
        return this.assessments;
    }
    updateStatistics(statistics) {
        // Logic to update statistics based on assessments
        for (const letter in this.assessments) {
            if (this.assessments.hasOwnProperty(letter)) {
                statistics.update(letter, this.assessments[letter]);
            }
        }
    }
}

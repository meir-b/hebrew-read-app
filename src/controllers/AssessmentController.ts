export class AssessmentController {
    private assessments: { [key: string]: number } = {};

    constructor() {}

    public assess(userPronunciation: string, expectedNikud: string): { nikud: string, isCorrect: boolean } {
        const isCorrect = userPronunciation.trim() === expectedNikud;
        this.recordAssessment(expectedNikud, isCorrect);
        return { nikud: expectedNikud, isCorrect };
    }
 
    recordAssessment(letter: string, isCorrect: boolean): void {
        if (!this.assessments[letter]) {
            this.assessments[letter] = 0;
        }
        this.assessments[letter] += isCorrect ? 1 : 0;
    }

    getAssessmentResults(): { [key: string]: number } {
        return this.assessments;
    }

    updateStatistics(statistics: any): void {
        // Logic to update statistics based on assessments
        for (const letter in this.assessments) {
            if (this.assessments.hasOwnProperty(letter)) {
                statistics.update(letter, this.assessments[letter]);
            }
        }
    }
}
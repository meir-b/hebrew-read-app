export class Statistics {
    constructor() {
        this.proficiency = {};
    }
    updateStatistics(nikud, isCorrect) {
        if (!this.proficiency[nikud]) {
            this.proficiency[nikud] = { correct: 0, total: 0 };
        }
        this.proficiency[nikud].total++;
        if (isCorrect) {
            this.proficiency[nikud].correct++;
        }
    }
    getStatistics(nikud) {
        return this.proficiency[nikud];
    }
    calculateOverallPerformance() {
        const overallPerformance = {};
        for (const nikud in this.proficiency) {
            const { correct, total } = this.proficiency[nikud];
            overallPerformance[nikud] = total > 0 ? (correct / total) * 100 : 0;
        }
        return overallPerformance;
    }
}

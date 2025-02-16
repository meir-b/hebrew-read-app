export class Statistics {
    private proficiency: Record<string, { correct: number; total: number }>;

    constructor() {
        this.proficiency = {};
    }

    updateStatistics(nikud: string, isCorrect: boolean): void {
        if (!this.proficiency[nikud]) {
            this.proficiency[nikud] = { correct: 0, total: 0 };
        }
        this.proficiency[nikud].total++; 
        if (isCorrect) {
            this.proficiency[nikud].correct++;
        }
    }

    getStatistics(nikud: string): { correct: number; total: number } | undefined {
        return this.proficiency[nikud];
    }

    calculateOverallPerformance(): Record<string, number> {
        const overallPerformance: Record<string, number> = {};
        for (const nikud in this.proficiency) {
            const { correct, total } = this.proficiency[nikud];
            overallPerformance[nikud] = total > 0 ? (correct / total) * 100 : 0;
        }
        return overallPerformance;
    }
}
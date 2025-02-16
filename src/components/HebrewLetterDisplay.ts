import { Statistics } from '../models/Statistics.js';
import { HebrewLetterGenerator, CharectorNikud, NIKUD_LIST } from '../utils/letterUtils.js';

interface NikudInfo {
    nikud: string;
    name: string;
}

interface WeightMap {
    [key: string]: number;
}

class HebrewLetterDisplay {
    private currentLetter: CharectorNikud;
    private readonly statistics: Statistics;
    
    // Constants
    private static readonly DIFFICULTY_THRESHOLD = 0.6;
    private static readonly MIN_EXPOSURE_COUNT = 5;

    constructor(statistics: Statistics) {
        this.statistics = statistics;
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter();
    }

    public getNikudList(): readonly NikudInfo[] {
        return NIKUD_LIST;
    }

    public getCurrentLetter(): CharectorNikud {
        return { ...this.currentLetter }; // Return a copy to prevent external modification
    }

    private getNikudName(nikud: string): string {
        const found = NIKUD_LIST.find(item => item.nikud === nikud);
        return found ? found.name : "Unknown Nikud";
    }

    public updateDisplayedLetter(): void {
        const weights = this.calculateNikudWeights();
        console.log("weights:", weights);
        this.currentLetter = HebrewLetterGenerator.generateNextCharacter(weights);
        this.render();
    }

    private calculateNikudWeights(): WeightMap {
        const performance = this.statistics.calculateOverallPerformance();
        console.log("performance:", performance);

        const weights: WeightMap = {};
        
        const leastPracticedNikud = this.findLeastPracticedNikud();
        console.log("leastPracticedNikud:", leastPracticedNikud);
        
        return weights;
    }


   

    private findLeastPracticedNikud(): string | null {
        const nikudCounts = NIKUD_LIST.map(n => ({
            nikud: n.nikud,
            total: this.statistics.getStatistics(n.nikud)?.total ?? 0
        }));

        const leastPracticed = nikudCounts
            .filter(n => n.total < HebrewLetterDisplay.MIN_EXPOSURE_COUNT)
            .sort((a, b) => a.total - b.total)[0];

        return leastPracticed?.nikud ?? null;
    }



    private render(): void {
        const letterElement = document.querySelector<HTMLElement>('.letter-display');
        if (!letterElement) {
            console.error('Letter display element not found');
            return;
        }
        
        letterElement.textContent = this.currentLetter.charector;
    }
}

export default HebrewLetterDisplay;
import { Statistics } from '../models/Statistics.js';
import { LevelManager } from '../models/LevelManager.js';
import { HebrewLetterGenerator, LevelAwareGenerator, CharectorNikud, NIKUD_LIST } from '../utils/letterUtils.js';

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
    private readonly levelManager: LevelManager;
    
    // Constants
    private static readonly DIFFICULTY_THRESHOLD = 0.6;
    private static readonly MIN_EXPOSURE_COUNT = 5;

    constructor(statistics: Statistics, levelManager: LevelManager) {
        this.statistics = statistics;
        this.levelManager = levelManager;
        this.currentLetter = this.generateLevelAwareLetter();
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

    private generateLevelAwareLetter(): CharectorNikud {
        const config = this.levelManager.getLevelConfig();
        return LevelAwareGenerator.generateForLevel(config);
    }

    public updateDisplayedLetter(): void {
        this.currentLetter = this.generateLevelAwareLetter();
        this.render();
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
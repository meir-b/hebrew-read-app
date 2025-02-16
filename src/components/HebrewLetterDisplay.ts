import { Statistics } from '../models/Statistics.js';

class HebrewLetterDisplay {
    private lettersWithNikud: { letter: string; nikud: string }[];
    private currentLetter: { letter: string; nikud: string };
    private nikud: { nikud: string; name: string }[];
    private statistics: Statistics;
    private readonly DIFFICULTY_THRESHOLD = 0.6; // 60% success rate threshold
    private readonly MAX_REPEATED_NIKUD_CHANCE = 0.4; // 40% max chance for difficult Nikud
    private readonly MIN_EXPOSURE_COUNT = 5; // Minimum attempts before considering performance
 
    constructor(statistics: Statistics) {
        this.statistics = statistics;

        this.nikud = [
            {nikud: 'ַ', name: 'patach'},
            {nikud: 'ָ', name: 'kamatz'},
            {nikud: 'ֶ', name: 'segol'},
            {nikud: 'ֵ', name: 'tsere'},
            {nikud: 'ֻ', name: 'kubutz'},
            {nikud: 'ִ', name: 'hirik'},
            {nikud: 'ֹ', name: 'holam'},  // Added Holam
            //{nikud: 'וּ', name: 'shuruk'},
            //{nikud: 'ְ', name: 'sheva'},
        ];

        this.lettersWithNikud = [
            { letter: 'א', nikud: 'ַ' },
            { letter: 'בּ', nikud: 'ַ' },
            { letter: 'ב', nikud: 'ַ' },
            { letter: 'ג', nikud: 'ָ' },
            { letter: 'ד', nikud: 'ֶ' },
            { letter: 'ה', nikud: 'ֵ' },
            { letter: 'ו', nikud: 'ֹ' },
            { letter: 'ז', nikud: 'ֻ' },
            { letter: 'ח', nikud: 'ַ' },
            { letter: 'ט', nikud: 'ָ' },
            { letter: 'י', nikud: 'ִ' },
            { letter: 'כּ', nikud: 'ַ' },
            { letter: 'כ', nikud: 'ּ' },
            { letter: 'ל', nikud: 'ָ' },
            { letter: 'מ', nikud: 'ַ' },
            { letter: 'נ', nikud: 'ִ' },
            { letter: 'ס', nikud: 'ּ' },
            { letter: 'ע', nikud: 'ַ' },
            { letter: 'פּ', nikud: 'ַ' },
            { letter: 'פ', nikud: 'ּ' },
            { letter: 'צ', nikud: 'ּ' },
            { letter: 'ק', nikud: 'ָ' },
            { letter: 'ר', nikud: 'ָ' },
            { letter: 'שׁ', nikud: 'ִ' },
            { letter: 'שׂ', nikud: 'ִ' },
            { letter: 'תּ', nikud: 'ַ' },
            { letter: 'ת', nikud: 'ּ' }
        ];

        this.currentLetter = this.getRandomLetter();
        this.getRandomNikud();
    }

    private getRandomLetter(): { letter: string; nikud: string } {
        const randomIndex = Math.floor(Math.random() * this.lettersWithNikud.length);
        return this.lettersWithNikud[randomIndex];
    }

    private getRandomNikud(): void {
        const randomIndex = Math.floor(Math.random() * this.nikud.length);
        this.currentLetter.nikud = this.nikud[randomIndex].nikud;
    }

    public getNikudList(): Array<{ nikud: string; name: string }> {
        return [...this.nikud];
    }

    public updateDisplayedLetter(): void {
        const performance = this.statistics.calculateOverallPerformance();
        const difficultNikud = this.findDifficultNikud(performance);
        const leastPracticedNikud = this.findLeastPracticedNikud();
        
        // Weighted random selection
        const random = Math.random();
        
        if (difficultNikud && random < this.calculateRepeatChance(difficultNikud)) {
            // Show difficult Nikud
            this.currentLetter = this.getLetterWithSpecificNikud(difficultNikud);
        } else if (leastPracticedNikud && random < 0.3) {
            // Show least practiced Nikud
            this.currentLetter = this.getLetterWithSpecificNikud(leastPracticedNikud);
        } else {
            // Show random combination
            this.currentLetter = this.getRandomLetter();
            this.getRandomNikud();
        }
        
        this.render();
    }

    

    private findLeastPracticedNikud(): string | null {
        const nikudCounts = this.nikud.map(n => {
            const stats = this.statistics.getStatistics(n.nikud);
            return {
                nikud: n.nikud,
                total: stats ? stats.total : 0
            };
        });

        const leastPracticed = nikudCounts
            .filter(n => n.total < this.MIN_EXPOSURE_COUNT)
            .sort((a, b) => a.total - b.total)[0];

        return leastPracticed ? leastPracticed.nikud : null;
    }

    private calculateRepeatChance(nikud: string): number {
        const stats = this.statistics.getStatistics(nikud);
        if (!stats) return 0;

        const successRate = stats.correct / stats.total;
        // Dynamic probability based on success rate
        // Lower success rate = higher chance of showing this Nikud
        const baseChance = this.MAX_REPEATED_NIKUD_CHANCE * (1 - successRate);
        
        // Reduce chance if we've shown this Nikud too much recently
        const recentExposurePenalty = Math.min(stats.total / 20, 0.5);
        
        return Math.max(0, baseChance - recentExposurePenalty);
    }

    private findDifficultNikud(performance: Record<string, number>): string | null {
        const difficultNikuds = Object.entries(performance)
            .filter(([nikud, score]) => {
                const stats = this.statistics.getStatistics(nikud);
                return stats && 
                       stats.total >= this.MIN_EXPOSURE_COUNT && 
                       score < this.DIFFICULTY_THRESHOLD;
            })
            .sort(([, a], [, b]) => a - b);
        
        return difficultNikuds.length > 0 ? difficultNikuds[0][0] : null;
    }

    private getLetterWithSpecificNikud(targetNikud: string): { letter: string; nikud: string } {
        const availableLetters = this.lettersWithNikud.filter(l => 
            this.nikud.some(n => n.nikud === targetNikud));
        
        if (availableLetters.length === 0) {
            return this.getRandomLetter();
        }

        const randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
        return { ...randomLetter, nikud: targetNikud };
    }

    // filepath: /c:/Users/mebloya/Desktop/toDel/testNewApp/1/hebrew-reading-app/src/components/HebrewLetterDisplay.ts
    private render(): void {
        console.log('Rendering letter:', this.currentLetter);
        const letterElement = document.querySelector('.letter-display');
        const nikudElement = document.querySelector('.nikud-display');
        
        if (letterElement && nikudElement) {
            letterElement.textContent = this.currentLetter.letter;
            nikudElement.textContent = this.currentLetter.nikud;
            nikudElement.setAttribute('data-nikud', this.currentLetter.nikud);
            
            // Remove all special position classes
            nikudElement.classList.remove('holam-position', 'shuruk-position');
            
            // Add appropriate position class
            if (this.currentLetter.nikud === 'ֹ') {
                nikudElement.classList.add('holam-position');
            } else if (this.currentLetter.nikud === 'וּ') {
                nikudElement.classList.add('shuruk-position');
            }
        } else {
            console.error('Display elements not found');
        }
    }

    public getCurrentLetter(): { letter: string; nikud: string } {
        return this.currentLetter;
    }

    public handleUserInteraction(pronunciation: string): void {
        // Logic to assess the pronunciation and provide feedback
        console.log(`User Pronunciation: ${pronunciation}`);
    }
}

export default HebrewLetterDisplay;
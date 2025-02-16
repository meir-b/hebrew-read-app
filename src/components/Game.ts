import HebrewLetterDisplay from './HebrewLetterDisplay.js';
import { AssessmentController } from '../controllers/AssessmentController.js';
import { Statistics } from '../models/Statistics.js';

export class Game {
    private letterDisplay: HebrewLetterDisplay;
    private assessmentController: AssessmentController;
    private statistics: Statistics;
    private lettersShown: number;
    private successSound!: HTMLAudioElement;
    private errorSound!: HTMLAudioElement;

    private streak: number = 0;
    private streakSound!: HTMLAudioElement;
    private readonly STREAK_THRESHOLD = 3;

    private readonly STREAK_LEVELS = [3, 6, 9];


    constructor() {
        console.log('Game initialized');
        this.statistics = new Statistics();
        this.letterDisplay = new HebrewLetterDisplay(this.statistics);
        this.assessmentController = new AssessmentController();

        this.lettersShown = 0;
        this.initializeSounds();
        this.initializeHandlers();

        this.streak = 0;
        this.initializeSounds();
        this.initializeHandlers();
    }

    private initializeSounds(): void {
        this.successSound = document.getElementById('successSound') as HTMLAudioElement;
        this.errorSound = document.getElementById('errorSound') as HTMLAudioElement;
        this.streakSound = document.getElementById('streakSound') as HTMLAudioElement;

    }

    // Add this method to the Game class
private updateStatisticsDisplay(): void {
    const statsContainer = document.getElementById('nikud-stats');
    if (!statsContainer) return;

    // Clear existing stats
    statsContainer.innerHTML = '';

    // Get nikud list from HebrewLetterDisplay
    const nikudList = this.letterDisplay.getNikudList();
    const performance = this.statistics.calculateOverallPerformance();
 
    nikudList.forEach(({ nikud, name }) => {
        const stats = this.statistics.getStatistics(nikud);
        if (!stats) return;

        const statItem = document.createElement('div');
        statItem.className = 'nikud-stat-item';

        const successRate = stats.total > 0 
            ? Math.round((stats.correct / stats.total) * 100) 
            : 0;

        statItem.innerHTML = `
            <div class="nikud-symbol">${nikud}</div>
            <div class="nikud-name">${name}</div>
            <div class="nikud-progress">
                <div class="nikud-progress-bar" style="width: ${successRate}%"></div>
            </div>
            <div class="nikud-stats">
                <span class="success-rate">${successRate}%</span> 
                (${stats.correct}/${stats.total})
            </div>
        `;

        statsContainer.appendChild(statItem);
    });
}

private async playSound(isCorrect: boolean): Promise<void> {
    try {
        let sound: HTMLAudioElement;
        
        if (!isCorrect) {
            sound = this.errorSound;
        } else {
            // For correct answers, choose between streak and success sounds
            if (this.STREAK_LEVELS.includes(this.streak)) {
                // Play streak sound only on milestone numbers (3,6,9)
                sound = this.streakSound;
                if (sound) {
                    sound.playbackRate = 1 + (this.streak / 10);
                }
            } else {
                // Play regular success sound for non-milestone numbers
                sound = this.successSound;
            }
        }

        if (!sound) {
            console.error('Sound element not found');
            return;
        }

        console.log('Playing sound:', isCorrect ? 
            (this.STREAK_LEVELS.includes(this.streak) ? 'streak' : 'success') 
            : 'error');
            
        sound.currentTime = 0;
        sound.volume = 0.5;
        await sound.play();
    } catch (error) {
        console.error('Error playing sound:', error);
    }
}
    
    private showLearningFeedback(nikud: string): void {
        const stats = this.statistics.getStatistics(nikud);
        if (stats) {
            const accuracy = (stats.correct / stats.total * 100).toFixed(0);
            const milestone = document.getElementById('streak-milestone');
            if (milestone) {
                milestone.textContent = `Keep practicing ${nikud} - ${accuracy}% mastery`;
                milestone.classList.remove('milestone-show');
                void milestone.offsetWidth;
                milestone.classList.add('milestone-show');
            }
        }
    }


    private handleAssessment(isCorrect: boolean): void {
    console.log('Assessment:', isCorrect);
    const currentLetter = this.letterDisplay.getCurrentLetter();
    
    // Update statistics and counter
    this.statistics.updateStatistics(currentLetter.nikud, isCorrect);
    this.lettersShown++;
    this.updateCounter();
    this.updateStatisticsDisplay(); // Add this line
    
    // Handle streak and feedback
    if (isCorrect) {
        this.streak++;
        if (this.streak >= this.STREAK_THRESHOLD) {
            this.addStreakAnimation();
        }
    } else {
        this.streak = 0;
        this.showLearningFeedback(currentLetter.nikud);
    }
    
    // Update UI
    console.log('Streak:', this.streak);
    this.updateStreakDisplay();
    
    // Play sound effects
    this.playSound(isCorrect);
    
    // Show next letter
    this.showNextLetter();
}

private addStreakAnimation(): void {
    const displayArea = document.getElementById('display-area');
    const milestone = document.getElementById('streak-milestone');
    
    if (!displayArea || !milestone) return;

    // Remove any existing streak animations
    displayArea.classList.remove('streak-animation-3', 'streak-animation-6', 'streak-animation-9');

    // Determine streak level
    let streakLevel = 0;
    for (let level of this.STREAK_LEVELS) {
        if (this.streak >= level) streakLevel = level;
    }

    if (streakLevel > 0) {
        // Add appropriate animation class
        displayArea.classList.add(`streak-animation-${streakLevel}`);

        // Show milestone message if exact streak level reached
        if (this.STREAK_LEVELS.includes(this.streak)) {
            this.showMilestoneMessage(streakLevel);
        }
        
        // Removed sound playing from here since it's handled in playSound method
    }
}
    private showMilestoneMessage(level: number): void {
        const milestone = document.getElementById('streak-milestone');
        if (!milestone) return;
    
        const messages = {
            3: '🌟 Great Streak! 🌟',
            6: '🔥 Amazing! 🔥',
            9: '⭐ Incredible! ⭐'
        };
    
        milestone.textContent = messages[level as keyof typeof messages];
        milestone.classList.remove('milestone-show');
        void milestone.offsetWidth; // Force reflow
        milestone.classList.add('milestone-show');
    }

    private updateStreakDisplay(): void {
    const streakElement = document.getElementById('streak');
    if (streakElement) {
        streakElement.textContent = `${this.streak}`;
        
        // Update streak display style based on level
        let streakLevel = 0;
        for (let level of this.STREAK_LEVELS) {
            if (this.streak >= level) streakLevel = level;
        }

        streakElement.className = streakLevel > 0 ? 'streak-highlight' : '';
        if (streakLevel > 0) {
            streakElement.style.color = this.getStreakColor(streakLevel);
            streakElement.style.fontSize = `${24 + (streakLevel * 2)}px`;
        } else {
            streakElement.style.color = '';
            streakElement.style.fontSize = '';
        }
    }
}

private getStreakColor(level: number): string {
    const colors = {
        3: '#ff4081',
        6: '#FFA500',
        9: '#4CAF50'
    };
    return colors[level as keyof typeof colors];
}

    private initializeHandlers(): void {
        console.log('Initializing handlers');
        (window as any).gameHandlers = {
            handleCorrect: () => {
                console.log('Correct clicked');
                this.handleAssessment(true);
            },
            handleIncorrect: () => {
                console.log('Incorrect clicked');
                this.handleAssessment(false);
            }
        };
    }

    private updateCounter(): void {
        const counterElement = document.getElementById('counter');
        if (counterElement) {
            counterElement.textContent = this.lettersShown.toString();
        }
    }
    
    public startGame(): void {
        console.log('Game started');
        this.lettersShown = 0;
        this.updateCounter();
        this.letterDisplay.updateDisplayedLetter();
    }

    private showNextLetter(): void {
        this.letterDisplay.updateDisplayedLetter();
    }


   
}